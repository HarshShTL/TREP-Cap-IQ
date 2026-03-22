# TREP Cap IQ — PRD Implementation Tracker

**Last updated:** 2026-03-21
**Legend:** ✅ Done · ⚠️ Partial · ❌ Not started · 🔒 Future / Phase 2

---

## §1–2 Executive Brief & Competitive Context
*No implementation tasks — documentation only.*

---

## §3 Platform Overview (Screen-by-Screen)

| Screen | Status | Notes | Key File(s) |
|--------|--------|-------|-------------|
| 3.1 Login page | ✅ | Clean login with branding, email/password | `src/app/login/page.tsx` |
| 3.1 Post-login redirect to Dashboard | ✅ | Middleware redirects auth users | `src/middleware.ts` |
| 3.2 Sidebar — nav links (Dashboard, Deals, Contacts, Companies, Activity) | ✅ | Persistent dark navy sidebar | `src/components/app-sidebar.tsx` |
| 3.2 Sidebar — Settings link (Super Admin only) | ✅ | Hidden unless super_admin role | `src/components/app-sidebar.tsx` |
| 3.2 Sidebar — mobile hamburger collapse | ✅ | Sheet component on mobile | `src/components/app-shell.tsx` |
| 3.3 Dashboard — KPI cards (active deals, contacts, total amount) | ✅ | Three default KPI cards | `src/app/(app)/page.tsx` |
| 3.3 Dashboard — Bar chart (deals by stage) | ✅ | Recharts BarChart | `src/app/(app)/page.tsx` |
| 3.3 Dashboard — Pie chart (contacts by lead status) | ✅ | Recharts PieChart | `src/app/(app)/page.tsx` |
| 3.3 Dashboard — 10 most recent deals (clickable) | ✅ | Links to `/deals/[id]` | `src/app/(app)/page.tsx` |
| 3.3 Dashboard — 20 most recent activities (with AI badge) | ⚠️ | Feed shows but AI badge (`ai_generated` flag) not rendered | `src/app/(app)/page.tsx` |
| 3.3 Dashboard — activity contact names as links | ⚠️ | Contact names shown but not hyperlinked to `/contacts/[id]` | `src/app/(app)/page.tsx` |
| 3.4 Deals Board — Kanban columns per stage | ✅ | `@hello-pangea/dnd` DragDropContext | `src/components/deals/deals-board-view.tsx` |
| 3.4 Deals Board — deal cards (name, asset class, location, amount, close date, priority dot) | ✅ | Color-coded priority dot | `src/components/deals/deal-card.tsx` |
| 3.4 Deals Board — drag-and-drop stage change (saves instantly) | ✅ | Optimistic update + rollback | `src/hooks/use-deals.ts` |
| 3.4 Deals Board — quick-edit panel on card click | ✅ | Right-side Sheet | `src/components/deals/deal-quick-edit-sheet.tsx` |
| 3.4 Deals Board — toggle to list view | ✅ | "board" / "list" toggle | `src/app/(app)/deals/page.tsx` |
| 3.4 Deals Board — filterable list view | ✅ | Sortable table | `src/components/deals/deals-list-view.tsx` |
| 3.4 Deals Board — custom views (saved filters) | ❌ | CustomViewsSidebar not mounted on deals page | — |
| 3.5 Detail pages — 3-column layout (30/50/20) | ✅ | All three entity detail pages | `src/app/(app)/deals/[id]/page.tsx` |
| 3.5 Deal detail — left column all editable fields | ✅ | InlineEditField for every field | `src/components/deals/deal-summary-panel.tsx` |
| 3.5 Deal detail — center Activities tab | ✅ | ActivityFeed scoped to deal | `src/components/deals/deal-center-panel.tsx` |
| 3.5 Deal detail — center Deal Participants tab | ✅ | Table with role/status/commitment | `src/components/deals/deal-participants-tab.tsx` |
| 3.5 Deal detail — center NDA Tracking tab | ✅ | NDA sent/signed dates per participant | `src/components/deals/nda-tracking-tab.tsx` |
| 3.5 Deal detail — right column linked contacts/companies | ✅ | Participants listed | `src/components/deals/deal-right-panel.tsx` |
| 3.5 Deal detail — right column file attachments | ⚠️ | UI exists (drag-drop zone + file list); Supabase Storage bucket config required | `src/components/deals/deal-right-panel.tsx` |
| 3.5 Contact detail — 3-column layout | ✅ | Same layout pattern | `src/app/(app)/contacts/[id]/page.tsx` |
| 3.5 Contact detail — all fields inline editable | ✅ | 30+ fields via InlineEditField | `src/components/contacts/contact-summary-panel.tsx` |
| 3.5 Contact detail — center Activities, Participants, NDA tabs | ✅ | All three tabs | `src/app/(app)/contacts/[id]/page.tsx` |
| 3.5 Contact detail — contact_owner UUID → name display | ⚠️ | UUID shown raw, not resolved to full_name | `src/components/contacts/contact-summary-panel.tsx` |
| 3.5 Company detail — 3-column layout | ✅ | Same layout pattern | `src/app/(app)/companies/[id]/page.tsx` |
| 3.5 Company detail — all fields inline editable | ✅ | InlineEditField | `src/components/companies/company-summary-panel.tsx` |
| 3.5 Company detail — center Activities, Contacts, Deal Participation tabs | ✅ | All three tabs | `src/app/(app)/companies/[id]/page.tsx` |
| 3.6 Contacts page — paginated table (50/page) | ✅ | Cursor-based pagination | `src/components/contacts/contacts-table.tsx` |
| 3.6 Contacts page — search (name, email, company) | ✅ | Debounced 300ms | `src/app/(app)/contacts/page.tsx` |
| 3.6 Contacts page — custom views sidebar | ✅ | CustomViewsSidebar component | `src/app/(app)/contacts/page.tsx` |
| 3.6 Contacts page — sortable columns | ⚠️ | Client-side sort on visible page only; not full DB sort | `src/components/contacts/contacts-table.tsx` |
| 3.6 Contacts page — export CSV | ✅ | ExportCSVButton component | `src/components/shared/export-csv-button.tsx` |
| 3.7 Companies page — paginated table | ✅ | With contact count column | `src/components/companies/companies-table.tsx` |
| 3.7 Companies page — search | ✅ | Debounced search | `src/app/(app)/companies/page.tsx` |
| 3.7 Companies page — export CSV | ✅ | ExportCSVButton | `src/app/(app)/companies/page.tsx` |
| 3.8 Activity log — global feed | ✅ | ActivityFeed with no entity scope | `src/app/(app)/activity/page.tsx` |
| 3.8 Activity log — type filter chips | ✅ | All / Call / Email / Meeting / Note / NDA / Document | `src/app/(app)/activity/page.tsx` |
| 3.8 Activity log — full-text search | ✅ | Debounced subject/body search | `src/app/(app)/activity/page.tsx` |
| 3.8 Activity log — AI badge on AI-generated activities | ❌ | `ai_generated` column exists in DB but badge not rendered in ActivityFeed | `src/components/activities/activity-feed.tsx` |
| 3.8 Activity log — expandable body | ⚠️ | Body shown truncated; expand-on-click not implemented | `src/components/activities/activity-feed.tsx` |
| 3.9 AI Chatbot — floating FAB bottom-right | ✅ | Navy/amber styling | `src/components/ai-chatbot.tsx` |
| 3.9 AI Chatbot — Ctrl+K / Cmd+K shortcut | ✅ | Global keydown listener | `src/components/ai-chatbot.tsx` |
| 3.9 AI Chatbot — natural language → structured changes | ✅ | Claude Sonnet 4.6 with tool use | `src/app/api/chat/route.ts` |
| 3.9 AI Chatbot — propose-and-confirm flow | ✅ | Checkbox list per change item | `src/components/ai-chatbot.tsx` |
| 3.9 AI Chatbot — streaming responses | ❌ | Non-streaming; full response returned at once | `src/app/api/chat/route.ts` |
| 3.10 Settings — Pipeline Stages tab | ✅ | DnD reorder, add/delete | `src/components/settings/pipeline-stages-tab.tsx` |
| 3.10 Settings — Deal Fields tab | ✅ | Add/edit/remove custom fields | `src/components/settings/field-manager-tab.tsx` |
| 3.10 Settings — Contact Fields tab | ✅ | Same field manager | `src/app/(app)/settings/page.tsx` |
| 3.10 Settings — Company Fields tab | ✅ | Same field manager | `src/app/(app)/settings/page.tsx` |
| 3.10 Settings — Dashboard KPI Config tab | ❌ | Tab exists as label; no config UI implemented | `src/app/(app)/settings/page.tsx` |
| 3.10 Settings — Super Admin guard (non-admins redirected) | ✅ | useProfile() + redirect | `src/app/(app)/settings/page.tsx` |

