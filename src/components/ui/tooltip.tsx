import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type {
  ComponentPropsWithoutRef,
  ElementRef,
  HTMLAttributes,
} from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipPortal = TooltipPrimitive.Portal;

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-xs border border-white/12 bg-white/[0.12] px-3 py-2 text-xs text-popover-foreground shadow-lg backdrop-blur-md",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

type TooltipTitleProps = HTMLAttributes<HTMLParagraphElement>;

export const TooltipTitle = ({ className, ...props }: TooltipTitleProps) => (
  <p
    className={cn(
      "text-[11px] font-semibold text-popover-foreground",
      className,
    )}
    {...props}
  />
);

type TooltipDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const TooltipDescription = ({
  className,
  ...props
}: TooltipDescriptionProps) => (
  <p
    className={cn("text-[11px] text-muted-foreground", className)}
    {...props}
  />
);
