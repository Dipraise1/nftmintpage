import axios from 'axios';

let cachedPrice: number | null = null;
let lastFetchTime: number = 0;
const CACHE_DURATION = 60000; // 1 minute

export async function getSolPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if still valid
  if (cachedPrice && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedPrice;
  }

  try {
    // Try CoinGecko first (free tier, no API key needed)
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
      { timeout: 5000 }
    );
    
    const price = response.data?.solana?.usd;
    
    if (price) {
      cachedPrice = price;
      lastFetchTime = now;
      return price;
    }
    
    throw new Error('Invalid price data');
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    
    // Fallback to a reasonable default or last cached price
    return cachedPrice || 145; // Default fallback price
  }
}

export function convertSolToUsd(solAmount: number, solPrice: number): number {
  return Number((solAmount * solPrice).toFixed(2));
}

export function convertUsdToSol(usdAmount: number, solPrice: number): number {
  return Number((usdAmount / solPrice).toFixed(4));
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatSol(amount: number): string {
  return `${amount.toFixed(4)} SOL`;
}
