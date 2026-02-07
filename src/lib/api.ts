import { GoldHistoryItem, GoldPriceData, GoldPriceWithChange, MarketData } from './types';
import YahooFinance from 'yahoo-finance2';
import * as cheerio from 'cheerio';

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_BASE_URL;
const API_KEY = process.env.SUPABASE_API_KEY;

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
        const url = `${BASE_URL}/rest/v1/gold_prices_api?slug=eq.${city}&order=date.desc&limit=1`;
        const res = await fetch(url, {
            headers: HEADERS,
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('Failed to fetch gold prices');
        const data = await res.json();
        if (!data || data.length === 0) return null;

        const row = data[0];
        const parse = (val: any) => Number(val || 0);

        const price24k = parse(row['24K_1g_today']);
        const prev24k = parse(row['24K_1g_yesterday']);
        const price22k = parse(row['22K_1g_today']);
        const prev22k = parse(row['22K_1g_yesterday']);
        const price18k = parse(row['18K_1g_today']);
        const prev18k = parse(row['18K_1g_yesterday']);

        const parseDirection = (dir: any): 'up' | 'down' | 'flat' => {
            const d = String(dir).trim();
            if (d === '+') return 'up';
            if (d === '-') return 'down';
            return 'flat';
        };

        const dir24k = parseDirection(row['24K_1g_direction']);
        const dir22k = parseDirection(row['22K_1g_direction']);
        const dir18k = parseDirection(row['18K_1g_direction']);

        const ch24k = parse(row['24K_1g_change']) || Math.abs(price24k - prev24k);
        const ch22k = parse(row['22K_1g_change']) || Math.abs(price22k - prev22k);
        const ch18k = parse(row['18K_1g_change']) || Math.abs(price18k - prev18k);

        return {
            currency: row.currency || '₹',
            city: city,
            date: row.date,
            price24k,
            price22k,
            price18k,
            previousPrice24k: prev24k,
            previousPrice22k: prev22k,
            previousPrice18k: prev18k,
            change24k: ch24k,
            direction24k: dir24k,
            change22k: ch22k,
            direction22k: dir22k,
            change18k: ch18k,
            direction18k: dir18k,
        };

    } catch (error) {
        console.error('Error fetching gold prices:', error);
        return null;
    }
}

