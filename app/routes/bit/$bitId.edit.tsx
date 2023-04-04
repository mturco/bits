import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { updateBit } from "~/models/bit.server";
import { deleteBit } from "~/models/bit.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { getBit } from "~/models/bit.server";
import { getUserId } from "~/session.server";
import { BitForm } from "~/components/BitForm";
import { PageContainer } from "~/components/PageContainer";

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

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await getUserId(request);
  const formData = await request.formData();

  switch (request.method) {
    case "PUT": {
      const { bitId } = params;
      const content = formData.get("content") as string | null;
      if (bitId && content) {
        await updateBit({ id: bitId, content, profile_id: userId });
        return redirect(`/bit/${bitId}`);
      }
    }

    case "DELETE": {
      const id = formData.get("id") as string | null;
      if (id) {
        await deleteBit({ id, profile_id: userId });
      }
      return redirect("/");
    }

    default: {
      return null;
    }
  }
};

export default function ViewBitPage() {
  const data = useLoaderData<typeof loader>() as LoaderData;

  return (
    <PageContainer>
      <BitForm method="put" initialContent={data.bit.content} />
    </PageContainer>
  );
}
