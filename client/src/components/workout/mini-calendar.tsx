import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Workout } from "@shared/schema";

export default function MiniCalendar() {
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of the month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Create array of days
  const days = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDay = new Date(currentYear, currentMonth, -startingDayOfWeek + i + 1);
    days.push({
      day: prevMonthDay.getDate(),
      isCurrentMonth: false,
      date: prevMonthDay,
    });
  }
  
  // Add days of the current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(currentYear, currentMonth, day),
    });
  }

  // Get workout dates for highlighting
  const workoutDates = new Set(
    workouts?.map(workout => 
      new Date(workout.date).toDateString()
    ) || []
  );

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card className="bg-white dark:bg-gray-800 transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          Workout Calendar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
          {dayNames.map((day, i) => (
            <div key={i} className="text-center py-1">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.slice(0, 42).map((dayInfo, i) => {
            const isToday = dayInfo.date.toDateString() === today.toDateString();
            const hasWorkout = workoutDates.has(dayInfo.date.toDateString());
            
            return (
              <div
                key={i}
                className={cn(
                  "text-center p-1 text-sm cursor-pointer rounded transition-colors",
                  !dayInfo.isCurrentMonth && "text-gray-400 dark:text-gray-600",
                  dayInfo.isCurrentMonth && "hover:bg-gray-100 dark:hover:bg-gray-700",
                  isToday && "bg-primary text-white font-semibold",
                  hasWorkout && !isToday && "bg-primary text-white",
                )}
              >
                {dayInfo.day}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <div className="w-3 h-3 bg-primary rounded mr-2"></div>
          <span>Workout days</span>
        </div>
      </CardContent>
    </Card>
  );
}
