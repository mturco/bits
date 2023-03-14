import { useMenuSection, useSeparator } from "react-aria";
import type { TreeState } from "react-stately";
import type { Node } from "@react-types/shared";
import { UserMenuItem } from "./UserMenuItem";

interface UserMenuSectionProps<T> {
  section: Node<T>;
  state: TreeState<T>;
}

export function UserMenuSection<T>({
  section,
  state,
}: UserMenuSectionProps<T>) {
  const { itemProps, headingProps, groupProps } = useMenuSection({
    heading: section.rendered,
    "aria-label": section["aria-label"],
  });

  const { separatorProps } = useSeparator({
    elementType: "li",
  });

  return (
    <>
      {section.key !== state.collection.getFirstKey() && (
        <li
          {...separatorProps}
          style={{
            borderTop: "1px solid gray",
            margin: "2px 5px",
          }}
        />
      )}
      <li {...itemProps}>
        {section.rendered && (
          <span
            {...headingProps}
            style={{
              fontStyle: "italic",
              padding: "2px 5px",
            }}
          >
            {section.rendered}
          </span>
        )}
        <ul
          {...groupProps}
          style={{
            padding: 0,
            listStyle: "none",
          }}
        >
          {[...section.childNodes].map((node) => (
            <UserMenuItem key={node.key} item={node} state={state} />
          ))}
        </ul>
      </li>
    </>
  );
}
