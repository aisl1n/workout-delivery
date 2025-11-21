import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, items } = body;

    // TODO: Pegar o personalId do usuário autenticado
    const personalId = "temp-personal-id";

    // Criar ou buscar o Personal (temporário até ter autenticação)
    let personal = await prisma.personal.findUnique({
      where: { id: personalId },
    });

    if (!personal) {
      personal = await prisma.personal.create({
        data: {
          id: personalId,
          email: "temp@example.com",
          name: "Personal Temporário",
        },
      });
    }

    // Gerar slug único
    const slug = nanoid(10);

    // Criar o treino com os itens
    const workout = await prisma.workout.create({
      data: {
        title,
        slug,
        personalId: personal.id,
        items: {
          create: items.map(
            (item: {
              exerciseId: string;
              sets: string;
              reps: string;
              order: number;
            }) => ({
              exerciseId: item.exerciseId,
              sets: item.sets,
              reps: item.reps,
              order: item.order,
            }),
          ),
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

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Error creating workout:", error);
    return NextResponse.json(
      { error: "Failed to create workout" },
      { status: 500 },
    );
  }
}
