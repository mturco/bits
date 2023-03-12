import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import styles from "./BitForm.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface BitFormProps {
  action?: string;
  clearOnSubmit?: boolean;
  method: "post" | "put";
  initialContent?: string;
  onSubmit?(): void;
}

export const BitForm: React.FC<BitFormProps> = ({
  action,
  clearOnSubmit = false,
  method,
  initialContent = "",
}) => {
  const actionData = useActionData();
  const [dirty, setDirty] = useState(false);
  const [content, setContent] = useState(initialContent);

  const form = useRef<HTMLFormElement>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const submit = useSubmit();

  useEffect(() => {
    if (textarea.current) {
      textarea.current.style.height = "1px";
      textarea.current.style.height = `${textarea.current.scrollHeight}px`;
    }
  }, [content]);

  useEffect(() => {
    if (initialContent) {
      textarea.current?.setSelectionRange(
        initialContent.length,
        initialContent.length
      );
    }
  }, [initialContent]);

  function maybeClear() {
    if (clearOnSubmit) {
      setContent("");
    }
  }

  function handleChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(evt.target.value);
    setDirty(evt.target.value.length > 0);
  }

  function handleKeyDown(evt: React.KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = evt.target as HTMLTextAreaElement;
    if (evt.metaKey && evt.key === "Enter" && textarea.value.trim().length) {
      submit(form.current, { method });
      maybeClear();
    }
  }

  return (
    <Form
      action={action}
      method={method}
      ref={form}
      className="bit-form"
      onSubmit={maybeClear}
    >
      <textarea
        autoFocus
        className={dirty ? "dirty" : ""}
        name="content"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a bit (⌘ + ⏎ to save)"
        rows={1}
        ref={textarea}
        value={content}
      ></textarea>
      {actionData?.errors?.content && (
        <p className="form-error">{actionData.errors.content}</p>
      )}
      <button type="submit">Save</button>
    </Form>
  );
};
