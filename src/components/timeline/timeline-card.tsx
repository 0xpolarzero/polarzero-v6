import {
  BookIcon,
  GithubLogoIcon,
  GlobeIcon,
  NewspaperIcon,
  XLogoIcon,
} from "@phosphor-icons/react";
import type { JSX } from "react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  TimelineCategory,
  TimelineItem,
  TimelineLinkKey,
} from "@/data/timeline";
import { getPeriod } from "@/lib/date";
import { cn } from "@/lib/utils";

export const timelineCategoryMeta: Record<
  TimelineCategory,
  { label: string; variant: BadgeProps["variant"]; className?: string }
> = {
  work: {
    label: "work",
    variant: "secondary",
    className:
      "bg-pink-500/10 text-pink-500 hover:bg-pink-500/10 hover:text-pink-500",
  },
  experiments: {
    label: "experiments",
    variant: "secondary",
    className:
      "bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 hover:text-amber-500",
  },
  research: {
    label: "research",
    variant: "secondary",
    className:
      "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-500",
  },
  writing: {
    label: "writing",
    variant: "secondary",
    className:
      "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500",
  },
  education: {
    label: "education",
    variant: "secondary",
    className:
      "bg-violet-500/10 text-violet-500 hover:bg-violet-500/10 hover:text-violet-500",
  },
};

const LINK_ICONS: Record<TimelineLinkKey, JSX.Element> = {
  website: <GlobeIcon size={12} weight="light" />,
  github: <GithubLogoIcon size={12} weight="light" />,
  twitter: <XLogoIcon size={12} weight="light" />,
  docs: <BookIcon size={12} weight="light" />,
  article: <NewspaperIcon size={12} weight="light" />,
};

const buildLinkButtons = (
  links: TimelineItem["links"],
): Array<{
  key: TimelineLinkKey;
  href: string;
  icon: JSX.Element;
}> => {
  if (!links) return [];

  return (Object.entries(links) as Array<[TimelineLinkKey, string]>)
    .filter(([, href]) => Boolean(href))
    .map(([key, href]) => ({ key, href, icon: LINK_ICONS[key] }));
};

type TimelineCardProps = {
  item: TimelineItem;
  itemId: string;
  highlighted?: boolean;
  onHover?: (itemId: string | null) => void;
};

export const TimelineCard = ({
  item,
  itemId,
  highlighted = false,
  onHover,
}: TimelineCardProps) => {
  const categoryMeta = timelineCategoryMeta[item.category];
  const endDate = item.to ?? null;
  const linkButtons = buildLinkButtons(item.links);

  const handlePointerEnter = () => {
    onHover?.(itemId);
  };

  const handlePointerLeave = () => {
    onHover?.(null);
  };

  const handleFocus = () => {
    onHover?.(itemId);
  };

  const handleBlur = () => {
    onHover?.(null);
  };

  return (
    <article
      id={itemId}
      data-highlighted={highlighted ? "true" : undefined}
      className={cn(
        "relative rounded-xs border border-white/12 bg-white/[0.02] px-6 py-5 transition duration-150 ease-out hover:border-mist/40 hover:bg-white/[0.05] data-[highlighted=true]:border-mist/50 data-[highlighted=true]:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(7,7,9,0.75)] md:px-8 md:py-6",
      )}
      onMouseEnter={handlePointerEnter}
      onMouseLeave={handlePointerLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[18px] leading-snug text-foreground">
          {item.title}
        </h3>
        <span className="text-[11px] font-mono lowercase tracking-[0.24em] text-muted-foreground">
          {item.from} - {endDate === null ? "today" : endDate}
          <span className="ml-2 text-[10px] tracking-[0.24em]">
            ({getPeriod(item.from, endDate)})
          </span>
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {item.caption}
      </p>

      <div className="mt-4">{item.description}</div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {linkButtons.length ? (
          <div className="flex flex-wrap gap-2">
            {linkButtons.map(({ key, href, icon }) => (
              <Button key={key} variant="ghost" size="sm" asChild>
                <a href={href} target="_blank" rel="noreferrer">
                  {icon}
                </a>
              </Button>
            ))}
          </div>
        ) : (
          <span />
        )}

        <Badge
          variant={categoryMeta.variant}
          className={cn(
            "ml-auto whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.28em]",
            categoryMeta.className,
          )}
        >
          {categoryMeta.label}
        </Badge>
      </div>
    </article>
  );
};
