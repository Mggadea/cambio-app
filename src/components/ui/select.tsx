import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={`w-full rounded-xl border border-slate-200 bg-white px-4 h-12 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";

export default Select;