import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WORKOUT_TYPES } from "@/lib/constants";
import { useState } from "react";
import type { Workout } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
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

  // Get workouts by date
  const workoutsByDate = new Map<string, Workout[]>();
  workouts?.forEach(workout => {
    const dateKey = new Date(workout.date).toDateString();
    if (!workoutsByDate.has(dateKey)) {
      workoutsByDate.set(dateKey, []);
    }
    workoutsByDate.get(dateKey)!.push(workout);
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const today = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16"></div>
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <CalendarIcon className="mr-3 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Workout Calendar</h2>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((dayInfo, i) => {
                const isToday = dayInfo.date.toDateString() === today.toDateString();
                const dayWorkouts = workoutsByDate.get(dayInfo.date.toDateString()) || [];
                
                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-[100px] p-2 border rounded-lg transition-colors duration-200",
                      !dayInfo.isCurrentMonth && "text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-700",
                      dayInfo.isCurrentMonth && "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600",
                      isToday && "border-primary bg-primary/5 dark:bg-primary/10"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isToday && "text-primary font-bold",
                      !isToday && dayInfo.isCurrentMonth && "text-gray-900 dark:text-white"
                    )}>
                      {dayInfo.day}
                    </div>
                    
                    {/* Workout indicators */}
                    <div className="space-y-1">
                      {dayWorkouts.slice(0, 3).map((workout, index) => {
                        const workoutType = WORKOUT_TYPES[workout.type as keyof typeof WORKOUT_TYPES];
                        return (
                          <div
                            key={index}
                            className={cn(
                              "text-xs px-2 py-1 rounded truncate text-white",
                              workoutType?.bgColor || "bg-gray-500"
                            )}
                            title={workout.exercise}
                          >
                            {workout.exercise}
                          </div>
                        );
                      })}
                      {dayWorkouts.length > 3 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                          +{dayWorkouts.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              {Object.entries(WORKOUT_TYPES).map(([key, config]) => (
                <div key={key} className="flex items-center">
                  <div className={`w-3 h-3 ${config.bgColor} rounded mr-2`}></div>
                  <span>{config.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
