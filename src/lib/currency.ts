// Detect device locale and produce localized weekly price strings.
// Falls back to USD if currency cannot be resolved.
const RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, SAR: 3.75, AED: 3.67, EGP: 49,
  CAD: 1.36, AUD: 1.51, JPY: 152, INR: 83, CNY: 7.2, BRL: 5.1, MXN: 17,
  CHF: 0.88, SEK: 10.5, NOK: 10.6, TRY: 32, ZAR: 18.5,
};

const LOCALE_TO_CCY: Record<string, string> = {
  US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR",
  SA: "SAR", AE: "AED", EG: "EGP", JO: "JOD", KW: "KWD", QA: "QAR",
  CA: "CAD", AU: "AUD", JP: "JPY", IN: "INR", CN: "CNY", BR: "BRL", MX: "MXN",
  CH: "CHF", SE: "SEK", NO: "NOK", TR: "TRY", ZA: "ZAR",
};

function detectCurrency(): string {
  if (typeof navigator === "undefined") return "USD";
  const lang = navigator.language || "en-US";
  const region = lang.split("-")[1]?.toUpperCase();
  return (region && LOCALE_TO_CCY[region]) || "USD";
}

export function formatPriceUSD(usd: number, locale?: string): string {
  const ccy = detectCurrency();
  const rate = RATES[ccy] ?? 1;
  const amount = usd * rate;
  try {
    return new Intl.NumberFormat(locale || (typeof navigator !== "undefined" ? navigator.language : "en-US"), {
      style: "currency",
      currency: ccy,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${usd.toFixed(2)}`;
  }
}
