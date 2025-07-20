import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkoutSchema, insertExerciseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Workouts
  app.get("/api/workouts", async (req, res) => {
    try {
      // For demo purposes, use userId = 1
      const workouts = await storage.getWorkouts(1);
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const workouts = await storage.getWorkoutsByDateRange(
        1, // userId
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(workouts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workouts by date range" });
    }
  });

  app.post("/api/workouts", async (req, res) => {
    try {
      const workoutData = insertWorkoutSchema.parse(req.body);
      const workout = await storage.createWorkout({
        ...workoutData,
        userId: 1, // For demo purposes
      });
      res.json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workout" });
    }
  });

  app.put("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const workoutData = insertWorkoutSchema.partial().parse(req.body);
      const workout = await storage.updateWorkout(id, workoutData);
      
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json(workout);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update workout" });
    }
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWorkout(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Workout not found" });
      }
      
      res.json({ message: "Workout deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Exercises
  app.get("/api/exercises", async (req, res) => {
    try {
      const exercises = await storage.getExercises();
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/type/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const exercises = await storage.getExercisesByType(type);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises by type" });
    }
  });

  app.get("/api/exercises/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const exercises = await storage.searchExercises(q as string);
      res.json(exercises);
    } catch (error) {
      res.status(500).json({ message: "Failed to search exercises" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  // Stats endpoints
  app.get("/api/stats/overview", async (req, res) => {
    try {
      const workouts = await storage.getWorkouts(1);
      
      const totalWorkouts = workouts.length;
      const hoursTrained = workouts.reduce((sum, workout) => sum + (workout.duration || 0), 0) / 60;
      const weightLifted = workouts
        .filter(w => w.weight)
        .reduce((sum, workout) => sum + parseFloat(workout.weight?.toString() || "0") * (workout.sets || 1) * (workout.reps || 1), 0);
      
      // Calculate streaks
      const sortedWorkouts = workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      let currentStreak = 0;
      let bestStreak = 0;
      
      const today = new Date();
      const workoutDates = new Set(sortedWorkouts.map(w => new Date(w.date).toDateString()));
      
      // Calculate current streak
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        if (workoutDates.has(checkDate.toDateString())) {
          currentStreak++;
        } else if (i > 0) {
          break;
        }
      }
      
      // Calculate best streak properly
      if (workoutDates.size === 0) {
        bestStreak = 0;
      } else {
        // Calculate actual best streak by checking consecutive days
        const dates = Array.from(workoutDates).map(d => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
        let tempStreak = 1;
        bestStreak = 1;
        
        for (let i = 1; i < dates.length; i++) {
          const daysDiff = Math.floor((dates[i].getTime() - dates[i-1].getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            tempStreak++;
            bestStreak = Math.max(bestStreak, tempStreak);
          } else {
            tempStreak = 1;
          }
        }
      }
      
      // Weekly workouts
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      const weeklyWorkouts = workouts.filter(w => new Date(w.date) >= oneWeekAgo).length;
      
      res.json({
        totalWorkouts,
        hoursTrained: Math.round(hoursTrained * 10) / 10,
        weightLifted: Math.round(weightLifted),
        currentStreak,
        bestStreak,
        weeklyWorkouts,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/stats/chart", async (req, res) => {
    try {
      const { period = "week" } = req.query;
      const workouts = await storage.getWorkouts(1);
      
      const today = new Date();
      const days = period === "week" ? 7 : period === "month" ? 30 : 90;
      
      const chartData = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === dateStr);
        
        chartData.push({
          date: date.toISOString().split('T')[0],
          workouts: dayWorkouts.length,
          duration: dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
          weight: dayWorkouts.reduce((sum, w) => sum + parseFloat(w.weight?.toString() || "0"), 0),
        });
      }
      
      res.json(chartData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chart data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
