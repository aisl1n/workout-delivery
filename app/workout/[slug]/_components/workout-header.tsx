interface WorkoutHeaderProps {
  title: string;
  itemCount: number;
}

export const WorkoutHeader = ({ title, itemCount }: WorkoutHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-zinc-900 md:text-4xl dark:text-white">
        {title}
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        {itemCount} exercícios
      </p>
    </div>
  );
};
