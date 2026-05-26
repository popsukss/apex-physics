-- Apex Physics — Supabase Schema
-- Run in Supabase SQL editor (Dashboard > SQL Editor)

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Auto-created on user signup via trigger; mirrors auth.users
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  username    text unique not null,
  avatar_url  text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── Resources ───────────────────────────────────────────────────────────────
create table public.resources (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text,
  category    text not null,         -- e.g. 'mechanics', 'electromagnetism'
  type        text not null          -- 'pdf' | 'link' | 'video'
              check (type in ('pdf', 'link', 'video')),
  url         text not null,
  created_at  timestamptz not null default now()
);

-- ─── Roadmap Topics ───────────────────────────────────────────────────────────
create table public.roadmap_topics (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  description  text,
  category     text not null,        -- e.g. 'mechanics'
  order_index  integer not null,     -- display order within category
  created_at   timestamptz not null default now()
);

-- Many-to-many: topics ↔ resources
create table public.topic_resources (
  topic_id    uuid references public.roadmap_topics(id) on delete cascade,
  resource_id uuid references public.resources(id) on delete cascade,
  primary key (topic_id, resource_id)
);

-- User progress on roadmap topics (requires auth)
create table public.topic_completions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id) on delete cascade not null,
  topic_id     uuid references public.roadmap_topics(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

-- ─── Posts (QnA) ──────────────────────────────────────────────────────────────
create table public.posts (
  id          uuid primary key default uuid_generate_v4(),
  author_id   uuid references public.profiles(id) on delete set null,
  title       text not null,
  content     text not null,         -- Markdown
  category    text,                  -- optional topic tag
  is_pinned   boolean not null default false,
  is_verified boolean not null default false,  -- admin-verified answer exists
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at
  before update on public.posts
  for each row execute procedure public.set_updated_at();

-- ─── Comments ─────────────────────────────────────────────────────────────────
create table public.comments (
  id          uuid primary key default uuid_generate_v4(),
  post_id     uuid references public.posts(id) on delete cascade not null,
  parent_id   uuid references public.comments(id) on delete cascade,  -- null = top-level
  author_id   uuid references public.profiles(id) on delete set null,
  content     text not null,         -- Markdown
  is_verified boolean not null default false,  -- admin-marked as correct answer
  created_at  timestamptz not null default now()
);

-- ─── Votes ────────────────────────────────────────────────────────────────────
-- Unified votes table — covers both posts and comments
create table public.votes (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  target_id   uuid not null,         -- post_id or comment_id
  target_type text not null check (target_type in ('post', 'comment')),
  value       smallint not null default 1 check (value in (1, -1)),  -- upvote/downvote
  created_at  timestamptz not null default now(),
  unique (user_id, target_id, target_type)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index on public.posts (created_at desc);
create index on public.posts (category);
create index on public.comments (post_id, created_at);
create index on public.comments (parent_id);
create index on public.votes (target_id, target_type);
create index on public.topic_completions (user_id);
create index on public.roadmap_topics (category, order_index);

-- ─── Row Level Security ───────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.roadmap_topics enable row level security;
alter table public.topic_resources enable row level security;
alter table public.topic_completions enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;

-- Profiles: public read, own write
create policy "profiles_public_read"   on public.profiles for select using (true);
create policy "profiles_own_update"    on public.profiles for update using (auth.uid() = id);

-- Resources + roadmap: public read, admin write
create policy "resources_public_read"  on public.resources for select using (true);
create policy "resources_admin_write"  on public.resources for all
  using ((select is_admin from public.profiles where id = auth.uid()));

create policy "roadmap_public_read"    on public.roadmap_topics for select using (true);
create policy "roadmap_admin_write"    on public.roadmap_topics for all
  using ((select is_admin from public.profiles where id = auth.uid()));

create policy "topic_resources_public" on public.topic_resources for select using (true);

-- Topic completions: own rows only
create policy "completions_own_read"   on public.topic_completions for select using (auth.uid() = user_id);
create policy "completions_own_write"  on public.topic_completions for insert with check (auth.uid() = user_id);
create policy "completions_own_delete" on public.topic_completions for delete using (auth.uid() = user_id);

-- Posts: public read, auth insert, own update/delete, admin all
create policy "posts_public_read"      on public.posts for select using (true);
create policy "posts_auth_insert"      on public.posts for insert with check (auth.uid() = author_id);
create policy "posts_own_update"       on public.posts for update
  using (auth.uid() = author_id or (select is_admin from public.profiles where id = auth.uid()));
create policy "posts_own_delete"       on public.posts for delete
  using (auth.uid() = author_id or (select is_admin from public.profiles where id = auth.uid()));

-- Comments: same pattern as posts
create policy "comments_public_read"   on public.comments for select using (true);
create policy "comments_auth_insert"   on public.comments for insert with check (auth.uid() = author_id);
create policy "comments_own_update"    on public.comments for update
  using (auth.uid() = author_id or (select is_admin from public.profiles where id = auth.uid()));
create policy "comments_own_delete"    on public.comments for delete
  using (auth.uid() = author_id or (select is_admin from public.profiles where id = auth.uid()));

-- Votes: auth only, one vote per user per target
create policy "votes_public_read"      on public.votes for select using (true);
create policy "votes_auth_insert"      on public.votes for insert with check (auth.uid() = user_id);
create policy "votes_own_delete"       on public.votes for delete using (auth.uid() = user_id);
-- Prevent vote value update — delete + reinsert instead
create policy "votes_no_update"        on public.votes for update using (false);

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable realtime for live vote counts and comment threads
-- Run in Supabase dashboard: Database > Replication > enable for posts, comments, votes
