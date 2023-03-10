import {
  ActionFunction,
  LinksFunction,
  LoaderArgs,
  redirect,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { deleteBit } from "~/models/bit.server";
import { requireUserId } from "~/session.server";
import { Bit, links as bitLinks } from "~/components/Bit";
import invariant from "tiny-invariant";
import { getBit } from "~/models/bit.server";
import styles from "~/styles/bit.css";
import { getUserId } from "~/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...bitLinks(),
];

type LoaderData = {
  bit: BitType;
};

export async function loader({ request, params }: LoaderArgs) {
  const userId = await requireUserId(request);
  invariant(params.bitId, "Bit not found");

  const bit = await getBit({ id: params.bitId, profile_id: userId });
  if (!bit) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({ bit });
}

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const formData = await request.formData();

  switch (request.method) {
    case "DELETE": {
      const id = formData.get("id") as string | null;
      if (id) {
        await deleteBit({ id, profile_id: userId });
      }
      return redirect("/");
    }
  }
};

export default function ViewBitPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  return (
    <div className="bit-page">
      <Bit bit={data.bit} />
    </div>
  );
}
