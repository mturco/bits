import { Button as ReactAriaButton } from "react-aria-components";
import type { ButtonProps } from "react-aria-components";
import { forwardRef, useRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", ...props }, forwardedRef) => {
    const fallbackRef = useRef<HTMLButtonElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLButtonElement>) ?? fallbackRef;

    return (
      <ReactAriaButton
        {...props}
        ref={ref}
        className={`cursor-pointer rounded-md border-none bg-teal-600 py-2 px-5 text-sm font-medium text-white outline-none ring-teal-400 ring-offset-1 hover:bg-teal-700 focus:ring-2 active:bg-teal-800 ${className}`}
      />
    );
  }
);

Button.displayName = "Button";
