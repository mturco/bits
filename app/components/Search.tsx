import { useSearchFieldState } from "react-stately";
import type { AriaSearchFieldProps } from "react-aria";
import { Overlay } from "react-aria";
import { VisuallyHidden } from "react-aria";
import { useSearchField } from "react-aria";
import { useRef, useState } from "react";
import { useFetcher } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { Bit } from "./Bit";
import Icon from "@mdi/react";
import { mdiMagnify } from "@mdi/js";

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
      <div className="px-4 relative">
        <VisuallyHidden>
          <label {...labelProps}>Search bits</label>
        </VisuallyHidden>
        <input
          {...inputProps}
          className="w-full h-10 bg-gray-200 rounded-full pl-11 pr-5 focus:outline-teal-600 outline-2 focus:bg-teal-50"
          onChange={handleChange}
          value={query}
          ref={ref}
        />
        <Icon
          className="absolute top-1/2 -translate-y-1/2 left-7 text-teal-600"
          path={mdiMagnify}
          size={1}
        />
      </div>
      {query.length > 0 ? (
        <Overlay>
          <div className="fixed inset-0 top-16 z-10 bg-white overflow-auto px-4 py-16">
            <div
              className="mx-auto flex flex-col gap-8"
              style={{ maxWidth: "var(--page-width)" }}
            >
              {!fetcher.data ? (
                <p className="text-center">Searching...</p>
              ) : !fetcher.data.length ? (
                <p className="text-center">No matching bits.</p>
              ) : (
                fetcher.data.map((bit) => <Bit bit={bit} key={bit.id} />)
              )}
            </div>
          </div>
        </Overlay>
      ) : null}
    </>
  );
};
