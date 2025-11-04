import { CheckIcon } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Changelog } from "@/components/changelog";
import { NavigationIsland } from "@/components/navigation-island";
import Timeline from "@/components/timeline/timeline";
import { TimelineFilters } from "@/components/timeline/timeline-filters";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/data/socials";
import type { TimelineCategory } from "@/data/timeline";
import { cn } from "@/lib/utils";

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<
    TimelineCategory | "all"
  >("all");
  const filtersWrapperRef = useRef<HTMLDivElement | null>(null);
  const filtersContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaQueryRef = useRef<MediaQueryList | null>(null);
  const scheduledFilterUpdateRef = useRef<number | null>(null);
  const [filtersStuck, setFiltersStuck] = useState(false);
  const [filtersTranslate, setFiltersTranslate] = useState(0);

  const handleCopy = async (value: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopiedValue(value);
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
    } catch {
      setCopiedValue(value);
    }
  };

  useEffect(() => {
    if (!copiedValue) {
      return;
    }

    const timer = window.setTimeout(() => setCopiedValue(null), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedValue]);

  const updateFilterPositions = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const wrapper = filtersWrapperRef.current;
    const container = filtersContainerRef.current;
    const mediaQuery = mediaQueryRef.current;

    if (!mediaQuery?.matches || !wrapper || !container) {
      setFiltersStuck(false);
      setFiltersTranslate(0);
      return;
    }

    const computedTop = parseFloat(window.getComputedStyle(wrapper).top) || 0;
    const rect = wrapper.getBoundingClientRect();
    const isStuck = rect.top <= computedTop + 0.5;

    setFiltersStuck(isStuck);

    if (isStuck) {
      const parentWidth = wrapper.offsetWidth;
      const contentWidth = container.offsetWidth;
      const offset = Math.max((parentWidth - contentWidth) / 2, 0);
      setFiltersTranslate(offset);
    } else {
      setFiltersTranslate(0);
    }
  }, []);

  const scrollToActivitySection = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    const section = document.getElementById("activity");

    if (!section) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const wrapper = filtersWrapperRef.current;
    const computedTop =
      wrapper && typeof window.getComputedStyle === "function"
        ? parseFloat(window.getComputedStyle(wrapper).top) || 0
        : 0;

    const docStyleTop =
      typeof window.getComputedStyle === "function"
        ? window
            .getComputedStyle(document.documentElement)
            .getPropertyValue("--nav-island-offset")
        : "";
    const navOffset = parseFloat(docStyleTop) || computedTop || 100;

    const targetTop = Math.max(section.offsetTop - navOffset, 0);

    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    mediaQueryRef.current = mediaQuery;

    const handleScroll = () => updateFilterPositions();
    const handleResize = () => updateFilterPositions();
    const handleMediaChange = () => updateFilterPositions();

    updateFilterPositions();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleMediaChange);
      }

      if (scheduledFilterUpdateRef.current !== null) {
        window.cancelAnimationFrame(scheduledFilterUpdateRef.current);
        scheduledFilterUpdateRef.current = null;
      }

      mediaQueryRef.current = null;
    };
  }, [updateFilterPositions]);

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="relative isolate">
      <NavigationIsland
        mobileNavOpen={mobileNavOpen}
        onMobileNavChange={setMobileNavOpen}
        onNavigate={closeMobileNav}
      />

      <main className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 pb-24 md:px-16 xl:px-[10rem]">
        <section id="profile" className="space-y-4 pt-24 md:space-y-6">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
            polarzero
          </p>
          <h1 className="text-[28px] leading-[1.22] text-foreground md:text-[30px]">
            software engineer
          </h1>
          <p className="max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            I build and contribute to impactful consumer products and developer
            tooling, preferably open-source public goods, with a strong focus on
            UX/DevX, API-first design principles, accessibility and local-first
            apps.
          </p>
          <div className="flex flex-wrap gap-3 text-muted-foreground">
            {SOCIALS.map((social) => {
              const Icon = social.icon;
              const copyValue = "copy" in social ? social.copy : null;
              const isCopy = Boolean(copyValue);
              const isCopied = copiedValue === copyValue;

              if (isCopy && copyValue) {
                return (
                  <Button
                    key={social.label}
                    aria-label={`Copy ${copyValue}`}
                    onClick={() => handleCopy(copyValue)}
                    variant="outline"
                    size="sm"
                  >
                    {isCopied ? (
                      <CheckIcon size={14} weight="light" />
                    ) : (
                      <Icon size={14} weight="light" />
                    )}
                    {isCopied ? (
                      <span className="inline-flex items-center gap-1 lowercase text-muted-foreground">
                        copied
                      </span>
                    ) : (
                      copyValue
                    )}
                  </Button>
                );
              }

              return (
                <Button key={social.label} variant="outline" size="sm" asChild>
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={14} weight="light" />
                    {social.label}
                  </a>
                </Button>
              );
            })}
          </div>
        </section>

        <section id="activity" className="pt-16">
          <h2 className="text-xs font-mono uppercase tracking-[0.32em] text-muted-foreground">
            Activity
          </h2>
          <div
            ref={filtersWrapperRef}
            data-stuck={filtersStuck ? "true" : "false"}
            className={cn(
              "mt-4 mb-4 md:sticky md:top-[var(--nav-island-offset,6.25rem)] md:z-30",
              filtersStuck && "md:mt-0",
            )}
          >
            <div
              ref={filtersContainerRef}
              className={cn(
                "md:inline-flex md:w-auto transition-transform duration-300 ease-out will-change-transform",
                filtersStuck &&
                  "md:rounded-xs md:border md:border-border/70 md:bg-card/80 md:px-4 md:py-2 md:backdrop-blur-md",
              )}
              style={{
                transform: `translateX(${filtersStuck ? filtersTranslate : 0}px)`,
              }}
            >
              <TimelineFilters
                value={timelineFilter}
                onChange={(value) => {
                  setTimelineFilter(value as TimelineCategory | "all");
                  scrollToActivitySection();

                  if (typeof window === "undefined") {
                    return;
                  }

                  if (scheduledFilterUpdateRef.current !== null) {
                    window.cancelAnimationFrame(
                      scheduledFilterUpdateRef.current,
                    );
                  }

                  scheduledFilterUpdateRef.current =
                    window.requestAnimationFrame(() => {
                      scheduledFilterUpdateRef.current = null;
                      updateFilterPositions();
                    });
                }}
                className="md:flex-nowrap"
              />
            </div>
          </div>
          <Timeline filter={timelineFilter} />
        </section>

        <section id="changelog" className="pt-16">
          <Changelog />
        </section>

        <section id="footer" className="pt-16 h-48"></section>
      </main>
    </div>
  );
}

export default App;
