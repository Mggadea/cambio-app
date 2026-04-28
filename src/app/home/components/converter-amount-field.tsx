import InputField from "@/components/ui/input-field";

interface ConverterAmountFieldProps {
  amount: string;
  amountErrorMessage?: string;
  amountSymbol: string;
  onAmountChange: (value: string) => void;
}

function ConverterAmountField({
  amount,
  amountErrorMessage,
  amountSymbol,
  onAmountChange,
}: ConverterAmountFieldProps) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-semibold text-slate-500">Amount</span>
      <InputField
        type="number"
        value={amount}
        aria-describedby={amountErrorMessage ? "amount-error-message" : undefined}
        aria-invalid={Boolean(amountErrorMessage)}
        min="0"
        step="0.01"
        inputMode="decimal"
        containerClassName={
          amountErrorMessage
            ? "border-red-300 focus-within:border-red-500 focus-within:ring-red-100"
            : ""
        }
        startAdornment={
          <span className="text-lg font-semibold text-slate-500">{amountSymbol}</span>
        }
        onChange={(event) => onAmountChange(event.target.value)}
      />
      <div className="min-h-0 md:min-h-5">
        {amountErrorMessage ? (
          <span
            id="amount-error-message"
            className="block text-sm font-medium leading-5 text-red-600"
          >
            {amountErrorMessage}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export default ConverterAmountField;