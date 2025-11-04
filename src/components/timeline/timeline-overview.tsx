import { useMemo } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { TimelineItem } from "@/data/timeline";
import { getPeriod } from "@/lib/date";
import { parseTimelineDate } from "@/lib/timeline";
import { cn } from "@/lib/utils";

import { timelineCategoryMeta } from "./timeline-card";

type TimelineOverviewItem = {
  item: TimelineItem;
  id: string;
};

type TimelineOverviewProps = {
  items: TimelineOverviewItem[];
  highlightedItemId?: string | null;
  onItemHover?: (id: string | null) => void;
  onItemSelect?: (id: string) => void;
};

const BAR_MIN_WIDTH_PERCENT = 1.5;
const LANE_HEIGHT = 12;
const LANE_GAP = 6;
const LINE_VERTICAL_OFFSET = 18;
const FIRST_LANE_OFFSET = 10;
const HITBOX_INSET_PX = 2;

const categoryBarClassnames: Record<TimelineItem["category"], string> = {
  work: "bg-pink-500/70 group-hover/timeline-item:bg-pink-500 group-focus-within/timeline-item:bg-pink-500 data-[highlighted=true]:bg-pink-500",
  experiments:
    "bg-amber-500/70 group-hover/timeline-item:bg-amber-500 group-focus-within/timeline-item:bg-amber-500 data-[highlighted=true]:bg-amber-500",
  research:
    "bg-indigo-500/70 group-hover/timeline-item:bg-indigo-500 group-focus-within/timeline-item:bg-indigo-500 data-[highlighted=true]:bg-indigo-500",
  writing:
    "bg-emerald-500/70 group-hover/timeline-item:bg-emerald-500 group-focus-within/timeline-item:bg-emerald-500 data-[highlighted=true]:bg-emerald-500",
  education:
    "bg-violet-500/70 group-hover/timeline-item:bg-violet-500 group-focus-within/timeline-item:bg-violet-500 data-[highlighted=true]:bg-violet-500",
};

