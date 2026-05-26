import { notFound } from "next/navigation";
import { Pin, BadgeCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { VoteButton } from "@/components/community/VoteButton";
import { CommentThread, type CommentWithAuthor } from "@/components/community/CommentThread";
import { CommentForm } from "@/components/community/CommentForm";
import { BackToDiscussions, CommentsHeading, PostMeta } from "@/components/community/PostDetailWidgets";

export const metadata = { title: "Discussion" };

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = await createClient();

  type RawPost = {
    id: string;
    title: string;
    content: string;
    category: string | null;
    is_pinned: boolean;
    is_verified: boolean;
    created_at: string;
    author: { username: string; avatar_url: string | null } | null;
  };

  const { data: postData, error: postError } = await supabase
    .from("posts")
    .select("*, author:profiles(username, avatar_url)")
    .eq("id", postId)
    .single();

  const post = postData as unknown as RawPost | null;

  if (postError || !post) {
    notFound();
  }

  const { data: commentsData } = await supabase
    .from("comments")
    .select(
      `
      id,
      parent_id,
      content,
      is_verified,
      created_at,
      author:profiles(username, avatar_url),
      vote_count:votes(count)
    `
    )
    .eq("post_id", postId)
    .order("created_at");

  const { data: postVotesData } = await supabase
    .from("votes")
    .select("count")
    .eq("target_id", postId)
    .eq("target_type", "post");

  type RawComment = {
    id: string;
    parent_id: string | null;
    content: string;
    is_verified: boolean;
    created_at: string;
    author: { username: string; avatar_url: string | null } | null;
    vote_count: { count: number }[];
  };

  type RawVote = {
    count: number;
  };

  const comments: CommentWithAuthor[] = (
    (commentsData as unknown as RawComment[] | null) || []
  ).map((c) => ({
    id: c.id,
    parent_id: c.parent_id,
    content: c.content,
    is_verified: c.is_verified,
    created_at: c.created_at,
    author: c.author,
    vote_count: Array.isArray(c.vote_count) && c.vote_count[0]
      ? c.vote_count[0].count || 0
      : 0,
  }));

  const postVotesTyped = (postVotesData as unknown as RawVote[] | null) || [];
  const postVoteCount = postVotesTyped[0] ? postVotesTyped[0].count || 0 : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <BackToDiscussions />

      <article className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{post.title}</h1>
              {post.is_pinned && (
                <Pin className="size-5 shrink-0 fill-yellow-500 text-yellow-500" />
              )}
              {post.is_verified && (
                <BadgeCheck className="size-5 shrink-0 fill-green-500 text-green-500" />
              )}
            </div>

            <PostMeta author={post.author} createdAt={post.created_at} />

            {post.category && (
              <div className="mt-3">
                <span className="inline-block rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {post.category}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <p className="whitespace-pre-wrap text-sm text-foreground">
            {post.content}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
          <VoteButton
            targetId={postId}
            targetType="post"
            initialCount={postVoteCount}
            initialUserVote={0}
          />
        </div>
      </article>

      <section className="mt-8">
        <CommentsHeading count={comments.length} />

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-4">
            <CommentForm postId={postId} />
          </div>

          <CommentThread comments={comments} postId={postId} />
        </div>
      </section>
    </div>
  );
}
