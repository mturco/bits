import { Link as RemixLink } from "@remix-run/react";

type LinkProps = React.ComponentProps<typeof RemixLink>;

export function Link({ className, ...props }: LinkProps) {
  return (
    <RemixLink
      {...props}
      className={`text-teal-700 outline-teal-300 dark:text-teal-400 ${className}`}
    />
  );
}
