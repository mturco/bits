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
import markdown from "~/styles/markdown.css";
import { Header } from "~/components/Header";

import { getUser } from "./session.server";

export const meta: MetaFunction = () => {
  return { title: "Bits" };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: modernNormalize },
  { rel: "stylesheet", href: tailwind },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: markdown },
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
      <body className="flex flex-col">
        <Header />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
