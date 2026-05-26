import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { PostList } from "@/components/community/PostList";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Community",
  description: "Physics Q&A discussion forum — ask questions, vote on answers.",
};

export default async function CommunityPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      category,
      is_pinned,
      is_verified,
      created_at,
      author:profiles(username, avatar_url),
      votes!inner(count),
      comments!inner(count)
    `
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  type PostRow = {
    id: string;
    title: string;
    content: string;
    category: string | null;
    is_pinned: boolean;
    is_verified: boolean;
    created_at: string;
    author: { username: string; avatar_url: string | null } | null;
    votes: Array<{ count: number }>;
    comments: Array<{ count: number }>;
  };

  const transformedPosts: Array<{
    id: string;
    title: string;
    content: string;
    category: string | null;
    is_pinned: boolean;
    is_verified: boolean;
    created_at: string;
    author: { username: string; avatar_url: string | null } | null;
    vote_count: number;
    comment_count: number;
  }> = [];

  if (posts && !error) {
    posts.forEach((post: PostRow) => {
      transformedPosts.push({
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        is_pinned: post.is_pinned,
        is_verified: post.is_verified,
        created_at: post.created_at,
        author: post.author,
        vote_count: Array.isArray(post.votes) ? post.votes[0]?.count ?? 0 : 0,
        comment_count: Array.isArray(post.comments) ? post.comments[0]?.count ?? 0 : 0,
      });
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Q&A</h1>
          <p className="mt-1 text-muted-foreground">Ask, answer, and learn together.</p>
        </div>
        <Link href="/community/new" className={buttonVariants()}>
          Ask a Question
        </Link>
      </div>
      <PostList posts={transformedPosts} />
    </div>
  );
}
