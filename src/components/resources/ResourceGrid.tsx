"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceCard } from "./ResourceCard";
import type { Resource } from "@/data/resources";
import { useLanguage } from "@/lib/i18n";

interface ResourceGridProps {
  resources: Resource[];
}

const CATEGORY_KEYS = [
  { value: "all", key: "resources.category_labels.all" },
  { value: "mechanics", key: "resources.category_labels.mechanics" },
  { value: "thermodynamics", key: "resources.category_labels.thermodynamics" },
  { value: "electromagnetism", key: "resources.category_labels.electromagnetism" },
  { value: "optics", key: "resources.category_labels.optics" },
  { value: "modern-physics", key: "resources.category_labels.modern_physics" },
  { value: "general", key: "resources.category_labels.general" },
];

const TYPE_KEYS = [
  { value: "all", key: "resources.type_labels.all" },
  { value: "pdf", key: "resources.type_labels.pdf" },
  { value: "link", key: "resources.type_labels.link" },
  { value: "video", key: "resources.type_labels.video" },
];

export function ResourceGrid({ resources }: ResourceGridProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filtered = resources.filter((resource) => {
    const matchCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    const matchType =
      selectedType === "all" || resource.type === selectedType;
    return matchCategory && matchType;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("resources.category_filter")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_KEYS.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat.value)}
              className="rounded-full"
            >
              {t(cat.key)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            {t("resources.type_filter")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_KEYS.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="rounded-full"
            >
              {t(type.key)}
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
          <p className="text-sm text-muted-foreground">{t("resources.no_results")}</p>
        </div>
      )}
    </div>
  );
}
