import { ListIcon, XIcon } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ThemeToggleDropdown,
  ThemeToggleMobile,
} from "@/components/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";

interface NavigationIslandProps {
  mobileNavOpen: boolean;
  onMobileNavChange: (open: boolean) => void;
  onNavigate: () => void;
}

export const NavigationIsland = ({
  mobileNavOpen,
  onMobileNavChange,
  onNavigate,
}: NavigationIslandProps) => {
  const NAV_HEADER_OFFSET = 72;
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [indicator, setIndicator] = useState<{
    width: number;
    left: number;
    visible: boolean;
  }>({ width: 0, left: 0, visible: false });
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const desktopNavRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = useCallback((sectionId: string) => {
    if (typeof window === "undefined") {
      return;
    }

    const element = document.getElementById(sectionId);

    if (!element) {
      return;
    }

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const elementTop = element.offsetTop;
    const targetTop = Math.max(elementTop - NAV_HEADER_OFFSET, 0);

    if (prefersReducedMotion) {
      window.scrollTo({ top: targetTop, behavior: "auto" });
    } else {
      window.scrollTo({ top: targetTop, behavior: "smooth" });
    }
  }, []);

  const updateIndicatorForSection = useCallback((sectionId: string | null) => {
    if (typeof window === "undefined") {
      return;
    }

    if (!sectionId) {
      setIndicator((prev) =>
        prev.visible ? { width: 0, left: 0, visible: false } : prev,
      );
      return;
    }

    const element = linkRefs.current[sectionId];
    const container = element?.parentElement;

    if (!element || !container) {
      return;
    }

    window.requestAnimationFrame(() => {
      setIndicator({
        width: element.offsetWidth,
        left: element.offsetLeft,
        visible: true,
      });
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const getExistingSectionIds = () =>
      NAV.map((item) =>
        item.href.startsWith("#") ? item.href.substring(1) : item.href,
      ).filter((id) => Boolean(document.getElementById(id)));

    const handleScroll = () => {
      const sectionIds = getExistingSectionIds();

      if (!sectionIds.length) {
        setActiveSection(null);
        return;
      }

      const viewThreshold = window.scrollY + NAV_HEADER_OFFSET + 16;
      let current: string | null = sectionIds[0];

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);

        if (!element) {
          return;
        }

        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        const isCompactSection =
          elementBottom - elementTop <= NAV_HEADER_OFFSET;

        if (
          viewThreshold >= elementTop &&
          (viewThreshold < elementBottom || isCompactSection)
        ) {
          current = id;
        }
      });

      const lastSectionId = sectionIds[sectionIds.length - 1];
      const scrollBottom =
        window.scrollY + window.innerHeight >=
        (document.documentElement?.scrollHeight ?? 0) - 4;

      if (scrollBottom) {
        current = lastSectionId;
      }

      if (window.scrollY < 16) {
        current = sectionIds[0];
      }

      updateIndicatorForSection(current);
      setActiveSection((prev) => (prev === current ? prev : current));
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [updateIndicatorForSection]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const doc = document.documentElement;
    const gapBelowNav = 16;

    const updateNavOffset = () => {
      const nav = desktopNavRef.current;

      if (!mediaQuery.matches || !nav) {
        doc.style.setProperty("--nav-island-offset", "6.25rem");
        return;
      }

      const computedStyles = window.getComputedStyle(nav);
      const topValue = parseFloat(computedStyles.top) || 0;
      const height = nav.offsetHeight || 0;

      doc.style.setProperty(
        "--nav-island-offset",
        `${topValue + height + gapBelowNav}px`,
      );
    };

    const handleMediaChange = () => updateNavOffset();

    updateNavOffset();

    window.addEventListener("resize", updateNavOffset);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      window.removeEventListener("resize", updateNavOffset);

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-x-0 z-40 hidden justify-center md:flex"
        style={{
          top: "calc(1.75rem + env(safe-area-inset-top, 0px))",
        }}
        ref={desktopNavRef}
      >
        <div className="flex items-center gap-3 rounded-xs border border-border/70 bg-card/80 px-2 py-1 backdrop-blur-md transition-all duration-300 ease-out">
          <div className="relative flex items-center">
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute -bottom-[1px] h-px rounded-xs bg-foreground transition-all duration-200 ease-out dark:bg-neutralHighlight",
                indicator.visible ? "opacity-100" : "opacity-0",
              )}
              style={{
                width: indicator.width - 4,
                transform: `translateX(${indicator.left + 2}px)`,
              }}
            />
            {NAV.map((item) => {
              const sectionId = item.href.startsWith("#")
                ? item.href.substring(1)
                : item.href;
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  ref={(node) => {
                    linkRefs.current[sectionId] = node;
                  }}
                  onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                    if (item.href.startsWith("#")) {
                      event.preventDefault();
                      scrollToSection(sectionId);
                    }
                  }}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:text-foreground dark:hover:text-neutralHighlight dark:focus-visible:text-neutralHighlight",
                    isActive && "text-foreground dark:text-neutralHighlight",
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
          <ThemeToggleDropdown />
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={onMobileNavChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
            className="fixed right-6 z-50 flex h-10 w-10 items-center justify-center rounded-xs border border-border/70 bg-card/85 text-muted-foreground backdrop-blur-sm transition hover:text-accent-foreground hover:bg-accent md:hidden"
            style={{
              top: "calc(1.75rem + env(safe-area-inset-top, 0px))",
            }}
          >
            {mobileNavOpen ? (
              <XIcon size={18} weight="light" />
            ) : (
              <ListIcon size={18} weight="light" />
            )}
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full max-w-xs border border-border/60 bg-card/85 text-foreground backdrop-blur-xl"
        >
          <div className="flex h-full flex-col justify-between">
            <nav className="space-y-3">
              {NAV.map((item) => {
                const sectionId = item.href.startsWith("#")
                  ? item.href.substring(1)
                  : item.href;
                const isActive = activeSection === sectionId;

                return (
                  <SheetClose key={item.href} asChild>
                    <a
                      href={item.href}
                      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                        if (item.href.startsWith("#")) {
                          event.preventDefault();
                          scrollToSection(sectionId);
                        }

                        onNavigate();
                      }}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "block rounded-xs px-3 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground",
                        isActive && "bg-accent text-accent-foreground",
                      )}
                    >
                      {item.label}
                    </a>
                  </SheetClose>
                );
              })}
            </nav>
            <ThemeToggleMobile className="mt-8" />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
