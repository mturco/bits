import {
  Form,
  useActionData,
  useSubmit,
  useLoaderData,
} from "@remix-run/react";
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
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useMemo } from "react";
import { useRef } from "react";
import { createBit } from "~/models/bit.server";
import { getUserId } from "~/session.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
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
  const formData = await request.formData();
  switch (request.method) {
    case "POST": {
      const userId = await getUserId(request);
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
      const id = formData.get("id");
      if (id) {
        await deleteBit(id as BitType["id"]);
      }
      return null;
    }
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>() as LoaderData;
  const actionData = useActionData();
  const submit = useSubmit();
  const form = useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = useState(false);

  const bits = useMemo(
    () =>
      data.bits?.sort((a, b) =>
        compareDesc(parseISO(a.created_at), parseISO(b.created_at))
      ),
    [data]
  );

  function handleChange(evt: ChangeEvent<HTMLTextAreaElement>) {
    setDirty(evt.target.value.length > 0);
  }

  function handleKeyDown(evt: KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = evt.target as HTMLTextAreaElement;
    if (evt.metaKey && evt.key === "Enter" && textarea.value.trim().length) {
      submit(form.current, { method: "post" });
      form.current?.reset();
      evt.preventDefault();
    }
  }

  return (
    <main className="index-page">
      <Form method="post" ref={form} className="bit-form">
        <textarea
          autoFocus
          className={dirty ? "dirty" : ""}
          name="content"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a bit (⌘ + ⏎ to save)"
        ></textarea>
        {actionData?.errors?.content && (
          <p className="error">{actionData.errors.content}</p>
        )}
      </Form>

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
