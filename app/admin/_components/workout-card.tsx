"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";

interface WorkoutCardProps {
  workout: {
    id: string;
    title: string;
    slug: string;
    createdAt: Date;
    items: {
      id: string;
      exercise: {
        name: string;
      };
    }[];
  };
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{workout.title}</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">
              {new Date(workout.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Link
            href={`/workout/${workout.slug}`}
            target="_blank"
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Exercícios</span>
            <span className="font-semibold">{workout.items.length}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {workout.items.slice(0, 3).map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {item.exercise.name}
              </span>
            ))}
            {workout.items.length > 3 && (
              <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                +{workout.items.length - 3}
              </span>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                const url = `${window.location.origin}/workout/${workout.slug}`;
                navigator.clipboard.writeText(url);
                alert("Link copiado!");
              }}
            >
              Copiar Link
            </Button>
            <Link href={`/workout/${workout.slug}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                Visualizar
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
