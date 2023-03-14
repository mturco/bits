import { useRef } from "react";
import { useMenuItem } from "react-aria";
import type { TreeState } from "react-stately";
import type { Node } from "@react-types/shared";

interface UserMenuItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
}

export function UserMenuItem<T>({ item, state }: UserMenuItemProps<T>) {
  const ref = useRef<HTMLLIElement>(null);
  const { menuItemProps, isFocused, isSelected, isDisabled } = useMenuItem(
    { key: item.key },
    state,
    ref
  );

  return (
    <li
      {...menuItemProps}
      ref={ref}
      style={{
        background: isFocused ? "gray" : "transparent",
        color: isDisabled ? "gray" : isFocused ? "white" : "black",
        padding: "2px 5px",
        outline: "none",
        cursor: "default",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </li>
  );
}
