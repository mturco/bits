import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getBitsMatching } from "~/models/bit.server";
import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const query = new URL(request.url).searchParams.get("query");
  const userId = await requireUserId(request);
  if (!query) return json([]);

  const results = await getBitsMatching(query, userId);
  return results;
};
