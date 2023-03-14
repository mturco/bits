import type { AriaButtonProps } from "react-aria";
import { useButton } from "react-aria";
import type { LinksFunction } from "@remix-run/node";
import styles from "./Button.css";
import { forwardRef, useRef } from "react";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface ButtonProps
  extends Pick<React.ComponentPropsWithoutRef<"button">, "className">,
    AriaButtonProps<"button"> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, forwardedRef) => {
    const fallbackRef = useRef<HTMLButtonElement>(null);
    const ref =
      (forwardedRef as React.RefObject<HTMLButtonElement>) ?? fallbackRef;
    const { buttonProps } = useButton(props, ref);

    return <button {...props} {...buttonProps} ref={ref} />;
  }
);

Button.displayName = "Button";
