import type { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

function InputField({
  startAdornment,
  endAdornment,
  containerClassName = "",
  inputClassName = "",
  type,
  ...props
}: InputFieldProps) {
  const numberInputClassName =
    type === "number" ? "number-input-no-controls" : "";

  return (
    <div
      className={`flex items-center gap-3 h-12 rounded-xl border border-slate-200 bg-white px-2 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 ${containerClassName}`}
    >
      {startAdornment ? <div className="shrink-0">{startAdornment}</div> : null}
      <input
        {...props}
        type={type}
        className={`min-w-0 flex-1 border-0 bg-transparent px-0 py-3 text-slate-900 outline-none ring-0 shadow-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 ${numberInputClassName} ${inputClassName}`}
      />
      {endAdornment ? <div className="shrink-0">{endAdornment}</div> : null}
    </div>
  );
}

export default InputField;