"use client";

import { useState, KeyboardEvent, forwardRef } from "react";

interface TagInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
}

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      label,
      error,
      placeholder = "Type and press Enter",
      value,
      onChange,
      maxTags = 10,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addTag();
      } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
        removeTag(value.length - 1);
      }
    };

    const addTag = () => {
      const trimmed = inputValue.trim();
      if (
        trimmed &&
        !value.includes(trimmed) &&
        value.length < maxTags
      ) {
        onChange([...value, trimmed]);
        setInputValue("");
      }
    };

    const removeTag = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div
          className={`
            w-full min-h-[42px] px-3 py-2 rounded-lg border bg-white
            focus-within:ring-2 focus-within:ring-slate-500 focus-within:border-transparent
            ${error ? "border-red-500" : "border-slate-300"}
          `}
        >
          <div className="flex flex-wrap gap-2">
            {value.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-md"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={`Remove ${tag}`}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
            <input
              ref={ref}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addTag}
              placeholder={value.length === 0 ? placeholder : ""}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
              disabled={value.length >= maxTags}
            />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {value.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            {value.length} of {maxTags} tags added
          </p>
        )}
      </div>
    );
  }
);

TagInput.displayName = "TagInput";

export { TagInput };
