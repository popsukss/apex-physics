"use client";

import { useState, useMemo } from "react";
import { PostCard, type PostCardProps } from "./PostCard";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

const CATEGORY_KEYS = [
  "all",
  "mechanics",
  "thermodynamics",
  "electromagnetism",
  "optics",
  "modern_physics",
  "other",
] as const;

type CategoryKey = (typeof CATEGORY_KEYS)[number];
type SortOption = "latest" | "top-voted";

const CATEGORY_VALUES: Record<CategoryKey, string | null> = {
  all: null,
  mechanics: "mechanics",
  thermodynamics: "thermodynamics",
  electromagnetism: "electromagnetism",
  optics: "optics",
  modern_physics: "modern-physics",
  other: "other",
};

interface PostListProps {
  posts: PostCardProps["post"][];
}

export function PostList({ posts }: PostListProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const filteredAndSortedPosts = useMemo(() => {
    const categoryValue = CATEGORY_VALUES[selectedCategory];
    let filtered = categoryValue === null
      ? posts
      : posts.filter((post) => post.category === categoryValue);

    const sorted = [...filtered];
    if (sortBy === "top-voted") {
      sorted.sort((a, b) => b.vote_count - a.vote_count);
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    return sorted;
  }, [posts, selectedCategory, sortBy]);

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {t("community.category_filter")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  selectedCategory === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {t(`community.categories.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">
            {t("community.sort_label")}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy("latest")}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                sortBy === "latest"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t("community.sort_latest")}
            </button>
            <button
              onClick={() => setSortBy("top-voted")}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
                sortBy === "top-voted"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t("community.sort_top_voted")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            {t("community.no_posts")}
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
