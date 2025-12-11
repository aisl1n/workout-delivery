import { prisma } from "@/lib/prisma";
import { Dumbbell, Calendar } from "lucide-react";
import { WorkoutCard } from "./_components/workout-card";
import { StatsCard } from "./_components/stats-card";
import { EmptyWorkoutState } from "./_components/empty-workout-state";
import { CreateWorkoutButton } from "./_components/create-workout-button";

// Força revalidação a cada requisição (dynamic rendering)
export const dynamic = "force-dynamic";

// Alternativa: revalidate a cada X segundos
// export const revalidate = 0; // ou 10, 30, 60...

const AdminDashboard = async () => {
  // TODO: Adicionar autenticação e pegar o personalId do usuário logado
  // Por enquanto, busca ou cria um personal padrão
  let personal = await prisma.personal.findFirst();

  if (!personal) {
    personal = await prisma.personal.create({
      data: {
        email: "personal@exemplo.com",
        name: "Personal Trainer",
      },
    });
  }

  const workouts = await prisma.workout.findMany({
    where: {
      personalId: personal.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      items: {
        include: {
          exercise: true,
        },
      },
    },
  });

  const workoutsThisMonth = workouts.filter(
    (w) => new Date(w.createdAt).getMonth() === new Date().getMonth(),
  ).length;

  const averageExercises =
    workouts.length > 0
      ? Math.round(
          workouts.reduce((acc, w) => acc + w.items.length, 0) /
            workouts.length,
        )
      : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 px-4 dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-6xl py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Gerencie seus treinos e alunos
            </p>
          </div>
          <CreateWorkoutButton />
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatsCard
            title="Total de Treinos"
            value={workouts.length}
            icon={Dumbbell}
          />
          <StatsCard
            title="Este Mês"
            value={workoutsThisMonth}
            icon={Calendar}
          />
          <StatsCard
            title="Média de Exercícios"
            value={averageExercises}
            icon={Dumbbell}
          />
        </div>

        {/* Workouts List */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-white">
            Treinos Recentes
          </h2>

          {workouts.length === 0 ? (
            <EmptyWorkoutState />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {workouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
