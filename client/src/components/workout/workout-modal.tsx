import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORKOUT_TYPES } from "@/lib/constants";
import { insertWorkoutSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Exercise } from "@shared/schema";

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertWorkoutSchema.extend({
  exercise: z.string().min(1, "Exercise is required"),
  type: z.string().min(1, "Workout type is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function WorkoutModal({ isOpen, onClose }: WorkoutModalProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      type: "",
      exercise: "",
      sets: undefined,
      reps: undefined,
      weight: undefined,
      duration: undefined,
      notes: "",
    },
  });

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises/search", exerciseSearch],
    enabled: exerciseSearch.length > 0,
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/workouts", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({ title: "Workout logged successfully!" });
      handleClose();
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to log workout. Please try again.",
        variant: "destructive"
      });
    },
  });

  const handleClose = () => {
    form.reset();
    setSelectedType("");
    setExerciseSearch("");
    setShowSuggestions(false);
    onClose();
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const handleExerciseSelect = (exercise: string) => {
    setExerciseSearch(exercise);
    form.setValue("exercise", exercise);
    setShowSuggestions(false);
  };

  const onSubmit = (data: FormData) => {
    createWorkoutMutation.mutate(data);
  };

  const filteredExercises = exercises?.filter(exercise =>
    exercise.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  ).slice(0, 5) || [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Log New Workout
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Workout Type Selection */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Workout Type
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(WORKOUT_TYPES).map(([type, config]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTypeSelect(type)}
                  className={cn(
                    "p-3 border rounded-lg text-center transition-all duration-200",
                    `workout-type-${type}`,
                    selectedType === type && "active"
                  )}
                >
                  <div className="text-xl mb-1">{config.icon}</div>
                  <div className="text-xs font-medium">{config.name}</div>
                </button>
              ))}
            </div>
            {form.formState.errors.type && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          {/* Exercise Search */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Exercise
            </Label>
            <div className="relative">
              <Input
                placeholder="Search exercises..."
                value={exerciseSearch}
                onChange={(e) => {
                  setExerciseSearch(e.target.value);
                  setShowSuggestions(true);
                  form.setValue("exercise", e.target.value);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              
              {/* Exercise Suggestions */}
              {showSuggestions && filteredExercises.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg">
                  {filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => handleExerciseSelect(exercise.name)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-md last:rounded-b-md"
                    >
                      {exercise.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.formState.errors.exercise && (
              <p className="text-red-500 text-sm mt-1">{form.formState.errors.exercise.message}</p>
            )}
          </div>

          {/* Workout Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Sets
              </Label>
              <Input
                type="number"
                placeholder="3"
                {...form.register("sets", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Reps
              </Label>
              <Input
                type="number"
                placeholder="12"
                {...form.register("reps", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Weight (lbs)
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder="135"
                {...form.register("weight")}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Duration (min)
              </Label>
              <Input
                type="number"
                placeholder="30"
                {...form.register("duration", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Date
            </Label>
            <Input
              type="date"
              {...form.register("date")}
            />
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Notes (optional)
            </Label>
            <Textarea
              placeholder="Add any notes about your workout..."
              rows={3}
              {...form.register("notes")}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createWorkoutMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createWorkoutMutation.isPending ? "Logging..." : "Log Workout"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