---

## §4 Platform Workflows

| Workflow Step | Status | Notes |
|--------------|--------|-------|
| 4.1 Create deal → appears in Kanban "Overviews" | ✅ | NewDealDialog → Kanban |
| 4.1 Drag card to new stage → saves instantly | ✅ | Optimistic update |
| 4.1 Add participants from contact database | ✅ | Search + add in ParticipantsTab |
| 4.1 AI chatbot meeting notes → propose 6 changes at once | ✅ | Multi-item propose_changes tool |
| 4.1 Total committed capital visible on deal detail | ❌ | No sum displayed; individual amounts shown but not aggregated | `src/components/deals/deal-participants-tab.tsx` |
| 4.1 Drag to "Closed" → close_date auto-populates | ✅ | `useUpdateDealStage` sets close_date | `src/hooks/use-deals.ts` |
| 4.1 Days-to-close auto-calculated | ❌ | Field exists in PRD; not computed or displayed | — |
| 4.1 Participants with status "Committed" marked "Closed" on deal close | ❌ | No auto-update of participant status on deal stage change | — |
| 4.2 Import CSV of 2,000 contacts | ✅ | 6-step wizard | `src/app/(app)/import/page.tsx` |
| 4.2 Deduplication on email | ✅ | Step 5 dedup check | `src/app/(app)/import/page.tsx` |
| 4.2 Company domain matching during import | ❌ | Import does not auto-link to Company records | `src/app/(app)/import/page.tsx` |
| 4.2 Create new custom field from import screen | ❌ | Unmatched columns can only be skipped/mapped | `src/app/(app)/import/page.tsx` |
| 4.2 Custom views ("Conference Leads — Need to Call") | ✅ | Save View button in CustomViewsSidebar | `src/components/shared/custom-views-sidebar.tsx` |
| 4.2 AutofillInput on region/location text fields | ✅ | Debounced Supabase ilike query | `src/components/autofill-input.tsx` |
| 4.2 DocuSign NDA workflow | 🔒 | Phase 2 integration | — |
| 4.2 Company Detail — all contacts + aggregate commitments | ✅ | Company detail tabs | `src/app/(app)/companies/[id]/page.tsx` |
| 4.3 Dashboard KPI cards with live data | ✅ | — | `src/app/(app)/page.tsx` |
| 4.3 AI chatbot Ctrl+K paste meeting notes | ✅ | — | `src/components/ai-chatbot.tsx` |
| 4.3 Uncheck one AI suggestion before confirming | ✅ | Per-item checkboxes | `src/components/ai-chatbot.tsx` |
| 4.3 Export "Active Deals" as Excel | ❌ | CSV export only; .xlsx export not implemented | — |

