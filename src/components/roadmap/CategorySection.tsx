"use client";

import { ProgressBar } from "./ProgressBar";
import { TopicRow } from "./TopicRow";

interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface Category {
  id: string;
  label: string;
  color: string;
  topics: Topic[];
}

interface CategorySectionProps {
  category: Category;
  completedIds: Set<string>;
  onToggle: (id: string) => void;
}

export function CategorySection({
  category,
  completedIds,
  onToggle,
}: CategorySectionProps) {
  const completedCount = category.topics.filter((t) =>
    completedIds.has(t.id)
  ).length;

  return (
    <section>
      <h2 className="text-xl font-semibold">{category.label}</h2>
      <div className="mt-3 mb-4">
        <ProgressBar completed={completedCount} total={category.topics.length} />
      </div>
      <ol className="space-y-3">
        {category.topics.map((topic) => (
          <TopicRow
            key={topic.id}
            topic={topic}
            completed={completedIds.has(topic.id)}
            onToggle={onToggle}
          />
        ))}
      </ol>
    </section>
  );
}
