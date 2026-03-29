export async function getExchangeRate(base, target) {
    try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`);
        const data = await res.json();
        return data.rates[target] || 1;
    } catch (error) {
        console.error('Currency API Error:', error);
        return 1; // Fallback to 1:1 if API fails
    }
}

export async function convertCurrency(amount, from, to) {
    if (from === to) return amount;
    const rate = await getExchangeRate(from, to);
    return amount * rate;
}
