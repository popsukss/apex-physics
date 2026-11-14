-- RLS decides which rows a user may write; it cannot stop them writing a column.
-- Without column grants, a user could set profiles.is_admin on their own row,
-- or is_pinned / is_verified on their own posts and comments.
-- Users now write only content columns. Privileged flags are set by the
-- service role (dashboard / server), which bypasses these grants.

revoke insert, update on public.profiles from anon, authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;

revoke insert, update on public.posts from anon, authenticated;
grant insert (author_id, title, content, category) on public.posts to authenticated;
grant update (title, content, category) on public.posts to authenticated;

revoke insert, update on public.comments from anon, authenticated;
grant insert (post_id, parent_id, author_id, content) on public.comments to authenticated;
grant update (content) on public.comments to authenticated;

-- security definer functions must not resolve names through a caller-controlled search_path.
alter function public.handle_new_user() set search_path = '';
