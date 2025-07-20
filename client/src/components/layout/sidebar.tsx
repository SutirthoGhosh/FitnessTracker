import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Dumbbell, BarChart3, PlusCircle, Calendar, TrendingUp, List } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useQuery } from "@tanstack/react-query";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Log Workout", href: "/log-workout", icon: PlusCircle },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Progress", href: "/progress", icon: TrendingUp },
];

export default function Sidebar() {
  const [location] = useLocation();
  
  // Fetch real stats data
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/overview"],
  });

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">FitTrack</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <div
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Stats
          </h3>
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
              <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats?.weeklyWorkouts || 0} workouts
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 transition-colors duration-300">
              <div className="text-xs text-gray-500 dark:text-gray-400">Best Streak</div>
              <div className="text-lg font-semibold text-primary">
                {stats?.bestStreak || 0} days
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}
