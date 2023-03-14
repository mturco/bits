import { useSearchFieldState } from "react-stately";
import type { AriaSearchFieldProps } from "react-aria";
import { Overlay } from "react-aria";
import { VisuallyHidden } from "react-aria";
import { useSearchField } from "react-aria";
import { useEffect, useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { Bit } from "./Bit";

interface SearchProps extends AriaSearchFieldProps {}

export const Search: React.FC<SearchProps> = (props) => {
  const [query, setQuery] = useState("");
  const state = useSearchFieldState(props);
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps } = useSearchField(props, state, ref);
  const fetcher = useFetcher<BitType[]>();

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setQuery(evt.target.value);
    fetcher.load(`/bit/search?query=${evt.target.value}`);
  }

  return (
    <>
      <div>
        <VisuallyHidden>
          <label {...labelProps}>Search bits</label>
        </VisuallyHidden>
        <input
          {...inputProps}
          className="w-full h-10 bg-gray-200 rounded-full px-5 focus:outline-teal-600 outline-2 focus:bg-teal-50"
          onChange={handleChange}
          value={query}
          ref={ref}
        />
      </div>
      {query.length > 0 && fetcher.type === "done" && (
        <Overlay>
          <div className="fixed inset-0 top-16 z-10 bg-white overflow-auto px-4 py-16">
            <div
              className="mx-auto flex flex-col gap-8"
              style={{ maxWidth: "45rem" }}
            >
              {fetcher.data.length > 0 ? (
                fetcher.data.map((bit) => <Bit bit={bit} key={bit.id} />)
              ) : (
                <p className="text-center">No matching bits.</p>
              )}
            </div>
          </div>
        </Overlay>
      )}
    </>
  );
};
