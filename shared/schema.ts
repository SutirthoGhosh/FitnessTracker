import { z } from "zod";

// User types for local storage
export interface User {
  id: number;
  username: string;
  password: string;
}

export interface Workout {
  id: number;
  userId: number;
  date: Date;
  type: string; // cardio, strength, yoga, gripper
  exercise: string;
  sets?: number | null;
  reps?: number | null;
  weight?: string | null;
  duration?: number | null; // in minutes
  notes?: string | null;
  createdAt: Date;
}

export interface Exercise {
  id: number;
  name: string;
  type: string;
  muscleGroups?: string[] | null;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const insertWorkoutSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  type: z.string(),
  exercise: z.string(),
  sets: z.number().optional(),
  reps: z.number().optional(),
  weight: z.string().optional(),
  duration: z.number().optional(),
  notes: z.string().optional(),
});

export const insertExerciseSchema = z.object({
  name: z.string(),
  type: z.string(),
  muscleGroups: z.array(z.string()).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
