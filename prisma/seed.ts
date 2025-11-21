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

  // Find header row (should be row 16)
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

  for (let i = 0; i < exercisesData.length; i++) {
    const row = exercisesData[i];
    const rowIndex = headerRowIndex + 1 + i; // Actual row index in Excel (0-indexed)

    const name = row[0]; // Column B - Exercise name (index 0 in array)
    const muscleGroup = row[5] || "General"; // Column G - Prime Mover Muscle (index 5 in array)

    if (!name || name === "Exercise") continue; // Skip header or empty rows

    // Extract hyperlink from column C (index 2 in Excel, but we need to calculate it)
    // The array starts from column B, so column C is at Excel column index 2
    const cellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 2 }); // Column C in Excel
    const cell = sheet[cellAddress];
    const videoUrl = cell?.l?.Target || null; // Get hyperlink only

    console.log(`Processing: ${name}`);
    console.log(`  Video URL: ${videoUrl}`);
    console.log(`  Muscle Group: ${muscleGroup}`);

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
