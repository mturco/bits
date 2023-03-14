import { useRef } from "react";
import type { AriaMenuProps } from "react-aria";
import { useTreeState } from "react-stately";
import { useMenu } from "react-aria";
import { UserMenuItem } from "./UserMenuItem";
import { UserMenuSection } from "./UserMenuSection";

export function UserMenu<T extends object>(props: AriaMenuProps<T>) {
  let state = useTreeState(props);
  let ref = useRef(null);
  let { menuProps } = useMenu(props, state, ref);

  return (
    <ul
      {...menuProps}
      ref={ref}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        width: 150,
      }}
    >
      {[...state.collection].map((item) =>
        item.type === "section" ? (
          <UserMenuSection key={item.key} section={item} state={state} />
        ) : (
          <UserMenuItem key={item.key} item={item} state={state} />
        )
      )}
    </ul>
  );
}