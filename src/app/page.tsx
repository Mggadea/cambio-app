import HomePageContainer from "./home/containers/home-page-container";
import {
  resolveCurrencyPair,
} from "./home/helpers/currency-converter";
import { getLatestRates, getSupportedCurrencies } from "@/lib/vatcomply";
import type { CurrencyOption, VatComplyRatesResponse } from "@/lib/vatcomply";

async function Page() {
  let currencies: CurrencyOption[] = [];
  let currenciesErrorMessage: string | undefined;
  let initialRatesData: VatComplyRatesResponse | null = null;

  try {
    currencies = await getSupportedCurrencies();
  } catch (error) {
    currenciesErrorMessage =
      error instanceof Error ? error.message : "Unable to load supported currencies.";
  }

  const { fromCurrency: initialFromCurrency, toCurrency: initialToCurrency } =
    resolveCurrencyPair(currencies);

  if (currenciesErrorMessage === undefined && initialFromCurrency !== initialToCurrency) {
    try {
      initialRatesData = await getLatestRates(initialFromCurrency, [initialToCurrency]);
    } catch {
      initialRatesData = null;
    }
  }

  return (
    <HomePageContainer
      currencies={currencies}
      currenciesErrorMessage={currenciesErrorMessage}
      initialRatesData={initialRatesData}
    />
  );
}

export default Page;
