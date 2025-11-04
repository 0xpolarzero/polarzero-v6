import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  TIMELINE,
  type TimelineCategory,
  type TimelineYear,
} from "@/data/timeline";
import { getTimelineItemId, matchesTimelineFilter } from "@/lib/timeline";

import { TimelineCard } from "./timeline-card";
import TimelineOverview from "./timeline-overview";

type TimelineProps = {
  filter: TimelineCategory | "all";
};

const NAV_HEADER_OFFSET = 72;
const PROGRAMMATIC_SCROLL_RESET_MS = 600;

const Timeline = ({ filter }: TimelineProps) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const [pinnedItemId, setPinnedItemId] = useState<string | null>(null);
  const programmaticScrollRef = useRef(false);
  const scrollResetTimeoutRef = useRef<number | null>(null);

  const filteredTimeline = useMemo(
    () =>
      TIMELINE.map((group: TimelineYear) => ({
        ...group,
        items: group.items.filter((item) =>
          matchesTimelineFilter(filter, item.category),
        ),
      })).filter((group) => group.items.length > 0),
    [filter],
  );

  const overviewItems = useMemo(
    () =>
      filteredTimeline.flatMap((group) =>
        group.items
          .filter((item) =>
            filter === "education" ? true : item.category !== "education",
          )
          .map((item) => ({
            item,
            id: getTimelineItemId(item),
          })),
      ),
    [filteredTimeline, filter],
  );

  const highlightedItemId = hoveredItemId ?? pinnedItemId ?? null;

  const scrollToTimelineItem = useCallback((itemId: string) => {
    if (typeof window === "undefined") return;

    const element = document.getElementById(itemId);
    if (!element) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rect = element.getBoundingClientRect();
    const targetTop = Math.max(
      rect.top + window.scrollY - NAV_HEADER_OFFSET,
      0,
    );

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  const handleItemHover = useCallback(
    (itemId: string | null) => {
      setHoveredItemId(itemId);

      if (itemId && pinnedItemId && pinnedItemId !== itemId) {
        setPinnedItemId(null);
      }
    },
    [pinnedItemId],
  );

  const handleItemSelect = useCallback(
    (itemId: string) => {
      setPinnedItemId(itemId);
      programmaticScrollRef.current = true;
      scrollToTimelineItem(itemId);

      if (scrollResetTimeoutRef.current !== null) {
        window.clearTimeout(scrollResetTimeoutRef.current);
      }

      scrollResetTimeoutRef.current = window.setTimeout(() => {
        programmaticScrollRef.current = false;
        scrollResetTimeoutRef.current = null;
      }, PROGRAMMATIC_SCROLL_RESET_MS);
    },
    [scrollToTimelineItem],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (programmaticScrollRef.current) return;
      setPinnedItemId((current) => (current ? null : current));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(
    () => () => {
      if (scrollResetTimeoutRef.current !== null) {
        window.clearTimeout(scrollResetTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    setHoveredItemId(null);
    setPinnedItemId(null);
  }, []);

  return (
    <>
      <div className="relative">
        <div className="hidden h-full w-px bg-white/12 md:block" aria-hidden />
        <div className="space-y-10 md:space-y-12">
          {filteredTimeline.map((group: TimelineYear) => (
            <div key={group.year} className="relative flex flex-col gap-2">
              <span className="w-px bg-white/10 md:hidden" aria-hidden />
              <div className="mb-3 text-[12px] font-mono uppercase tracking-[0.32em] text-neutralHighlight/80 md:mb-0 md:pr-6 md:text-right">
                {group.year}
              </div>
              <div className="space-y-6">
                {group.items.map((item) => {
                  const itemId = getTimelineItemId(item);
                  return (
                    <TimelineCard
                      key={`${group.year}-${item.title}`}
                      item={item}
                      itemId={itemId}
                      highlighted={highlightedItemId === itemId}
                      onHover={handleItemHover}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          {filteredTimeline.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No entries found for this filter.
            </div>
          ) : null}
        </div>
      </div>
      <TimelineOverview
        items={overviewItems}
        highlightedItemId={highlightedItemId}
        onItemHover={handleItemHover}
        onItemSelect={handleItemSelect}
      />
    </>
  );
};

export default Timeline;
