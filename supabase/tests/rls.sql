-- Row-level security checks for a signed-in, non-admin user.
-- Run with supabase/tests/run.sh (throwaway Postgres + minimal Supabase auth stub).

\o /dev/null
create temp table results (label text, pass boolean);

create function pg_temp.check(label text, pass boolean) returns void language sql as
  $$ insert into results values (label, pass) $$;

-- Seed as superuser: user A (author), user B (other), one post + comment by A.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'a@example.com'),
  ('00000000-0000-0000-0000-00000000000b', 'b@example.com');
insert into public.posts (id, author_id, title, content)
  values ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-00000000000a', 'Q', 'body');
insert into public.comments (id, post_id, author_id, content)
  values ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000f1',
          '00000000-0000-0000-0000-00000000000a', 'answer');

-- Act as user A.
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', false);

do $$ begin
  update public.profiles set is_admin = true where id = auth.uid();
exception when insufficient_privilege then null; end $$;

do $$ begin
  update public.posts set is_pinned = true, is_verified = true where id = '00000000-0000-0000-0000-0000000000f1';
exception when insufficient_privilege then null; end $$;

do $$ begin
  update public.comments set is_verified = true where id = '00000000-0000-0000-0000-0000000000c1';
exception when insufficient_privilege then null; end $$;

do $$ begin
  insert into public.posts (author_id, title, content, is_pinned, is_verified)
    values (auth.uid(), 'spam', 'spam', true, true);
exception when insufficient_privilege then null; end $$;

do $$ begin
  insert into public.comments (post_id, author_id, content, is_verified)
    values ('00000000-0000-0000-0000-0000000000f1', auth.uid(), 'fake', true);
exception when insufficient_privilege then null; end $$;

-- What the app does today must keep working.
update public.profiles set username = 'renamed' where id = auth.uid();
update public.posts set title = 'Q edited' where id = '00000000-0000-0000-0000-0000000000f1';
update public.comments set content = 'answer edited' where id = '00000000-0000-0000-0000-0000000000c1';
insert into public.posts (title, content, category, author_id) values ('new', 'body', null, auth.uid());
insert into public.comments (post_id, parent_id, author_id, content)
  values ('00000000-0000-0000-0000-0000000000f1', null, auth.uid(), 'reply');
insert into public.votes (user_id, target_id, target_type, value)
  values (auth.uid(), '00000000-0000-0000-0000-0000000000f1', 'post', 1);

reset role;

select pg_temp.check('user cannot make themselves admin',
  not (select is_admin from public.profiles where id = '00000000-0000-0000-0000-00000000000a'));
select pg_temp.check('author cannot pin or verify own post',
  not (select is_pinned or is_verified from public.posts where id = '00000000-0000-0000-0000-0000000000f1'));
select pg_temp.check('author cannot verify own comment',
  not (select is_verified from public.comments where id = '00000000-0000-0000-0000-0000000000c1'));
select pg_temp.check('user cannot insert a pre-pinned or pre-verified post',
  not exists (select 1 from public.posts where title = 'spam'));
select pg_temp.check('user cannot insert a pre-verified comment',
  not exists (select 1 from public.comments where content = 'fake'));
select pg_temp.check('user can rename themselves',
  (select username from public.profiles where id = '00000000-0000-0000-0000-00000000000a') = 'renamed');
select pg_temp.check('author can edit own post',
  exists (select 1 from public.posts where title = 'Q edited'));
select pg_temp.check('author can edit own comment',
  exists (select 1 from public.comments where content = 'answer edited'));
select pg_temp.check('user can create a post', exists (select 1 from public.posts where title = 'new'));
select pg_temp.check('user can comment', exists (select 1 from public.comments where content = 'reply'));
select pg_temp.check('user can vote', exists (select 1 from public.votes));

\o
select (case when pass then 'PASS  ' else 'FAIL  ' end) || label as result from results;

do $$ begin
  if exists (select 1 from results where not pass) then
    raise exception '% check(s) failed', (select count(*) from results where not pass);
  end if;
end $$;
