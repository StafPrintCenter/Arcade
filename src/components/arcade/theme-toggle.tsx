import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre"}
    >
      {mounted && theme === "dark" ? <Sun className="mr-1 size-4" /> : <Moon className="mr-1 size-4" />}
      {mounted && theme === "dark" ? "Clair" : "Sombre"}
    </Button>
  );
}