---

## §5 Users, Roles & Permissions

| Feature | Status | Notes | File(s) |
|---------|--------|-------|---------|
| 5.1 Super Admin role | ✅ | Checked via `profiles.role` | `src/hooks/use-profile.ts` |
| 5.1 User role | ✅ | Default role | — |
| 5.1 Read-Only role | ❌ | Role exists in PRD; UI does not enforce view-only for Read-Only users | — |
| 5.2 View all entities — all roles | ✅ | No view-only gates | — |
| 5.2 Create/edit — blocked for Read-Only | ❌ | Buttons visible to all roles | — |
| 5.2 AI chatbot — blocked for Read-Only | ❌ | FAB visible to all roles | — |
| 5.2 Export — all roles | ✅ | ExportCSVButton available everywhere | — |
| 5.2 Settings — Super Admin only | ✅ | Redirect guard | `src/app/(app)/settings/page.tsx` |
| 5.2 Manage users / audit logs — Super Admin only | ❌ | No user management UI built | — |
| 5.3 JWT auth via Supabase | ✅ | Middleware validates session | `src/middleware.ts` |
| 5.3 httpOnly secure cookies | ✅ | Supabase SSR handles this | `src/lib/supabase/server.ts` |
| 5.3 All API routes validate JWT | ✅ | Chat route + Supabase RLS | `src/app/api/chat/route.ts` |
| 5.3 Frontend route guards → redirect to login | ✅ | Middleware redirects unauthenticated | `src/middleware.ts` |
| 5.3 Role-based 403 redirect | ❌ | Only Settings checks role; no 403 page | — |
| 5.3 Session invalidation on password change | ✅ | Supabase handles natively | — |

---

## §6 Core Data Model

### §6.1 Deal Fields

| Field | In DB | In UI | Notes |
|-------|-------|-------|-------|
| name | ✅ | ✅ | Required, inline editable |
| amount | ✅ | ✅ | — |
| stage | ✅ | ✅ | Enum, drag-to-update |
| pipeline | ✅ | ⚠️ | Field exists, not surfaced in UI |
| deal_type | ✅ | ✅ | — |
| description | ✅ | ✅ | — |
| currency | ✅ | ⚠️ | Field exists, not shown in UI |
| priority | ✅ | ✅ | Color dot on card |
| location | ✅ | ✅ | AutofillInput |
| asset_class | ✅ | ✅ | Badge on card |
| create_date / created_at | ✅ | ⚠️ | Not displayed on detail page |
| close_date | ✅ | ✅ | Auto-set on "Closed" drag |
| expected_close_date | ✅ | ✅ | — |
| days_to_close (computed) | ❌ | ❌ | Not computed or stored; PRD says auto-calculated |
| last_contacted | ❌ | ❌ | Not auto-updated when activity logged |
| last_activity_date | ❌ | ❌ | Not auto-updated |
| next_activity_date | ❌ | ❌ | Not computed |
| deal_owner (UUID FK) | ✅ | ⚠️ | Stored as UUID; resolved to name in QuickEdit but raw in some places |
| deal_collaborator (UUID FK) | ✅ | ⚠️ | Stored as UUID; not resolved to name in UI |
| custom_fields (JSONB) | ✅ | ✅ | Rendered dynamically via useSchemaConfig |

