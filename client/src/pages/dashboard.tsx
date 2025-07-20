import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressChart from "@/components/workout/progress-chart";
import MiniCalendar from "@/components/workout/mini-calendar";
import RecentWorkouts from "@/components/workout/recent-workouts";
import QuickActions from "@/components/workout/quick-actions";
import WorkoutModal from "@/components/workout/workout-modal";
import { useState } from "react";

interface Stats {
  totalWorkouts: number;
  hoursTrained: number;
  weightLifted: number;
  currentStreak: number;
  bestStreak: number;
  weeklyWorkouts: number;
}

export default function Dashboard() {
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats/overview"],
  });

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric", 
    month: "long",
    day: "numeric",
  });

  const statCards = [
    {
      title: "Total Workouts",
      value: stats?.totalWorkouts || 0,
      icon: "🔥",
      bgColor: "bg-primary",
    },
    {
      title: "Hours Trained", 
      value: `${stats?.hoursTrained || 0}`,
      icon: "⏱️",
      bgColor: "bg-blue-500",
    },
    {
      title: "Best Streak",
      value: `${stats?.bestStreak || 0} days`,
      icon: "🏆",
      bgColor: "bg-amber-500",
    },
    {
      title: "Weight Lifted",
      value: `${stats?.weightLifted || 0} lbs`,
      icon: "🏋️",
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <>
      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16"></div>
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Today, {currentDate}</p>
            </div>
            <Button 
              onClick={() => setIsWorkoutModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white font-medium"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Log Workout</span>
              <span className="sm:hidden">Log</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg text-white text-xl`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {statsLoading ? "..." : stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Calendar Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <ProgressChart />
          </div>
          <MiniCalendar />
        </div>

        {/* Recent Workouts and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentWorkouts />
          </div>
          <QuickActions onQuickWorkout={() => setIsWorkoutModalOpen(true)} />
        </div>
      </main>

      <WorkoutModal 
        isOpen={isWorkoutModalOpen}
        onClose={() => setIsWorkoutModalOpen(false)}
      />
    </>
  );
}
