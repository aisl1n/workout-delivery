export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  videoUrl: string | null;
}

export interface WorkoutItem {
  id: string;
  sets: string | null;
  reps: string | null;
  order: number;
  exercise: Exercise;
}

export interface Workout {
  id: string;
  title: string;
  createdAt: string;
  items: WorkoutItem[];
}

export interface WorkoutClientProps {
  slug: string;
}
