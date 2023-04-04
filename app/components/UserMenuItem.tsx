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

  const focus = isFocused
    ? "bg-teal-50 border-teal-600 bg-teal-600/10 dark:border-teal-400"
    : "border-transparent";

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={`${focus} relative mx-1 cursor-default select-none rounded border-2 py-1 px-2 text-sm focus:outline-none dark:text-white`}
    >
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </li>
  );
}
