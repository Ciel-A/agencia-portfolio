"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by rendering a placeholder until mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-transparent flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
      </div>
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[18px] w-[18px] text-amber-500 transition-all duration-300" />;
      case "dark":
        return <Moon className="h-[18px] w-[18px] text-zinc-300 transition-all duration-300" />;
      default:
        return <Laptop className="h-[18px] w-[18px] text-zinc-500 dark:text-zinc-400 transition-all duration-300" />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-950/80 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
      aria-label="Toggle theme"
      title={`Theme: ${theme}. Click to change.`}
    >
      {getIcon()}
    </button>
  );
}
