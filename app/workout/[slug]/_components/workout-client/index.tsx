"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Dumbbell, Loader2 } from "lucide-react";
import {
  WorkoutCompletion,
  WorkoutFloatingStatus,
  WorkoutHeader,
  WorkoutItemCard,
  WorkoutProgress,
} from "../index";
import { Workout, WorkoutClientProps } from "../../types";

const WorkoutClient = ({ slug }: WorkoutClientProps) => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workout/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setWorkout(data);
        }
      } catch (error) {
        console.error("Error fetching workout:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [slug]);

  const toggleComplete = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
        <Card className="mx-4 max-w-md">
          <CardContent className="py-12 text-center">
            <Dumbbell className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-white">
              Treino não encontrado
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Verifique o link e tente novamente
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isComplete = completedItems.size === workout.items.length;

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <div className="mx-auto max-w-3xl px-4 py-8 pb-24">
        <WorkoutHeader title={workout.title} itemCount={workout.items.length} />

        <WorkoutProgress
          completedCount={completedItems.size}
          totalCount={workout.items.length}
        />

        {isComplete && <WorkoutCompletion />}

        <div className="space-y-4">
          {workout.items
            .sort((a, b) => a.order - b.order)
            .map((item, index) => (
              <WorkoutItemCard
                key={item.id}
                item={item}
                index={index}
                isCompleted={completedItems.has(item.id)}
                isExpanded={expandedItems.has(item.id)}
                onToggleComplete={() => toggleComplete(item.id)}
                onToggleExpanded={() => toggleExpanded(item.id)}
              />
            ))}
        </div>
      </div>

      {!isComplete && completedItems.size > 0 && (
        <WorkoutFloatingStatus
          completedCount={completedItems.size}
          totalCount={workout.items.length}
        />
      )}
    </div>
  );
};

export default WorkoutClient;
