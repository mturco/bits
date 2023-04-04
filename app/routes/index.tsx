import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { deleteBit, getAllBits } from "~/models/bit.server";
import type { Bit as BitType } from "~/models/bit.server";
import { Bit } from "~/components/Bit";
import { createBit } from "~/models/bit.server";
import { getUserId } from "~/session.server";
import { BitForm } from "~/components/BitForm";
import { PageContainer } from "~/components/PageContainer";

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

  return (
    <PageContainer>
      <BitForm clearOnSubmit method="post" />

      <div className="mt-8 flex flex-col gap-8 md:mt-16 lg:mt-24">
        {data.bits?.length ? (
          data.bits.map((bit) => <Bit bit={bit} key={bit.id} />)
        ) : (
          <p>No bits yet!</p>
        )}
      </div>
    </PageContainer>
  );
}
