# RE Capital IQ (TREP Cap IQ)

A purpose-built investor relations and deal tracking platform for real estate investment firms. Replaces fragmented spreadsheets, CRMs, and email threads with a single secure system.

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Database & Auth**: Supabase (PostgreSQL + Auth)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: TanStack React Query
- **AI**: Anthropic Claude (via API route)
- **Port**: 5000 (Replit requirement)

## Key Features

- **Deal Pipeline** — Kanban board with drag-and-drop, 7 stages (Overviews → Pass)
- **Investor CRM** — 50K+ contact database with 5 investor-type classification dropdowns
- **Company CRM** — Auto-create/link from contact domain matching
- **Deal Participants** — Per-deal contact tracking with status, commitment, NDA dates
- **Activity Feed** — Global timeline of calls, emails, meetings, notes, AI updates
- **AI Chatbot** — Floating assistant (requires ANTHROPIC_API_KEY)
- **Settings** — Custom fields, pipeline stage configuration
- **Import/Export** — CSV/Excel bulk import with field mapping

## Environment Variables (Secrets)

| Key | Purpose |
|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin operations |
| `ANTHROPIC_API_KEY` | AI chatbot (optional — chat disabled without it) |

## Running

```
npm run dev   # dev server on port 5000
npm run build # production build
npm run start # production server on port 5000
```

## Replit-Specific Configuration

- Dev/start scripts use `-p 5000 -H 0.0.0.0` (Replit webview requirement)
- Supabase cookies use `SameSite=None; Secure` for cross-site iframe compatibility
- `next.config.mjs` sets `allowedDevOrigins` for Replit preview domains

## Data Model

Five core entities with UUID PKs, soft deletes, and JSONB custom fields:
- **Deal** — Pipeline stage, amount, asset class, priority, close dates
- **Contact** — Investor with 5 type dropdowns, lead status, relationship tier
- **Company** — Domain-matched org with investor profile mirroring Contact
- **DealParticipant** — Contact↔Deal junction with status, commitment, NDA tracking
- **Activity** — Cross-entity log (Call, Email, Meeting, Note, NDA, Document, AI Update)

## Enum Values (per PRD)

### Lead Status
Need to Call | Left VM | Call Scheduled | Had Call | Tag to Deal | Hold off for now

### Capital Type (Investor)
Senior Debt | GP Equity | LP - Large | LP - Mid | Subordinated Debt/Pref Equity | Senior Debt - TX Banks | LP - Small

### Participant Status
Introduced | NDA Sent | NDA Signed | Reviewing Deck | Meeting Scheduled | Soft Circle | Committed | Passed | Closed

### Participant Roles
Lead Investor | Co-Investor | Broker | Lender | Legal | Other

### Asset Class
Residential - For Rent | Residential - For Sale | Retail | Office | Industrial/Storage | Hotel | Healthcare/Senior | Land | Datacenter | Other

### Company Type
Investor | Broker | Lender | Legal | Other

### Relationship
J - No Relationship | A - Very Well | B - Warm | H - Call | X - Going Concern | Y - Lender | W - Sponsor | Z - Existing
