create extension if not exists pgcrypto;
create table if not exists public.paperfix_requests (id uuid primary key default gen_random_uuid(),token text unique not null,full_name text not null,phone text not null,certificate_type text not null,district text not null,mandal text not null,request_type text not null,application_number text null,urgency text not null,documents_ready text not null,notes text null,consent_accepted boolean not null default false,status text not null default 'Request Received',status_message text null,internal_note text null,created_at timestamptz default now(),updated_at timestamptz default now());
create index if not exists paperfix_requests_token_idx on public.paperfix_requests (token);
create index if not exists paperfix_requests_status_idx on public.paperfix_requests (status);
create index if not exists paperfix_requests_created_at_idx on public.paperfix_requests (created_at desc);
create or replace function public.set_updated_at() returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists set_paperfix_requests_updated_at on public.paperfix_requests;
create trigger set_paperfix_requests_updated_at before update on public.paperfix_requests for each row execute function public.set_updated_at();
alter table public.paperfix_requests enable row level security;
drop policy if exists "Allow public request creation" on public.paperfix_requests;
create policy "Allow public request creation" on public.paperfix_requests for insert to anon with check (consent_accepted = true);
-- Status lookup and admin updates are handled by Next.js API routes. Add SUPABASE_SERVICE_ROLE_KEY in Vercel.
