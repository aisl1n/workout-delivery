import { Card, CardContent } from "@/app/_components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface WorkoutFloatingStatusProps {
  completedCount: number;
  totalCount: number;
}

export const WorkoutFloatingStatus = ({
  completedCount,
  totalCount,
}: WorkoutFloatingStatusProps) => {
  return (
    <div className="sticky right-0 bottom-6 left-0 flex justify-center px-4">
      <Card className="shadow-2xl">
        <CardContent className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="font-medium text-zinc-900 dark:text-white">
            {completedCount} de {totalCount} completos
          </span>
        </CardContent>
      </Card>
    </div>
  );
};
