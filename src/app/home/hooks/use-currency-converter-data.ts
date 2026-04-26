"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { CurrencyOption, VatComplyRatesResponse } from "@/lib/vatcomply";

interface CurrenciesResponse {
  currencies: CurrencyOption[];
}

interface ApiErrorResponse {
  message?: string;
}

async function getInternalJson<ResponseType>(url: string) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorBody =
      ((await response.json().catch(() => null)) as ApiErrorResponse | null) ??
      null;

    throw new Error(
      errorBody?.message ?? `Request failed with status ${response.status}.`
    );
  }

  return (await response.json()) as ResponseType;
}

export function useSupportedCurrenciesQuery() {
  return useQuery<CurrencyOption[], Error>({
    queryKey: ["supported-currencies"],
    queryFn: async () => {
      const response = await getInternalJson<CurrenciesResponse>(
        "/api/currencies"
      );

      return response.currencies;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useExchangeRatesQuery(
  baseCurrency: string,
  targetCurrency: string
) {
  return useQuery<VatComplyRatesResponse, Error>({
    queryKey: ["exchange-rates", baseCurrency, targetCurrency],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        base: baseCurrency,
        symbols: targetCurrency,
      });

      return getInternalJson<VatComplyRatesResponse>(
        `/api/exchange-rates?${searchParams.toString()}`
      );
    },
    enabled: Boolean(baseCurrency && targetCurrency && baseCurrency !== targetCurrency),
    placeholderData: keepPreviousData,
  });
}