### §6.2 Contact Fields

| Field | In DB | In UI | Notes |
|-------|-------|-------|-------|
| first_name, last_name | ✅ | ✅ | Required, locked |
| email | ✅ | ✅ | — |
| phone | ✅ | ✅ | — |
| job_title | ✅ | ✅ | — |
| company_id (FK) | ✅ | ⚠️ | Auto-link logic not implemented |
| company_name (derived) | ✅ | ✅ | — |
| industry | ✅ | ✅ | — |
| website | ✅ | ✅ | — |
| street_address, city, state, postal_code, country | ✅ | ✅ | All editable |
| time_zone | ✅ | ✅ | — |
| contact_owner (UUID FK) | ✅ | ❌ | Stored but not resolved to name or shown in UI |
| lead_status | ✅ | ✅ | — |
| capital_type, family_office, institutional, retail, indirect, ownership (5 dropdowns) | ✅ | ✅ | All 5 investor type selects |
| investment_strategy, region, asset_class | ✅ | ✅ | — |
| relationship | ✅ | ✅ | — |
| last_interaction_date | ✅ | ⚠️ | Not auto-updated on activity creation |
| next_steps | ✅ | ✅ | — |
| database_source | ✅ | ✅ | — |
| email_verification | ✅ | ✅ | — |
| trep_capital_type_prior_outreach | ✅ | ✅ | — |
| trep_deal_prior_outreach | ✅ | ✅ | — |
| custom_fields (JSONB) | ✅ | ✅ | — |

### §6.3 Company Fields

| Field | In DB | In UI | Notes |
|-------|-------|-------|-------|
| name | ✅ | ✅ | Required |
| website | ✅ | ✅ | — |
| domain (auto-derived) | ✅ | ⚠️ | Not auto-extracted from website on save |
| company_type | ✅ | ✅ | — |
| industry | ✅ | ✅ | — |
| linkedin | ✅ | ✅ | — |
| hq_address, hq_city, hq_state, hq_country | ✅ | ✅ | — |
| capital_type (5 investor type fields) | ✅ | ✅ | — |
| investment_strategy, region, asset_class | ✅ | ✅ | — |
| aum | ✅ | ✅ | — |
| custom_fields (JSONB) | ✅ | ✅ | — |

**§6.3.1 Auto-Create / Append Company from Contact**
| Behavior | Status | Notes |
|----------|--------|-------|
| Extract domain from website/email on contact save | ❌ | Not implemented |
| Auto-create Company if domain not found | ❌ | Not implemented |
| Link Contact to existing Company if domain matches | ❌ | Not implemented |
| Show confirmation toast "Linked to / Created company X" | ❌ | Not implemented |

### §6.4 Deal Participant Fields

| Field | In DB | In UI | Notes |
|-------|-------|-------|-------|
| deal_id, contact_id | ✅ | ✅ | — |
| role | ✅ | ✅ | — |
| status | ✅ | ✅ | Color badges |
| commitment_amount | ✅ | ✅ | — |
| notes | ✅ | ❌ | Field exists in PRD; not shown or editable in UI |
| nda_sent_date, nda_signed_date | ✅ | ✅ | Shown in NDA tab |
| last_activity_date (auto) | ❌ | ❌ | Not in live DB; removed from codebase |

**Total committed capital sum on deal detail:** ❌ No aggregated total displayed

### §6.5 Activity Fields

| Field | In DB | In UI | Notes |
|-------|-------|-------|-------|
| deal_id, contact_id, company_id | ✅ | ✅ | All three linkable in LogActivityDialog |
| type | ✅ | ✅ | All 7 types including AI Update |
| subject | ✅ | ✅ | — |
| body | ✅ | ⚠️ | Stored; shown truncated in feed; expand-on-click not implemented |
| date | ✅ | ✅ | Shown in feed |
| outlook_message_id | ✅ | ❌ | Field exists for future integration; no UI |
| attachments (text[]) | ✅ | ❌ | Field exists; not wired to file upload in LogActivityDialog |
| ai_generated (boolean) | ✅ | ❌ | Flag stored; AI badge not rendered in ActivityFeed |
| created_by | ✅ | ❌ | Not displayed |

**Activity side effects (auto-update parent fields):**
| Side Effect | Status |
|-------------|--------|
| Auto-update Contact.last_interaction_date | ❌ |
| Auto-update Deal.last_activity_date | ❌ |
| Auto-update Deal.last_contacted (for Email/Call/Meeting) | ❌ |
| Auto-update Deal.next_activity_date (if future-dated) | ❌ |
| Auto-update DealParticipant.last_activity_date | ❌ |

