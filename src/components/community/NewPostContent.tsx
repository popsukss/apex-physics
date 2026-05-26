"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { PostForm } from "./PostForm";

export function NewPostContent({ hasUser }: { hasUser: boolean }) {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">{t("community.new_title")}</h1>
      {!hasUser ? (
        <div className="mt-6 rounded-lg border border-input bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            {t("community.sign_in_prompt")}
          </p>
          <Link
            href="/community"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {t("community.back_to_community")}
          </Link>
        </div>
      ) : (
        <PostForm />
      )}
    </div>
  );
}
