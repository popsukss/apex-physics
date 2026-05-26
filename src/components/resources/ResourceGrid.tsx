"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/data/resources";

interface ResourceGridProps {
  resources: Resource[];
}

const categories = [
  { label: "All", value: "all" },
  { label: "Mechanics", value: "mechanics" },
  { label: "Thermodynamics", value: "thermodynamics" },
  { label: "Electromagnetism", value: "electromagnetism" },
  { label: "Optics", value: "optics" },
  { label: "Modern Physics", value: "modern-physics" },
  { label: "General", value: "general" },
];

const types = [
  { label: "All", value: "all" },
  { label: "PDF", value: "pdf" },
  { label: "Link", value: "link" },
  { label: "Video", value: "video" },
];

export function ResourceGrid({ resources }: ResourceGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered = resources.filter((resource) => {
    const matchCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchType = selectedType === "all" || resource.type === selectedType;
    return matchCategory && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Type</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="rounded-full"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">No resources found for your selection.</p>
        </div>
      )}
    </div>
  );
}
