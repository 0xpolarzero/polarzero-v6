import { ListIcon, XIcon } from "@phosphor-icons/react";
import type { MouseEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
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

  return (
    <>
      <div className="fixed top-6 z-40 hidden items-center rounded-xs border border-white/12 bg-white/[0.05] backdrop-blur-md transition-all duration-300 ease-out md:flex left-1/2 -translate-x-1/2">
        <div className="relative flex">
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute -bottom-[1px] h-px rounded-xs bg-neutralHighlight transition-all duration-200 ease-out",
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
                  "relative whitespace-nowrap px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:text-neutralHighlight focus-visible:text-neutralHighlight",
                  isActive && "text-neutralHighlight",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={onMobileNavChange}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileNavOpen}
            className="fixed right-6 top-6 z-50 flex h-10 w-10 items-center justify-center rounded-xs border border-white/10 bg-white/[0.08] text-muted-foreground backdrop-blur-sm transition hover:text-neutralHighlight md:hidden"
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
          className="w-full max-w-xs border border-white/10 bg-white/[0.08] text-foreground backdrop-blur-xl"
        >
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
                      "block rounded-xs px-3 py-2 text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.12] hover:text-neutralHighlight focus-visible:bg-white/[0.12] focus-visible:text-neutralHighlight",
                      isActive && "bg-white/[0.08] text-neutralHighlight",
                    )}
                  >
                    {item.label}
                  </a>
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};
