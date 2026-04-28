"use client";

import ConverterCard from "../components/converter-card";
import Header from "../components/header";
import Hero from "../components/hero";
import { PAGE_TITLE } from "../constants/currency-converter";
import { useCurrencyConverter } from "../hooks/use-currency-converter-data";
import type { CurrencyOption, VatComplyRatesResponse } from "@/lib/vatcomply";

interface HomePageContainerProps {
  currencies: CurrencyOption[];
  currenciesErrorMessage?: string;
  initialRatesData: VatComplyRatesResponse | null;
}

function HomePageContainer({
  currencies,
  currenciesErrorMessage,
  initialRatesData,
}: HomePageContainerProps) {
  const converter = useCurrencyConverter({
    currencies,
    currenciesErrorMessage,
    initialRatesData,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header title={PAGE_TITLE} />
      <Hero title={converter.hero.title} titleDetail={converter.hero.titleDetail}>
        <ConverterCard form={converter.form} result={converter.result} />
      </Hero>
    </div>
  );
}

export default HomePageContainer;