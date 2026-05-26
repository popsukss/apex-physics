"use client";

import { useState, useMemo } from "react";
import { PostCard, type PostCardProps } from "./PostCard";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Mechanics",
  "Thermodynamics",
  "Electromagnetism",
  "Optics",
  "Modern Physics",
  "Other",
] as const;

type SortOption = "latest" | "top-voted";

interface PostListProps {
  posts: PostCardProps["post"][];
}

export function PostList({ posts }: PostListProps) {
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    if (selectedCategory !== "All") {
      filtered = posts.filter((post) => post.category === selectedCategory);
    }

    const sorted = [...filtered];
    if (sortBy === "top-voted") {
      sorted.sort((a, b) => b.vote_count - a.vote_count);
    } else {
      sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return sorted;
  }, [posts, selectedCategory, sortBy]);

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Category</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Sort</h3>
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
              Latest
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
              Top Voted
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center text-muted-foreground">
            No posts yet. Be the first to ask!
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
