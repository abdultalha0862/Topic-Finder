import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal `Slot` (subset of @radix-ui/react-slot). Merges its own props onto a
 * single child element so components can support an `asChild` prop without an
 * extra dependency. Uses loose typing on purpose — it forwards arbitrary props.
 */
type SlotProps = { children?: React.ReactNode; className?: string } & Record<
  string,
  unknown
>;

export const Slot = React.forwardRef<unknown, SlotProps>(
  ({ children, className, ...slotProps }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<{ className?: string }>;
    const merged = {
      ...slotProps,
      ...child.props,
      className: cn(
        className as string | undefined,
        (child.props as { className?: string }).className,
      ),
      ref,
      // cloneElement's prop typing is stricter than our pass-through use.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    return React.cloneElement(child, merged);
  },
);
Slot.displayName = "Slot";
