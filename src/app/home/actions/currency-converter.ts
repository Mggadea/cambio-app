"use server";

import { getLatestRates } from "@/lib/vatcomply";
import type { VatComplyRatesResponse } from "@/lib/vatcomply";

interface GetExchangeRatesActionInput {
  baseCurrency: string;
  targetCurrency: string;
}

type GetExchangeRatesActionResult =
  | {
      ok: true;
      data: VatComplyRatesResponse;
    }
  | {
      ok: false;
      message: string;
    };

export async function getExchangeRatesAction({
  baseCurrency,
  targetCurrency,
}: GetExchangeRatesActionInput): Promise<GetExchangeRatesActionResult> {
  if (!baseCurrency || !targetCurrency) {
    return {
      ok: false,
      message: "Both base and target currencies are required.",
    };
  }

  if (baseCurrency === targetCurrency) {
    return {
      ok: true,
      data: {
        base: baseCurrency,
        date: new Date().toISOString().slice(0, 10),
        rates: {
          [targetCurrency]: 1,
        },
      },
    };
  }

  try {
    const exchangeRates = await getLatestRates(baseCurrency, [targetCurrency]);

    return {
      ok: true,
      data: exchangeRates,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "Unable to load exchange rates.",
    };
  }
}