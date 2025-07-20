import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Activity, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useState } from "react";
import type { Workout } from "@shared/schema";

interface ChartData {
  date: string;
  workouts: number;
  duration: number;
  weight: number;
}

interface Stats {
  totalWorkouts: number;
  hoursTrained: number;
  weightLifted: number;
  currentStreak: number;
  bestStreak: number;
  weeklyWorkouts: number;
}

export default function Progress() {
  const [timeframe, setTimeframe] = useState("month");
  
  const { data: chartData } = useQuery<ChartData[]>({
    queryKey: ["/api/stats/chart", { period: timeframe }],
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ["/api/stats/overview"],
  });

  const { data: workouts } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeframe === "week") {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  // Calculate workout type distribution
  const workoutTypeData = workouts?.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeChartData = Object.entries(workoutTypeData || {}).map(([type, count]) => ({
    type: type.charAt(0).toUpperCase() + type.slice(1),
    count,
  }));

  const progressCards = [
    {
      title: "Total Workouts",
      value: stats?.totalWorkouts || 0,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Hours Trained",
      value: `${stats?.hoursTrained || 0}h`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Current Streak",
      value: `${stats?.currentStreak || 0} days`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Best Streak",
      value: `${stats?.bestStreak || 0} days`,
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16"></div>
      
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <TrendingUp className="mr-3 h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Progress Tracking</h2>
          </div>
        </div>
      </div>

      <main className="p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        {/* Progress Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {progressCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`${card.bgColor} p-3 rounded-lg`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          {/* Workout Frequency Chart */}
          <Card className="transition-colors duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="dark:text-white">Workout Frequency</CardTitle>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last 7 days</SelectItem>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="quarter">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => formatDate(value as string)}
                      formatter={(value: number) => [value, "Workouts"]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Workout Type Distribution */}
          <Card className="transition-colors duration-300">
            <CardHeader>
              <CardTitle className="dark:text-white">Workout Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="type"
                      stroke="#6b7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip 
                      formatter={(value: number) => [value, "Workouts"]}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Duration Progress */}
        <Card className="transition-colors duration-300">
          <CardHeader>
            <CardTitle className="dark:text-white">Training Duration Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    labelFormatter={(value) => formatDate(value as string)}
                    formatter={(value: number) => [`${value} min`, "Duration"]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="hsl(var(--fitness-blue))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--fitness-blue))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
