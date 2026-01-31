export interface GoldPriceData {
  currency: string;
  price24k: number;
  price22k: number;
  price18k: number;
  date: string;
  city: string;
  previousPrice24k?: number;
  previousPrice22k?: number;
  previousPrice18k?: number;
}

// Derived state for UI
export interface GoldPriceWithChange extends GoldPriceData {
  change24k: number;
  direction24k: 'up' | 'down' | 'flat';
  change22k: number;
  direction22k: 'up' | 'down' | 'flat';
  change18k: number;
  direction18k: 'up' | 'down' | 'flat';
}

export interface GoldHistoryItem {
  date: string;
  price: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  direction: 'up' | 'down' | 'flat';
}