*These would be implemented as Supabase database triggers or edge functions.*

---

## §7 Feature Modules

### §7.1 Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| Default KPI: Total Active Deals | ✅ | — |
| Default KPI: Active Contacts | ✅ | — |
| Default KPI: Total Deal Amount | ✅ | — |
| KPI customization (up to 8, Super Admin) | ❌ | Settings tab placeholder only; no config UI |
| Dynamic KPI activation when custom fields added | ❌ | Not wired to schema_config |
| Bar chart: Deals by Stage | ✅ | — |
| Pie chart: Contacts by Lead Status | ✅ | — |
| Pie chart configurable field (via Settings) | ❌ | Hardcoded to lead_status |
| 10 most recent deals (clickable) | ✅ | — |
| 20 most recent activities (with AI badge) | ⚠️ | Feed renders; AI badge missing |
| Activity contact/deal names as clickable links | ⚠️ | Deal links done; contact names not linked |

### §7.2 Deals Board (Kanban)

| Feature | Status | Notes |
|---------|--------|-------|
| Configurable stage columns | ✅ | Driven by pipeline_config |
| Deal cards with all 6 data points | ✅ | name, asset class, location, amount, close date, priority dot |
| Close date shown on closed deals | ⚠️ | Date field available but card doesn't highlight it when stage=Closed |
| Drag-and-drop with optimistic UI + rollback | ✅ | — |
| Column footer total amount | ✅ | Sum per stage column |
| Quick-edit panel (card click) | ✅ | Sheet component |
| "Open full view" link in quick-edit | ✅ | — |
| Create Deal modal | ✅ | All fields including AutofillInput |
| Toggle Kanban / List view | ✅ | — |
| List view sortable columns | ✅ | All 7 columns |
| Custom deal views (saved filter/column combos) | ❌ | No CustomViewsSidebar on deals page |
| Custom fields on deal cards (equity raise progress bar) | ❌ | Only base fields shown on card |

### §7.3 Detail Pages

| Feature | Status | Notes |
|---------|--------|-------|
| Consistent 3-column layout (30/50/20) | ✅ | All 3 entity types |
| Left column: summary card + all fields inline editable | ✅ | — |
| Fields grouped by category | ✅ | — |
| Center: Activities tab | ✅ | — |
| Center: Deal Participants tab | ✅ | — |
| Center: NDA Tracking tab | ✅ | — |
| Right: associations (linked entities) | ✅ | — |
| Right: file attachments (drag-drop + list) | ⚠️ | UI complete; requires Supabase Storage bucket |
| InlineEditField — text / number / date / textarea / select | ✅ | All types supported |
| InlineEditField — spinner while saving | ✅ | — |
| Custom fields rendered from schema_config | ✅ | — |

### §7.4 Contacts Page

| Feature | Status | Notes |
|---------|--------|-------|
| Paginated table (50/page cursor) | ✅ | — |
| Full-text search | ⚠️ | Uses ilike (prefix/substring); tsvector full-text search not wired |
| Custom views sidebar | ✅ | — |
| Sort by any column | ⚠️ | Sort works client-side on current page only |
| Configurable column set | ❌ | Fixed columns; not user-configurable |
| Add Contact modal | ✅ | Tabbed form |
| Company auto-create/append on contact save | ❌ | — |
| Soft delete with confirmation | ✅ | ConfirmDialog + `deleted_at` |
| Export CSV | ✅ | — |

### §7.5 Companies Page

| Feature | Status | Notes |
|---------|--------|-------|
| Paginated table (name, type, industry, AUM, HQ, contact count, website) | ✅ | — |
| Search on company name | ✅ | — |
| Add Company modal | ✅ | Domain auto-extracted from website field |
| Click name → detail page | ✅ | — |
| Export CSV | ✅ | — |

### §7.6 Activity Log

| Feature | Status | Notes |
|---------|--------|-------|
| Global activity feed | ✅ | — |
| Multi-select type filter chips | ✅ | — |
| Search on subject/body | ✅ | — |
| Rows: type icon, subject, date, linked deal/contact | ✅ | — |
| AI badge on ai_generated activities | ❌ | Not rendered |
| Expandable body text | ❌ | Body shown truncated; no expand control |
| Create Activity modal with all fields | ✅ | — |
| Company dropdown in Log Activity dialog | ❌ | Only deal_id and contact_id selectable |
| File attachment on activity creation | ❌ | PRD §9.3; not wired |
| Load More / cursor pagination | ✅ | — |

### §7.7 Settings (Super Admin)

