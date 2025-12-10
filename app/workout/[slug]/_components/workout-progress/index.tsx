import { WorkoutProgressProps } from "./types";

export const WorkoutProgress = ({
  completedCount,
  totalCount,
}: WorkoutProgressProps) => {
  const progress = (completedCount / totalCount) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Progresso
        </span>
        <span className="text-zinc-600 dark:text-zinc-400">
          {completedCount} / {totalCount}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
