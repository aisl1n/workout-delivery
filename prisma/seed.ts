import "dotenv/config";
import { PrismaClient } from "@/lib/generated/prisma/client";
import * as XLSX from "xlsx";
import * as path from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const filePath = path.resolve(__dirname, "../exercices-data.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

  // Find header row
  const headerRowIndex = data.findIndex(
    (row) =>
      row &&
      row.some(
        (cell) =>
          typeof cell === "string" &&
          (cell.includes("Exercise") || cell.includes("Name")),
      ),
  );

  if (headerRowIndex === -1) {
    throw new Error("Could not find header row in Excel file");
  }

  // Get the next 15 rows
  const exercisesData = data.slice(headerRowIndex + 1, headerRowIndex + 16);

  console.log(`Found ${exercisesData.length} exercises to seed.`);

  for (const row of exercisesData) {
    const name = row[0];
    const videoUrl = row[1];
    const muscleGroup = row[4] || "General"; // Default if missing

    if (!name) continue;

    await prisma.exercise.create({
      data: {
        name,
        videoUrl,
        muscleGroup,
      },
    });
  }

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
