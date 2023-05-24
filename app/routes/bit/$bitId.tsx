import type { ActionFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { deleteBit } from "~/models/bit.server";
import { requireUserId } from "~/session.server";
import { Bit } from "~/components/Bit";
import invariant from "tiny-invariant";
import { getBit } from "~/models/bit.server";
import { getUserId } from "~/session.server";
import { PageContainer } from "~/components/PageContainer";

export const meta: MetaFunction<typeof loader> = ({ data }) => ({
  title: `${data.bit.content.split("\n")[0]} | Bits`,
});

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
    <PageContainer>
      <Bit bit={data.bit} />
    </PageContainer>
  );
}
