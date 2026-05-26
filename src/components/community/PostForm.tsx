"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n";

const CATEGORY_KEYS = [
  { value: "", key: "community.post_form.category_select" },
  { value: "mechanics", key: "community.categories.mechanics" },
  { value: "thermodynamics", key: "community.categories.thermodynamics" },
  { value: "electromagnetism", key: "community.categories.electromagnetism" },
  { value: "optics", key: "community.categories.optics" },
  { value: "modern-physics", key: "community.categories.modern_physics" },
  { value: "other", key: "community.categories.other" },
];

interface ValidationErrors {
  title?: string;
  content?: string;
  submit?: string;
}

export function PostForm() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) {
      newErrors.title = t("community.post_form.error_title_required");
    } else if (title.length > 200) {
      newErrors.title = t("community.post_form.error_title_too_long");
    }

    if (!content.trim()) {
      newErrors.content = t("community.post_form.error_content_required");
    } else if (content.length < 20) {
      newErrors.content = t("community.post_form.error_content_too_short");
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
        setErrors({ submit: t("community.post_form.error_sign_in") });
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
        err instanceof Error ? err.message : t("community.post_form.error_sign_in");
      setErrors({ submit: message });
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          {t("community.post_form.title_label")}
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("community.post_form.title_placeholder")}
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
          {t("community.post_form.category_label")}
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={submitting}
          className={cn(
            "w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-offset-1",
            "border-input bg-background",
            "focus:border-primary/50 focus:ring-primary/20",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {CATEGORY_KEYS.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {t(cat.key)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          {t("community.post_form.content_label")}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("community.post_form.content_placeholder")}
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

      <Button type="submit" disabled={submitting} className="w-full gap-2">
        <Send className="size-4" />
        {submitting
          ? t("community.post_form.submitting")
          : t("community.post_form.submit")}
      </Button>
    </form>
  );
}
