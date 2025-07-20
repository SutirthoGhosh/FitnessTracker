export const WORKOUT_TYPES = {
  cardio: {
    name: "Cardio",
    icon: "🏃",
    color: "blue",
    bgColor: "bg-blue-500",
    textColor: "text-blue-700",
    lightBg: "bg-blue-50",
  },
  strength: {
    name: "Strength",
    icon: "💪",
    color: "purple", 
    bgColor: "bg-purple-500",
    textColor: "text-purple-700",
    lightBg: "bg-purple-50",
  },
  yoga: {
    name: "Yoga",
    icon: "🧘",
    color: "green",
    bgColor: "bg-green-500", 
    textColor: "text-green-700",
    lightBg: "bg-green-50",
  },
  gripper: {
    name: "Gripper",
    icon: "✊",
    color: "amber",
    bgColor: "bg-amber-500",
    textColor: "text-amber-700", 
    lightBg: "bg-amber-50",
  },
} as const;

export type WorkoutType = keyof typeof WORKOUT_TYPES;

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "BarChart3" },
  { href: "/log-workout", label: "Log Workout", icon: "PlusCircle" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/progress", label: "Progress", icon: "TrendingUp" },
] as const;
