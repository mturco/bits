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

  const focus = isFocused ? "bg-teal-600 text-white" : "text-gray-900";

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={`${focus} text-sm cursor-default select-none relative mx-1 rounded py-1 px-2 focus:outline-none`}
    >
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </li>
  );
}
