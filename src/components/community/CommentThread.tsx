"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VoteButton } from "./VoteButton";
import { CommentForm } from "./CommentForm";

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

export type CommentWithAuthor = {
  id: string;
  parent_id: string | null;
  content: string;
  is_verified: boolean;
  created_at: string;
  author: { username: string; avatar_url: string | null } | null;
  vote_count: number;
  replies?: CommentWithAuthor[];
};

interface CommentThreadProps {
  comments: CommentWithAuthor[];
  postId: string;
  depth?: number;
}

function buildCommentTree(comments: CommentWithAuthor[]): CommentWithAuthor[] {
  const commentMap = new Map<string, CommentWithAuthor>();

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });

  const roots: CommentWithAuthor[] = [];

  commentMap.forEach((comment) => {
    if (comment.parent_id) {
      const parent = commentMap.get(comment.parent_id);
      if (parent) {
        parent.replies ??= [];
        parent.replies.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

function CommentItem({
  comment,
  postId,
  depth = 0,
}: {
  comment: CommentWithAuthor;
  postId: string;
  depth?: number;
}) {
  const router = useRouter();
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleCommentSuccess = () => {
    setShowReplyForm(false);
    router.refresh();
  };

  return (
    <div
      className={cn(
        "mt-4 space-y-3",
        depth > 0 && "ml-4 border-l border-border pl-4"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {comment.author?.username || "Anonymous"}
            </span>
            {comment.is_verified && (
              <BadgeCheck className="size-3.5 shrink-0 fill-green-500 text-green-500" />
            )}
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>

          <p className="mt-2 text-sm text-foreground">{comment.content}</p>

          <div className="mt-3 flex items-center gap-2">
            <VoteButton
              targetId={comment.id}
              targetType="comment"
              initialCount={comment.vote_count}
              initialUserVote={0}
            />
            {depth < 3 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="gap-1.5"
              >
                <Reply className="size-3.5" />
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && depth < 3 && (
        <div className="mt-3">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onSuccess={handleCommentSuccess}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({
  comments,
  postId,
  depth = 0,
}: CommentThreadProps) {
  const commentTree = depth === 0 ? buildCommentTree(comments) : comments;

  if (commentTree.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {commentTree.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          depth={depth}
        />
      ))}
    </div>
  );
}
