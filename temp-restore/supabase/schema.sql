-- lucid.dev Production Database Schema
-- Last Updated: 2026-05-17

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type public.transaction_type as enum ('TOPUP', 'USAGE', 'REFUND', 'BONUS');
create type public.ai_task_type as enum ('LIGHT_UI', 'STANDARD_UI', 'HEAVY_UI', 'VISION_UI', 'CODE_EXPORT', 'FULL_APP', 'BACKEND_GEN');
create type public.project_visibility as enum ('PRIVATE', 'PUBLIC', 'UNLISTED');

-- 3. TABLES

-- Profiles (Linked to Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Wallets (One-to-one with Profiles)
create table public.wallets (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  balance_credits int default 10 not null check (balance_credits >= 0),
  lifetime_credits_used int default 0 not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Subscriptions
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz default now() not null
);

-- Credit Transactions (Auditable Ledger)
create table public.credit_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type public.transaction_type not null,
  amount int not null, -- Positive for topup, negative for usage
  balance_after int not null,
  reference_id text, -- Paystack Ref or AI Log ID
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null
);

-- AI Usage Logs
create table public.ai_usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  model_used text not null,
  task_type public.ai_task_type not null,
  prompt_tokens int,
  completion_tokens int,
  credits_charged int not null,
  latency_ms int,
  success boolean default true,
  error_message text,
  created_at timestamptz default now() not null
);

-- Projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  thumbnail_url text,
  framework text default 'Next.js',
  visibility public.project_visibility default 'PRIVATE' not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Project Versions
create table public.project_versions (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  version_number int not null,
  prompt text,
  generated_code text not null, -- Store big code blobs here
  preview_url text,
  created_at timestamptz default now() not null
);

-- Screenshots (Supabase Storage references)
create table public.screenshots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  storage_path text not null,
  optimized_size_kb int,
  analysis_status text default 'PENDING',
  created_at timestamptz default now() not null
);

-- Exports (Signed URLs)
create table public.exports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete cascade not null,
  export_type text default 'ZIP',
  download_url text,
  expires_at timestamptz,
  created_at timestamptz default now() not null
);

-- API Keys (Third-party integrations)
create table public.api_keys (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null, -- e.g., 'openai', 'anthropic'
  encrypted_key text not null,
  created_at timestamptz default now() not null
);

-- 4. INDEXES (Optimized for performance)
create index idx_profiles_email on public.profiles(email);
create index idx_wallets_user on public.wallets(user_id);
create index idx_transactions_user_date on public.credit_transactions(user_id, created_at desc);
create index idx_usage_user_date on public.ai_usage_logs(user_id, created_at desc);
create index idx_projects_user_updated on public.projects(user_id, updated_at desc);
create index idx_versions_project on public.project_versions(project_id, version_number desc);

-- 5. ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.wallets enable row level security;
alter table public.subscriptions enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.ai_usage_logs enable row level security;
alter table public.projects enable row level security;
alter table public.project_versions enable row level security;
alter table public.screenshots enable row level security;
alter table public.exports enable row level security;
alter table public.api_keys enable row level security;

-- Policies: Owners only for almost everything
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own wallet" on public.wallets for select using (auth.uid() = user_id);

create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);
create policy "Users can insert own projects" on public.projects for insert with check (auth.uid() = user_id);

create policy "Users can view own versions" on public.project_versions for select 
using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

create policy "Users can view own transactions" on public.credit_transactions for select using (auth.uid() = user_id);
create policy "Users can view own usage logs" on public.ai_usage_logs for select using (auth.uid() = user_id);
create policy "Users can view own screenshots" on public.screenshots for select using (auth.uid() = user_id);
create policy "Users can view own api keys" on public.api_keys for select using (auth.uid() = user_id);

-- 6. FUNCTIONS & TRIGGERS

-- Handle New User Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.wallets (user_id, balance_credits)
  values (new.id, 10); -- Give 10 starter credits

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic Credit Operations
create or replace function public.deduct_credits(p_user_id uuid, p_amount int, p_task_type text, p_metadata jsonb default '{}'::jsonb)
returns boolean
language plpgsql
security definer
as $$
declare
  current_balance int;
begin
  -- Force balance lock
  select balance_credits into current_balance from public.wallets 
  where user_id = p_user_id for update;

  if current_balance < p_amount then
    return false;
  end if;

  -- Update wallet
  update public.wallets 
  set 
    balance_credits = balance_credits - p_amount,
    lifetime_credits_used = lifetime_credits_used + p_amount,
    updated_at = now()
  where user_id = p_user_id;

  -- Log transaction
  insert into public.credit_transactions (user_id, type, amount, balance_after, metadata)
  values (p_user_id, 'USAGE', -p_amount, current_balance - p_amount, p_metadata || jsonb_build_object('task', p_task_type));

  return true;
end;
$$;

create or replace function public.add_credits(p_user_id uuid, p_amount int, p_reference text, p_metadata jsonb default '{}'::jsonb)
returns void
language plpgsql
security definer
as $$
declare
  current_balance int;
begin
  select balance_credits into current_balance from public.wallets 
  where user_id = p_user_id for update;

  update public.wallets 
  set balance_credits = balance_credits + p_amount, updated_at = now()
  where user_id = p_user_id;

  insert into public.credit_transactions (user_id, type, amount, balance_after, reference_id, metadata)
  values (p_user_id, 'TOPUP', p_amount, current_balance + p_amount, p_reference, p_metadata);
end;
$$;

-- 7. STORAGE BUCKETS
-- Note: These often need to be created via the Supabase dashboard or API, but we can set policies
-- Storage policies are usually applied to the 'storage.objects' table
