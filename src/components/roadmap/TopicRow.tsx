"use client";

import { cn } from "@/lib/utils";

interface Topic {
  id: string;
  title: string;
  description: string;
  order: number;
}

interface TopicRowProps {
  topic: Topic;
  completed: boolean;
  onToggle: (id: string) => void;
}

export function TopicRow({ topic, completed, onToggle }: TopicRowProps) {
  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 bg-card transition-colors",
        completed && "bg-muted/30"
      )}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(topic.id)}
        className="mt-1 flex-shrink-0 w-5 h-5 rounded cursor-pointer accent-primary"
      />
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-semibold flex items-center justify-center">
        {topic.order}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium transition-all",
            completed && "line-through text-muted-foreground"
          )}
        >
          {topic.title}
        </p>
        <p className="text-sm text-muted-foreground">{topic.description}</p>
      </div>
    </li>
  );
}
