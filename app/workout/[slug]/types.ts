import type {
  Workout as PrismaWorkout,
  WorkoutItem as PrismaWorkoutItem,
  Exercise as PrismaExercise,
} from "@/lib/generated/prisma/client";

/**
 * Types para o frontend - extende os types do Prisma com as relações necessárias
 */

// Reutilizando o type Exercise do Prisma diretamente
export type Exercise = PrismaExercise;

// WorkoutItem com a relação exercise incluída
export type WorkoutItem = PrismaWorkoutItem & {
  exercise: Exercise;
};

// Workout com items e suas relações, e createdAt como string para serialização JSON
export type Workout = Omit<PrismaWorkout, "createdAt" | "items"> & {
  createdAt: string;
  items: WorkoutItem[];
};

export interface WorkoutClientProps {
  workout: Workout;
}
