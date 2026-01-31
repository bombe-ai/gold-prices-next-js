
const https = require('https');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data: data.substring(0, 500) })); // First 500 chars
        }).on('error', reject);
    });
}

(async () => {
    console.log("Testing Yahoo Finance (Sensex)...");
    try {
        const yahoo = await fetchUrl("https://query1.finance.yahoo.com/v8/finance/chart/^BSESN?interval=1d&range=1d");
        console.log("Yahoo Status:", yahoo.statusCode);
        console.log("Yahoo Data Start:", yahoo.data);
    } catch (e) {
        console.log("Yahoo Error:", e.message);
    }

    console.log("\nTesting CoinGecko (Crypto)...");
    try {
        const gecko = await fetchUrl("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=inr&include_24hr_change=true");
        console.log("Gecko Status:", gecko.statusCode);
        console.log("Gecko Data:", gecko.data);
    } catch (e) {
        console.log("Gecko Error:", e.message);
    }
})();
