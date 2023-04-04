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
        className={`rounded-md border-none bg-transparent px-3 py-2 outline-none ring-2 ring-inset ring-ayu-300 focus:bg-puerto-rico-50 focus:ring-2 focus:ring-puerto-rico-600 dark:border-ayu-600 dark:ring-ayu-700 dark:focus:bg-puerto-rico-600/10 ${className}`}
        ref={ref}
      />
    );
  }
);

Input.displayName = "Input";
