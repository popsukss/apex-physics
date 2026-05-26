import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { staticResources } from "@/data/resources";
import { ResourceGrid } from "@/components/resources/ResourceGrid";
import type { Resource } from "@/data/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "Physics Olympiad learning resources — PDFs, videos, and links.",
};

export default async function ResourcesPage() {
  let resources: Resource[] = staticResources;

  try {
    const client = await createClient();
    const { data, error } = await client
      .from("resources")
      .select("id, title, description, category, type, url")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      resources = data as Resource[];
    }
  } catch {
    // Fallback to static resources on error
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
      <p className="mt-2 text-muted-foreground">
        Curated materials for Physics Olympiad preparation.
      </p>
      <div className="mt-10">
        <ResourceGrid resources={resources} />
      </div>
    </div>
  );
}
