"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        {t("home.title")}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted-foreground">
        {t("home.subtitle")}
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/roadmap" className={buttonVariants({ size: "lg" })}>
          {t("home.cta_roadmap")}
        </Link>
        <Link href="/community" className={buttonVariants({ variant: "outline", size: "lg" })}>
          {t("home.cta_community")}
        </Link>
      </div>
    </div>
  );
}
