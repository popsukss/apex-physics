"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function CommunityHeader() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("community.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("community.subtitle")}</p>
      </div>
      <Link href="/community/new" className={buttonVariants()}>
        {t("community.ask_question")}
      </Link>
    </div>
  );
}
