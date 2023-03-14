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
          className="border-t border-gray-300 mx-2 mt-1 mb-1"
        />
      )}
      <li {...itemProps}>
        {section.rendered && (
          <span
            {...headingProps}
            className="text-sm text-gray-500 block select-none mx-1 my-0.5 px-2"
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
