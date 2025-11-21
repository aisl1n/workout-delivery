import { Card, CardContent } from "@/app/_components/ui/card";
import { Trophy } from "lucide-react";

export const WorkoutCompletion = () => {
  return (
    <Card className="mb-6 border-green-200 bg-linear-to-r from-green-50 to-emerald-50 dark:border-green-900 dark:from-green-950 dark:to-emerald-950">
      <CardContent className="py-8 text-center">
        <Trophy className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" />
        <h2 className="mb-2 text-2xl font-bold text-green-900 dark:text-green-100">
          Parabéns! 🎉
        </h2>
        <p className="text-green-700 dark:text-green-300">
          Você completou todos os exercícios do treino!
        </p>
      </CardContent>
    </Card>
  );
};
