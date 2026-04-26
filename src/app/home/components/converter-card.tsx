import Card from "@/components/ui/card";
import InputField from "@/components/ui/input-field";
import Select from "@/components/ui/select";
import type { CurrencyOption } from "@/lib/vatcomply";

interface ConverterCardProps {
  amount: string;
  amountSymbol: string;
  conversionSummary: string;
  conversionResult: string;
  currencies: CurrencyOption[];
  errorMessage?: string;
  exchangeRateLabel: string;
  isLoading: boolean;
  fromCurrency: string;
  toCurrency: string;
  onAmountChange: (value: string) => void;
  onFromCurrencyChange: (currencyCode: string) => void;
  onSwapCurrencies: () => void;
  onToCurrencyChange: (currencyCode: string) => void;
}

function ConverterCard({
  amount,
  amountSymbol,
  conversionSummary,
  conversionResult,
  currencies,
  errorMessage,
  exchangeRateLabel,
  isLoading,

  fromCurrency,
  toCurrency,
  onAmountChange,
  onFromCurrencyChange,
  onSwapCurrencies,
  onToCurrencyChange,
}: ConverterCardProps) {
  const isCurrencySelectionDisabled = currencies.length === 0;

  return (
    <Card className="shadow-xl shadow-indigo-950/10">
      <div className="space-y-6">
        <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_auto_1fr] md:items-end">
          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-500">
              Amount
            </span>
            <InputField
              type="number"
              value={amount}
              min="0"
              step="0.01"
              inputMode="decimal"
              startAdornment={
                <span className="text-lg font-semibold text-slate-500">
                  {amountSymbol}
                </span>
              }
              onChange={(event) => onAmountChange(event.target.value)}
            />
          </label>

          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-500">
              From
            </span>
            <Select
              value={fromCurrency}
              disabled={isCurrencySelectionDisabled}
              onChange={(event) => onFromCurrencyChange(event.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </Select>
          </label>

          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-xl font-bold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Switch currencies"
            disabled={isCurrencySelectionDisabled}
            onClick={onSwapCurrencies}
          >
            ⇄
          </button>

          <label className="space-y-2">
            <span className="block text-sm font-semibold text-slate-500">
              To
            </span>
            <Select
              value={toCurrency}
              disabled={isCurrencySelectionDisabled}
              onChange={(event) => onToCurrencyChange(event.target.value)}
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl  px-6 py-8" aria-live="polite">
            <p className="mt-3 whitespace-pre-line text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
              {isLoading && !errorMessage
                ? "Loading rate..."
                : conversionResult}
            </p>
            <p className="mt-3 text-base text-slate-600">
              {errorMessage ?? exchangeRateLabel}
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:pt-20">
            <div className="h-min rounded-lg bg-indigo-200 p-6 shadow-none">
              <p className="text-balance font-medium text-black ">
                We use the mid-market rate for our Converter. This is for
                informational purposes only. You will not receive this rate when
                sending money.
              </p>
            </div>

            <p className="px-1 text-sm font-medium text-slate-600">
              {conversionSummary}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ConverterCard;
