import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json({ errors: { title: "Title is required" } }, { status: 400 });
  }

  if (typeof body !== "string" || body.length === 0) {
    return json({ errors: { body: "Body is required" } }, { status: 400 });
  }

  const note = await createNote({ title, body, userId });
  return note ? redirect(`/notes/${note.id}`) : redirect("/notes/");
};

export default function NewNotePage() {
  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label>
          <span>Title: </span>
          <input name="title" />
        </label>
      </div>
      <div>
        <label>
          <span>Body: </span>
          <textarea name="body" rows={8}></textarea>
        </label>
      </div>

      <div>
        <button type="submit">Save</button>
      </div>
    </Form>
  );
}
