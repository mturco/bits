import { useSearchFieldState } from "react-stately";
import type { AriaSearchFieldProps } from "react-aria";
import { Overlay } from "react-aria";
import { VisuallyHidden } from "react-aria";
import { useSearchField } from "react-aria";
import { useRef } from "react";
import { useFetcher } from "@remix-run/react";
import type { Bit as BitType } from "~/models/bit.server";
import { Bit } from "./Bit";
import Icon from "@mdi/react";
import { mdiClose, mdiMagnify } from "@mdi/js";
import type { LinksFunction } from "@remix-run/node";
import styles from "./Search.css";
import { Button } from "./Button";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

interface SearchProps extends AriaSearchFieldProps {}

export const Search: React.FC<SearchProps> = (props) => {
  const state = useSearchFieldState(props);
  const ref = useRef<HTMLInputElement>(null);
  const { labelProps, inputProps, clearButtonProps } = useSearchField(
    props,
    state,
    ref
  );
  const fetcher = useFetcher<BitType[]>();

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    state.setValue(evt.target.value);
    fetcher.load(`/bit/search?query=${evt.target.value}`);
  }

  return (
    <>
      <div className="relative">
        <VisuallyHidden>
          <label {...labelProps}>Search bits</label>
        </VisuallyHidden>
        <input
          {...inputProps}
          className="search-input w-full h-10 bg-gray-200 rounded-full pl-12 pr-5 focus:outline-teal-600 outline-2 focus:bg-teal-50 appearance-none"
          onChange={handleChange}
          value={state.value}
          ref={ref}
        />
        <Icon
          aria-hidden="true"
          className="absolute top-1/2 -translate-y-1/2 left-4 text-teal-600 pointer-events-none"
          path={mdiMagnify}
          size={1}
        />
        {state.value && (
          <Button
            aria-label="Clear search"
            noStyling
            className="absolute top-1/2 -translate-y-1/2 text-gray-500 right-4"
            {...clearButtonProps}
          >
            <Icon path={mdiClose} size={1} />
          </Button>
        )}
      </div>
      {state.value.length > 0 ? (
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
