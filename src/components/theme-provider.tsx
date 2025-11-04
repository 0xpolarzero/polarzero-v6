import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<Theme, "system">;

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "polarzero-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

const getSystemTheme = (
  mediaQueryList?: MediaQueryList | null,
): ResolvedTheme => (mediaQueryList?.matches ? "dark" : "light");

const assignThemeToDocument = (theme: ResolvedTheme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  root.classList.toggle("dark", theme === "dark");
};

export interface ThemeProviderProps extends PropsWithChildren {
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedValue = window.localStorage.getItem(storageKey) as Theme | null;
    return storedValue ?? defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    if (theme === "dark" || theme === "light") {
      return theme;
    }

    if (typeof window === "undefined") {
      return defaultTheme === "dark" ? "dark" : "light";
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);
    return getSystemTheme(mediaQuery);
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const applyTheme = (nextTheme: Theme) => {
      const computed =
        nextTheme === "system" ? getSystemTheme(mediaQuery) : nextTheme;

      assignThemeToDocument(computed);
      setResolvedTheme(computed);
    };

    applyTheme(theme);

    const handleMediaChange = () => {
      if (theme === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // Ignore storage write failures (e.g. private mode).
    }
  }, [theme, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(MEDIA_QUERY);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      const nextTheme =
        (event.newValue as Theme | null) ?? defaultTheme ?? "system";

      setThemeState(nextTheme);

      if (nextTheme === "system") {
        assignThemeToDocument(getSystemTheme(mediaQuery));
        return;
      }

      assignThemeToDocument(nextTheme);
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, [defaultTheme, storageKey]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
