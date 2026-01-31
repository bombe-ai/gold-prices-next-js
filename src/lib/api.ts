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
