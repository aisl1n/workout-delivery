import { WorkoutItem } from "../../types";

export interface WorkoutItemCardProps {
  item: WorkoutItem;
  index: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onToggleComplete: () => void;
  onToggleExpanded: () => void;
}
