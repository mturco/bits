import { Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { UserMenu } from "./UserMenu";
import { Search } from "./Search";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const user = useOptionalUser();

  return (
    <header className="sticky top-0 grid h-16 grid-cols-header items-center justify-between gap-4 border-b border-ayu-200/95 bg-ayu-100/95 px-4 text-sm dark:border-ayu-700/95 dark:bg-ayu-800/95">
      <Link
        to="/"
        className="mr-auto font-mono text-xl font-bold text-teal-600 outline-teal-400 dark:text-teal-400"
      >
        Bits
      </Link>
      {user && (
        <>
          <Search />

          <div className="justify-self-end">
            <UserMenu user={user} />
          </div>
        </>
      )}
    </header>
  );
};
