import { forwardRef, useRef } from "react";
import type { CheckboxProps as ReactAriaCheckboxProps } from "react-aria-components";
import { Checkbox as ReactAriaCheckbox } from "react-aria-components";

interface CheckboxProps extends ReactAriaCheckboxProps {
  label: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, ...props }, forwardedRef) => {
    const fallbackRef = useRef<HTMLInputElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLInputElement>) ?? fallbackRef;

    return (
      <ReactAriaCheckbox
        {...props}
        className={`flex items-center gap-2 ${className}`}
        ref={ref}
      >
        {({ isSelected, isDisabled, isFocusVisible }) => (
          <>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                isDisabled
                  ? "border-ayu-200 text-ayu-400"
                  : isFocusVisible || isSelected
                  ? "border-teal-600 bg-teal-50 text-teal-600"
                  : "border-ayu-300"
              }`}
            >
              <svg
                className="h-4 w-4 fill-none stroke-teal-600 transition-all"
                style={{
                  marginLeft: "1px",
                  strokeWidth: "3px",
                  strokeDasharray: "22px",
                  strokeDashoffset: isSelected ? "44" : "66",
                }}
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <polyline points="1 9 7 14 15 4" />
              </svg>
            </div>
            <span>{label}</span>
          </>
        )}
      </ReactAriaCheckbox>
    );
  }
);

Checkbox.displayName = "Checkbox";
