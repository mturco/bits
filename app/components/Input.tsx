import { forwardRef, useRef } from "react";

type InputProps = React.ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, forwardedRef) => {
    const fallbackRef = useRef<HTMLInputElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLInputElement>) ?? fallbackRef;

    return (
      <input
        {...props}
        className={`rounded-sm border px-2 py-1 outline-none ring-puerto-rico-400 ring-offset-1 focus:ring-2 ${className}`}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";
