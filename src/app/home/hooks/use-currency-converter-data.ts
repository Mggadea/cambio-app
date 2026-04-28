"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { getExchangeRatesAction } from "../actions/currency-converter";
import {
  DEFAULT_AMOUNT,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  EMPTY_CONVERSION_RESULT,
} from "../constants/currency-converter";
import {
  buildConversionResult,
  buildConversionSummary,
  buildExchangeRateLabel,
  buildHeroTitle,
  buildHeroTitleDetail,
  findCurrency,
  getAmountValidationMessage,
  getResolvedRate,
  parseAmount,
  resolveCurrencyPair,
} from "../helpers/currency-converter";
import type { CurrencyOption } from "@/lib/vatcomply";
import type { VatComplyRatesResponse } from "@/lib/vatcomply";

interface UseExchangeRatesTransitionOptions {
  fromCurrency: string;
  toCurrency: string;
  initialRatesData: VatComplyRatesResponse | null;
}

interface UseCurrencyConverterOptions {
  currencies: CurrencyOption[];
  currenciesErrorMessage?: string;
  initialRatesData: VatComplyRatesResponse | null;
}

export interface CurrencyConverterHeroViewModel {
  title: string;
  titleDetail: string;
}

export interface CurrencyConverterFormViewModel {
  amount: string;
  amountErrorMessage?: string;
  amountSymbol: string;
  currencies: CurrencyOption[];
  fromCurrency: string;
  isCurrencySelectionDisabled: boolean;
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (currencyCode: string) => void;
  onSwapCurrencies: () => void;
  onToCurrencyChange: (currencyCode: string) => void;
  toCurrency: string;
}

export interface CurrencyConverterResultViewModel {
  conversionSummary: string;
  conversionResult: string;
  errorMessage?: string;
  exchangeRateLabel: string;
  isLoading: boolean;
}

export interface CurrencyConverterViewModel {
  hero: CurrencyConverterHeroViewModel;
  form: CurrencyConverterFormViewModel;
  result: CurrencyConverterResultViewModel;
}

function useExchangeRatesTransition({
  fromCurrency,
  toCurrency,
  initialRatesData,
}: UseExchangeRatesTransitionOptions) {
  const [ratesData, setRatesData] = useState<VatComplyRatesResponse | undefined>(
    initialRatesData ?? undefined,
  );
  const [ratesErrorMessage, setRatesErrorMessage] = useState<string | undefined>();
  const [isTransitionPending, startTransition] = useTransition();
  const lastRequestedPairRef = useRef(`${fromCurrency}->${toCurrency}`);
  const latestRequestIdRef = useRef(0);

  useEffect(() => {
    const pairKey = `${fromCurrency}->${toCurrency}`;

    if (lastRequestedPairRef.current === pairKey) {
      return;
    }

    lastRequestedPairRef.current = pairKey;

    if (!fromCurrency || !toCurrency || fromCurrency === toCurrency) {
      return;
    }

    const requestId = ++latestRequestIdRef.current;

    startTransition(() => {
      void getExchangeRatesAction({
        baseCurrency: fromCurrency,
        targetCurrency: toCurrency,
      }).then((result) => {
        if (requestId !== latestRequestIdRef.current) {
          return;
        }

        if (result.ok) {
          setRatesData(result.data);
          setRatesErrorMessage(undefined);
          return;
        }

        setRatesErrorMessage(result.message);
      });
    });
  }, [fromCurrency, toCurrency]);

  return {
    ratesData,
    ratesErrorMessage:
      fromCurrency === toCurrency ? undefined : ratesErrorMessage,
    isLoading: fromCurrency !== toCurrency && isTransitionPending,
  };
}

export function useCurrencyConverter({
  currencies,
  currenciesErrorMessage,
  initialRatesData,
}: UseCurrencyConverterOptions): CurrencyConverterViewModel {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [requestedFromCurrency, setRequestedFromCurrency] =
    useState(DEFAULT_FROM_CURRENCY);
  const [requestedToCurrency, setRequestedToCurrency] =
    useState(DEFAULT_TO_CURRENCY);
  const { fromCurrency, toCurrency } = resolveCurrencyPair(
    currencies,
    requestedFromCurrency,
    requestedToCurrency,
  );
  const { ratesData, ratesErrorMessage, isLoading } =
    useExchangeRatesTransition({
      fromCurrency,
      toCurrency,
      initialRatesData,
    });

  const amountValidationMessage = getAmountValidationMessage(amount);
  const parsedAmount = parseAmount(amount);
  const rate = getResolvedRate(fromCurrency, toCurrency, ratesData);
  const fromCurrencyOption = findCurrency(currencies, fromCurrency);
  const toCurrencyOption = findCurrency(currencies, toCurrency);
  const conversionResult = amountValidationMessage
    ? EMPTY_CONVERSION_RESULT
    : buildConversionResult(
        parsedAmount,
        rate,
        fromCurrencyOption?.name ?? fromCurrency,
        toCurrencyOption?.name ?? toCurrency,
        fromCurrencyOption?.decimalPlaces ?? 2,
        toCurrencyOption?.decimalPlaces ?? 2,
      );
  const conversionSummary = buildConversionSummary(
    fromCurrencyOption?.name ?? fromCurrency,
    toCurrencyOption?.name ?? toCurrency,
    ratesData?.date,
  );
  const exchangeRateLabel = buildExchangeRateLabel(
    fromCurrency,
    rate,
    toCurrency,
  );
  const errorMessage =
    amountValidationMessage ?? currenciesErrorMessage ?? ratesErrorMessage;

  return {
    hero: {
      title: buildHeroTitle(fromCurrency, toCurrency),
      titleDetail: buildHeroTitleDetail(
        fromCurrencyOption?.name ?? fromCurrency,
        toCurrencyOption?.name ?? toCurrency,
      ),
    },
    form: {
      amount,
      amountErrorMessage: amountValidationMessage,
      amountSymbol: fromCurrencyOption?.symbol ?? fromCurrency,
      currencies,
      fromCurrency,
      isCurrencySelectionDisabled: currencies.length === 0,
      onAmountChange: setAmount,
      onFromCurrencyChange: setRequestedFromCurrency,
      onSwapCurrencies: () => {
        setRequestedFromCurrency(toCurrency);
        setRequestedToCurrency(fromCurrency);
      },
      onToCurrencyChange: setRequestedToCurrency,
      toCurrency,
    },
    result: {
      conversionSummary,
      conversionResult,
      errorMessage,
      exchangeRateLabel,
      isLoading,
    },
  };
}