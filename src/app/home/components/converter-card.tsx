import Card from "@/components/ui/card";
import ConversionMetaPanel from "./conversion-meta-panel";
import ConversionResultPanel from "./conversion-result-panel";
import ConverterAmountField from "./converter-amount-field";
import CurrencyPairFields from "./currency-pair-fields";
import type {
  CurrencyConverterFormViewModel,
  CurrencyConverterResultViewModel,
} from "../hooks/use-currency-converter-data";

interface ConverterCardProps {
  form: CurrencyConverterFormViewModel;
  result: CurrencyConverterResultViewModel;
}

function ConverterCard({ form, result }: ConverterCardProps) {
  return (
    <Card className="shadow-xl shadow-indigo-950/10">
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto_1fr] md:items-end">
          <ConverterAmountField
            amount={form.amount}
            amountErrorMessage={form.amountErrorMessage}
            amountSymbol={form.amountSymbol}
            onAmountChange={form.onAmountChange}
          />

          <CurrencyPairFields
            currencies={form.currencies}
            fromCurrency={form.fromCurrency}
            isDisabled={form.isCurrencySelectionDisabled}
            onFromCurrencyChange={form.onFromCurrencyChange}
            onSwapCurrencies={form.onSwapCurrencies}
            onToCurrencyChange={form.onToCurrencyChange}
            toCurrency={form.toCurrency}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <ConversionResultPanel
            conversionResult={result.conversionResult}
            errorMessage={result.errorMessage}
            exchangeRateLabel={result.exchangeRateLabel}
            isLoading={result.isLoading}
          />

          <ConversionMetaPanel conversionSummary={result.conversionSummary} />
        </div>
      </div>
    </Card>
  );
}

export default ConverterCard;
