import nftMetadata from '../metadata/nft-metadata.json';

export interface NFTMetadata {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  properties: {
    category: string;
    files: Array<{
      uri: string;
      type: string;
    }>;
  };
  seller_fee_basis_points: number;
  creators: Array<{
    address: string;
    share: number;
  }>;
  metadataUri?: string; // IPFS URI after upload
  imageUri?: string; // IPFS URI for image
}

// This will be populated after IPFS upload
// For now, use local metadata
export function getMetadataForNFT(nftId: string): NFTMetadata | null {
  const nft = nftMetadata.nfts.find((n) => n.id === nftId);
  if (!nft) return null;
  
  return nft as NFTMetadata;
}

export function getAllNFTMetadata(): NFTMetadata[] {
  return nftMetadata.nfts as NFTMetadata[];
}

// Placeholder URIs - replace these after uploading to IPFS
export const METADATA_URIS: Record<string, string> = {
  '0': '', // Will be filled after IPFS upload
  '1': '',
  '2': '',
  '3': '',
  '4': '',
  '5': '',
  '6': '',
  '7': '',
  '8': '',
  '9': '',
  '10': '',
  '11': '',
  '12': '',
  '13': '',
  '14': '',
  '15': '',
  '16': '',
  '17': '',
  '18': '',
  '19': '',
  '20': '',
  '21': '',
  '22': '',
  '23': '',
  '24': '',
  '25': '',
  '26': '',
  '27': '',
  '28': '',
  '29': '',
  '30': '',
  '31': '',
  '32': '',
  '33': '',
  '34': '',
  '35': '',
  '36': '',
  '37': '',
  '38': '',
  '39': '',
};
