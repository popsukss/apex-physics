"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setSubmitting(true);

    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        setError("Sign in to comment");
        setSubmitting(false);
        return;
      }

      const commentData = {
        post_id: postId,
        parent_id: parentId ?? null,
        author_id: authData.user.id,
        content: content.trim(),
      };

      const { error: insertError } = await (
        supabase
          .from("comments")
          .insert([commentData as never])
      );

      if (insertError) {
        setError(insertError.message);
        setSubmitting(false);
        return;
      }

      setContent("");
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to post comment";
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        rows={parentId ? 3 : 4}
        disabled={submitting}
        className={cn(
          "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1 resize-none",
          "border-input bg-background",
          "placeholder:text-muted-foreground",
          "focus:border-primary/50 focus:ring-primary/20",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setContent("")}
          disabled={submitting || !content.trim()}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
          <Send className="size-4" />
          {submitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}
