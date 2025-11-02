import {
  ArrowsClockwise,
  GithubLogo,
  Lightning,
  MoonStars,
  PaintBrush,
  SunDim,
} from "@phosphor-icons/react";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

type Feature = {
  title: string;
  description: string;
  icon: ReactNode;
};

const features: Feature[] = [
  {
    title: "Modern tooling",
    description:
      "Vite, pnpm, and Biome deliver instant feedback loops, modern bundling, and ergonomic linting.",
    icon: <Lightning weight="duotone" size={28} />,
  },
  {
    title: "Composable components",
    description:
      "Build on top of shadcn/ui primitives with Tailwind CSS, ready to theme and extend.",
    icon: <PaintBrush weight="duotone" size={28} />,
  },
  {
    title: "Typed and scalable",
    description:
      "TypeScript-first foundations with sensible aliases, utilities, and reusable UI patterns.",
    icon: <ArrowsClockwise weight="duotone" size={28} />,
  },
];

const THEME_STORAGE_KEY = "shadcn-vite-theme";

function App() {
  const prefersDark = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    [],
  );
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") {
      return stored === "dark";
    }
    return prefersDark;
  });

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;
    root.classList.toggle("dark", isDark);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    }
  }, [isDark]);

  const themeToggleIcon = isDark ? (
    <SunDim weight="duotone" size={20} />
  ) : (
    <MoonStars weight="duotone" size={20} />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
              <GithubLogo weight="fill" size={30} />
            </span>
            <div>
              <p className="text-xl font-semibold">Shadcn Vite Starter</p>
              <p className="text-sm text-muted-foreground">
                React + TypeScript + Tailwind + shadcn/ui + Biome
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setIsDark((value) => !value)}
            >
              {themeToggleIcon}
            </Button>
            <Button asChild variant="outline">
              <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">
                Browse components
              </a>
            </Button>
            <Button asChild>
              <a
                href="https://github.com/polarzero"
                target="_blank"
                rel="noreferrer"
              >
                View repo
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container flex flex-col gap-12 pb-16 pt-12">
        <section className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-muted-foreground">
            <span className="inline-flex size-2 rounded-full bg-primary" />
            Ready-to-ship starter stack
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Launch delightful interfaces in record time.
          </h1>
          <p className="text-lg text-muted-foreground">
            Start from a modern React foundation that pairs Vite speed with
            shadcn/ui flexibility and polished defaults. Customize the tokens,
            swap icons, and ship product screens with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://biomejs.dev" target="_blank" rel="noreferrer">
                Read Biome docs
              </a>
            </Button>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 text-left shadow-sm transition hover:border-primary/60 hover:shadow"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default App;
