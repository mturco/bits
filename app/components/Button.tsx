import type { AriaButtonProps } from "react-aria";
import { mergeProps, useButton } from "react-aria";
import type { LinksFunction } from "@remix-run/node";
import styles from "./Button.css";
import { forwardRef, useRef } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface ButtonProps
  extends Pick<React.ComponentPropsWithoutRef<"button">, "className">,
    AriaButtonProps<"button"> {
  noStyling?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ noStyling, ...props }, forwardedRef) => {
    const mergedProps = mergeProps(
      { className: noStyling ? "" : "button" },
      props
    );
    const fallbackRef = useRef<HTMLButtonElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLButtonElement>) ?? fallbackRef;
    const { buttonProps } = useButton(mergedProps, ref);

    return <button {...mergedProps} {...buttonProps} ref={ref} />;
  }
);

Button.displayName = "Button";
