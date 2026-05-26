"use client";

import { useLanguage } from "@/lib/i18n";

export function PageHeader({
  titleKey,
  descKey,
}: {
  titleKey: string;
  descKey: string;
}) {
  const { t } = useLanguage();
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">{t(titleKey)}</h1>
      <p className="mt-2 text-muted-foreground">{t(descKey)}</p>
    </>
  );
}
