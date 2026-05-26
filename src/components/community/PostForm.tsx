"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const CATEGORIES = [
  { value: "", label: "Select a category..." },
  { value: "mechanics", label: "Mechanics" },
  { value: "thermodynamics", label: "Thermodynamics" },
  { value: "electromagnetism", label: "Electromagnetism" },
  { value: "optics", label: "Optics" },
  { value: "modern-physics", label: "Modern Physics" },
  { value: "other", label: "Other" },
];

interface ValidationErrors {
  title?: string;
  content?: string;
  submit?: string;
}

export function PostForm() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    } else if (title.length > 200) {
      newErrors.title = "Title must be 200 characters or less";
    }

    if (!content.trim()) {
      newErrors.content = "Question is required";
    } else if (content.length < 20) {
      newErrors.content = "Question must be at least 20 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const { data: authData } = await supabase.auth.getUser();

      if (!authData.user) {
        setErrors({ submit: "You must be signed in to post" });
        setSubmitting(false);
        return;
      }

      const { error } = await supabase.from("posts").insert([{
        title: title.trim(),
        content: content.trim(),
        category: category || null,
        author_id: authData.user.id,
      }] as any);

      if (error) {
        setErrors({ submit: error.message });
        setSubmitting(false);
        return;
      }

      router.push("/community");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your physics question?"
          maxLength={200}
          disabled={submitting}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1",
            "border-input bg-background",
            "placeholder:text-muted-foreground",
            "focus:border-primary/50 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            errors.title && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
        />
        {errors.title && (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {errors.title}
          </div>
        )}
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {title.length}/200
        </div>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-2">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={submitting}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1",
            "border-input bg-background",
            "placeholder:text-muted-foreground",
            "focus:border-primary/50 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Your Question (Markdown supported)
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Describe your question in detail..."
          rows={8}
          disabled={submitting}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1 resize-none",
            "border-input bg-background",
            "placeholder:text-muted-foreground",
            "focus:border-primary/50 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            errors.content && "border-destructive focus:border-destructive focus:ring-destructive/20"
          )}
        />
        {errors.content && (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {errors.content}
          </div>
        )}
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {content.length} characters (min 20)
        </div>
      </div>

      {errors.submit && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3">
          <AlertCircle className="size-4 mt-0.5 text-destructive flex-shrink-0" />
          <p className="text-sm text-destructive">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full gap-2"
      >
        <Send className="size-4" />
        {submitting ? "Posting..." : "Post Question"}
      </Button>
    </form>
  );
}
