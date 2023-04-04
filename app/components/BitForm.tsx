import { useEffect, useRef, useState } from "react";
import { Form, useActionData, useSubmit } from "@remix-run/react";
import { Button } from "./Button";

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
      className="flex flex-col"
      onSubmit={maybeClear}
    >
      <textarea
        autoFocus
        className="resize-none rounded-lg bg-transparent py-4 px-5 text-sm outline-none ring-2 ring-inset ring-ayu-300 focus:bg-puerto-rico-50 focus:ring-puerto-rico-600 focus:placeholder:text-puerto-rico-500 dark:ring-ayu-700 dark:focus:bg-puerto-rico-600/10 dark:focus:ring-puerto-rico-400"
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
      <Button type="submit" className="ml-auto mt-2">
        Save
      </Button>
    </Form>
  );
};
