"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { getYouTubeEmbedUrl } from "@/utils";
import {
  BicepsFlexed,
  ChevronDown,
  ChevronUp,
  Loader2,
  Repeat,
} from "lucide-react";
import { WorkoutItemCardProps } from "./types";

export const WorkoutItemCard = ({
  item,
  index,
  isCompleted,
  isExpanded,
  onToggleComplete,
  onToggleExpanded,
}: WorkoutItemCardProps) => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [prevExpanded, setPrevExpanded] = useState(isExpanded);

  if (isExpanded !== prevExpanded) {
    setPrevExpanded(isExpanded);
    if (!isExpanded) {
      setIsVideoLoading(true);
    }
  }

  const embedUrl = item.exercise.videoUrl
    ? getYouTubeEmbedUrl(item.exercise.videoUrl)
    : null;

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isCompleted
          ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20"
          : "hover:shadow-lg"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-4 px-4 pb-4">
          <div className="pt-1">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={onToggleComplete}
              className="h-6 w-6"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-col items-start gap-2">
                  <span className="text-sm font-medium text-zinc-500">
                    #{index + 1}
                  </span>
                  <h3
                    className={`text-lg font-semibold ${
                      isCompleted
                        ? "text-green-700 line-through dark:text-green-400"
                        : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    {item.exercise.name}
                  </h3>
                </div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.exercise.muscleGroup}
                </p>
                {(item.sets || item.reps) && (
                  <div className="mt-2 flex gap-2 text-sm">
                    {item.sets && (
                      <span className="bg-primary/15 text-primary flex h-10 w-full items-center justify-center gap-1 rounded-full font-medium">
                        <BicepsFlexed className="size-4" /> {item.sets} séries
                      </span>
                    )}
                    {item.reps && (
                      <span className="bg-primary/15 text-primary flex h-10 w-full items-center justify-center gap-1 rounded-full font-medium">
                        <Repeat className="size-4" /> {item.reps} rép
                      </span>
                    )}
                  </div>
                )}
              </div>

              {embedUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleExpanded}
                  className="gap-2"
                >
                  {isExpanded ? (
                    <>
                      Fechar vídeo
                      <ChevronUp className="size-4" />
                    </>
                  ) : (
                    <>
                      Ver vídeo
                      <ChevronDown className="size-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {embedUrl && isExpanded && (
          <div className="relative -mb-6 border-t border-zinc-200 dark:border-zinc-800">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            )}
            <iframe
              src={embedUrl}
              className="aspect-video w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsVideoLoading(false)}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
