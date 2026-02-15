"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", label, error, helperText, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-walnut mb-1"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full px-3 py-2 rounded-xl border transition-colors
            bg-white text-charcoal
            focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-transparent
            disabled:bg-beige disabled:text-charcoal/50 disabled:cursor-not-allowed
            ${error ? "border-red-500" : "border-sand"}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
        {helperText && !error && (
          <p className="mt-1 text-sm text-charcoal/60">{helperText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
