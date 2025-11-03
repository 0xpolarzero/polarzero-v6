import { CheckIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { NavigationIsland } from "@/components/navigation-island";
import Timeline from "@/components/timeline/timeline";
import { TimelineFilters } from "@/components/timeline/timeline-filters";
import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/data/socials";
import type { TimelineCategory } from "@/data/timeline";

function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [timelineFilter, setTimelineFilter] = useState<
    TimelineCategory | "all"
  >("all");

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

        <section id="activity" className="space-y-4 pt-16">
          <h2 className="text-xs font-mono uppercase tracking-[0.32em] text-muted-foreground">
            Activity
          </h2>
          <TimelineFilters
            value={timelineFilter}
            onChange={(value) =>
              setTimelineFilter(value as TimelineCategory | "all")
            }
          />
          <Timeline filter={timelineFilter} />
        </section>
      </main>
    </div>
  );
}

export default App;
