import type { LinksFunction } from "@remix-run/node";
import { Link, useSubmit } from "@remix-run/react";
import { parseISO, format, formatDistanceToNowStrict } from "date-fns";
import Markdown from "marked-react";
import type { Bit as BitType } from "~/models/bit.server";
import styles from "./Bit.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface BitProps {
  bit: BitType;
}

export const Bit: React.FC<BitProps> = ({ bit }) => {
  const submit = useSubmit();

  function handleDelete() {
    if (confirm("Are you sure you want to delete this?")) {
      const formData = new FormData();
      formData.set("id", bit.id);
      submit(formData, { method: "delete" });
    }
  }

  return (
    <article className="bit-container" key={bit.id}>
      <div className="bit-actions">
        <time
          className="bit-created-at"
          dateTime={bit.created_at}
          title={format(parseISO(bit.created_at), "PPpp")}
        >
          {formatDistanceToNowStrict(parseISO(bit.created_at), {
            addSuffix: true,
          })}
        </time>

        <Link className="button" to={`/bit/${bit.id}`}>
          link
        </Link>

        <button type="button" onClick={handleDelete}>
          delete
        </button>
      </div>
      <div className="bit-content">
        <Markdown>{bit.content}</Markdown>
      </div>
    </article>
  );
};
