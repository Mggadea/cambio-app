interface ConversionMetaPanelProps {
  conversionSummary: string;
}

function ConversionMetaPanel({ conversionSummary }: ConversionMetaPanelProps) {
  return (
    <div className="flex flex-col gap-3 lg:pt-20">
      <div className="h-min rounded-lg bg-indigo-200 p-6 shadow-none">
        <p className="text-balance font-medium text-black">
          We use the mid-market rate for our Converter. This is for
          informational purposes only. You will not receive this rate when
          sending money.
        </p>
      </div>

      <p className="px-1 text-sm font-medium text-slate-600">
        {conversionSummary}
      </p>
    </div>
  );
}

export default ConversionMetaPanel;