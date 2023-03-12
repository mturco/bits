import { useMemo } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type {
  ActionFunction,
  LoaderFunction,
  LinksFunction,
} from "@remix-run/node";
import { compareDesc, parseISO } from "date-fns";
import { requireUserId } from "~/session.server";
import { deleteBit, getAllBits } from "~/models/bit.server";
import type { Bit as BitType } from "~/models/bit.server";
import styles from "~/styles/index.css";
import { Bit, links as bitLinks } from "~/components/Bit";
import { createBit } from "~/models/bit.server";
import { getUserId } from "~/session.server";
import { BitForm, links as bitFormLinks } from "~/components/BitForm";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...bitFormLinks(),
  ...bitLinks(),
];

interface LoaderData {
  bits: BitType[] | null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  return json<LoaderData>({
    bits: await getAllBits(userId),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await getUserId(request);
  const formData = await request.formData();

  switch (request.method) {
    case "POST": {
      const content = formData.get("content");

      if (typeof content !== "string" || content.length === 0) {
        return json(
          { errors: { content: "Content is required" } },
          { status: 400 }
        );
      }

      const bit = await createBit({ profile_id: userId, content });
      return json({ bit });
    }

    case "DELETE": {
      const id = formData.get("id") as string | null;
      if (id) {
        await deleteBit({ id, profile_id: userId });
      }
      return null;
    }

    default: {
      return null;
    }
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  const bits = useMemo(
    () =>
      data.bits?.sort((a, b) =>
        compareDesc(parseISO(a.created_at), parseISO(b.created_at))
      ),
    [data]
  );

  return (
    <main className="index-page">
      <BitForm clearOnSubmit method="post" />

      <div className="bits-list">
        {bits?.length ? (
          bits.map((bit) => <Bit bit={bit} key={bit.id} />)
        ) : (
          <p>No bits yet!</p>
        )}
      </div>
    </main>
  );
}
