"use client";

import { useState } from "react";
import ConverterCard from "../components/converter-card";
import Header from "../components/header";
import Hero from "../components/hero";
import {
  DEFAULT_AMOUNT,
  DEFAULT_FROM_CURRENCY,
  DEFAULT_TO_CURRENCY,
  EMPTY_CONVERSION_RESULT,
  PAGE_TITLE,
} from "../constants/currency-converter";
import {
  buildConversionResult,
  buildConversionSummary,
  buildExchangeRateLabel,
  buildHeroTitle,
  buildHeroTitleDetail,
  findCurrency,
  getAmountValidationMessage,
  getResolvedCurrencyCode,
  getResolvedRate,
  parseAmount,
} from "../helpers/currency-converter";
import {
  useExchangeRatesQuery,
  useSupportedCurrenciesQuery,
} from "../hooks/use-currency-converter-data";

function HomePageContainer() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT);
  const [requestedFromCurrency, setRequestedFromCurrency] =
    useState(DEFAULT_FROM_CURRENCY);
  const [requestedToCurrency, setRequestedToCurrency] =
    useState(DEFAULT_TO_CURRENCY);

  const {
    data: currencies = [],
    error: currenciesError,
    isLoading: isCurrenciesLoading,
  } = useSupportedCurrenciesQuery();

  const fromCurrency =
    currencies.length > 0
      ? getResolvedCurrencyCode(currencies, [
          requestedFromCurrency,
          DEFAULT_FROM_CURRENCY,
        ])
      : requestedFromCurrency;

  const toCurrency =
    currencies.length > 0
      ? getResolvedCurrencyCode(currencies, [
          requestedToCurrency,
          DEFAULT_TO_CURRENCY,
        ])
      : requestedToCurrency;

  const {
    data: ratesData,
    error: ratesError,
    isLoading: isRatesLoading,
  } = useExchangeRatesQuery(fromCurrency, toCurrency);

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
    toCurrency
  );
  const errorMessage =
    amountValidationMessage ?? currenciesError?.message ?? ratesError?.message;
  const isLoading =
    isCurrenciesLoading || (fromCurrency !== toCurrency && isRatesLoading);

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={PAGE_TITLE} />
      <Hero
        title={buildHeroTitle(fromCurrency, toCurrency)}
        titleDetail={buildHeroTitleDetail(
          fromCurrencyOption?.name ?? fromCurrency,
          toCurrencyOption?.name ?? toCurrency
        )}
      >
        <ConverterCard
          amount={amount}
          amountErrorMessage={amountValidationMessage}
          amountSymbol={fromCurrencyOption?.symbol ?? fromCurrency}
          conversionSummary={conversionSummary}
          conversionResult={conversionResult}
          currencies={currencies}
          errorMessage={errorMessage}
          exchangeRateLabel={exchangeRateLabel}
          fromCurrency={fromCurrency}
          isLoading={isLoading}
          onAmountChange={setAmount}
          onFromCurrencyChange={setRequestedFromCurrency}
          onSwapCurrencies={() => {
            setRequestedFromCurrency(toCurrency);
            setRequestedToCurrency(fromCurrency);
          }}
          onToCurrencyChange={setRequestedToCurrency}
          toCurrency={toCurrency}
        />
      </Hero>
    </div>
  );
}

export default HomePageContainer;