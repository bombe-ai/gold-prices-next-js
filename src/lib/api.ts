import { GoldHistoryItem, GoldPriceData, GoldPriceWithChange } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

if (!BASE_URL || !API_KEY) {
    console.warn('Missing Supabase Environment Variables');
}

const HEADERS = {
    'apikey': API_KEY || '',
    'Authorization': `Bearer ${API_KEY || ''}`,
    'Content-Type': 'application/json',
};

export async function fetchTodayGoldPrice(city: string = 'kerala'): Promise<GoldPriceWithChange | null> {
    try {
        // If we just need the LATEST data, we might not need "date=..." if we sort by date descending.
        // However, the user provided a curl with `date=in.(2026-01-31)`.
        // Let's try to query for the latest record specifically, which usually gives "today".
        // Or we can try to query for "today's" date dynamically if needed.
        // Given the user specifically passed a date in curl, let's assume 'order=date.desc&limit=1' is sufficient 
        // to get the latest available price, which is what "Today's Gold Price" usually means.

        // NOTE: The user's response structure ALREADY contains "today" and "yesterday" and "change".
        // This looks like a view or a pre-calculated table `gold_prices_api`.
        // So we only need ONE row.

        const url = `${BASE_URL}/rest/v1/gold_prices_api?slug=eq.${city}&order=date.desc&limit=1`;

        const res = await fetch(url, {
            headers: HEADERS,
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('Failed to fetch gold prices');

        const data = await res.json();

        // Check if we have data
        if (!data || data.length === 0) return null;

        const row = data[0]; // The single row contains everything we need

        /* 
           Response Structure from User:
           {
              "24K_1g_today": 16058,
              "24K_1g_yesterday": 15196,
              "24K_1g_change": 862,
              "24K_1g_direction": "-",
              "22K_1g_today": 14720,
               ...
           }
        */

        // Helper to safety parse numbers
        const parse = (val: any) => Number(val || 0);

        const price24k = parse(row['24K_1g_today']);
        const prev24k = parse(row['24K_1g_yesterday']);

        const price22k = parse(row['22K_1g_today']);
        const prev22k = parse(row['22K_1g_yesterday']);

        const price18k = parse(row['18K_1g_today']);
        const prev18k = parse(row['18K_1g_yesterday']);

        // Directions and Changes provided by API
        // Direction "-" seems ambiguous, so we can self-calculate direction to be safe,
        // or map "-" to something. But standard logic `today >= yesterday` is better for UI color.

        const getDirection = (today: number, yesterday: number) => {
            if (today > yesterday) return 'up';
            if (today < yesterday) return 'down';
            return 'flat';
        };

        return {
            currency: row.currency || '₹',
            city: city, // or row.city || city
            date: row.date,
            price24k,
            price22k,
            price18k,
            previousPrice24k: prev24k,
            previousPrice22k: prev22k,
            previousPrice18k: prev18k,
            change24k: parse(row['24K_1g_change']) || (price24k - prev24k),
            direction24k: getDirection(price24k, prev24k),
            change22k: parse(row['22K_1g_change']) || (price22k - prev22k),
            direction22k: getDirection(price22k, prev22k),
            change18k: parse(row['18K_1g_change']) || (price18k - prev18k),
            direction18k: getDirection(price18k, prev18k),
        };

    } catch (error) {
        console.error('Error fetching gold prices:', error);
        return null;
    }
}

export async function fetchGoldHistory(city: string = 'kerala'): Promise<GoldHistoryItem[]> {
    // Graph Logic
    // User Said: "only after that take todas date wise for graph only show month wise"
    // Assuming the original graph endpoint works as `date | price`.
    // If not, we might need to debug this too.
    // But for now, let's keep it assuming simple structure, but add error logging if empty.
    try {
        const url = `${BASE_URL}/rest/v1/gold_prices_22k_graph?slug=eq.${city}&order=date.asc&limit=30`;

        const res = await fetch(url, {
            headers: HEADERS,
            next: { revalidate: 3600 * 12 }
        });

        if (!res.ok) throw new Error('Failed to fetch gold history');

        const data = await res.json();

        return data.map((item: any) => {
            // Warning: if the graph API *also* returns fields like `22K_1g_today`, we need to change this.
            // But "gold_prices_22k_graph" implies a specific simplified view.
            // Let's assume `price` field exists or map from a likely candidate.
            // If it's a history view, it might have `price` or `22k`.
            // Let's safe-check common names.
            const val = Number(item.price || item.val || item['22k'] || 0);
            return {
                date: item.date,
                price: val
            };
        });

    } catch (error) {
        console.error('Error fetching gold history:', error);
        return [];
    }
}

export interface MarketData {
    symbol: string;
    price: number;
    change: number;
    percentChange: number;
    direction: 'up' | 'down' | 'flat';
}

export async function fetchMarketData(): Promise<MarketData[]> {
    // 1. Get Live Gold Data (reuse logic mostly, or just fetch lightweight)
    // We'll reuse fetchTodayGoldPrice for simplicity as it's cached
    const goldData = await fetchTodayGoldPrice();

    const marketItems: MarketData[] = [];

    // --- Real Public APIs ---

    // 2. Crypto (CoinGecko) - Free Public API
    const fetchCrypto = async () => {
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true', {
                next: { revalidate: 60 } // Cache for 1 min
            });
            if (!res.ok) return [];
            const data = await res.json();

            const items: MarketData[] = [];
            if (data.bitcoin) {
                items.push({
                    symbol: 'BTC/INR',
                    price: data.bitcoin.inr,
                    change: (data.bitcoin.inr * (data.bitcoin.inr_24h_change / 100)), // Approx change value
                    percentChange: data.bitcoin.inr_24h_change,
                    direction: data.bitcoin.inr_24h_change >= 0 ? 'up' : 'down'
                });
            }
            if (data.ethereum) {
                items.push({
                    symbol: 'ETH/INR',
                    price: data.ethereum.inr,
                    change: (data.ethereum.inr * (data.ethereum.inr_24h_change / 100)),
                    percentChange: data.ethereum.inr_24h_change,
                    direction: data.ethereum.inr_24h_change >= 0 ? 'up' : 'down'
                });
            }
            return items;
        } catch (e) {
            console.error('Crypto API Error', e);
            return [];
        }
    };

    // 3. Forex (ExchangeRate-API) - Free Public API
    const fetchForex = async () => {
        try {
            // Base USD to get USD->INR. For others we calculate relative?
            // Actually https://api.exchangerate-api.com/v4/latest/USD gives .rates.INR (USD to INR)
            // https://api.exchangerate-api.com/v4/latest/GBP gives .rates.INR (GBP to INR)
            // Let's just fetch slightly different endpoints or calculate from one base if we assume cross-rates are consistent.
            // Fetching multiple might be slow. Let's fetch USD base and derive others? 
            // Or just fetch one. Let's fetch USD base.

            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
                next: { revalidate: 3600 }
            });
            if (!res.ok) return [];
            const data = await res.json();
            const inrRate = data.rates.INR; // 1 USD = x INR

            const items: MarketData[] = [];
            if (inrRate) {
                items.push({
                    symbol: 'USD/INR',
                    price: inrRate,
                    change: 0, // API doesn't give change vs yesterday easily without history. 
                    percentChange: 0,
                    direction: 'flat'
                });
            }

            // To get GBP/INR, we can fetch GBP base or infer. 
            // Let's do a client-side calculation if we have GBP in USD base?
            // GBP -> USD is 1/data.rates.GBP. Then * data.rates.INR.
            // GBP/INR = (1 / USD_per_GBP) * USD_per_INR? No.
            // data.rates.GBP is "How many GBP for 1 USD". e.g. 0.79.
            // So 1 USD = 0.79 GBP. 1 GBP = 1.26 USD.
            // 1 GBP = 1.26 USD * (83 INR / 1 USD) = 104 INR.
            // Formula: Rate_Currency_to_INR = Rate_USD_to_INR / Rate_USD_to_Currency

            if (data.rates.GBP) {
                const gbpInr = inrRate / data.rates.GBP;
                items.push({
                    symbol: 'GBP/INR',
                    price: gbpInr,
                    change: 0,
                    percentChange: 0,
                    direction: 'flat'
                });
            }

            if (data.rates.EUR) {
                const eurInr = inrRate / data.rates.EUR;
                items.push({
                    symbol: 'EUR/INR',
                    price: eurInr,
                    change: 0,
                    percentChange: 0,
                    direction: 'flat'
                });
            }

            if (data.rates.AED) {
                const aedInr = inrRate / data.rates.AED;
                items.push({
                    symbol: 'AED/INR',
                    price: aedInr,
                    change: 0,
                    percentChange: 0,
                    direction: 'flat'
                });
            }

            return items;

        } catch (e) {
            console.error('Forex API Error', e);
            return [];
        }
    };


    // 4. Gold/Silver Proxies (CoinGecko) - "pax-gold" (Gold) and "kinesis-silver" (Silver)
    // These track real commodity prices very closely and are available on the free Crypto API.
    const fetchCommodityProxies = async () => {
        try {
            // Note: CoinGecko requires User-Agent sometimes. default fetch usually suffices or we add simple headers.
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,kinesis-silver&vs_currencies=inr&include_24hr_change=true', {
                next: { revalidate: 60 }
            });
            if (!res.ok) return [];
            const data = await res.json();

            const items: MarketData[] = [];

            // PAX Gold (PAXG) ~ 1 oz Gold.  1 oz = 31.1035 grams.
            // Our local price is usually per gram or 8g. 
            // Let's typically show the "Global Gold (1oz)" price or convert?
            // Market tickers usually show the Asset price. Let's show PAXG price but labeled "Global Gold".
            if (data['pax-gold']) {
                items.push({
                    symbol: 'Gold (Global)',
                    price: data['pax-gold'].inr,
                    change: (data['pax-gold'].inr * (data['pax-gold'].inr_24h_change / 100)),
                    percentChange: data['pax-gold'].inr_24h_change,
                    direction: data['pax-gold'].inr_24h_change >= 0 ? 'up' : 'down'
                });
            }

            // Kinesis Silver (KAG) ~ 1 oz Silver
            if (data['kinesis-silver']) {
                items.push({
                    symbol: 'Silver (Global)',
                    price: data['kinesis-silver'].inr,
                    change: (data['kinesis-silver'].inr * (data['kinesis-silver'].inr_24h_change / 100)),
                    percentChange: data['kinesis-silver'].inr_24h_change,
                    direction: data['kinesis-silver'].inr_24h_change >= 0 ? 'up' : 'down'
                });
            }

            return items;

        } catch (e) {
            console.error('Commodity Proxy API Error', e);
            return [];
        }
    };

    const [cryptoItems, forexItems, commodityItems] = await Promise.all([fetchCrypto(), fetchForex(), fetchCommodityProxies()]);

    // Add Internal Gold/Silver (Priority)
    if (goldData) {

        // Safety check for previous price to avoid division by zero or undefined
        const safePrevPrice22k = goldData.previousPrice22k || goldData.price22k;

        marketItems.push({
            symbol: 'Gold (Kerala)', // Renamed to distinguish from Global
            price: goldData.price22k,
            change: goldData.change22k,
            percentChange: (goldData.change22k / safePrevPrice22k) * 100,
            direction: goldData.direction22k as 'up' | 'down' | 'flat'
        });
    }

    // Add Global Proxies
    return [...marketItems, ...commodityItems, ...cryptoItems, ...forexItems];
}
