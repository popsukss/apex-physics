import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewPostContent } from "@/components/community/NewPostContent";

export const metadata: Metadata = { title: "Ask a Question" };

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return <NewPostContent hasUser={!!user} />;
}
