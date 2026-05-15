# PaperFix V1

PaperFix is a Telangana-focused certificate delivery support website.

## Included

- Public landing page
- Certificate request form
- Immediate token generation
- Supabase request storage
- WhatsApp handoff to +91 9666989331
- Token status checking
- 1 hour status waiting rule
- Simple `/admin` page with PIN protection
- Admin table, search, filters, details, status updates, internal notes, customer-facing messages, and WhatsApp button

## Environment variables

Add these in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_ADMIN_PIN=your_admin_pin
```

`SUPABASE_SERVICE_ROLE_KEY` is used only in server API routes for status lookup and admin updates. Do not expose it publicly.

If `NEXT_PUBLIC_ADMIN_PIN` is missing, local development uses `1234`.

## Supabase setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Add the environment variables in Vercel.
5. Deploy.
