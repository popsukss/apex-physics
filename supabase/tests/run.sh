#!/usr/bin/env bash
# Applies every migration to a throwaway local Postgres with a minimal Supabase
# auth stub, then runs rls.sql. Needs initdb/pg_ctl/psql on PATH.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(dirname "$here")"
tmp="$(mktemp -d)"
port="${PGTEST_PORT:-54329}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

cleanup() { pg_ctl -D "$tmp/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$tmp"; }
trap cleanup EXIT

initdb -D "$tmp/data" -U postgres -A trust >/dev/null
pg_ctl -D "$tmp/data" -o "-p $port -k $tmp -c listen_addresses=''" -l "$tmp/log" -w start >/dev/null

psql_() { psql -h "$tmp" -p "$port" -U postgres -d postgres -v ON_ERROR_STOP=1 -q "$@"; }

# What Supabase provides before any project migration runs.
psql_ <<'SQL'
create role anon nologin;
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}');
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to anon, authenticated;
grant usage on schema public to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
SQL

for m in "$root"/migrations/*.sql; do psql_ -f "$m"; done
psql_ -f "$here/rls.sql"
