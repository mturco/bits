import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBitsMatching } from "~/models/bit.server";

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url).searchParams.get("query");
  if (!query) return json([]);

  const results = await getBitsMatching(query);
  return results;
};
