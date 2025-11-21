import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            muscleGroup: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error("Error searching exercises:", error);
    return NextResponse.json(
      { error: "Failed to search exercises" },
      { status: 500 },
    );
  }
}
