import { type User, type Workout, type Exercise } from "@shared/schema";

// Client-side localStorage utilities
export class ClientStorage {
  private static readonly KEYS = {
    USERS: 'fittrack_users',
    WORKOUTS: 'fittrack_workouts',
    EXERCISES: 'fittrack_exercises',
  };

  static saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users to localStorage:', error);
    }
  }

  static loadUsers(): User[] {
    try {
      const data = localStorage.getItem(this.KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load users from localStorage:', error);
      return [];
    }
  }

  static saveWorkouts(workouts: Workout[]): void {
    try {
      localStorage.setItem(this.KEYS.WORKOUTS, JSON.stringify(workouts));
    } catch (error) {
      console.error('Failed to save workouts to localStorage:', error);
    }
  }

  static loadWorkouts(): Workout[] {
    try {
      const data = localStorage.getItem(this.KEYS.WORKOUTS);
      if (!data) return [];
      
      const workouts = JSON.parse(data);
      // Convert date strings back to Date objects
      return workouts.map((workout: any) => ({
        ...workout,
        date: new Date(workout.date),
        createdAt: new Date(workout.createdAt),
      }));
    } catch (error) {
      console.error('Failed to load workouts from localStorage:', error);
      return [];
    }
  }

  static saveExercises(exercises: Exercise[]): void {
    try {
      localStorage.setItem(this.KEYS.EXERCISES, JSON.stringify(exercises));
    } catch (error) {
      console.error('Failed to save exercises to localStorage:', error);
    }
  }

  static loadExercises(): Exercise[] {
    try {
      const data = localStorage.getItem(this.KEYS.EXERCISES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load exercises from localStorage:', error);
      return [];
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(this.KEYS.USERS);
      localStorage.removeItem(this.KEYS.WORKOUTS);
      localStorage.removeItem(this.KEYS.EXERCISES);
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}