"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, useRelativeTime } from "@/lib/i18n";

export function BackToDiscussions() {
  const { t } = useLanguage();
  return (
    <Link href="/community">
      <Button variant="ghost" size="sm" className="mb-6 gap-2">
        <ArrowLeft className="size-4" />
        {t("community.back_to_discussions")}
      </Button>
    </Link>
  );
}

export function CommentsHeading({ count }: { count: number }) {
  const { t } = useLanguage();
  return (
    <h2 className="mb-4 text-lg font-semibold text-foreground">
      {t("community.comments")} ({count})
    </h2>
  );
}

export function PostMeta({
  author,
  createdAt,
}: {
  author: { username: string } | null;
  createdAt: string;
}) {
  const formatRelativeTime = useRelativeTime();
  if (!author) return null;
  return (
    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">{author.username}</span>
      <span>•</span>
      <span>{formatRelativeTime(createdAt)}</span>
    </div>
  );
}
