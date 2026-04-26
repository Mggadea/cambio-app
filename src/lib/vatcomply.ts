const VATCOMPLY_API_BASE_URL = "https://api.vatcomply.com";

interface NextFetchInit extends RequestInit {
  next?: {
    revalidate?: number;
  };
}

interface VatComplyErrorResponse {
  detail?: string;
}

interface VatComplyCurrencyResponse {
  name: string;
  symbol: string;
  numeric_code: string;
  currency_symbol: string;
  currency_symbol_narrow: string | null;
  decimal_places: number;
  rounding: number;
  countries: string[];
}

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
}

export interface VatComplyRatesResponse {
  date: string;
  base: string;
  rates: Record<string, number>;
}

function createVatComplyUrl(path: string, searchParams?: URLSearchParams) {
  const url = new URL(path, VATCOMPLY_API_BASE_URL);

  if (searchParams) {
    url.search = searchParams.toString();
  }

  return url;
}

async function getVatComplyJson<ResponseType>(
  path: string,
  options?: NextFetchInit & { searchParams?: URLSearchParams }
) {
  const { searchParams, ...requestInit } = options ?? {};
  const response = await fetch(createVatComplyUrl(path, searchParams), {
    headers: {
      Accept: "application/json",
      ...(requestInit.headers ?? {}),
    },
    ...requestInit,
  });

  if (!response.ok) {
    const errorBody =
      ((await response.json().catch(() => null)) as VatComplyErrorResponse | null) ??
      null;

    throw new Error(
      errorBody?.detail ??
        `VAT Comply request failed with status ${response.status}.`
    );
  }

  return (await response.json()) as ResponseType;
}

export async function getSupportedCurrencies() {
  const currencies = await getVatComplyJson<
    Record<string, VatComplyCurrencyResponse>
  >("/currencies", {
    next: { revalidate: 60 * 60 * 24 },
  });

  return Object.entries(currencies)
    .map(([code, currency]) => ({
      code,
      name: currency.name,
      symbol: currency.currency_symbol || code,
      decimalPlaces: currency.decimal_places,
    }))
    .sort((leftCurrency, rightCurrency) =>
      leftCurrency.code.localeCompare(rightCurrency.code)
    );
}

export async function getLatestRates(baseCurrency: string, symbols?: string[]) {
  const searchParams = new URLSearchParams({
    base: baseCurrency,
  });

  if (symbols && symbols.length > 0) {
    searchParams.set("symbols", symbols.join(","));
  }

  return getVatComplyJson<VatComplyRatesResponse>("/rates", {
    searchParams,
    next: { revalidate: 60 * 30 },
  });
}