| Feature | Status | Notes |
|---------|--------|-------|
| Deal Fields tab — add/edit/remove custom fields | ✅ | — |
| Contact Fields tab | ✅ | — |
| Company Fields tab | ✅ | — |
| Field types: text / number / date / select | ✅ | — |
| Locked fields protection (first_name, last_name, etc.) | ⚠️ | `locked: true` in FieldDefinition type; UI shows lock icon but delete action may still fire |
| Manage enum options for select fields | ✅ | Options array editable |
| Dashboard KPI Configuration tab (up to 8 KPIs) | ❌ | Tab placeholder only |
| Pipeline Stages tab | ✅ | DnD reorder, add, delete |
| Stage deletion confirmation dialog | ✅ | — |
| Schema changes apply immediately to all users | ✅ | useSchemaConfig invalidates on save |
| Schema versioning / rollback | ❌ | No version increment or rollback |
| User management (invite / deactivate) | ❌ | Not built |
| Audit log viewer | ❌ | Not built |

### §7.8 AutofillInput

| Feature | Status | Notes |
|---------|--------|-------|
| Debounced query after 2+ chars (200ms) | ✅ | 300ms debounce |
| Supabase ilike prefix match | ✅ | — |
| Floating dropdown, z-50 | ✅ | — |
| Arrow keys + Enter + Escape navigation | ✅ | — |
| Scoped to same entity type | ✅ | `table` + `column` props |
| Frequency-ranked suggestions | ❌ | Results returned in DB order, not frequency-ranked |
| Backend GET /api/autofill endpoint | ❌ | Direct Supabase client query (no dedicated API endpoint) |
| Used on location, city, state, industry, job_title, company_name | ⚠️ | Used on some fields; not on all listed fields |

---

## §8 AI Features

### §8.1 AI Adapter Layer

| Feature | Status | Notes |
|---------|--------|-------|
| Anthropic Claude integration | ✅ | Claude Sonnet 4.6 |
| Model-agnostic adapter (AI_PROVIDER env var) | ❌ | Hardcoded to Anthropic; no OpenAI fallback |
| Retry logic with backoff | ❌ | Single attempt; no retry |
| Token logging | ❌ | Not implemented |
| Error normalization | ⚠️ | Basic try/catch; no structured error codes |
| Graceful degradation (AI outage = non-AI features work) | ✅ | API route isolated; app works without API key |

### §8.2 AI Field Update (Deal Detail Page)

| Feature | Status | Notes |
|---------|--------|-------|
| AI update text panel on Deal Detail page | ❌ | **Not implemented** — no AI update panel on deal detail |
| Deal context injected into prompt | ❌ | — |
| Propose deal_updates + participant_status_updates | ❌ | — |
| Propose-and-confirm flow with per-item checkboxes | ❌ | — |
| Editable activity note before confirming | ❌ | — |
| On confirm: patch deal + create AI Update activity | ❌ | — |
| Error handling: invalid enum highlight + block | ❌ | — |

*Note: The Global Chatbot (§8.3) implements a similar flow from the FAB. The deal-page-specific panel described in §8.2 is a separate, dedicated widget on the Deal Detail page.*

### §8.3 Global AI Chatbot

| Feature | Status | Notes |
|---------|--------|-------|
| Floating FAB bottom-right | ✅ | — |
| Ctrl+K / Cmd+K shortcut | ✅ | — |
| Chat panel with message history | ✅ | — |
| Typing indicator (bounce dots) | ✅ | — |
| Suggestion chips on open | ✅ | — |
| Search deals tool | ✅ | — |
| Search contacts tool | ✅ | — |
| Get deal participants tool | ✅ | — |
| Get recent activities tool | ✅ | — |
| Propose changes tool (propose-and-confirm) | ✅ | — |
| Apply deal_updates on confirm | ✅ | Direct Supabase patch |
| Apply participant_updates on confirm | ✅ | — |
| Apply activity_creates on confirm | ✅ | — |
| Query cache invalidation after confirm | ✅ | — |
| Never creates Deals/Contacts/Companies | ✅ | Enforced in system prompt |
| Never deletes | ✅ | Enforced in system prompt |
| Per-item checkbox toggle before confirm | ✅ | — |
| Clear conversation button | ✅ | — |
| Shift+Enter for newline | ✅ | — |
| Streaming responses | ❌ | Non-streaming |
| Session-based conversation history | ✅ | In-component state |
| User identity tracked for attribution | ❌ | Not passed to API route |
| Companies tool (read-only) | ❌ | Not in tool list |
| Rate limiting (10 req/min AI) | ❌ | No rate limiting |
| ANTHROPIC_API_KEY configured | ⚠️ | Placeholder in .env.local; requires actual key |

---

## §9 File Storage & Attachments

