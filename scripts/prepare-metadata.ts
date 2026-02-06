
import { PinataSDK } from "pinata-web3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud';

if (!PINATA_JWT) {
  console.error('❌ PINATA_JWT is missing in .env.local');
  process.exit(1);
}

const pinata = new PinataSDK({
  pinataJwt: PINATA_JWT,
  pinataGateway: PINATA_GATEWAY,
});

async function uploadFileToIPFS(filePath: string): Promise<string> {
  try {
    const blob = new Blob([fs.readFileSync(filePath)]);
    const file = new File([blob], path.basename(filePath), { type: "image/jpeg" });
    const upload = await pinata.upload.file(file);
    return `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
}

async function uploadJSONToIPFS(metadata: any): Promise<string> {
  try {
    const upload = await pinata.upload.json(metadata);
    return `https://${PINATA_GATEWAY}/ipfs/${upload.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading JSON:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Metadata Preparation...');
  console.log('-----------------------------------');

  const metadataPath = path.join(process.cwd(), 'metadata/nft-metadata.json');
  const nftsDir = path.join(process.cwd(), 'public/nfts');

  if (!fs.existsSync(metadataPath)) {
    console.error('❌ Metadata file not found at:', metadataPath);
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  const updatedNFTs = [];
  const uriMap: Record<string, string> = {};

  // Process each NFT
  for (const nft of metadata.nfts) {
    console.log(`\nProcessing NFT #${nft.id}: ${nft.name}`);
    
    // 1. Upload Image
    const localImagePath = path.join(process.cwd(), 'public', nft.image);
    console.log(`   Uploading image: ${path.basename(localImagePath)}...`);
    
    let imageUrl = nft.image; // Default to local if upload fails or is skipped
    if (fs.existsSync(localImagePath)) {
        try {
            const ipfsImageUri = await uploadFileToIPFS(localImagePath);
            console.log(`   ✅ Image uploaded: ${ipfsImageUri}`);
            imageUrl = ipfsImageUri;
        } catch (e) {
             console.error(`   ⚠️ Failed to upload image, using local path.`);
        }
    } else {
        console.warn(`   ⚠️ Image file not found: ${localImagePath}`);
    }

    // 2. Update Metadata with IPFS Image URI
    const nftMetadata = {
      name: nft.name,
      symbol: nft.symbol,
      description: nft.description,
      image: imageUrl,
      external_url: nft.external_url,
      attributes: nft.attributes,
      properties: {
        files: [
          {
            uri: imageUrl,
            type: "image/jpeg"
          }
        ],
        category: "image",
        creators: nft.creators
      },
      seller_fee_basis_points: nft.seller_fee_basis_points
    };

    // 3. Upload JSON Metadata
    console.log(`   Uploading metadata JSON...`);
    const metadataUri = await uploadJSONToIPFS(nftMetadata);
    console.log(`   ✅ Metadata uploaded: ${metadataUri}`);

    uriMap[nft.id] = metadataUri;
    
    // Update local record
    updatedNFTs.push({
      ...nft,
      image: imageUrl, // Update image to IPFS URL in our local file too (optional, but good for ref)
      metadataUri: metadataUri
    });
  }

  // 4. Save results
  console.log('\n-----------------------------------');
  console.log('💾 Saving results...');
  
  // Save updated local metadata file
  metadata.nfts = updatedNFTs;
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('✅ Updated metadata.json saved');

  // Generate a TS file with the URIs
  const tsContent = `// Auto-generated file. Do not edit manually.
export const METADATA_URIS: Record<string, string> = ${JSON.stringify(uriMap, null, 2)};
`;
  
  fs.writeFileSync(path.join(process.cwd(), 'lib/metadata-uris.ts'), tsContent);
  console.log('✅ Generated lib/metadata-uris.ts');

  console.log('\n🎉 ALL DONE! Your NFTs are ready to mint.');
}

main().catch(console.error);
