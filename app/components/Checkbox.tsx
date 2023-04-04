import { forwardRef, useRef } from "react";

type CheckboxProps = React.ComponentPropsWithoutRef<"input">;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, forwardedRef) => {
    const fallbackRef = useRef<HTMLInputElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLInputElement>) ?? fallbackRef;

    return (
      <input
        {...props}
        type="checkbox"
        className={`outline-none ring-teal-400 ring-offset-1 focus:ring-2 ${className}`}
        ref={ref}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";
