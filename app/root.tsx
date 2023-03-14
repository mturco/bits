import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import modernNormalize from "modern-normalize/modern-normalize.css";
import globalStyles from "~/styles/global.css";
import tailwind from "~/tailwind.css";
import { Header, links as headerLinks } from "~/components/Header";

import { getUser } from "./session.server";

export const meta: MetaFunction = () => {
  return { title: "Bits" };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: modernNormalize },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: globalStyles },
  ...headerLinks(),
];

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <div className="outlet">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
