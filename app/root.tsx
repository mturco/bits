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

import { getUser } from "./session.server";

export const meta: MetaFunction = () => {
  return { title: "Bits" };
};

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: modernNormalize },
    { rel: "stylesheet", href: globalStyles },
  ];
};

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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
