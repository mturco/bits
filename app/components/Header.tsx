import { useSubmit } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { UserMenuButton } from "./UserMenuButton";
import { Item, Section } from "react-stately";
import { Search } from "./Search";
import { Link } from "./Link";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const user = useOptionalUser();
  const submit = useSubmit();

  function handleMenuAction(key: React.Key) {
    switch (key) {
      case "logout": {
        submit(null, { action: "/logout", method: "post" });
        return;
      }
    }
  }

  return (
    <header className="sticky top-0 grid h-16 grid-cols-header items-center justify-between gap-4 border-b border-ayu-200/95 bg-ayu-100/95 px-4 text-sm dark:border-ayu-700/95 dark:bg-ayu-800/95">
      <Link to="/" className="mr-auto font-mono text-xl font-bold">
        Bits
      </Link>
      {user && (
        <>
          <Search />

          <div className="justify-self-end">
            <UserMenuButton onAction={handleMenuAction}>
              <Section title={user.email}>
                <Item key="logout">Logout</Item>
              </Section>
            </UserMenuButton>
          </div>
        </>
      )}
    </header>
  );
};
