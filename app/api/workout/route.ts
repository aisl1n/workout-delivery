import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

/**
 * POST /api/workout
 * Cria um novo treino e retorna o slug gerado
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, items } = body as {
      title: string;
      items: Array<{
        exerciseId: string;
        sets: string;
        reps: string;
      }>;
    };

    // Validação básica
    if (!title || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Título e itens são obrigatórios" },
        { status: 400 },
      );
    }

    // Gera slug único
    const slug = nanoid(10);

    // TODO: Adicionar personalId quando tiver autenticação
    // Por enquanto, busca o primeiro personal do banco
    const personal = await prisma.personal.findFirst();

    if (!personal) {
      return NextResponse.json(
        { error: "Nenhum personal encontrado. Execute o seed primeiro." },
        { status: 400 },
      );
    }

    // Cria o treino com seus itens
    const workout = await prisma.workout.create({
      data: {
        title,
        slug,
        personalId: personal.id,
        items: {
          create: items.map((item, index: number) => ({
            exerciseId: item.exerciseId,
            sets: item.sets,
            reps: item.reps,
            order: index,
          })),
        },
      },
      include: {
        items: {
          include: {
            exercise: true,
          },
        },
      },
    });

    // Revalida o cache da página admin para mostrar o novo treino
    revalidatePath("/admin");

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Erro ao criar treino" },
      { status: 500 },
    );
  }
}
