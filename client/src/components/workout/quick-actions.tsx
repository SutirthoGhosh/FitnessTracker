import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { WORKOUT_TYPES } from "@/lib/constants";

interface QuickActionsProps {
  onQuickWorkout: () => void;
}

export default function QuickActions({ onQuickWorkout }: QuickActionsProps) {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/overview"],
  });

  const workoutTypes = Object.entries(WORKOUT_TYPES).map(([key, config]) => ({
    key,
    ...config,
  }));

  const goalProgress = stats?.weeklyWorkouts ? (stats.weeklyWorkouts / 4) * 100 : 0;
  const goalText = `${stats?.weeklyWorkouts || 0} of 4 workouts completed`;

  return (
    <Card className="bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={onQuickWorkout}
          className="w-full bg-primary hover:bg-primary/90 text-white p-4 font-medium"
        >
          <Play className="mr-2 h-4 w-4" />
          Start Quick Workout
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          {workoutTypes.map((type) => (
            <Button
              key={type.key}
              variant="outline"
              onClick={onQuickWorkout}
              className={`p-3 h-auto flex flex-col items-center ${type.lightBg} ${type.textColor} border-gray-200 hover:border-current transition-colors`}
            >
              <span className="text-xl mb-1">{type.icon}</span>
              <span className="text-xs font-medium">{type.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Today's Goal Progress</div>
          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(goalProgress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{goalText}</div>
        </div>
      </CardContent>
    </Card>
  );
}
