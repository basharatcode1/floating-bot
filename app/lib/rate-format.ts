type RatePeriod = "Hourly" | "Monthly" | "Yearly" | "Daywise" | string;

const PERIOD_LABELS: Record<string, string> = {
  hourly: "hour",
  hr: "hour",
  monthly: "month",
  month: "month",
  mo: "month",
  yearly: "year",
  annual: "year",
  annually: "year",
  year: "year",
  yr: "year",
  lpa: "year",
  pa: "year",
  "per annum": "year",
  "per year": "year",
  daywise: "day",
  daily: "day",
  day: "day",
  perday: "day",
  "per day": "day",
};

const CURRENCY_CODES: Record<string, string> = {
  "₹": "INR",
  "$": "USD",
  "£": "GBP",
  "€": "EUR",
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: "₹",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export const getRatePeriodLabel = (period?: RatePeriod) => {
  if (!period) return "year";
  return PERIOD_LABELS[String(period).trim().toLowerCase()] || String(period).trim().toLowerCase();
};

export const getCurrencyCode = (currency?: string, amount?: string) => {
  const text = `${currency || ""} ${amount || ""}`;
  const explicitCode = text.match(/\b(INR|USD|GBP|EUR)\b/i)?.[1];
  if (explicitCode) return explicitCode.toUpperCase();

  const symbol = Object.keys(CURRENCY_CODES).find((item) => text.includes(item));
  return symbol ? CURRENCY_CODES[symbol] : "";
};

export const getCurrencySymbol = (currency?: string, fallbackAmount?: string) => {
  const code = getCurrencyCode(currency, fallbackAmount);
  if (code && CURRENCY_SYMBOLS[code]) return CURRENCY_SYMBOLS[code];

  const parenSymbol = currency?.match(/\((.*)\)/)?.[1];
  if (parenSymbol) return parenSymbol;

  return Object.keys(CURRENCY_CODES).find((item) => fallbackAmount?.includes(item)) || "";
};

export const formatCompactRateAmount = (
  value: number,
  currency?: string,
  period?: RatePeriod,
) => {
  const symbol = getCurrencySymbol(currency) || "";
  const code = getCurrencyCode(currency);
  const isINR = code === "INR";
  const periodLabel = getRatePeriodLabel(period);

  if (isINR && (periodLabel === "month" || periodLabel === "year")) {
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `${symbol}${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
    }
  }

  if (value >= 1000) {
    const thousands = value / 1000;
    return `${symbol}${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }

  return `${symbol}${value}`;
};

export const formatRateRange = ({
  min,
  max,
  amount,
  period,
  currency,
}: {
  min?: number | string;
  max?: number | string;
  amount?: string;
  period?: RatePeriod;
  currency?: string;
}) => {
  const baseAmount = amount?.trim() || "";
  const periodFromAmount = baseAmount.match(/\/\s*([a-z]+)/i)?.[1];
  const cleanAmount = baseAmount
    .replace(/[–—]/g, "-")
    .replace(/\b(INR|USD|GBP|EUR)\b/gi, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\/\s*[a-z]+/gi, "")
    .trim();
  const code = getCurrencyCode(currency, baseAmount);
  let label = getRatePeriodLabel(period || periodFromAmount || "Yearly");

  let displayAmount = cleanAmount;
  const hasMin = min !== undefined && String(min).trim() !== "";
  const hasMax = max !== undefined && String(max).trim() !== "";

  if (hasMin && hasMax) {
    const minNumber = Number(min);
    const maxNumber = Number(max);
    if (!Number.isNaN(minNumber) && !Number.isNaN(maxNumber)) {
      displayAmount = `${formatCompactRateAmount(minNumber, currency, period)} - ${formatCompactRateAmount(maxNumber, currency, period)}`;
    } else if (String(min).includes("-") || String(min).includes("–")) {
      displayAmount = String(min).replace(/[–—]/g, "-").trim();
    }
  } else if (hasMin && !hasMax) {
    const minStr = String(min).trim().replace(/[–—]/g, "-");
    const minNumber = Number(min);
    if (!Number.isNaN(minNumber)) {
      displayAmount = formatCompactRateAmount(minNumber, currency, period);
    } else {
      displayAmount = minStr.replace(/\/\s*[a-z]+/gi, "").trim();
    }
  } else if (displayAmount.includes("-")) {
    const symbol = getCurrencySymbol(currency, displayAmount);
    const [first, second] = displayAmount.split("-").map((part) => part.trim());
    displayAmount = `${first} - ${second.startsWith(symbol) || !symbol ? second : `${symbol}${second}`}`;
  }

  // Fallback if displayAmount is still empty but amount was provided
  if (!displayAmount && baseAmount) {
    displayAmount = baseAmount;
  }

  // If there is still no amount, prevent returning orphaned "/ hour • USD"
  if (!displayAmount) {
    return "Not Disclosed";
  }

  // In Indian tech compensation, Lakhs (L) amounts (e.g. 18L, 15-18L) represent
  // annual salary (per year / LPA). If label is "month", override to "year" to prevent
  // unrealistic monthly figures.
  const isLakhAmount =
    /(?:^|[^a-zA-Z0-9])\d+(?:\.\d+)?\s*L\b/i.test(baseAmount) ||
    /(?:^|[^a-zA-Z0-9])\d+(?:\.\d+)?\s*L\b/i.test(cleanAmount) ||
    /(?:^|[^a-zA-Z0-9])\d+(?:\.\d+)?\s*L\b/i.test(displayAmount) ||
    /lakh/i.test(baseAmount);

  if (isLakhAmount && label === "month") {
    label = "year";
  }

  return [displayAmount, `/ ${label}`, code ? `• ${code}` : ""]
    .filter(Boolean)
    .join(" ");
};

