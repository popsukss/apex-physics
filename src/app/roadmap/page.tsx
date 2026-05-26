"use client";

import { useEffect, useState } from "react";
import roadmapData from "@/data/roadmap.json";
import { CategorySection } from "@/components/roadmap/CategorySection";
import { ProgressBar } from "@/components/roadmap/ProgressBar";

export default function RoadmapPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("apex-completed-topics");
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        setCompletedIds(new Set(ids));
      } catch {
        setCompletedIds(new Set());
      }
    }
    setMounted(true);
  }, []);

  const handleToggle = (id: string) => {
    setCompletedIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      localStorage.setItem(
        "apex-completed-topics",
        JSON.stringify(Array.from(updated))
      );
      return updated;
    });
  };

  if (!mounted) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight">TPhO Roadmap</h1>
        <p className="mt-2 text-muted-foreground">
          Work through these topics in order. Check off each one as you complete
          it.
        </p>
      </div>
    );
  }

  const allTopics = roadmapData.categories.flatMap((cat) => cat.topics);
  const totalCompleted = completedIds.size;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">TPhO Roadmap</h1>
      <p className="mt-2 text-muted-foreground">
        Work through these topics in order. Check off each one as you complete
        it.
      </p>

      <div className="mt-8 p-6 rounded-lg border bg-card">
        <p className="text-sm font-medium mb-2">Overall Progress</p>
        <ProgressBar completed={totalCompleted} total={allTopics.length} />
      </div>

      <div className="mt-10 space-y-10">
        {roadmapData.categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            completedIds={completedIds}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}
