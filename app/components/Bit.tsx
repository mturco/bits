import { useSubmit } from "@remix-run/react";
import { parseISO, format, formatDistanceToNowStrict } from "date-fns";
import Markdown from "marked-react";
import type { Bit as BitType } from "~/models/bit.server";
import { Link } from "./Link";

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
    <article key={bit.id}>
      <div className="mb-0.5 flex items-center gap-4">
        <Link
          className="mr-auto text-sm text-gray-500 hover:underline"
          to={`/bit/${bit.id}`}
        >
          <time
            dateTime={bit.created_at}
            title={format(parseISO(bit.created_at), "PPpp")}
          >
            {formatDistanceToNowStrict(parseISO(bit.created_at), {
              addSuffix: true,
            })}
          </time>
        </Link>

        <Link
          className="text-sm font-medium hover:underline"
          to={`/bit/${bit.id}/edit`}
        >
          Edit
        </Link>

        <button
          className="text-sm font-medium hover:underline"
          type="button"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
      <div className="md-content rounded-lg border border-gray-200 px-5">
        <Markdown breaks gfm value={bit.content} />
      </div>
    </article>
  );
};
