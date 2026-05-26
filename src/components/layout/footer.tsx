"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} Popsuk (Pop) Sumetchoengprachya</span>
        <nav className="flex gap-4">
          <Link href="/roadmap" className="hover:text-foreground transition-colors">{t("nav.roadmap")}</Link>
          <Link href="/community" className="hover:text-foreground transition-colors">{t("nav.community")}</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">{t("nav.about")}</Link>
        </nav>
      </div>
    </footer>
  );
}
