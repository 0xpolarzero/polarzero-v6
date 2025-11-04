import { FunnelIcon } from "@phosphor-icons/react";
import { forwardRef } from "react";

import { Button } from "@/components/ui/button";
import type { TimelineCategory } from "@/data/timeline";
import { cn } from "@/lib/utils";
import { timelineCategoryMeta } from "./timeline-card";

type TimelineFiltersProps = {
  value: TimelineCategory | "all";
  onChange: (value: TimelineCategory | "all") => void;
  className?: string;
};

export const TimelineFilters = forwardRef<HTMLDivElement, TimelineFiltersProps>(
  ({ value, onChange, className }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      <FunnelIcon size={14} weight="light" className="mr-4" />
      {[
        {
          label: "all",
          variant: "secondary",
          className: "bg-foreground/10 text-foreground hover:bg-foreground/20",
        },
        ...Object.values(timelineCategoryMeta),
      ].map((option) => (
        <Button
          key={option.label}
          variant="secondary"
          size="sm"
          onClick={() => onChange(option.label as TimelineCategory | "all")}
          className={cn(
            option.className,
            "font-mono text-[10px] uppercase tracking-[0.28em] font-semibold h-[21px] transition-all shadow-none",
            option.label !== value &&
              "bg-transparent opacity-75 hover:opacity-100",
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  ),
);

TimelineFilters.displayName = "TimelineFilters";
