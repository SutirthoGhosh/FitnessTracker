import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LogWorkout from "@/pages/log-workout";
import Calendar from "@/pages/calendar";
import Progress from "@/pages/progress";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/log-workout" component={LogWorkout} />
      <Route path="/calendar" component={Calendar} />
      <Route path="/progress" component={Progress} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="fittrack-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Router />
            </div>
            <MobileNav />
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
