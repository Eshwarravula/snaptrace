# TaxFlow MVP

TaxFlow is an Indian CA/GST firm operating system. It is not GST filing software. It is an operations/control-room dashboard that helps CA firms manage GST clients, monthly filing work, document collection, staff tasks, WhatsApp follow-ups, and fee tracking from one dashboard.

## Current MVP status

This repo has been converted from the previous app into a TaxFlow MVP.

Included now:

- Next.js App Router + TypeScript + Tailwind CSS
- Mobile-responsive SaaS dashboard layout
- Sidebar navigation for Dashboard, Clients, GST Work, Documents, Tasks, Reminders, Payments, Calendar, and Settings
- Demo data for one CA firm, 5 clients, 2 staff members, GST work records, document statuses, payments, tasks, and WhatsApp templates
- Client CRM create/search/filter UI
- Monthly GST workflow table with status update controls
- Document checklist view
- Staff task tracker with My tasks, All tasks, and Overdue tasks
- Click-to-send WhatsApp reminder generator using `wa.me` links
- Payment tracker views for unpaid, overdue, and paid clients
- Compliance calendar list for GST follow-ups, task due dates, and fee due dates
- Settings page for firm profile, default due days, and staff invite placeholder
- Supabase/Postgres migration with multi-tenant firm_id design, UUID keys, indexes, seed templates, and RLS-ready policies

## Tech stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, and Storage ready
- Supabase JS client dependency already included
- No paid APIs
- WhatsApp click-to-send links instead of WhatsApp API

## Run locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build check

```bash
npm run build
```

## Environment variables

Create `.env.local` when connecting Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Important: `SUPABASE_SERVICE_ROLE_KEY` must only be used in server routes. Do not expose it in client components.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run:

```text
supabase/migrations/001_taxflow_schema.sql
```

4. Create a Supabase Storage bucket named:

```text
taxflow-documents
```

5. Add the env vars in Vercel or `.env.local`.
6. Replace demo state in the UI with Supabase queries/mutations.

## Database tables

The migration creates:

- firms
- profiles
- clients
- gst_work_records
- document_checklist_items
- uploaded_documents
- tasks
- reminder_templates
- reminder_logs
- payments
- firm_settings

Every tenant-owned table has `firm_id` for multi-tenancy.

## RLS design

The migration enables RLS and includes a `current_firm_id()` helper. The default policies scope access by the authenticated user's firm.

Production hardening still needed before real client data:

- Review and split policies by role and action
- Add invite flow with secure token expiry
- Add server actions or route handlers for writes
- Add audit logs for sensitive changes
- Add better file upload rules and storage path policies
- Add backups and monitoring
- Add data export and deletion flows
- Add validation for GSTIN, phone, and e-mail fields on both client and server

## MVP development path from here

1. Connect Supabase Auth email/password.
2. Create onboarding route after signup to create a firm and owner profile.
3. Replace demo arrays with Supabase data loading.
4. Add server-side create/update/delete actions for clients, GST work, documents, tasks, reminders, and payments.
5. Implement file upload to the `taxflow-documents` bucket.
6. Deploy to Vercel.

## Vercel deployment

```bash
npm run build
```

Then push to GitHub and import the repo into Vercel. Add env vars in Project Settings → Environment Variables.
