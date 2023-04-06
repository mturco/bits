import { useSubmit } from "@remix-run/react";
import {
  MenuTrigger,
  Button,
  Popover,
  Menu,
  Item,
  Section,
  Header,
} from "react-aria-components";
import { Icon } from "@mdi/react";
import { mdiAccountCircle } from "@mdi/js";
import type { ItemProps, SectionProps } from "react-aria-components";
import type { User } from "~/models/user.server";

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const submit = useSubmit();

  function handleAction(key: React.Key) {
    switch (key) {
      case "logout": {
        submit(null, { action: "/logout", method: "post" });
        return;
      }
    }
  }

  return (
    <MenuTrigger>
      <Button
        aria-label="User menu"
        className="flex text-teal-600 outline-teal-300 hover:text-teal-700 active:text-teal-800"
      >
        <Icon path={mdiAccountCircle} size={1} />
      </Button>
      <Popover>
        <Menu
          onAction={handleAction}
          className="min-w-[200px] rounded-md bg-white pt-1 pb-1 shadow-lg focus:outline-none dark:bg-ayu-900"
        >
          <UserMenuSection>
            <UserMenuHeader>{user.email}</UserMenuHeader>
            <UserMenuItem id="logout">Logout</UserMenuItem>
          </UserMenuSection>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

function UserMenuItem(props: ItemProps) {
  return (
    <Item
      {...props}
      className={({ isFocused }) =>
        `${
          isFocused
            ? "border-teal-600 bg-teal-50 bg-teal-600/10 dark:border-teal-400"
            : "border-transparent"
        } relative mx-1 cursor-default select-none rounded border-2 py-1 px-2 text-sm focus:outline-none dark:text-white`
      }
    />
  );
}

function UserMenuSection<T extends object>(props: SectionProps<T>) {
  return <Section {...props} className="" />;
}

interface UserMenuHeaderProps {
  children: React.ReactNode;
}

function UserMenuHeader({ children }: UserMenuHeaderProps) {
  return (
    <Header className="mx-1 my-0.5 block select-none px-2 text-sm text-ayu-500 dark:text-ayu-300">
      {children}
    </Header>
  );
}
