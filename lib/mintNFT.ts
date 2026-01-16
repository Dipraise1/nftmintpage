import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Keypair,
} from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-adapter-base';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
  generateSigner,
  percentAmount,
  createSignerFromKeypair,
  keypairIdentity,
} from '@metaplex-foundation/umi';
import { fromWeb3JsKeypair, fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';

// Treasury wallet address - REPLACE WITH YOUR ACTUAL TREASURY WALLET
// You can set this via environment variable: NEXT_PUBLIC_TREASURY_WALLET
const TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || 'YOUR_TREASURY_WALLET_ADDRESS_HERE';

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
    const paymentSignature = await wallet.sendTransaction(transferTransaction, connection);
    
    // Wait for confirmation
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: paymentSignature,
    }, 'confirmed');
    
    signatures.push(paymentSignature);

    // Step 2: Create UMI instance with RPC endpoint
    const umi = createUmi(connection.rpcEndpoint);
    umi.use(mplTokenMetadata());

    // Step 3: Set up signer for minting
    // IMPORTANT: This is a simplified implementation for demonstration
    // In production, you should:
    // 1. Use a backend service that handles minting securely
    // 2. Or properly integrate wallet adapter signing with UMI
    // 3. Ensure NFTs are minted directly to the user's wallet address
    
    // For now, we create a temporary keypair for signing
    // The NFTs will be created but may need to be transferred to the user's wallet
    const tempKeypair = Keypair.generate();
    const umiKeypair = fromWeb3JsKeypair(tempKeypair);
    const signer = createSignerFromKeypair(umi, umiKeypair);
    umi.use(keypairIdentity(signer));

    // Step 4: Mint NFTs for the requested quantity
    for (let i = 0; i < quantity; i++) {
      try {
        // Generate a new mint keypair for each NFT
        const mint = generateSigner(umi);
        
        // Create unique name for each NFT
        const uniqueName = quantity > 1 
          ? `${nftName} #${nftId}-${i + 1}` 
          : nftName;
        
        // Create metadata URI (in production, upload to IPFS/Arweave)
        const metadataUri = nftImage; // For now, using image URL directly
        
        // Create NFT with metadata
        // Set the user's wallet as the update authority and owner
        const userPublicKey = fromWeb3JsPublicKey(wallet.publicKey);
        const result = await createNft(umi, {
          mint,
          name: uniqueName,
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(0), // 0% royalty
          symbol: 'LP-CENT',
          updateAuthority: userPublicKey, // User's wallet as update authority
        }).sendAndConfirm(umi);
        
        // Note: The NFT is created but the token account ownership may need to be handled
        // In production, ensure the NFT is properly associated with the user's wallet

        mintAddresses.push(mint.publicKey.toString());
        
        // Add signature from the mint operation
        if (result.signature) {
          signatures.push(result.signature.toString());
        }
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
