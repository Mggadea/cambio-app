interface ConversionResultPanelProps {
  conversionResult: string;
  errorMessage?: string;
  exchangeRateLabel: string;
  isLoading: boolean;
}

function ConversionResultPanel({
  conversionResult,
  errorMessage,
  exchangeRateLabel,
  isLoading,
}: ConversionResultPanelProps) {
  return (
    <div className="rounded-2xl px-6 py-8" aria-live="polite">
      <p className="mt-3 whitespace-pre-line text-4xl font-bold leading-tight tracking-tight text-slate-950 md:text-5xl">
        {isLoading && !errorMessage ? "Loading rate..." : conversionResult}
      </p>
      <p className="mt-3 text-base text-slate-600">
        {errorMessage ?? exchangeRateLabel}
      </p>
    </div>
  );
}

export default ConversionResultPanel;