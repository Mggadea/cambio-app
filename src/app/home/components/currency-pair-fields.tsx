import Image from "next/image";
import Select from "@/components/ui/select";
import swapImage from "@/assets/swap.png";
import type { CurrencyOption } from "@/lib/vatcomply";

interface CurrencyPairFieldsProps {
  currencies: CurrencyOption[];
  fromCurrency: string;
  isDisabled: boolean;
  onFromCurrencyChange: (currencyCode: string) => void;
  onSwapCurrencies: () => void;
  onToCurrencyChange: (currencyCode: string) => void;
  toCurrency: string;
}

function CurrencyPairFields({
  currencies,
  fromCurrency,
  isDisabled,
  onFromCurrencyChange,
  onSwapCurrencies,
  onToCurrencyChange,
  toCurrency,
}: CurrencyPairFieldsProps) {
  return (
    <>
      <label className="space-y-2">
        <span className="block text-sm font-semibold text-slate-500">From</span>
        <Select
          value={fromCurrency}
          disabled={isDisabled}
          onChange={(event) => onFromCurrencyChange(event.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </Select>
        <div className="min-h-0 md:min-h-5" aria-hidden="true" />
      </label>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-indigo-500 bg-white text-xl font-bold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Switch currencies"
          disabled={isDisabled}
          onClick={onSwapCurrencies}
        >
          <Image
            src={swapImage}
            alt=""
            className="mix-blend-multiply"
            width={24}
            height={24}
          />
        </button>
        <div className="min-h-0 md:min-h-5" aria-hidden="true" />
      </div>

      <label className="space-y-2">
        <span className="block text-sm font-semibold text-slate-500">To</span>
        <Select
          value={toCurrency}
          disabled={isDisabled}
          onChange={(event) => onToCurrencyChange(event.target.value)}
        >
          {currencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </Select>
        <div className="min-h-0 md:min-h-5" aria-hidden="true" />
      </label>
    </>
  );
}

export default CurrencyPairFields;