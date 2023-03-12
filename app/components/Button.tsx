import type { LinksFunction } from "@remix-run/node";
import styles from "./Button.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {}

export const Button: React.FC<ButtonProps> = ({ className = "", ...props }) => {
  return <button {...props} className={`button ${className}`} />;
};
