// Detect device locale and produce localized weekly price strings.
// Comprehensive worldwide currency support with FX rates relative to USD.
// Rates are approximate (updated 2025). Falls back gracefully if missing.

const RATES: Record<string, number> = {
  // Major
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 152, CHF: 0.88, CAD: 1.36, AUD: 1.51, NZD: 1.66,
  // Middle East & North Africa
  SAR: 3.75, AED: 3.67, EGP: 49, JOD: 0.71, KWD: 0.31, QAR: 3.64, BHD: 0.38, OMR: 0.38,
  ILS: 3.7, LBP: 89500, IQD: 1310, LYD: 4.85, MAD: 9.95, TND: 3.12, DZD: 134, YER: 250,
  SYP: 13000, SDG: 600,
  // Asia
  CNY: 7.2, HKD: 7.8, TWD: 32, KRW: 1380, SGD: 1.34, MYR: 4.7, THB: 35, IDR: 16100,
  PHP: 58, VND: 25400, INR: 83, PKR: 278, BDT: 119, LKR: 305, NPR: 133, MMK: 2100,
  KHR: 4100, LAK: 21500, MNT: 3450, AFN: 71, KZT: 480, UZS: 12700, TMT: 3.5, KGS: 87,
  TJS: 10.9, AZN: 1.7, AMD: 387, GEL: 2.7,
  // Europe (non-EUR)
  NOK: 10.6, SEK: 10.5, DKK: 6.86, ISK: 138, PLN: 4.0, CZK: 23, HUF: 360, RON: 4.6,
  BGN: 1.8, HRK: 6.9, RSD: 108, BAM: 1.8, MKD: 56, ALL: 92, MDL: 17.5, UAH: 41,
  BYN: 3.27, RUB: 92, TRY: 32,
  // Americas
  MXN: 17, BRL: 5.1, ARS: 870, CLP: 940, COP: 3950, PEN: 3.75, UYU: 39, BOB: 6.91,
  PYG: 7400, VES: 36, GTQ: 7.8, CRC: 510, DOP: 59, HNL: 24.7, NIO: 36.7, PAB: 1,
  JMD: 156, TTD: 6.78, BSD: 1, BBD: 2, BZD: 2.01, XCD: 2.7, KYD: 0.83, HTG: 132,
  CUP: 24, AWG: 1.8, ANG: 1.79, SRD: 32,
  // Africa
  ZAR: 18.5, NGN: 1550, KES: 130, GHS: 15.5, UGX: 3700, TZS: 2620, ETB: 57, RWF: 1320,
  ZMW: 26, MWK: 1730, MZN: 64, AOA: 875, XAF: 605, XOF: 605, MGA: 4500, MUR: 46,
  SCR: 13.6, BWP: 13.7, NAD: 18.5, SZL: 18.5, LSL: 18.5, GMD: 70, SLL: 22000,
  SLE: 22, GNF: 8600, BIF: 2870, DJF: 178, ERN: 15, CDF: 2750, SOS: 571, CVE: 102,
  STN: 22.6,
  // Oceania
  FJD: 2.26, PGK: 3.93, SBD: 8.5, VUV: 121, WST: 2.78, TOP: 2.36, XPF: 110,
  // Caribbean & misc
  GYD: 209, BMD: 1, FKP: 0.79, GIP: 0.79, SHP: 0.79, IMP: 0.79, JEP: 0.79, GGP: 0.79,
};

