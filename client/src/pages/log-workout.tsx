import { useState } from "react";
import WorkoutModal from "@/components/workout/workout-modal";

export default function LogWorkout() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back to dashboard or previous page
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile Header Spacer */}
      <div className="lg:hidden h-16"></div>
      
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Log Workout</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your exercise progress by logging your workouts.</p>
      </div>

      <WorkoutModal 
        isOpen={isModalOpen}
        onClose={handleClose}
      />
    </div>
  );
}
