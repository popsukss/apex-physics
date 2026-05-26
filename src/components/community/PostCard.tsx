import Link from "next/link";
import { Pin, BadgeCheck, ChevronUp, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) return "just now";
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffMonths / 12)}y ago`;
}

export type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    category: string | null;
    is_pinned: boolean;
    is_verified: boolean;
    created_at: string;
    author: { username: string; avatar_url: string | null } | null;
    vote_count: number;
    comment_count: number;
  };
};

export function PostCard({ post }: PostCardProps) {
  const contentPreview = post.content.length > 100 ? post.content.slice(0, 100) + "..." : post.content;

  return (
    <Link href={`/community/${post.id}`}>
      <div className="group rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary">{post.title}</h3>
              {post.is_pinned && (
                <Pin className="h-4 w-4 shrink-0 fill-yellow-500 text-yellow-500" />
              )}
              {post.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 fill-green-500 text-green-500" />
              )}
            </div>

            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              {post.author && (
                <>
                  <span>{post.author.username}</span>
                  <span>•</span>
                  <span>{formatRelativeTime(post.created_at)}</span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{contentPreview}</p>

            <div className="mt-3 flex items-center gap-4">
              {post.category && (
                <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {post.category}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ChevronUp className="h-4 w-4" />
            <span>{post.vote_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.comment_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
