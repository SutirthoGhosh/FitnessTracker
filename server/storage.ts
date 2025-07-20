import { type User, type InsertUser, type Workout, type InsertWorkout, type Exercise, type InsertExercise } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getWorkouts(userId: number): Promise<Workout[]>;
  getWorkoutsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Workout[]>;
  createWorkout(workout: InsertWorkout & { userId: number }): Promise<Workout>;
  updateWorkout(id: number, workout: Partial<InsertWorkout>): Promise<Workout | undefined>;
  deleteWorkout(id: number): Promise<boolean>;
  
  getExercises(): Promise<Exercise[]>;
  getExercisesByType(type: string): Promise<Exercise[]>;
  searchExercises(query: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
}

export class LocalStorage implements IStorage {
  private users: Map<number, User>;
  private workouts: Map<number, Workout>;
  private exercises: Map<number, Exercise>;
  private currentUserId: number;
  private currentWorkoutId: number;
  private currentExerciseId: number;

  constructor() {
    this.users = new Map();
    this.workouts = new Map();
    this.exercises = new Map();
    this.currentUserId = 1;
    this.currentWorkoutId = 1;
    this.currentExerciseId = 1;
    
    // Load data from localStorage or initialize
    this.loadFromLocalStorage();
    
    // Initialize with common exercises if none exist
    if (this.exercises.size === 0) {
      this.initializeExercises();
      this.saveToLocalStorage();
    }
  }

  private loadFromLocalStorage() {
    try {
      // Note: localStorage access is handled on the client side
      // Server-side storage remains in memory until client syncs
      // Server-side initialization - actual localStorage sync happens on client
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    // Server-side storage is in memory only
    // Client-side will handle localStorage persistence
  }

  private initializeExercises() {
    const commonExercises: InsertExercise[] = [
      // Strength Training
      { name: "Bench Press", type: "strength", muscleGroups: ["chest", "triceps", "shoulders"] },
      { name: "Squats", type: "strength", muscleGroups: ["quadriceps", "glutes", "hamstrings"] },
      { name: "Deadlifts", type: "strength", muscleGroups: ["hamstrings", "glutes", "back"] },
      { name: "Pull-ups", type: "strength", muscleGroups: ["back", "biceps"] },
      { name: "Push-ups", type: "strength", muscleGroups: ["chest", "triceps", "shoulders"] },
      { name: "Overhead Press", type: "strength", muscleGroups: ["shoulders", "triceps"] },
      { name: "Barbell Rows", type: "strength", muscleGroups: ["back", "biceps"] },
      { name: "Bicep Curls", type: "strength", muscleGroups: ["biceps"] },
      
      // Cardio
      { name: "Running", type: "cardio", muscleGroups: ["legs", "cardiovascular"] },
      { name: "Cycling", type: "cardio", muscleGroups: ["legs", "cardiovascular"] },
      { name: "Swimming", type: "cardio", muscleGroups: ["full body", "cardiovascular"] },
      { name: "Rowing", type: "cardio", muscleGroups: ["back", "legs", "cardiovascular"] },
      { name: "Jumping Jacks", type: "cardio", muscleGroups: ["full body", "cardiovascular"] },
      { name: "Burpees", type: "cardio", muscleGroups: ["full body", "cardiovascular"] },
      
      // Yoga
      { name: "Sun Salutation", type: "yoga", muscleGroups: ["full body", "flexibility"] },
      { name: "Warrior Pose", type: "yoga", muscleGroups: ["legs", "core", "flexibility"] },
      { name: "Downward Dog", type: "yoga", muscleGroups: ["arms", "legs", "flexibility"] },
      { name: "Tree Pose", type: "yoga", muscleGroups: ["legs", "core", "balance"] },
      { name: "Child's Pose", type: "yoga", muscleGroups: ["back", "flexibility"] },
      
      // Forearm Gripper
      { name: "Grip Strength Training", type: "gripper", muscleGroups: ["forearms", "hands"] },
      { name: "Forearm Squeeze", type: "gripper", muscleGroups: ["forearms"] },
      { name: "Hand Gripper", type: "gripper", muscleGroups: ["hands", "forearms"] },
    ];

    commonExercises.forEach(exercise => {
      this.exercises.set(this.currentExerciseId, {
        id: this.currentExerciseId,
        ...exercise,
      });
      this.currentExerciseId++;
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const usersArray = Array.from(this.users.values());
    return usersArray.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
    };
    this.users.set(user.id, user);
    this.saveToLocalStorage();
    return user;
  }

  async getWorkouts(userId: number): Promise<Workout[]> {
    const userWorkouts = Array.from(this.workouts.values())
      .filter(workout => workout.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return userWorkouts;
  }

  async getWorkoutsByDateRange(userId: number, startDate: Date, endDate: Date): Promise<Workout[]> {
    const userWorkouts = Array.from(this.workouts.values())
      .filter(workout => 
        workout.userId === userId && 
        new Date(workout.date) >= startDate && 
        new Date(workout.date) <= endDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return userWorkouts;
  }

  async createWorkout(workoutData: InsertWorkout & { userId: number }): Promise<Workout> {
    const workout: Workout = {
      id: this.currentWorkoutId++,
      createdAt: new Date(),
      ...workoutData,
    };
    this.workouts.set(workout.id, workout);
    this.saveToLocalStorage();
    return workout;
  }

  async updateWorkout(id: number, workoutData: Partial<InsertWorkout>): Promise<Workout | undefined> {
    const workout = this.workouts.get(id);
    if (!workout) {
      return undefined;
    }
    
    const updatedWorkout = { ...workout, ...workoutData };
    this.workouts.set(id, updatedWorkout);
    this.saveToLocalStorage();
    return updatedWorkout;
  }

  async deleteWorkout(id: number): Promise<boolean> {
    const deleted = this.workouts.delete(id);
    if (deleted) {
      this.saveToLocalStorage();
    }
    return deleted;
  }

  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getExercisesByType(type: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.type === type)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.exercises.values())
      .filter(exercise => 
        exercise.name.toLowerCase().includes(lowerQuery) ||
        exercise.type.toLowerCase().includes(lowerQuery) ||
        exercise.muscleGroups?.some(group => group.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async createExercise(exerciseData: InsertExercise): Promise<Exercise> {
    const exercise: Exercise = {
      id: this.currentExerciseId++,
      ...exerciseData,
    };
    this.exercises.set(exercise.id, exercise);
    this.saveToLocalStorage();
    return exercise;
  }
}

export const storage = new LocalStorage();