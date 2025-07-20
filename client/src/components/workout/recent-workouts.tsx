import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WORKOUT_TYPES } from "@/lib/constants";
import type { Workout } from "@shared/schema";

export default function RecentWorkouts() {
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const formatWorkoutDate = (date: string | Date) => {
    const workoutDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (workoutDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (workoutDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      const diffTime = Math.abs(today.getTime() - workoutDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days ago`;
    }
  };

  const formatWorkoutTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getWorkoutIcon = (type: string) => {
    const workoutType = WORKOUT_TYPES[type as keyof typeof WORKOUT_TYPES];
    return workoutType?.icon || "💪";
  };

  const getWorkoutColor = (type: string) => {
    const workoutType = WORKOUT_TYPES[type as keyof typeof WORKOUT_TYPES];
    return workoutType?.bgColor || "bg-gray-500";
  };

  const formatWorkoutDetails = (workout: Workout) => {
    const parts = [];
    if (workout.sets && workout.reps) {
      parts.push(`${workout.sets} sets × ${workout.reps} reps`);
    }
    if (workout.duration) {
      parts.push(`${workout.duration} min`);
    }
    if (workout.weight) {
      parts.push(`${workout.weight} lbs`);
    }
    return parts.join(" • ") || "Workout completed";
  };

  const recentWorkouts = workouts?.slice(0, 5) || [];

  return (
    <Card className="bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Workouts
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View all
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentWorkouts.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No workouts logged yet.</p>
            <p className="text-sm">Start by logging your first workout!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentWorkouts.map((workout) => (
              <div 
                key={workout.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className={`${getWorkoutColor(workout.type)} p-2 rounded-lg text-white text-xl`}>
                    {getWorkoutIcon(workout.type)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{workout.exercise}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatWorkoutDetails(workout)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatWorkoutDate(workout.date)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatWorkoutTime(workout.date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
