import { useRef } from "react";
import { useMenuTrigger } from "react-aria";
import type { AriaMenuProps } from "react-aria";
import type { MenuTriggerProps } from "react-stately";
import { useMenuTriggerState } from "react-stately";
import { Icon } from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import { Button } from "./Button";
import { Popover } from "./Popover";
import { UserMenu } from "./UserMenu";

interface UserMenuButtonProps<T> extends AriaMenuProps<T>, MenuTriggerProps {}

export function UserMenuButton<T extends object>(
  props: UserMenuButtonProps<T>
) {
  const state = useMenuTriggerState(props);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { menuTriggerProps, menuProps } = useMenuTrigger<T>(
    {},
    state,
    buttonRef
  );

  return (
    <>
      <Button
        {...menuTriggerProps}
        className="user-menu-button"
        ref={buttonRef}
      >
        <Icon path={mdiAccountCircle} size={1} />
      </Button>
      {state.isOpen && (
        <Popover state={state} triggerRef={buttonRef} placement="bottom end">
          <UserMenu {...props} {...menuProps} />
        </Popover>
      )}
    </>
  );
}