const LOCALE_TO_CCY: Record<string, string> = {
  // Major
  US: "USD", GB: "GBP", JP: "JPY", CH: "CHF", CA: "CAD", AU: "AUD", NZ: "NZD",
  // Eurozone
  DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", AT: "EUR",
  IE: "EUR", PT: "EUR", FI: "EUR", GR: "EUR", LU: "EUR", SK: "EUR", SI: "EUR",
  EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR", HR: "EUR",
  // MENA
  SA: "SAR", AE: "AED", EG: "EGP", JO: "JOD", KW: "KWD", QA: "QAR", BH: "BHD",
  OM: "OMR", IL: "ILS", LB: "LBP", IQ: "IQD", LY: "LYD", MA: "MAD", TN: "TND",
  DZ: "DZD", YE: "YER", SY: "SYP", SD: "SDG", PS: "ILS",
  // Asia
  CN: "CNY", HK: "HKD", TW: "TWD", KR: "KRW", SG: "SGD", MY: "MYR", TH: "THB",
  ID: "IDR", PH: "PHP", VN: "VND", IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR",
  NP: "NPR", MM: "MMK", KH: "KHR", LA: "LAK", MN: "MNT", AF: "AFN", KZ: "KZT",
  UZ: "UZS", TM: "TMT", KG: "KGS", TJ: "TJS", AZ: "AZN", AM: "AMD", GE: "GEL",
  // Europe (non-EUR)
  NO: "NOK", SE: "SEK", DK: "DKK", IS: "ISK", PL: "PLN", CZ: "CZK", HU: "HUF",
  RO: "RON", BG: "BGN", RS: "RSD", BA: "BAM", MK: "MKD", AL: "ALL", MD: "MDL",
  UA: "UAH", BY: "BYN", RU: "RUB", TR: "TRY",
  // Americas
  MX: "MXN", BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", UY: "UYU",
  BO: "BOB", PY: "PYG", VE: "VES", GT: "GTQ", CR: "CRC", DO: "DOP", HN: "HNL",
  NI: "NIO", PA: "PAB", JM: "JMC", TT: "TTD", BS: "BSD", BB: "BBD", BZ: "BZD",
  HT: "HTG", CU: "CUP", AW: "AWG", SR: "SRD", GY: "GYD", BM: "BMD",
  // Africa
  ZA: "ZAR", NG: "NGN", KE: "KES", GH: "GHS", UG: "UGX", TZ: "TZS", ET: "ETB",
  RW: "RWF", ZM: "ZMW", MW: "MWK", MZ: "MZN", AO: "AOA", CM: "XAF", SN: "XOF",
  CI: "XOF", MG: "MGA", MU: "MUR", SC: "SCR", BW: "BWP", NA: "NAD", SZ: "SZL",
  LS: "LSL", GM: "GMD", SL: "SLE", GN: "GNF", BI: "BIF", DJ: "DJF", ER: "ERN",
  CD: "CDF", SO: "SOS", CV: "CVE", ST: "STN",
  // Oceania
  FJ: "FJD", PG: "PGK", SB: "SBD", VU: "VUV", WS: "WST", TO: "TOP", PF: "XPF",
  NC: "XPF",
  // Crown dependencies / overseas
  GI: "GIP", FK: "FKP", SH: "SHP", IM: "IMP", JE: "JEP", GG: "GGP",
};

function detectCurrency(): string {
  if (typeof navigator === "undefined") return "USD";
  // Try every preferred language until we find a known region.
  const langs: readonly string[] =
    navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en-US"];
  for (const lang of langs) {
    const region = lang.split("-")[1]?.toUpperCase();
    if (region && LOCALE_TO_CCY[region]) return LOCALE_TO_CCY[region];
  }
  return "USD";
}

export function formatPriceUSD(usd: number, locale?: string): string {
  // SSR-safe: always render USD on the server, then swap on the client.
  if (typeof navigator === "undefined") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: usd >= 100 ? 0 : 2,
    }).format(usd);
  }
  const ccy = detectCurrency();
  const rate = RATES[ccy] ?? 1;
  const amount = usd * rate;
  try {
    return new Intl.NumberFormat(locale || navigator.language, {
      style: "currency",
      currency: ccy,
      maximumFractionDigits: amount >= 100 ? 0 : 2,
    }).format(amount);
  } catch {
    return `$${usd.toFixed(2)}`;
  }
}
