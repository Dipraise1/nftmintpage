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

// Treasury wallet address
const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || '8WWyVqqsGFAveZVjBrS5vUSBb1LmsdsoLvEZq6bMUT7G';

export interface MintNFTParams {
  wallet: WalletAdapter;
  connection: Connection;
  nftId: string;
  nftName: string;
  nftDescription: string;
  nftImage: string;
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
  price,
  quantity,
}: MintNFTParams): Promise<{ mintAddresses: string[]; signatures: string[] }> {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error('Wallet not connected or does not support sending transactions');
  }

  if (TREASURY_WALLET === 'YOUR_TREASURY_WALLET_ADDRESS_HERE') {
    throw new Error('Please set NEXT_PUBLIC_TREASURY_WALLET environment variable with your treasury wallet address');
  }

  const signatures: string[] = [];
  const mintAddresses: string[] = [];

  try {
    const treasuryPubkey = new PublicKey(TREASURY_WALLET);
    const totalPriceLamports = Math.round(price * LAMPORTS_PER_SOL * quantity);

    // Step 1: Transfer payment to treasury
    // Note: We are doing this as a separate transaction for now because mixing
    // web3.js transactions (transfer) and UMI transactions (minting) can be complex manually.
    // Ideally, we'd use UMI for everything, but for quick integration with existing setup:

    // Check balance first
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < totalPriceLamports) {
      throw new Error(`Insufficient SOL balance. Needed: ${price * quantity} SOL`);
    }

    const transferTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: treasuryPubkey,
        lamports: totalPriceLamports,
      })
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transferTransaction.recentBlockhash = blockhash;
    transferTransaction.feePayer = wallet.publicKey;

    // Send payment transaction
    console.log('Sending payment to treasury...');
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
          ? `${nftName} #${nftId}-${Date.now().toString().slice(-4)}-${i + 1}`
          : nftName;

        // Create metadata URI (in production, upload to IPFS/Arweave)
        const metadataUri = nftImage;

        // Create NFT (Mint Account + Metadata)
        // We use the user's wallet (in UMI context) as the update authority
        const result = await createNft(umi, {
          mint,
          name: uniqueName,
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(0),
          symbol: 'LP-CENT',
          updateAuthority: fromWeb3JsPublicKey(wallet.publicKey),
        }).sendAndConfirm(umi);

        // Mint the token to the user
        // Note: createNft in some versions creates the mint account and metadata,
        // but the token supply is 0. We need mintV1 to actually mint 1 token
        // to the user's wallet.
        await mintV1(umi, {
          mint: mint.publicKey,
          authority: umi.identity, // The user's wallet is the authority
          amount: 1,
          tokenOwner: umi.identity.publicKey, // Mint to the user's wallet
          tokenStandard: TokenStandard.NonFungible,
        }).sendAndConfirm(umi);

        mintAddresses.push(mint.publicKey.toString());

        // Add signature from the mint operation
        if (result.signature) {
          // UMI signatures are Uint8Array, need to convert if we want them in our list
          // But our interface expects string. UMI signature can be deserialized.
          // For now, we'll just log it or format it if needed, but we already have payment sig.
          // Let's rely on payment signature for the main receipt.
        }
      } catch (error: any) {
        console.error(`Error minting NFT ${i + 1}:`, error);
        // We don't want to stop the loop if one fails after payment, 
        // but in production we should refund or retry.
        // For now, we throw to alert the user.
        throw new Error(`Failed to mint NFT ${i + 1}: ${error.message}`);
      }
    }

    if (mintAddresses.length === 0) {
      throw new Error('Failed to mint any NFTs. Please try again.');
    }

    return {
      mintAddresses,
      signatures
    };
  } catch (error: any) {
    console.error('Error in minting process:', error);

    // Provide more specific error messages
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
