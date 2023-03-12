import type { LinksFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { useOptionalUser } from "~/utils";
import styles from "./Header.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  const user = useOptionalUser();

  return (
    <header className="header">
      <Link to="/" className="app-name">
        Bits
      </Link>
      {user ? (
        <>
          <span className="user-email">{user.email}</span>
          <Form action="/logout" method="post">
            <button className="header-button" type="submit">
              Logout
            </button>
          </Form>
        </>
      ) : (
        <Link className="header-button" to="/login">
          Login
        </Link>
      )}
    </header>
  );
};
