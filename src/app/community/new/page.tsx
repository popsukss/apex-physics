import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/components/community/PostForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Ask a Question" };

export default async function NewPostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold tracking-tight">Ask a Question</h1>

      {!user ? (
        <div className="mt-6 rounded-lg border border-input bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to share your physics questions with the community.
          </p>
          <Link
            href="/community"
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Back to Community
          </Link>
        </div>
      ) : (
        <PostForm />
      )}
    </div>
  );
}
