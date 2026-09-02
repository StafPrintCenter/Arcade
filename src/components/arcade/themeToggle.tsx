import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = mounted && theme === "dark";

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer au thème clair" : "Passer au thème sombre"}
      className="px-2.5 sm:px-3"
    >
      {isDark ? <Sun className="size-4 sm:mr-1.5" /> : <Moon className="size-4 sm:mr-1.5" />}
      <span className="hidden sm:inline">
        {isDark ? "Clair" : "Sombre"}
      </span>
    </Button>
  );
}
