"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/app/_components/ui/button";
import { PlusCircle } from "lucide-react";

export const CreateWorkoutButton = () => {
  const [isFixed, setIsFixed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFixed(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: "-20px 0px 0px 0px",
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} className="h-px w-full bg-transparent" />
      <Link
        href="/admin/workout/new"
        className={`z-50 transition-all duration-300 ${
          isFixed ? "fixed right-6 bottom-6 mb-12" : ""
        }`}
      >
        <Button
          size="lg"
          className={`gap-2 transition-all duration-300 ${
            isFixed
              ? "inset-shadow-md text-base font-semibold shadow-md shadow-black/50"
              : ""
          }`}
        >
          <PlusCircle
            className={`transition-all ${isFixed ? "size-6" : "h-5 w-5"}`}
          />
          {isFixed ? "Criar Treino" : "Novo Treino"}
        </Button>
      </Link>
    </>
  );
};
