import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createNft,
  mplTokenMetadata,
  mintV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  publicKey,
} from '@metaplex-foundation/umi';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// Owner wallet (Artist) - receives 90% of primary sales, 4% of secondary royalties
const OWNER_WALLET = process.env.NEXT_PUBLIC_OWNER_WALLET || '8WWyVqqsGFAveZVjBrS5vUSBb1LmsdsoLvEZq6bMUT7G';

// Dev wallet - receives 10% of primary sales, 1% of secondary royalties
const DEV_WALLET = process.env.NEXT_PUBLIC_DEV_WALLET || 'BEkmWcDkUWnpRorpG9W1X7G9FcyPQrRFah8eksRWTrX';

// Revenue split percentages
const OWNER_SHARE_PERCENT = 90;
const DEV_SHARE_PERCENT = 10;

export interface MintNFTParams {
  wallet: WalletAdapter;
  connection: Connection;
  nftId: string;
  nftName: string;
  nftDescription: string;
  nftImage: string;
  metadataUri: string; // IPFS URI for the JSON metadata
  price: number; // in SOL
  quantity: number;
}

export async function mintNFT({
  wallet,
  connection,
  nftId,
  nftName,
  nftDescription,
  nftImage,
  metadataUri,
  price,
  quantity,
}: MintNFTParams): Promise<{ mintAddresses: string[]; signatures: string[]; paymentSignature: string }> {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected or does not support sending transactions');
  }

  const signatures: string[] = [];
  const mintAddresses: string[] = [];

  try {
    const ownerPubkey = new PublicKey(OWNER_WALLET);
    const devPubkey = new PublicKey(DEV_WALLET);
    const totalPriceLamports = Math.round(price * LAMPORTS_PER_SOL * quantity);

    // Calculate the split: 90% to owner, 10% to dev
    const ownerAmount = Math.floor(totalPriceLamports * OWNER_SHARE_PERCENT / 100);
    const devAmount = totalPriceLamports - ownerAmount; // Remainder to dev to avoid rounding issues

    // Check balance first (include buffer for transaction fees)
    const balance = await connection.getBalance(wallet.publicKey);
    const estimatedFees = 10000; // ~0.00001 SOL buffer for tx fees
    if (balance < totalPriceLamports + estimatedFees) {
      throw new Error(`Insufficient SOL balance. Needed: ${price * quantity} SOL plus fees`);
    }

    // Create transaction with both transfers in a single atomic transaction
    const transferTransaction = new Transaction().add(
      // Transfer 90% to Owner wallet
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: ownerPubkey,
        lamports: ownerAmount,
      }),
      // Transfer 10% to Dev wallet
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: devPubkey,
        lamports: devAmount,
      })
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transferTransaction.recentBlockhash = blockhash;
    transferTransaction.feePayer = wallet.publicKey;

    // Send payment transaction
    console.log('Sending payment...');
    console.log(`  Owner (90%): ${ownerAmount / LAMPORTS_PER_SOL} SOL`);
    console.log(`  Dev (10%): ${devAmount / LAMPORTS_PER_SOL} SOL`);
    
    const paymentSignature = await wallet.sendTransaction(transferTransaction, connection);

    // Wait for confirmation
    console.log('Confirming payment...');
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: paymentSignature,
    }, 'confirmed');

    signatures.push(paymentSignature);
    console.log('Payment confirmed:', paymentSignature);

    // Step 2: Create UMI instance
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());
    umi.use(walletAdapterIdentity(wallet));

    // Step 3: Mint NFTs for the requested quantity
    for (let i = 0; i < quantity; i++) {
      try {
        console.log(`Minting NFT ${i + 1} of ${quantity}...`);

        // Generate a new mint keypair for each NFT
        const mint = generateSigner(umi);

        // Create unique name for each NFT
        const uniqueName = quantity > 1
          ? `${nftName} #${Date.now().toString().slice(-4)}-${i + 1}`
          : nftName;

        // Create NFT (Mint Account + Metadata)
        // Owner wallet retains update authority and full IP rights
        // Royalties: 5% total split as 4% owner / 1% dev (80/20 of the 5%)
        const result = await createNft(umi, {
          mint,
          name: uniqueName,
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(5), // 5% total royalty
          symbol: 'LP-CENT',
          updateAuthority: fromWeb3JsPublicKey(new PublicKey(OWNER_WALLET)), // Owner controls the NFT
          creators: [
            {
              address: fromWeb3JsPublicKey(new PublicKey(OWNER_WALLET)),
              verified: false, // Will be verified by owner signing later if needed
              share: 80, // 80% of 5% = 4% royalty
            },
            {
              address: fromWeb3JsPublicKey(new PublicKey(DEV_WALLET)),
              verified: false,
              share: 20, // 20% of 5% = 1% royalty
            },
          ],
        }).sendAndConfirm(umi);

        // Mint the token to the user
        await mintV1(umi, {
          mint: mint.publicKey,
          authority: umi.identity,
          amount: 1,
          tokenOwner: umi.identity.publicKey,
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);

        mintAddresses.push(mint.publicKey.toString());

      } catch (error: any) {
        console.error(`Error minting NFT ${i + 1}:`, error);
        throw new Error(`Failed to mint NFT ${i + 1}: ${error.message}`);
      }
    }

    if (mintAddresses.length === 0) {
      throw new Error('Failed to mint any NFTs. Please try again.');
    }

    return {
      mintAddresses,
      signatures,
      paymentSignature
    };
  } catch (error: any) {
    console.error('Error in minting process:', error);

    if (error.message?.includes('insufficient funds') || error.message?.includes('Insufficient')) {
      throw new Error('Insufficient SOL balance. Please ensure you have enough SOL to cover the transaction fees and NFT price.');
    } else if (error.message?.includes('User rejected') || error.message?.includes('rejected')) {
      throw new Error('Transaction was rejected. Please try again.');
    } else if (error.message?.includes('Network') || error.message?.includes('network')) {
      throw new Error('Network error. Please check your connection and try again.');
    } else if (error.message?.includes('blockhash')) {
      throw new Error('Transaction timeout. Please try again.');
    }

    throw new Error(error.message || 'Failed to process minting transaction. Please try again.');
  }
}
