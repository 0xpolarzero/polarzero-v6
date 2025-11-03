import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
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
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sectionIds = NAV.map((item) =>
      item.href.startsWith("#") ? item.href.substring(1) : item.href,
    ).filter((id) => Boolean(document.getElementById(id)));

    if (!sectionIds.length) {
      setActiveSection(null);
      return;
    }

    const visibility = new Map<string, { ratio: number; top: number }>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, {
            ratio: entry.isIntersecting ? entry.intersectionRatio : 0,
            top: entry.boundingClientRect.top,
          });
        });

        const ranked = Array.from(visibility.entries()).sort((a, b) => {
          const ratioDelta = b[1].ratio - a[1].ratio;
          if (Math.abs(ratioDelta) > 0.0001) {
            return ratioDelta;
          }
          return Math.abs(a[1].top) - Math.abs(b[1].top);
        });

        if (!ranked.length) {
          return;
        }

        const visibleEntry =
          ranked.find(([_, data]) => data.ratio > 0) ?? ranked[0];

        if (visibleEntry) {
          const [id] = visibleEntry;
          setActiveSection((prev) => (prev === id ? prev : id));
        }
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const fallbackActive = sectionIds[0] ?? null;
    setActiveSection(fallbackActive);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="fixed top-6 z-40 hidden items-center rounded-xs border border-white/12 bg-white/[0.05] backdrop-blur-md transition-all duration-300 ease-out md:flex left-1/2 -translate-x-1/2">
        {NAV.map((item) => {
          const sectionId = item.href.startsWith("#")
            ? item.href.substring(1)
            : item.href;
          const isActive = activeSection === sectionId;

          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setActiveSection(sectionId)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group relative whitespace-nowrap rounded-xs px-4 py-2 text-[11px] font-mono uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-150 hover:bg-white/[0.12] hover:text-neutralHighlight focus-visible:bg-white/[0.12] focus-visible:text-neutralHighlight",
                isActive && "bg-white/[0.12] text-neutralHighlight",
              )}
            >
              <span
                className={cn(
                  "after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-neutralHighlight after:transition-transform after:duration-150 group-hover:after:scale-x-100",
                  isActive && "after:scale-x-100",
                )}
              >
                {item.label}
              </span>
            </a>
          );
        })}
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
                <SheetClose
                  key={item.href}
                  asChild
                  onClick={() => {
                    setActiveSection(sectionId);
                    onNavigate();
                  }}
                >
                  <a
                    href={item.href}
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
