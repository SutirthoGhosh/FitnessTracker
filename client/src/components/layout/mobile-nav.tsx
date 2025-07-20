import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { BarChart3, PlusCircle, Calendar, TrendingUp, Menu, User } from "lucide-react";
import { Dumbbell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const bottomNavigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Log", href: "/log-workout", icon: PlusCircle },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:hidden fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
        <div className="flex items-center justify-between px-4 py-3">
          <button className="text-gray-500 dark:text-gray-400">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <div className="bg-primary p-1.5 rounded-lg">
              <Dumbbell className="h-4 w-4 text-white" />
            </div>
            <h1 className="ml-2 text-lg font-bold text-gray-900 dark:text-white">FitTrack</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50 transition-colors duration-300">
        <div className="flex justify-around">
          {bottomNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center p-2 transition-colors cursor-pointer",
                    isActive
                      ? "text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