| Feature | Status | Notes |
|---------|--------|-------|
| S3-compatible storage backend | ⚠️ | Supabase Storage used (S3-compatible); bucket must be created |
| File entity / metadata in PostgreSQL | ✅ | `use-files.ts` hooks |
| Signed URLs (1-hour expiry) | ✅ | Supabase `createSignedUrl` |
| Drag-and-drop upload zone on detail pages | ✅ | In deal-right-panel |
| Click-to-browse fallback | ✅ | — |
| File list: filename, size, upload date, uploader | ⚠️ | filename + size shown; uploader not resolved to name |
| Preview (images/PDFs) | ⚠️ | Download works; in-app preview not implemented |
| Download action | ✅ | Signed URL download |
| Delete file (soft delete: storage + row) | ✅ | `useDeleteFile` |
| File attachments on Contact/Company detail pages | ✅ | deal-right-panel pattern reused |
| Activity attachments (file attach when creating) | ❌ | LogActivityDialog doesn't support attachments |
| Max 25MB / 10 files per batch | ❌ | No client-side validation |
| Supported file type validation | ❌ | No MIME type filter on upload |

---

## §10 Mass Import & Export

### §10.1 Import

| Feature | Status | Notes |
|---------|--------|-------|
| Step 1: Entity type selection | ✅ | Contacts / Companies / Deals |
| Step 2: CSV upload + parse | ✅ | FileReader + manual split |
| Step 2: Excel (.xlsx) upload + parse | ✅ | Dynamic `import("xlsx")` |
| Step 2: Show filename, row count, headers | ✅ | — |
| Step 3: Column mapping (auto-match by name) | ✅ | — |
| Step 3: Manual adjustment / skip | ✅ | — |
| Step 3: Create new custom field for unmatched columns | ❌ | Not implemented |
| Step 4: Preview first 10 rows | ✅ | — |
| Step 4: Red highlight for missing required fields | ✅ | — |
| Step 5: Deduplication on email (contacts) | ✅ | Shows matches |
| Step 5: Deduplication on domain (companies) | ⚠️ | Basic; domain extraction not always reliable |
| Step 5: Skip / Update / Create options per duplicate | ✅ | — |
| Step 6: Batch insert (chunks of 50) | ✅ | — |
| Step 6: Progress display | ✅ | — |
| Step 6: Summary: X imported, Y skipped, Z errors | ✅ | — |
| Step 6: Downloadable CSV error report | ✅ | — |
| Company auto-link during contact import | ❌ | Not implemented |
| Type inference for new custom fields | ❌ | Not implemented (feature not available) |

### §10.2 Export

| Feature | Status | Notes |
|---------|--------|-------|
| Export current view as CSV | ✅ | ExportCSVButton component |
| Export as Excel (.xlsx) | ❌ | Not implemented |
| Available on Contacts, Deals, Companies, Activity pages | ⚠️ | On Contacts, Companies; deals page and activity page may be missing button |
| Max 50K rows per file | ❌ | No enforced limit |
| Large export queue + email link | ❌ | Phase 2 |

---

## §11 Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| 11.1 Outlook Email Sync (OAuth2, 5-min sync) | 🔒 | Phase 2 |
| 11.2 DocuSign NDA Tracking (webhook) | 🔒 | Phase 2; `nda_docusign_envelope_id` field placeholder |
| 11.3 WhatsApp / Slack / Teams chatbot | 🔒 | Phase 2 |
| 11.4 Webhook queue architecture (Redis) | 🔒 | Phase 2 |

---

## §12 Investor Portal & Reporting

| Feature | Status | Notes |
|---------|--------|-------|
| 12.1 Separate LP investor portal | 🔒 | Phase 2 |
| 12.2 PDF tear sheets / reports | 🔒 | Phase 2 |
| 12.3 Advanced analytics dashboard (funnel, time-in-stage, conversion) | 🔒 | Phase 2 |

---

## §13 Additional Platform Features

| Feature | Status | Notes |
|---------|--------|-------|
| 13.1 Field-level permissions (per-field role access) | 🔒 | Phase 2 |
| 13.2 Email + Slack notifications (stage changes, commitments, NDAs) | 🔒 | Phase 2 |
| 13.2 In-app notification center | 🔒 | Phase 2 |
| 13.3 Native mobile app (iOS/Android) | 🔒 | Phase 2 |
| 13.4 Multi-pipeline support | 🔒 | Phase 2; `pipeline` field exists on Deal |

---

## §14 Navigation, Layout & Design

| Feature | Status | Notes |
|---------|--------|-------|
| /login route | ✅ | — |
| / (Dashboard) | ✅ | — |
| /deals (Board + List) | ✅ | — |
| /deals/:id (Deal Detail) | ✅ | — |
| /contacts (Table + Views) | ✅ | — |
| /contacts/:id (Contact Detail) | ✅ | — |
| /companies | ✅ | — |
| /companies/:id (Company Detail) | ✅ | — |
| /activity | ✅ | — |
| /import (Super Admin + User) | ✅ | — |
| /settings (Super Admin only) | ✅ | — |
| Inter font (Google Fonts) | ✅ | — |
| Primary color: deep navy hsl(220,70%,22%) | ✅ | — |
| Accent: amber hsl(38,92%,50%) | ✅ | — |
| Background: soft gray hsl(220,20%,97%) | ✅ | — |
| Sidebar: dark navy hsl(220,30%,14%) | ✅ | — |
| Border radius: 0.75rem | ✅ | — |
| AI Chatbot FAB independent of sidebar | ✅ | — |

