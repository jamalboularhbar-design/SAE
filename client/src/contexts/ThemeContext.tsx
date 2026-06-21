import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Always check localStorage for user preference
    const stored = localStorage.getItem("preferred_theme") as Theme | null;
    if (stored) return stored;
    if (switchable) {
      const legacyStored = localStorage.getItem("theme") as Theme | null;
      if (legacyStored) return legacyStored;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    // Add smooth transition for theme changes
    root.style.transition = "background-color 0.3s ease, color 0.3s ease";
    
    root.classList.remove("dark", "light");
    root.classList.add(theme);

    // Persist to localStorage
    localStorage.setItem("preferred_theme", theme);
    // Also keep legacy key for backward compat
    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
