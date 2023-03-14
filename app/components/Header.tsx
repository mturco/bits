import type { LinksFunction } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import { UserMenuButton } from "./UserMenuButton";
import { Item, Section } from "react-stately";
import styles from "./Header.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

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
    <header className="header">
      <Link to="/" className="app-name">
        Bits
      </Link>
      {user && (
        <UserMenuButton onAction={handleMenuAction}>
          <Section title={user.email}>
            <Item key="logout">Logout</Item>
          </Section>
        </UserMenuButton>
      )}
    </header>
  );
};
