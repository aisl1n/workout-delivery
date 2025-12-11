"use client";

import { useState } from "react";
import {
  WorkoutCompletion,
  WorkoutFloatingStatus,
  WorkoutHeader,
  WorkoutItemCard,
  WorkoutProgress,
} from "../index";
import { WorkoutClientProps } from "../../types";

const WorkoutClient = ({ workout }: WorkoutClientProps) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

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
