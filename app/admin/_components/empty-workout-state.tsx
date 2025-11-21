import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Dumbbell, PlusCircle } from "lucide-react";

export const EmptyWorkoutState = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Dumbbell className="mb-4 h-12 w-12 text-zinc-400" />
        <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">
          Nenhum treino criado ainda
        </h3>
        <p className="mb-4 text-center text-zinc-600 dark:text-zinc-400">
          Comece criando seu primeiro treino para seus alunos
        </p>
        <Link href="/admin/workout/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Criar Primeiro Treino
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
