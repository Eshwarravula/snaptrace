-- TaxFlow MVP Supabase schema
-- Run this in Supabase SQL Editor.
-- Production hardening: review every RLS policy before going live, add backups, audit logs, and storage virus scanning if clients upload sensitive documents.

create extension if not exists "pgcrypto";

create table if not exists firms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  firm_id uuid not null references firms(id) on delete cascade,
  full_name text not null,
  email text not null,
  role text not null check (role in ('owner','admin','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  business_name text not null,
  owner_name text not null,
  gstin text not null,
  phone text not null,
  email text,
  city text,
  business_type text,
  gst_frequency text not null check (gst_frequency in ('monthly','quarterly','composition')),
  assigned_staff_id uuid references profiles(id),
  monthly_fee numeric(12,2) not null default 0,
  status text not null default 'active' check (status in ('active','inactive','risky')),
  notes text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gst_work_records (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  month int not null check (month between 1 and 12),
  year int not null check (year between 2020 and 2100),
  assigned_staff_id uuid references profiles(id),
  workflow_status text not null default 'not_started' check (workflow_status in ('not_started','waiting_for_client','documents_received','in_progress','ready_for_review','client_approval_pending','filed','completed')),
  document_status text not null default 'missing' check (document_status in ('missing','received','checked','issue_found')),
  approval_status text not null default 'not_required' check (approval_status in ('not_required','pending','approved','rejected')),
  filing_status text not null default 'not_filed' check (filing_status in ('not_filed','filed','late')),
  gst_payable_amount numeric(12,2) default 0,
  filing_date date,
  notes text,
  last_followup_at timestamptz,
  next_followup_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(firm_id, client_id, month, year)
);

create table if not exists document_checklist_items (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  gst_work_id uuid not null references gst_work_records(id) on delete cascade,
  title text not null,
  status text not null default 'missing' check (status in ('missing','received','checked','issue_found')),
  remarks text,
  uploaded_by uuid references profiles(id),
  uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists uploaded_documents (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  gst_work_id uuid references gst_work_records(id) on delete cascade,
  checklist_item_id uuid references document_checklist_items(id) on delete set null,
  storage_bucket text not null default 'taxflow-documents',
  storage_path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  title text not null,
  description text,
  client_id uuid references clients(id) on delete cascade,
  gst_work_id uuid references gst_work_records(id) on delete cascade,
  assigned_to uuid references profiles(id),
  due_date date,
  priority text not null default 'medium' check (priority in ('low','medium','high','urgent')),
  status text not null default 'todo' check (status in ('todo','in_progress','blocked','done')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reminder_templates (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  name text not null,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reminder_logs (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  gst_work_id uuid references gst_work_records(id) on delete set null,
  template_id uuid references reminder_templates(id) on delete set null,
  template_name text not null,
  message text not null,
  sent_by uuid references profiles(id),
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references firms(id) on delete cascade,
  client_id uuid not null references clients(id) on delete cascade,
  month int not null check (month between 1 and 12),
  year int not null check (year between 2020 and 2100),
  amount_due numeric(12,2) not null default 0,
  amount_paid numeric(12,2) not null default 0,
  due_date date,
  status text not null default 'unpaid' check (status in ('unpaid','partial','paid','overdue')),
  payment_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(firm_id, client_id, month, year)
);

create table if not exists firm_settings (
  firm_id uuid primary key references firms(id) on delete cascade,
  default_gst_due_day int not null default 20 check (default_gst_due_day between 1 and 31),
  default_fee_due_day int not null default 25 check (default_fee_due_day between 1 and 31),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_firm on profiles(firm_id);
create index if not exists idx_clients_firm on clients(firm_id);
create index if not exists idx_clients_assigned_staff on clients(assigned_staff_id);
create index if not exists idx_clients_status on clients(firm_id, status);
create index if not exists idx_clients_city on clients(firm_id, city);
create index if not exists idx_clients_frequency on clients(firm_id, gst_frequency);
create index if not exists idx_gst_work_firm on gst_work_records(firm_id);
create index if not exists idx_gst_work_client on gst_work_records(client_id);
create index if not exists idx_gst_work_staff on gst_work_records(assigned_staff_id);
create index if not exists idx_gst_work_month_year on gst_work_records(firm_id, month, year);
create index if not exists idx_docs_firm_client on document_checklist_items(firm_id, client_id);
create index if not exists idx_uploads_firm_client on uploaded_documents(firm_id, client_id);
create index if not exists idx_tasks_firm_staff on tasks(firm_id, assigned_to);
create index if not exists idx_tasks_due on tasks(firm_id, due_date);
create index if not exists idx_reminders_firm_client on reminder_logs(firm_id, client_id);
create index if not exists idx_payments_firm_client on payments(firm_id, client_id);
create index if not exists idx_payments_month_year on payments(firm_id, month, year);

-- RLS helper: a signed-in user can access only rows from their firm.
create or replace function public.current_firm_id()
returns uuid
language sql
security definer
stable
as $$
  select firm_id from public.profiles where id = auth.uid() and active = true
$$;

alter table firms enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table gst_work_records enable row level security;
alter table document_checklist_items enable row level security;
alter table uploaded_documents enable row level security;
alter table tasks enable row level security;
alter table reminder_templates enable row level security;
alter table reminder_logs enable row level security;
alter table payments enable row level security;
alter table firm_settings enable row level security;

-- Firms are visible only to their members.
create policy "firm members read firm" on firms for select using (id = public.current_firm_id());
create policy "owners update firm" on firms for update using (id = public.current_firm_id() and exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('owner','admin')));

-- Generic firm-scoped policies. Production hardening: split write permissions further by role/action.
create policy "profiles firm read" on profiles for select using (firm_id = public.current_firm_id());
create policy "profiles owner admin write" on profiles for all using (firm_id = public.current_firm_id() and exists(select 1 from profiles p where p.id = auth.uid() and p.role in ('owner','admin')));

create policy "clients firm access" on clients for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "gst work firm access" on gst_work_records for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "checklist firm access" on document_checklist_items for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "uploads firm access" on uploaded_documents for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "tasks firm access" on tasks for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "templates firm access" on reminder_templates for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "reminder logs firm access" on reminder_logs for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "payments firm access" on payments for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());
create policy "settings firm access" on firm_settings for all using (firm_id = public.current_firm_id()) with check (firm_id = public.current_firm_id());

-- Storage bucket for client documents. Create bucket in Supabase Storage named taxflow-documents.
-- Recommended storage RLS: allow authenticated users to read/write only paths prefixed by their firm_id.

-- Demo seed data without auth-bound users. The app also contains TypeScript demo data so it runs before Supabase is connected.
insert into firms (id, name, address, phone, email) values
('00000000-0000-0000-0000-000000000001', 'Rao & Associates CA Firm', 'Madhapur, Hyderabad, Telangana', '+919876543210', 'ops@raoassociates.in')
on conflict do nothing;

insert into firm_settings (firm_id, default_gst_due_day, default_fee_due_day) values
('00000000-0000-0000-0000-000000000001', 20, 25)
on conflict do nothing;

insert into reminder_templates (firm_id, name, body) values
('00000000-0000-0000-0000-000000000001','Missing GST documents','Hi {{client_name}}, this is {{staff_name}} from {{firm_name}}. For {{month}} {{year}} GST filing, we still need: {{missing_documents}}. Please share them today so we can complete filing on time.'),
('00000000-0000-0000-0000-000000000001','GST payable approval','Hi {{client_name}}, GST payable for {{business_name}} for {{month}} {{year}} is ₹{{gst_payable_amount}}. Please approve so we can proceed with filing.'),
('00000000-0000-0000-0000-000000000001','Filing completed','Hi {{client_name}}, GST filing for {{business_name}} for {{month}} {{year}} is completed. We will share the acknowledgement shortly.'),
('00000000-0000-0000-0000-000000000001','Fee payment reminder','Hi {{client_name}}, fee payment of ₹{{payment_amount}} is pending for {{month}} {{year}}. Please clear it at the earliest. - {{firm_name}}'),
('00000000-0000-0000-0000-000000000001','Custom message','Hi {{client_name}}, this is {{staff_name}} from {{firm_name}} regarding {{business_name}} GST work for {{month}} {{year}}.')
on conflict do nothing;
