import {
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  EMPTY_CONVERSION_RESULT,
  EMPTY_RATE_LABEL,
  LOCALE,
} from "../constants/currency-converter";
import type { CurrencyOption, VatComplyRatesResponse } from "@/lib/vatcomply";

export function getAmountValidationMessage(amount: string) {
  const normalizedAmount = amount.trim();

  if (normalizedAmount.length === 0) {
    return "Enter an amount.";
  }

  const parsedAmount = Number(normalizedAmount);

  if (!Number.isFinite(parsedAmount)) {
    return "Enter a valid number.";
  }

  if (parsedAmount < 0) {
    return "Amount cannot be negative.";
  }

  return undefined;
}

export function getResolvedCurrencyCode(
  currencies: CurrencyOption[],
  preferredCodes: string[],
) {
  for (const preferredCode of preferredCodes) {
    if (currencies.some((currency) => currency.code === preferredCode)) {
      return preferredCode;
    }
  }

  return currencies[0]?.code ?? "";
}

export function resolveCurrencyPair(
  currencies: CurrencyOption[],
  requestedFromCurrency = DEFAULT_FROM_CURRENCY,
  requestedToCurrency = DEFAULT_TO_CURRENCY,
) {
  return {
    fromCurrency:
      currencies.length > 0
        ? getResolvedCurrencyCode(currencies, [
            requestedFromCurrency,
            DEFAULT_FROM_CURRENCY,
          ])
        : requestedFromCurrency,
    toCurrency:
      currencies.length > 0
        ? getResolvedCurrencyCode(currencies, [
            requestedToCurrency,
            DEFAULT_TO_CURRENCY,
          ])
        : requestedToCurrency,
  };
}

export function formatDecimalAmount(amount: number, decimalPlaces: number) {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(amount);
}

export function formatRate(rate: number) {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(rate);
}

export function formatRateDate(rateDate: string) {
  const [year, month, day] = rateDate.split("-").map(Number);

  if (!year || !month || !day) {
    return rateDate;
  }

  const formattedDate = new Intl.DateTimeFormat(LOCALE, {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));

  return `${formattedDate} 00:00 UTC`;
}

export function parseAmount(amount: string) {
  const parsedAmount = Number(amount);

  return Number.isFinite(parsedAmount) && parsedAmount >= 0 ? parsedAmount : 0;
}

export function findCurrency(
  currencies: CurrencyOption[],
  currencyCode: string,
) {
  return currencies.find((currency) => currency.code === currencyCode);
}

export function getResolvedRate(
  fromCurrency: string,
  toCurrency: string,
  ratesData?: VatComplyRatesResponse,
) {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  return ratesData?.rates[toCurrency] ?? null;
}

export function buildConversionResult(
  amount: number,
  rate: number | null,
  fromCurrencyName: string,
  toCurrencyName: string,
  fromCurrencyDecimalPlaces: number,
  toCurrencyDecimalPlaces: number,
) {
  const formattedSourceAmount = formatDecimalAmount(
    amount,
    fromCurrencyDecimalPlaces,
  );

  if (rate === null) {
    return `${formattedSourceAmount} ${fromCurrencyName} =\n${EMPTY_CONVERSION_RESULT}`;
  }

  const formattedTargetAmount = formatDecimalAmount(
    amount * rate,
    toCurrencyDecimalPlaces,
  );

  return `${formattedSourceAmount} ${fromCurrencyName} =\n${formattedTargetAmount} ${toCurrencyName}`;
}

export function buildExchangeRateLabel(
  fromCurrency: string,
  rate: number | null,
  toCurrency: string,
) {
  if (rate === null) {
    return EMPTY_RATE_LABEL;
  }

  return `1 ${fromCurrency} = ${formatRate(rate)} ${toCurrency}`;
}

export function buildHeroTitle(fromCurrency: string, toCurrency: string) {
  return `1 ${fromCurrency} to ${toCurrency}`;
}

export function buildHeroTitleDetail(
  fromCurrencyName: string,
  toCurrencyName: string,
) {
  return `${fromCurrencyName} To ${toCurrencyName}`;
}

export function buildConversionSummary(
  fromCurrencyName: string,
  toCurrencyName: string,
  rateDate?: string,
) {
  const summary = `${fromCurrencyName} to ${toCurrencyName} conversion`;

  if (!rateDate) {
    return summary;
  }

  return `${summary} - Last updated ${formatRateDate(rateDate)}`;
}
