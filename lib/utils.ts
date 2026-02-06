export function getExplorerUrl(signature: string, type: 'tx' | 'address' = 'tx'): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const cluster = network === 'devnet' ? '?cluster=devnet' : '';
  
  const baseUrl = 'https://solscan.io';
  
  if (type === 'address') {
    return `${baseUrl}/account/${signature}${cluster}`;
  }
  
  return `${baseUrl}/tx/${signature}${cluster}`;
}

export function getSolanaExplorerUrl(signature: string, type: 'tx' | 'address' = 'tx'): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const cluster = network === 'devnet' ? '?cluster=devnet' : '';
  
  const baseUrl = 'https://explorer.solana.com';
  
  if (type === 'address') {
    return `${baseUrl}/address/${signature}${cluster}`;
  }
  
  return `${baseUrl}/tx/${signature}${cluster}`;
}

export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  
  return new Promise((resolve, reject) => {
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      resolve();
    } catch (err) {
      document.body.removeChild(textArea);
      reject(err);
    }
  });
}
