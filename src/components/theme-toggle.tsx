import {
  type IconProps,
  MonitorIcon,
  MoonStarsIcon,
  SunIcon,
} from "@phosphor-icons/react";
import { type ComponentType, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import { type ResolvedTheme, type Theme, useTheme } from "./theme-provider";

interface ThemeOption {
  value: Theme;
  label: string;
  icon: ComponentType<IconProps>;
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonStarsIcon },
  { value: "system", label: "System", icon: MonitorIcon },
];

const iconWeight = (theme: Theme, option: Theme, resolved: ResolvedTheme) => {
  if (option === "system") {
    return theme === "system" && resolved === "dark" ? "fill" : "regular";
  }

  return theme === option ? "fill" : "regular";
};

export const ThemeToggleDropdown = ({ className }: { className?: string }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const triggerIcon = useMemo(() => {
    const activeOption =
      THEME_OPTIONS.find((option) => option.value === theme) ??
      THEME_OPTIONS.find((option) => option.value === resolvedTheme) ??
      THEME_OPTIONS[0];

    if (theme === "system") {
      return resolvedTheme === "dark" ? MoonStarsIcon : SunIcon;
    }

    return activeOption.icon;
  }, [resolvedTheme, theme]);

  const TriggerIconComponent = triggerIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 gap-2 rounded-xs border border-transparent px-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:border-border hover:bg-accent hover:text-accent-foreground focus-visible:ring-offset-background",
            className,
          )}
        >
          <TriggerIconComponent size={16} weight="regular" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-[11px] tracking-[0.28em]">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        >
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem
              icon={<span />}
              key={value}
              value={value}
              className="gap-3 pr-8"
            >
              <Icon
                size={16}
                weight={iconWeight(theme, value, resolvedTheme)}
                className="text-muted-foreground"
              />
              <span className="text-sm font-medium capitalize text-foreground">
                {label}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const ThemeToggleMobile = ({ className }: { className?: string }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "rounded-xs border border-border/70 bg-card/80 p-2 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
          const isActive = theme === value;
          const weight = iconWeight(theme, value, resolvedTheme);

          return (
            <button
              key={value}
              type="button"
              className={cn(
                "flex h-11 flex-1 items-center justify-center rounded-xs border border-transparent text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "border-border bg-accent text-accent-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground",
              )}
              onClick={() => setTheme(value)}
              aria-pressed={isActive}
            >
              <Icon size={18} weight={weight} />
              <span className="sr-only">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
