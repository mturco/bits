import type { AriaButtonProps } from "react-aria";
import { useButton } from "react-aria";
import { forwardRef, useRef } from "react";

interface ButtonProps
  extends Pick<React.ComponentPropsWithoutRef<"button">, "className">,
    AriaButtonProps<"button"> {
  noStyling?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", noStyling = false, ...props }, forwardedRef) => {
    const fallbackRef = useRef<HTMLButtonElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLButtonElement>) ?? fallbackRef;
    const { buttonProps } = useButton(props, ref);

    return (
      <button
        {...props}
        {...buttonProps}
        ref={ref}
        className={
          noStyling
            ? className
            : `cursor-pointer rounded-md border-none bg-puerto-rico-600 py-2 px-5 text-sm font-medium text-white outline-none ring-puerto-rico-400 ring-offset-1 hover:bg-puerto-rico-700 focus:ring-2 active:bg-puerto-rico-800 ${className}`
        }
      />
    );
  }
);

Button.displayName = "Button";
