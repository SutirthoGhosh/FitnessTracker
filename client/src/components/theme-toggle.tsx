import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        "relative h-9 w-9 rounded-full transition-all duration-300 ease-in-out",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      )}
      aria-label="Toggle theme"
    >
      <div className="relative h-4 w-4">
        {/* Sun Icon */}
        <Sun
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out",
            isDark
              ? "scale-0 rotate-90 opacity-0"
              : "scale-100 rotate-0 opacity-100"
          )}
        />
        {/* Moon Icon */}
        <Moon
          className={cn(
            "absolute inset-0 h-4 w-4 transition-all duration-300 ease-in-out",
            isDark
              ? "scale-100 rotate-0 opacity-100"
              : "scale-0 -rotate-90 opacity-0"
          )}
        />
      </div>
    </Button>
  );
}