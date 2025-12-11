"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Label } from "@/app/_components/ui/label";
import {
  Search,
  Plus,
  Trash2,
  GripVertical,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import type { Exercise } from "@/lib/generated/prisma/client";

interface WorkoutItem {
  exercise: Exercise;
  sets: string;
  reps: string;
  order: number;
}

const NewWorkoutPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [workoutItems, setWorkoutItems] = useState<WorkoutItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const searchExercises = async (query: string) => {
    if (!query.trim()) {
      setExercises([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/exercises/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setExercises(data);
    } catch (error) {
      console.error("Error searching exercises:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addExercise = (exercise: Exercise) => {
    const newItem: WorkoutItem = {
      exercise,
      sets: "3",
      reps: "10-12",
      order: workoutItems.length,
    };
    setWorkoutItems([...workoutItems, newItem]);
    setSearchQuery("");
    setExercises([]);
  };

  const removeExercise = (index: number) => {
    setWorkoutItems(workoutItems.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: "sets" | "reps", value: string) => {
    const updated = [...workoutItems];
    updated[index][field] = value;
    setWorkoutItems(updated);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === workoutItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...workoutItems];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    updated[index].order = index;
    updated[newIndex].order = newIndex;
    setWorkoutItems(updated);
  };

  const saveWorkout = async () => {
    if (!title.trim() || workoutItems.length === 0) {
      alert("Adicione um título e pelo menos um exercício");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/workout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          items: workoutItems.map((item, index) => ({
            exerciseId: item.exercise.id,
            sets: item.sets,
            reps: item.reps,
            order: index,
          })),
        }),
      });

      if (response.ok) {
        const workout = await response.json();
        router.push(`/workout/${workout.slug}`);
      } else {
        alert("Erro ao salvar treino");
      }
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Erro ao salvar treino");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 px-4 font-sans dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white">
            Novo Treino
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Monte um treino personalizado para seu aluno
          </p>
        </div>

        {/* Workout Title */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Informações do Treino</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="title">Título do Treino</Label>
              <Input
                id="title"
                placeholder="Ex: Treino A - Peito e Tríceps"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Exercise Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Adicionar Exercícios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute top-3 left-3 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Buscar exercício (ex: Supino, Agachamento...)"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchExercises(e.target.value);
                }}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {isSearching && (
              <div className="mt-4 flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            )}

            {exercises.length > 0 && (
              <div className="mt-4 space-y-2">
                {exercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-200 p-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                  >
                    <div>
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {exercise.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {exercise.muscleGroup}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addExercise(exercise)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Workout Items */}
        <Card>
          <CardHeader>
            <CardTitle>Exercícios do Treino ({workoutItems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {workoutItems.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-zinc-500">
                  Nenhum exercício adicionado ainda
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  Use a busca acima para adicionar exercícios
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {workoutItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    {/* Drag Handle */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === workoutItems.length - 1}
                        className="text-zinc-400 hover:text-zinc-600 disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Exercise Info */}
                    <div className="flex-1">
                      <p className="font-medium text-zinc-900 dark:text-white">
                        {item.exercise.name}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {item.exercise.muscleGroup}
                      </p>
                    </div>

                    {/* Sets and Reps */}
                    <div className="flex gap-2">
                      <div className="w-20">
                        <Input
                          placeholder="Séries"
                          value={item.sets}
                          onChange={(e) =>
                            updateItem(index, "sets", e.target.value)
                          }
                          className="text-center"
                        />
                      </div>
                      <div className="w-24">
                        <Input
                          placeholder="Reps"
                          value={item.reps}
                          onChange={(e) =>
                            updateItem(index, "reps", e.target.value)
                          }
                          className="text-center"
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(index)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Save Button */}
            {workoutItems.length > 0 && (
              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={saveWorkout}
                  disabled={isSaving || !title.trim()}
                  className="flex-1 gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Gerar Link do Treino"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewWorkoutPage;
