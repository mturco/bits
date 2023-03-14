import { useRef } from "react";
import { DismissButton, Overlay, usePopover } from "react-aria";
import type { AriaPopoverProps } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

interface PopoverProps extends Omit<AriaPopoverProps, "popoverRef"> {
  children: React.ReactNode;
  state: OverlayTriggerState;
}

export const Popover: React.FC<PopoverProps> = ({
  children,
  state,
  offset = 8,
  ...props
}: PopoverProps) => {
  let popoverRef = useRef(null);
  let { popoverProps, underlayProps } = usePopover(
    {
      ...props,
      offset,
      popoverRef,
    },
    state
  );

  return (
    <Overlay>
      <div {...underlayProps} />
      <div
        {...popoverProps}
        ref={popoverRef}
        className="z-10 shadow-lg border border-gray-300 bg-white rounded-md"
      >
        <DismissButton onDismiss={state.close} />
        {children}
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
};
