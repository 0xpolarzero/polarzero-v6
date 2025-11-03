import {
  TIMELINE,
  type TimelineCategory,
  type TimelineYear,
} from "@/data/timeline";

import { TimelineCard } from "./timeline-card";

type TimelineProps = {
  filter: TimelineCategory | "all";
};

const matchesFilter = (
  filter: TimelineCategory | "all",
  category: TimelineCategory,
) => {
  if (filter === "all") return true;
  return filter === category;
};

const Timeline = ({ filter }: TimelineProps) => {
  const filteredTimeline = TIMELINE.map((group: TimelineYear) => ({
    ...group,
    items: group.items.filter((item) => matchesFilter(filter, item.category)),
  })).filter((group) => group.items.length > 0);

  return (
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
              {group.items.map((item) => (
                <TimelineCard key={`${group.year}-${item.title}`} item={item} />
              ))}
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
  );
};

export default Timeline;
