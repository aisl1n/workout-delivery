import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WorkoutClient from "./_components/workout-client";

const WorkoutPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  // Busca dados diretamente no servidor via Prisma
  const workout = await prisma.workout.findUnique({
    where: {
      slug: slug,
    },
    include: {
      items: {
        include: {
          exercise: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  // Se não encontrar, retorna 404
  if (!workout) {
    notFound();
  }

  // Serializa createdAt para string (JSON-safe)
  const workoutData = {
    ...workout,
    createdAt: workout.createdAt.toISOString(),
  };

  return <WorkoutClient workout={workoutData} />;
};

export default WorkoutPage;