const formatRangeLabel = (date: Date, fallbackLabel: string) => {
  if (Number.isNaN(date.getTime())) {
    return fallbackLabel;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const TimelineOverview = ({
  items,
  highlightedItemId,
  onItemHover,
  onItemSelect,
}: TimelineOverviewProps) => {
  const { layout, laneCount, startDate, endDate, baseStart, totalDuration } =
    useMemo(() => {
      const now = new Date();

      const validItems = items
        .map((entry) => {
          const startDate = parseTimelineDate(entry.item.from);
          if (Number.isNaN(startDate.getTime())) {
            return null;
          }

          const rawEndDate = entry.item.to
            ? parseTimelineDate(entry.item.to)
            : now;
          const endDate = Number.isNaN(rawEndDate.getTime())
            ? startDate
            : rawEndDate;

          return {
            ...entry,
            startDate,
            endDate,
          };
        })
        .filter(
          (
            entry,
          ): entry is TimelineOverviewItem & {
            startDate: Date;
            endDate: Date;
          } => entry !== null,
        )
        .sort((a, b) => {
          const startDiff = a.startDate.getTime() - b.startDate.getTime();
          if (startDiff !== 0) return startDiff;
          return a.endDate.getTime() - b.endDate.getTime();
        });

      if (validItems.length === 0) {
        const fallbackTime = now.getTime();
        return {
          layout: [],
          laneCount: 0,
          startDate: now,
          endDate: now,
          baseStart: fallbackTime,
          totalDuration: 1,
        };
      }

      const earliestStart = validItems.reduce(
        (earliest, entry) =>
          entry.startDate.getTime() < earliest.getTime()
            ? entry.startDate
            : earliest,
        validItems[0].startDate,
      );
      const latestEnd = validItems.reduce(
        (latest, entry) =>
          entry.endDate.getTime() > latest.getTime() ? entry.endDate : latest,
        validItems[0].endDate,
      );

      const baseStart = earliestStart.getTime();
      const baseEnd = Math.max(latestEnd.getTime(), now.getTime());
      const totalDuration = Math.max(1, baseEnd - baseStart);

      const minDuration = (BAR_MIN_WIDTH_PERCENT / 100) * totalDuration;

      const lanes: number[] = [];

      const layout = validItems.map((entry) => {
        const entryStart = entry.startDate.getTime();
        const entryEnd = Math.max(entry.endDate.getTime(), entryStart);
        const displayDuration = Math.max(entryEnd - entryStart, minDuration);
        const displayEnd = entryStart + displayDuration;

        let laneIndex = lanes.findIndex((laneEnd) => entryStart > laneEnd);

        if (laneIndex === -1) {
          laneIndex = lanes.length;
          lanes.push(displayEnd);
        } else {
          lanes[laneIndex] = Math.max(lanes[laneIndex], displayEnd);
        }

        const rawLeft = ((entryStart - baseStart) / totalDuration) * 100;
        const rawWidth = (displayDuration / totalDuration) * 100;

        const adjustedLeft = Math.min(Math.max(rawLeft, 0), 100);
        let adjustedWidth = rawWidth;

        if (adjustedWidth <= 0) {
          adjustedWidth = Math.min(
            BAR_MIN_WIDTH_PERCENT,
            Math.max(100 - adjustedLeft, 0),
          );
        } else if (adjustedWidth < BAR_MIN_WIDTH_PERCENT) {
          adjustedWidth = Math.min(
            BAR_MIN_WIDTH_PERCENT,
            Math.max(100 - adjustedLeft, adjustedWidth),
          );
        }

        if (adjustedLeft + adjustedWidth > 100) {
          adjustedWidth = Math.max(0, 100 - adjustedLeft);
        }

        return {
          entry,
          laneIndex,
          left: adjustedLeft,
          width: adjustedWidth,
        };
      });

      return {
        layout,
        laneCount: lanes.length,
        startDate: new Date(baseStart),
        endDate: new Date(baseEnd),
        baseStart,
        totalDuration,
      };
    }, [items]);

  const lanesHeight =
    LINE_VERTICAL_OFFSET +
    (laneCount > 0
      ? FIRST_LANE_OFFSET +
        laneCount * LANE_HEIGHT +
        Math.max(0, laneCount - 1) * LANE_GAP
      : 0);

  const yearTicks = useMemo(() => {
    if (totalDuration <= 0) {
      return [] as Array<{
        year: number;
        position: number;
        alignment: "start" | "center" | "end";
      }>;
    }

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    const ticks: Array<{
      year: number;
      position: number;
      alignment: "start" | "center" | "end";
    }> = [];

    for (let year = startYear; year <= endYear; year += 1) {
      const tickDate = new Date(year, 0, 1);
      const position = ((tickDate.getTime() - baseStart) / totalDuration) * 100;

      if (position < -1 || position > 101) {
        continue;
      }

      const clampedPosition = Math.min(Math.max(position, 0), 100);
      const alignment =
        clampedPosition < 4 ? "start" : clampedPosition > 96 ? "end" : "center";
      ticks.push({ year, position: clampedPosition, alignment });
    }

    return ticks;
  }, [baseStart, endDate, startDate, totalDuration]);

  if (!layout.length) return null;
  return (
    <TooltipProvider delayDuration={0}>
      <div
        className="pointer-events-none fixed inset-x-0 z-40 hidden justify-center xl:flex"
        style={{ bottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="pointer-events-auto relative w-[90vw] max-w-[72rem]">
          <div className="pointer-events-none absolute inset-0 rounded-xs border border-white/12 bg-white/[0.05] backdrop-blur-md" />
          <div className="relative rounded-xs px-6 py-2">
            <div
              className="pointer-events-auto relative"
              style={{ height: lanesHeight }}
              aria-hidden={items.length === 0}
            >
              <div
                className="absolute left-0 right-0 h-px bg-white/10"
                style={{ top: LINE_VERTICAL_OFFSET }}
              />
              {yearTicks.map((tick) => (
                <span
                  key={tick.year}
                  className={cn(
                    "absolute whitespace-nowrap text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground",
                    tick.alignment === "center"
                      ? "-translate-x-1/2"
                      : tick.alignment === "end"
                        ? "-translate-x-full"
                        : "translate-x-0",
                  )}
                  style={{
                    left: `${tick.position}%`,
                    top: LINE_VERTICAL_OFFSET - 16,
                  }}
                >
                  {tick.year}
                </span>
              ))}
              {layout.map(({ entry, laneIndex, left, width }) => {
                const barTop =
                  LINE_VERTICAL_OFFSET +
                  FIRST_LANE_OFFSET +
                  laneIndex * (LANE_HEIGHT + LANE_GAP);
                const isHighlighted = highlightedItemId === entry.id;

                return (
                  <div
                    key={entry.id}
                    className="group/timeline-item absolute"
                    data-highlighted={isHighlighted ? "true" : undefined}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      top: barTop,
                    }}
                  >
                    <div
                      aria-hidden
                      data-highlighted={isHighlighted ? "true" : undefined}
                      className={cn(
                        "pointer-events-none absolute inset-0 rounded-sm border border-white/20 opacity-75 transition duration-150 ease-out data-[highlighted=true]:opacity-100 data-[highlighted=true]:shadow-[0_12px_36px_rgba(7,7,9,0.5)]",
                        categoryBarClassnames[entry.item.category],
                      )}
                    />
                    <Tooltip disableHoverableContent>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => onItemSelect?.(entry.id)}
                          onMouseEnter={() => onItemHover?.(entry.id)}
                          onMouseLeave={() => onItemHover?.(null)}
                          onFocus={() => onItemHover?.(entry.id)}
                          onBlur={() => onItemHover?.(null)}
                          data-highlighted={isHighlighted ? "true" : undefined}
                          className="relative z-10 block h-[12px] w-full cursor-pointer rounded-sm bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutralHighlight focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(7,7,9,0.75)]"
                          style={{
                            marginLeft: `${HITBOX_INSET_PX}px`,
                            marginRight: `${HITBOX_INSET_PX}px`,
                          }}
                        >
                          <span className="sr-only">{entry.item.title}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="pointer-events-none max-w-xs"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-[11px] font-semibold text-popover-foreground">
                            {entry.item.title}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
                            {entry.item.from} – {entry.item.to ?? "today"} •{" "}
                            {getPeriod(entry.item.from, entry.item.to ?? null)}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-neutralHighlight">
                            {timelineCategoryMeta[entry.item.category].label}
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-mono uppercase tracking-[0.24em] text-muted-foreground">
              <span>{formatRangeLabel(startDate, "start")}</span>
              <span>{formatRangeLabel(endDate, "today")}</span>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TimelineOverview;
