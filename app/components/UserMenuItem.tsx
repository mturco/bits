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
    ? "bg-puerto-rico-50 border-puerto-rico-600 bg-puerto-rico-600/10 dark:border-puerto-rico-400"
    : "border-transparent";

  return (
    <li
      {...menuItemProps}
      ref={ref}
      className={`${focus} relative mx-1 cursor-default select-none rounded border-2 py-1 px-2 text-sm focus:outline-none`}
    >
      {item.rendered}
      {isSelected && <span aria-hidden="true">✅</span>}
    </li>
  );
}
