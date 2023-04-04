import { Link as RemixLink } from "@remix-run/react";

type LinkProps = React.ComponentProps<typeof RemixLink>;

export function Link({ className, ...props }: LinkProps) {
  return (
    <RemixLink
      {...props}
      className={`text-puerto-rico-600 outline-puerto-rico-300 dark:text-puerto-rico-400 ${className}`}
    />
  );
}
