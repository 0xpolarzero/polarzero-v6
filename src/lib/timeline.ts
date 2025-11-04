import type {
  TimelineCategory,
  TimelineItem,
  TimelineYear,
} from "@/data/timeline";

const TIMELINE_ITEM_PREFIX = "timeline-item";

export const matchesTimelineFilter = (
  filter: TimelineCategory | "all",
  category: TimelineCategory,
) => {
  if (filter === "all") {
    return category !== "education";
  }

  return filter === category;
};

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getTimelineItemId = (item: TimelineItem) =>
  `${TIMELINE_ITEM_PREFIX}-${slugify(item.title)}-${slugify(item.from)}`;

export const parseTimelineDate = (input: string | null | undefined): Date => {
  if (!input) {
    return new Date(NaN);
  }

  if (/^\d{4}$/.test(input)) {
    return new Date(Number.parseInt(input, 10), 0, 1);
  }

  if (/^\d{4}-\d{2}$/.test(input)) {
    const [year, month] = input
      .split("-")
      .map((part) => Number.parseInt(part, 10));
    return new Date(year, month - 1, 1);
  }

  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date(NaN) : date;
};

export const getTimelineBounds = (timeline: TimelineYear[]) => {
  let earliest = new Date();
  let latest = new Date(0);

  timeline.forEach((group) => {
    group.items.forEach((item) => {
      const start = parseTimelineDate(item.from);
      const end = parseTimelineDate(item.to ?? undefined);

      if (!Number.isNaN(start.getTime()) && start < earliest) {
        earliest = start;
      }

      if (!Number.isNaN(end.getTime()) && end > latest) {
        latest = end;
      }
    });
  });

  const now = new Date();

  if (earliest > now) {
    earliest = now;
  }

  if (latest < now) {
    latest = now;
  }

  return { earliest, latest: now > latest ? now : latest };
};

export const flattenTimelineItems = (
  timeline: TimelineYear[],
  filter: TimelineCategory | "all",
) =>
  timeline
    .flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        year: group.year,
      })),
    )
    .filter((entry) => matchesTimelineFilter(filter, entry.category));

export type FlattenedTimelineItem = ReturnType<
  typeof flattenTimelineItems
>[number];