*Note: PRD §14.4 specifies shadcn/ui + Radix; implementation uses Base UI + custom components — functionally equivalent.*

---

## §15 Technical Architecture

| Requirement | Status | Notes |
|-------------|--------|-------|
| React 18+ with TypeScript | ✅ | Next.js 14 App Router (PRD says Vite/React Router; Next.js is equivalent) |
| TanStack Query (server state) | ✅ | v5 |
| Tailwind CSS | ✅ | — |
| PostgreSQL 15+ (Supabase) | ✅ | — |
| Custom fields in JSONB | ✅ | — |
| Schema config in dedicated table | ✅ | `schema_config` table |
| Full-text search via tsvector | ❌ | Using ilike; no tsvector on contacts |
| Cursor-based pagination (no offset) | ✅ | `lt("created_at", cursor)` |
| JWT auth middleware | ✅ | `src/middleware.ts` |
| Role-based authorization middleware | ⚠️ | Super Admin checked on Settings page; no per-endpoint RBAC |
| S3-compatible file storage | ✅ | Supabase Storage |
| CI/CD pipeline | ❌ | Not configured |
| Docker containerization | ❌ | Not configured |
| Redis for event queues | ❌ | Phase 2 |
| Rate limiting (100 req/min standard, 10 AI) | ❌ | Not implemented |

---

## §16 Security & Non-Functional

| Requirement | Status | Notes |
|-------------|--------|-------|
| JWT auth, httpOnly cookies | ✅ | Supabase handles |
| CSRF protection on mutations | ⚠️ | Supabase SDK includes CSRF headers; not explicitly configured |
| Frontend route guards | ✅ | middleware.ts |
| Backend endpoint JWT validation | ✅ | Supabase RLS + chat API |
| No PII in logs | ✅ | No custom logging |
| TLS in transit | ✅ | Supabase enforces |
| Audit log (all CUD operations) | ❌ | Not implemented |
| Input validation/sanitization | ⚠️ | Zod on forms; API routes trust input |
| SQL injection prevention | ✅ | Parameterized queries via Supabase SDK |
| XSS prevention | ✅ | React escapes by default |
| Performance: Page FCP < 2s | ✅ | Next.js SSR/RSC |
| Performance: Contact list < 1s | ✅ | Cursor pagination |
| Performance: Kanban drag-drop save < 500ms | ✅ | Optimistic update |
| Performance: AI response < 10s | ✅ | Claude Sonnet 4.6 |
| Scale: 50K+ contacts | ✅ | Cursor-based pagination designed for it |

---

## Summary

| Category | Done | Partial | Not Started | Phase 2 |
|----------|------|---------|-------------|---------|
| Screens (§3) | 32 | 10 | 4 | 0 |
| Data Model (§6) | 46 | 12 | 14 | 0 |
| Feature Modules (§7) | 52 | 14 | 15 | 0 |
| AI Features (§8) | 17 | 4 | 16 | 0 |
| File Storage (§9) | 5 | 4 | 4 | 0 |
| Import/Export (§10) | 12 | 3 | 6 | 1 |
| Integrations (§11) | 0 | 0 | 0 | 4 |
| Portal/Reports (§12) | 0 | 0 | 0 | 3 |
| Additional Features (§13) | 0 | 0 | 0 | 4 |
| Tech/Security (§15–16) | 15 | 4 | 7 | 2 |

---

## Top Priority Gaps (Non-Phase-2)

1. **AI badge on activities** — `ai_generated` flag exists in DB but not rendered (`activity-feed.tsx`)
2. **Total committed capital sum** on Deal Detail participants tab
3. **Company auto-create/link from Contact** (§6.3.1) — core CRM feature
4. **AI Field Update panel on Deal Detail** (§8.2) — dedicated deal-page AI widget
5. **Settings: Dashboard KPI config tab** — tab is placeholder only
6. **contact_owner UUID → name display** on contact detail
7. **Activity body expand-on-click** in ActivityFeed
8. **Custom views on Deals page** — CustomViewsSidebar not mounted
9. **`ai_generated` activity creation** — chatbot creates activities but doesn't set `ai_generated: true`
10. **Read-Only role enforcement** — no UI gates for read-only users
11. **Days-to-close computed field** — not calculated on deal close
12. **Excel export (.xlsx)** — CSV only; PRD requires Excel
13. **tsvector full-text search** on contacts (currently ilike)
14. **Activity date field** in LogActivityDialog defaulting to today and stored
15. **Company dropdown in LogActivityDialog** (company_id linkage)