export async function fetchGoldHistory(city: string = 'kerala'): Promise<GoldHistoryItem[]> {
    try {
        const url = `${BASE_URL}/rest/v1/gold_prices_22k_graph?slug=eq.${city}&order=date.asc&limit=30`;
        const res = await fetch(url, {
            headers: HEADERS,
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('Failed to fetch gold history');
        const data = await res.json();
        return data.map((item: any) => {
            const val = Number(item.price || item.val || item['22k'] || 0);
            return {
                date: item.date,
                price: val * 8
            };
        });

    } catch (error) {
        console.error('Error fetching gold history:', error);
        return [];
    }
}

async function scrapeFuelPrice(type: 'Diesel' | 'Petrol', city: string = 'kochi'): Promise<MarketData | null> {
    const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    // Ordered list of sources to try
    const sources = [
        {
            url: `https://www.goodreturns.in/${type.toLowerCase()}-price-in-${city}.html`,
            regex: new RegExp(`Today's ${type} Price in ${city.charAt(0).toUpperCase() + city.slice(1)} is\\s*₹\\s*([\\d\\.]+)`, 'i'),
        },
        {
            url: `https://www.ndtv.com/fuel-prices/${type.toLowerCase()}-price-in-${city}-state-kerala`, // NDTV structure slightly different
            regex: new RegExp(`${type} Price in ${city.charAt(0).toUpperCase() + city.slice(1)}.*?₹\\s*([\\d\\.]+)`, 'i'),
        },
        // NDTV fallback: just state page?
        {
            url: `https://www.ndtv.com/fuel-prices/${type.toLowerCase()}-price-in-kerala-state`,
            regex: new RegExp(`${type} Price in Kerala.*?₹\\s*([\\d\\.]+)`, 'i'),
        }
    ];

    for (const source of sources) {
        try {
            const res = await fetch(source.url, {
                next: { revalidate: 3600 },
                headers: {
                    'User-Agent': ua,
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Cache-Control': 'max-age=0'
                }
            });

            if (!res.ok) continue;

            const html = await res.text();
            const $ = cheerio.load(html);
            const content = $('body').text();

            // Try Regex
            let match = content.match(source.regex);
            if (match && match[1]) {
                return {
                    symbol: `${type} (${city.charAt(0).toUpperCase() + city.slice(1)})`,
                    price: parseFloat(match[1]),
                    change: 0,
                    percentChange: 0,
                    direction: 'flat'
                };
            } else {
                // console.log(`No regex match for ${source.regex}`); // Removed
            }

            // Fallback for GoodReturns if regex fails but page loaded
            if (source.url.includes('goodreturns')) {
                const moneyValue = $('.money-web-value').first().text();
                if (moneyValue) {
                    const val = parseFloat(moneyValue.replace(/[^\d.]/g, ''));
                    if (!isNaN(val)) {
                        return {
                            symbol: `${type} (${city.charAt(0).toUpperCase() + city.slice(1)})`,
                            price: val,
                            change: 0,
                            percentChange: 0,
                            direction: 'flat'
                        };
                    }
                }
            }

            // Fallback for NDTV
            if (source.url.includes('ndtv')) {
                // Check for big price text
                const valText = $('.font-bold.text-2xl').text() || $('.big-price-text').text(); // highly specific, may vary
                // Inspecting NDTV often shows just a big number
            }

        } catch (e) {
            console.error(`Error scraping ${type} from ${source.url}:`, e);
        }
    }

    return null;
}

export async function fetchMarketData(): Promise<MarketData[]> {
    const marketItems: MarketData[] = [];
    const yf = new YahooFinance();

    try {
        const results = await yf.quote([
            '^BSESN', '^NSEI', 'CL=F', 'GC=F', 'SI=F', 'INR=X',
            '^GSPC', '^IXIC', 'BTC-USD', 'ETH-USD', 'EURINR=X'
        ]) as any[];

        if (Array.isArray(results)) {
            results.forEach(quote => {
                let symbol = quote.symbol;
                let name = quote.shortName || quote.symbol;

                // Mapping Yahoo Finance symbols to display names
                if (symbol === '^BSESN') {
                    symbol = 'SENSEX';
                } else if (symbol === '^NSEI') {
                    symbol = 'NIFTY';
                } else if (symbol === 'CL=F') {
                    symbol = 'Crude Oil';
                } else if (symbol === 'GC=F') {
                    symbol = 'Gold (World)';
                } else if (symbol === 'SI=F') {
                    symbol = 'Silver (World)';
                } else if (symbol === 'INR=X') {
                    symbol = 'USD/INR';
                } else if (symbol === '^GSPC') {
                    symbol = 'S&P 500';
                } else if (symbol === '^IXIC') {
                    symbol = 'NASDAQ';
                } else if (symbol === 'BTC-USD') {
                    symbol = 'Bitcoin';
                } else if (symbol === 'ETH-USD') {
                    symbol = 'Ethereum';
                } else if (symbol === 'EURINR=X') {
                    symbol = 'EUR/INR';
                }

                marketItems.push({
                    symbol: symbol,
                    price: quote.regularMarketPrice || 0,
                    change: quote.regularMarketChange || 0,
                    percentChange: quote.regularMarketChangePercent || 0,
                    direction: (quote.regularMarketChange || 0) >= 0 ? 'up' : 'down'
                });
            });
        }
    } catch (error) {
        console.error('Yahoo Finance API Error:', error);
    }

    const petrol = await scrapeFuelPrice('Petrol', 'kochi');
    if (petrol) marketItems.push(petrol);

    const diesel = await scrapeFuelPrice('Diesel', 'kochi');
    if (diesel) marketItems.push(diesel);

    return marketItems;
}
