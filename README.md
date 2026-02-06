# NFT Mint Site - Setup & Deployment Guide

## 🚀 Getting Started

Your NFT mint site is structurally complete! Follow these steps to make it production-ready.

### 1. Environment Configuration

Edit `.env.local` and add your keys:

```bash
# Required
NEXT_PUBLIC_TREASURY_WALLET=Your_Solana_Wallet_Address
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta (or devnet for testing)

# Optional (but recommended for full functionality)
PINATA_JWT=Your_Pinata_JWT_Token (Sign up at pinata.cloud)
NEXT_PUBLIC_SUPABASE_URL=Your_Supabase_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=Your_Supabase_Key
```

### 2. Upload Metadata to IPFS

This step is crucial for your NFTs to show up correctly in wallets (Phantom/Solflare) and marketplaces (Magic Eden/Tensor).

1. Get your API keys from [Pinata](https://app.pinata.cloud/developers/api-keys).
2. Run the upload script:

```bash
npx tsx scripts/prepare-metadata.ts
```

This script will:

- Upload all images from `public/nfts` to IPFS.
- Generate metadata JSONs and upload them to IPFS.
- Create `lib/metadata-uris.ts` with the new links.

### 3. Database Setup (Optional but Recommended)

If you want to track shipping details for physical delivery:

1. Create a project at [Supabase](https://supabase.com).
2. Go to the SQL Editor.
3. Copy/paste the contents of `lib/db/schema.sql` and run it.
4. Add your Supabase URL/Keys to `.env.local`.

### 4. Testing

1. Ensure you are on `devnet` (in `.env.local`).
2. Run the app: `npm run dev`.
3. Connect a Phantom wallet (set to Devnet).
4. Get some devnet SOL from [faucet.solana.com](https://faucet.solana.com).
5. Try minting an NFT!

### 5. Deployment

When ready for mainnet:

1. Change `NEXT_PUBLIC_SOLANA_NETWORK` to `mainnet-beta` in `.env.local`.
2. Deploy to Vercel:
   ```bash
   npx vercel deploy
   ```
3. Add your environment variables in the Vercel dashboard.

## 🛠 Features Implemented

- **Minting Engine**: Metaplex UMI integration for standard SPL NFTs.
- **Physical Redemption**: Shipping form with database storage.
- **Real-time Pricing**: Fetches live SOL/USD price.
- **Toast Notifications**: beautiful success/error feedback.
- **Transaction Tracking**: Links to Solscan for verification.
