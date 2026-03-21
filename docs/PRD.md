
RE CAPITAL IQ
Investor Relations & Deal Tracking Platform
Product Requirements Document

Final  |  March 2026
Prepared for Management Review
Classification: Internal — Confidential
 
1. Executive Brief
What it is: RE Capital IQ is a purpose-built, private web platform that replaces fragmented spreadsheets, CRMs, and email threads with a single secure system for managing real estate deal pipelines, investor relationships, and capital raising activity.

Who it serves: Deal principals, investor relations professionals, and analysts at real estate investment firms. All users are internal; there is no public access.

Problem it solves: IR teams today track deals across HubSpot, Excel, Outlook, and shared drives. Contact data is duplicated and stale. Activity history is scattered. There is no single view of pipeline health, equity raise progress, or investor engagement. Manual data entry consumes hours weekly that should be spent on relationship-building.

Key Capabilities
•	Deal Pipeline Management — Visual Kanban board with drag-and-drop stage tracking, deal amount visibility, and priority indicators across the full deal lifecycle. Equity raise tracking available via custom fields.
•	Investor & Company CRM — 50,000+ contact database with company-level aggregation, 5 investor-type categorizations, custom views, and full-text search.
•	AI-Assisted Updates — Natural language input parsed by AI (Claude/ChatGPT) into structured field updates, activity logs, and participant status changes — all with human review before commit.
•	Global AI Chatbot — Floating assistant accessible from any page for conversational data queries, meeting note processing, and cross-entity updates.
•	NDA Lifecycle Tracking — Firm-level and deal-specific NDA management with dedicated tracking views and DocuSign integration pathway.
•	Mass Import/Export — CSV/Excel import with intelligent field matching, deduplication, and new-field creation. Full data export for any view.
•	File Storage — S3-based document management attached to any entity with preview, download, and access control.
•	Integration-Ready Architecture — Webhook stubs and data model fields for Outlook email sync, DocuSign live tracking, and multi-channel chatbot (WhatsApp/Slack/Teams).

Expected Business Impact
Metric	Expected Outcome
Data entry time	40%+ reduction via AI-assisted updates and bulk import
Pipeline visibility	100% of active deals tracked in a single view
Investor data quality	Deduplication and company-level aggregation across 50K+ contacts
Decision speed	Real-time equity raise dashboards replace weekly manual reports
Relationship continuity	Full activity history per contact/deal eliminates institutional knowledge loss
 
2. Why Build (Competitive Context)
The firm currently uses HubSpot for contact management. While HubSpot is a capable general-purpose CRM, it was not designed for real estate capital markets workflows. The following gaps drive the decision to build a purpose-built platform:

Capability	HubSpot / Generic CRM	RE Capital IQ
Deal pipeline stages	Generic sales stages. Requires heavy customization to model RE deal flow (Overviews, LOI, Sourcing, etc.).	Built-in RE deal pipeline with configurable stages, asset class categorization, and extensible custom fields for equity raise, IRR, and financial targets.
Investor categorization	Flat contact types. Cannot natively model capital type, family office vs. institutional vs. retail, or relationship tiers.	Five dedicated investor-type dropdowns matching the firm’s existing taxonomy. Relationship tiers, prior outreach tracking, and database source fields.
Deal–Investor junction	Associations exist but lack deal-specific NDA tracking, commitment amounts, and participant status workflows.	Deal Participant entity with per-deal role, status, commitment, NDA sent/signed dates, and activity tracking.
NDA lifecycle	No native NDA workflow. Requires third-party plugins or manual tracking.	Two-tier NDA tracking (firm-level + deal-specific) with dedicated UI tab and DocuSign integration pathway.
AI-assisted data entry	Third-party AI plugins with limited CRM integration. No structured field extraction.	Built-in AI that parses natural language into deal field updates, activity logs, and participant status changes with human-in-the-loop review.
Company-level aggregation	Company records exist but lack automatic creation from contacts or investor-profile mirroring.	Auto-create/append Company from Contact data. Company detail page aggregates all contacts, deals, and commitments.
Cost at scale	HubSpot Enterprise: $1,500+/mo for 10 seats + API access. Custom objects require top tier.	One-time build cost. No per-seat licensing. Full data ownership and customization control.

Alternatives evaluated: Juniper Square (strong LP portal but rigid pipeline), DealCloud (expensive enterprise tool, long implementation), Salesforce (requires heavy customization and consultants). None provide the combination of RE-specific deal pipeline, AI-assisted updates, and investor categorization depth the firm requires at a reasonable cost.
 
3. Platform Overview (Screen-by-Screen)
This section walks through what a user experiences when they open RE Capital IQ, moving screen by screen through the core application.

3.1 Login
A clean login page with the RE Capital IQ branding. Email and password fields. All access requires authentication — there is no public content. After login, the user is redirected to the Dashboard.

3.2 Sidebar Navigation
A persistent dark navy sidebar on the left contains links to: Dashboard, Deals, Contacts, Companies, Activity, and (for Super Admins) Settings. The sidebar also shows the RE Capital IQ logo and an “Investor Relations” subtitle. On mobile, the sidebar collapses behind a hamburger menu.

3.3 Dashboard
The first thing a user sees after login. The top row shows KPI cards (customizable by Super Admins): defaults include total active deals, active contacts, and total deal amount. Below the KPIs are two charts: a bar chart of deals by stage and a pie chart of contacts by lead status. The lower section shows the 10 most recently updated deals, and a timeline of the 20 most recent activities across the firm. Every deal and contact name is clickable, linking directly to its detail page. Additional KPIs (e.g., equity raise tracking) activate automatically when the corresponding custom fields are added via Settings.

3.4 Deals Board
A visual Kanban board with columns for each pipeline stage (Overviews, Deal Review, Sourcing, LOI Sent, Closed, On Hold, Pass). Each deal appears as a card showing its name, asset class, location, deal amount, close date, and a color-coded priority dot. Users drag cards between columns to update deal stages — changes save instantly. Clicking a card opens a quick-edit panel on the right. A toggle switches between the Kanban view and a filterable list view. Users can create custom deal views with saved filters.

3.5 Detail Pages (Deal, Contact, Company)
Every entity detail page follows the same consistent layout. The left sidebar (~30%) shows the entity summary at the top (name, badges, primary identifier — email for contacts, website/domain for companies, location/stage for deals) and all editable fields below, grouped by category. The right sidebar (~20%) shows all associations (linked contacts, deals, companies) and attached files. The center area (~50%) is a full-width tabbed section with three tabs: Activities (chronological table of all interactions), Deal Participants (who is involved in which deal with what role, status, and commitment), and NDA Tracking (consolidated view of all firm-level and deal-specific NDAs). Only one tab is visible at a time, using the full center width.

3.6 Contacts Page
A paginated table of all contacts, supporting 50,000+ records. Users can search by name, email, or company. Custom views allow saving filter/column combinations (e.g., “Active LPs in Southeast” or “HNW Prospects — Need to Call”). The table supports sorting by any column. Clicking a contact name opens its detail page.

3.7 Companies Page
A paginated table of all companies showing name, type, investor category, AUM, HQ location, and contact count. Clicking a company name opens its detail page, which aggregates all associated contacts and their deal participation.

3.8 Activity Log
A global feed of all activities across the firm: calls, emails, meetings, notes, NDA events, documents, and AI-generated updates. Filterable by type with full-text search on subject and body. Each entry shows the type icon, subject, date, and linked deal/contact names. AI-generated activities are flagged with a distinct badge.

3.9 AI Chatbot
A floating button in the bottom-right corner of every page. Clicking it opens a chat panel where users can type natural language instructions: “Log a call with Sarah Kim about Oakmont, she soft circled $3M.” The chatbot parses this, proposes structured changes (create deal participant, update status, log activity), and waits for the user to confirm before saving anything. Works from any page — not context-dependent.

3.10 Settings (Super Admin)
Configuration hub for the platform. Tabs for Deal Fields, Contact Fields, Company Fields, and Dashboard KPIs. Super Admins can add, edit, or remove fields on any entity, manage dropdown options, and configure which KPI metrics appear on the dashboard. Changes take effect immediately for all users.
 
4. Platform Workflows
Three core user journeys that illustrate how the platform is used day-to-day.

4.1 Workflow: Deal Lifecycle (Creation Through Close)
Persona: A, Deal Principal

1.	A receives a new acquisition opportunity. He opens the Deals Board and clicks “+ New Deal.” A modal appears with all deal fields (name, amount, asset class, location, deal type, etc.). He fills in the basics and saves. The deal card appears in the “Overviews” column.
2.	After initial review, A drags the card from “Overviews” to “Deal Review.” The stage change saves automatically. He clicks the card to open quick-edit and adds financial details.
3.	A opens the deal’s detail page. In the Deal Participants tab, he clicks “Add Participant” and searches for investors from the contact database. He links three investors, setting each one’s status to “Introduced.”
4.	Over the next weeks, A uses the AI chatbot from any page: “Met with Sarah Kim from BluePeak yesterday. She’s interested, wants to see the deck. Also met John Park — he soft circled $5M.” The chatbot proposes: update Sarah’s status to “Reviewing Deck,” update John’s status to “Soft Circle” with $5M commitment, and log two activities. A reviews and confirms.
5.	As commitments accumulate on the Deal Participants tab, A can track total committed capital at a glance from the deal detail page.
6.	When the deal is ready to close, A drags it to “Closed.” The close date auto-populates. Days-to-close is auto-calculated. All participants with status “Committed” are marked “Closed.”

4.2 Workflow: Investor Relationship Management
Persona: B, Head of Investor Relations

1.	B receives a spreadsheet of 2,000 new contacts from a conference. He goes to the Import page, uploads the CSV, and maps columns to platform fields. The system flags 150 contacts with duplicate email addresses and offers merge/skip options. It also flags 80 companies with matching domains and offers to link contacts to existing companies. 50 contacts have a “Minimum Check Size” column that doesn’t match any existing field — B creates it as a new custom field right from the import screen. 1,850 contacts are imported successfully.
2.	For each imported contact, the system auto-creates or links to Company records based on domain matching. If a contact’s email is sarah@bluepeak.com, the system extracts “bluepeak.com” and matches it to an existing Company with that domain. BluePeak Capital already exists, so 12 contacts are linked to it. Meridian Partners is new — a Company record is auto-created with the industry and location data from the first contact.
3.	B creates a custom view: “Conference Leads — Need to Call” filtered by lead_status = “Need to Call” and tagged with the conference name. He sees 400 contacts to reach out to.
4.	As calls happen, B logs activities via the AI chatbot: “Called Tom Chen at Meridian. He’s interested in development deals in the Southeast. Set up a follow-up for next Thursday.” The chatbot updates Tom’s lead status, investment preferences, and logs the activity. When B types “Southeast” in the region field, the system auto-suggests it from existing data.
5.	When Tom is ready for a specific deal, B links him as a Deal Participant. The NDA Tracking tab shows Tom needs a deal-specific NDA. B initiates the NDA workflow (DocuSign integration when live; manual tracking in v1).
6.	On the Company Detail page for Meridian Partners, B can see all contacts, their aggregate deal participation, and total commitments across deals — giving a firm-level relationship view.

4.3 Workflow: AI-Assisted Daily Operations
Persona: C, Senior Associate

1.	C starts his day by opening the Dashboard. KPI cards show the firm has 12 active deals with $180M in total deal value. He clicks into the Oakmont deal to check participant commitments.
2.	C had three investor meetings yesterday. Instead of opening each deal and manually updating fields, he opens the AI chatbot (Ctrl+K) and pastes his meeting notes: a full paragraph covering all three meetings, who he met, what was discussed, and what commitments were made.
3.	The chatbot parses the notes and presents a structured summary: 6 proposed changes across 2 deals and 3 contacts. C scans the list, unchecks one item that the AI misinterpreted, edits an activity note for clarity, and clicks “Confirm.” Five updates save in seconds — what would have taken 20 minutes of manual data entry.
4.	Later, C’s colleague asks about investor overlap between two deals. C types into the chatbot: “Which investors are on both Oakmont and Sunridge?” The chatbot queries the Deal Participant records and returns a list with each investor’s status and commitment on both deals.
5.	At end of day, C exports the “Active Deals” custom view as an Excel file for a partner meeting tomorrow. The export includes all visible columns with current data.
 
5. Users, Roles & Permissions
Authentication is mandatory. Every route (frontend and backend) requires a valid JWT. Unauthenticated requests receive a 401 response.

5.1 Roles
Role	Description
Super Admin	Full access. Manages users, configures settings (schema, stages, KPIs), views audit logs. Only Super Admins can add/edit/delete fields in Settings.
User	Standard access. Views and manages deals, contacts, companies, activities, deal participants. Uses AI chatbot. Cannot access Settings or manage users.
Read-Only	View-only access. Can view all records, dashboards, reports. Can export data. Cannot create, edit, or delete records. Cannot use AI features.

5.2 Permission Matrix
Action	Super Admin	User	Read-Only
View all entities	Yes	Yes	Yes
Create/edit deals, contacts, companies	Yes	Yes	No
Create/edit activities	Yes	Yes	No
Manage deal participants	Yes	Yes	No
Use AI chatbot and AI field update	Yes	Yes	No
Create/manage custom views	Yes	Yes	Yes (view only)
Upload/delete files	Yes	Yes	No
Mass import data	Yes	Yes	No
Mass export data	Yes	Yes	Yes
Delete records (soft delete)	Yes	Yes	No
Modify schema (Settings)	Yes	No	No
Configure dashboard KPIs	Yes	No	No
Manage pipeline stages	Yes	No	No
Invite/deactivate users	Yes	No	No
View audit logs	Yes	No	No

5.3 Authentication Details
•	JWT-based with access tokens (15-min expiry) and refresh tokens (7-day expiry).
•	Tokens stored in httpOnly secure cookies (never localStorage).
•	All API endpoints validate JWT and check role permissions before processing.
•	Frontend route guards redirect unauthenticated users to login, unauthorized users to 403.
•	Session invalidation on password change or admin deactivation.
 
6. Core Data Model
Five core entities: Deal, Contact, Company, Deal Participant, and Activity. All use UUID primary keys, auto-managed timestamps (created_at, updated_at), and soft deletes (deleted_at). Database: PostgreSQL 15+. Custom fields stored in JSONB columns.
 
6.1 Deal
Represents a real estate investment opportunity tracked through the pipeline.

#	Field	Type	Notes
CORE INFORMATION
1	name	text (required)	Deal name, unique within active deals
2	amount	decimal	Total dollar value (USD)
3	stage	enum (required)	Overviews | Deal Review | Sourcing | LOI Sent | Closed | On Hold | Pass. Configurable via Settings.
4	pipeline	enum	Deal Pipeline (single; field exists for future multi-pipeline)
5	deal_type	enum	Development | Acquisition
6	description	text (long)	Free-text deal description
7	currency	enum	USD (default; field exists for future multi-currency)
8	priority	enum	Low | Medium | High. Default: Medium
9	location	text	Free-text location / market name
10	asset_class	enum	Residential - For Rent | Residential - For Sale | Retail | Office | Industrial/Storage | Hotel | Healthcare/Senior | Land | Datacenter | Other
DATES & TIMING
11	create_date	timestamp (auto)	Auto-set on creation
12	close_date	date (auto)	Auto-set when stage → Closed
13	expected_close_date	date	Manually set anticipated closure
14	days_to_close	integer (computed)	close_date minus create_date. Null if not closed.
15	last_contacted	datetime (auto)	Auto on last call/email/meeting activity
16	last_activity_date	datetime (auto)	Auto on any activity (note, call, email, meeting, task)
17	next_activity_date	datetime (auto)	Auto from next scheduled activity
OWNERSHIP & TEAM
18	deal_owner	uuid (FK to User)	Primary deal owner (dropdown of platform users)
19	deal_collaborator	uuid (FK to User)	Secondary collaborator (dropdown of platform users)
SYSTEM
	id	uuid (PK)	Auto-generated
	created_by	uuid (FK)	Auto-set
	updated_at / deleted_at	timestamp	Auto-managed
	custom_fields	jsonb	Fields added via Settings. Features like equity raise tracking, IRR targets, NDA required, and property images can be added here as needed.

Note: Fields such as equity_raise, equity_raised, target_irr, target_equity_multiple, investment_period, property address, image_url, nda_required, and notes are not part of the base schema. They can be added at any time by a Super Admin via Settings as custom fields. Features that depend on these fields (e.g., equity raise progress bars, IRR display) will activate automatically once the fields exist.
 
6.2 Contact
Represents an individual investor, broker, lender, or deal-related party. Primary identifier: email address. Investor type split into five separate dropdowns matching the firm’s HubSpot taxonomy.

#	Field	Type	Notes
PERSONAL INFORMATION
1	first_name	text (required, locked)	Cannot be deleted or type-changed in Settings
2	last_name	text (required, locked)	Cannot be deleted or type-changed in Settings
3	email	text	Primary identifier. Used for deduplication and display.
4	phone	text	Primary phone number
5	job_title	text	Job title at company
COMPANY & WORK
6	company_id	uuid (FK to Company)	Auto-creates or appends to Company (see Section 6.3)
7	company_name	text (derived)	Denormalized from Company.name for search/display. Maps to HubSpot “Company name.”
8	industry	text	Industry
9	website	text	Company website URL
LOCATION
10	street_address	text	Including apartment/unit number
11	city	text	City of residence
12	state	text	State or region
13	postal_code	text	Zip/postal code
14	country	text	Country of residence. Default: US
15	time_zone	enum	All global time zones (e.g., UTC -05:00 US Central, UTC +05:30 Asia Kolkata)
LIFECYCLE & OWNERSHIP
16	contact_owner	uuid (FK to User)	Dropdown of platform users
17	lead_status	enum	Need to Call | Left VM | Call Scheduled | Had Call | Tag to Deal | Hold off for now
INVESTOR TYPE (5 Separate Dropdowns)
18	capital_type	enum	Senior Debt | GP Equity | LP - Large | LP - Mid | Subordinated Debt/Pref Equity | Senior Debt - TX Banks | LP - Small
19	family_office	enum	Family Office - Single | Family Office - Multi
20	institutional	enum	Fund Manager/Allocator | Sovereign Wealth | Life Company
21	retail	enum	HNW | Emerging | HNW (TX) | UHNW
22	indirect	enum	Pension Fund | Foundation | Endowment | RIA
23	ownership	enum	Direct Owner
INVESTMENT PREFERENCES
24	investment_strategy	enum	Development | Acquisition
25	region	enum	Mid-West | Northeast | Southeast | Southwest | West | International
26	asset_class	enum	Same options as Deal asset_class
RELATIONSHIP
27	relationship	enum	J - No Relationship | A - Very Well | B - Warm | H - Call | X - Going Concern | Y - Lender | W - Sponsor | Z - Existing
28	last_interaction_date	datetime (auto)	Auto-updated on any activity for this contact
29	next_steps	text (long)	Free-text next steps notes
DATA & PRIOR OUTREACH
30	database_source	enum	TREP | KH
31	email_verification	enum	valid | accept_all_unverifiable | invalid | unknown
32	trep_capital_type_prior_outreach	enum (configurable)	Configurable via Settings. Initial: Programmatic Equity - TLHC IRF Income | Equity - Daytona | Equity - Healthcare | Equity - Wood River Valley Syndication | Transaction Prospects - Mountain West | Equity - TPP | Debt - Healthcare | Debt - Mountain West Banks | Debt - PAM Aiken
33	trep_deal_prior_outreach	enum (configurable)	Configurable via Settings. Initial: Tomoka Gate | Carpenter | Rivana | Magdalena | NNN Medical | MicroBay | 1600 SoCO | SoCo Hotel | Clear Sky | PAM Aiken | PAM Dover | TMC Pref | Rivana Recap | SunGate Recap
SYSTEM
	id	uuid (PK)	Auto-generated
	created_by	uuid (FK)	Auto-set
	created_at / updated_at / deleted_at	timestamp	Auto-managed
	custom_fields	jsonb	Fields added via Settings. Contact type, status, AUM, NDA, notes, tags, and LinkedIn can be added here as needed.

Note: Fields such as contact_type, status, aum, preferred_investment_size, nda_signed, nda_date, notes, tags, and linkedin are not part of the base schema. They can be added at any time by a Super Admin via Settings as custom fields. Features that reference these fields (e.g., Contacts by Type chart, firm-level NDA tracking) will activate once the relevant fields exist.
 
6.3 Company
Represents an organization. Primary identifier: website/domain. Fields mirror Contact for org-level tracking. Auto-created or appended when contacts are saved.

6.3.1 Auto-Create / Append Behavior
1.	When a Contact is saved with a company name or website, the system extracts the domain (e.g., “bluepeak.com” from “https://www.bluepeak.com” or from the contact’s email “sarah@bluepeak.com”). If no Company with that domain exists: a new Company is auto-created, populated with company-level fields from the Contact.
2.	If a Company with that domain already exists: the Contact is linked to the existing Company. Null Company fields are filled from Contact data; existing Company values are not overwritten.
3.	User sees confirmation: “Linked to existing company [Name]” or “New company [Name] created.”

6.3.2 Company Fields
#	Field	Type	Notes
CORE
1	name	text (required, locked)	Company name
2	website	text	Primary identifier for display
3	domain	text (auto-derived)	Auto-extracted from website URL or contact email domain (e.g., “bluepeak.com”). Unique within active records. Used for deduplication and contact-to-company matching.
4	company_type	enum	Investor | Broker | Lender | Legal | Other
5	industry	text	Industry vertical
6	linkedin	text	LinkedIn URL
LOCATION
7	hq_address / hq_city / hq_state / hq_country	text	Headquarters location. Country default: US
INVESTOR PROFILE (mirrors Contact)
8	capital_type	enum	Same as Contact
9	family_office / institutional / retail / indirect / ownership	enum (5 fields)	Same options as Contact. Five separate dropdowns.
10	investment_strategy	enum	Development | Acquisition
11	region / asset_class	enum	Same as Contact
12	aum	decimal	Assets under management (USD)
SYSTEM
	id / notes / custom_fields	various	Standard system fields + JSONB custom fields
	created_at / updated_at / deleted_at	timestamp	Auto-managed
6.4 Deal Participant
Junction entity linking a Contact to a Deal. Kept intentionally simple.

Field	Type	Notes
id	uuid (PK)	Auto-generated
deal_id	uuid (FK, required)	Reference to Deal
contact_id	uuid (FK, required)	Unique constraint on (deal_id, contact_id)
role	enum	Lead Investor | Co-Investor | Broker | Lender | Legal | Other
status	enum	Introduced | NDA Sent | NDA Signed | Reviewing Deck | Meeting Scheduled | Soft Circle | Committed | Passed | Closed. Default: Introduced
commitment_amount	decimal	Committed capital (USD)
notes	text (long)	Deal-specific notes
nda_sent_date	date	Deal-specific NDA sent
nda_signed_date	date	Deal-specific NDA signed
last_activity_date	date (auto)	Auto-updated on activity for this deal+contact
created_at / updated_at	timestamp	Auto-managed

NDA Layering: Deal Participant.nda_sent_date/nda_signed_date tracks deal-specific NDAs in the base schema. Firm-level NDA tracking (nda_signed, nda_date) can be added to Contacts via Settings as custom fields. Both levels are surfaced in the NDA Tracking tab once the fields exist.
6.5 Activity
Logs all interactions across entities.

Field	Type	Notes
id	uuid (PK)	Auto-generated
deal_id / contact_id / company_id	uuid (FK, optional)	Can reference any combination
type	enum (required)	Email | Call | Meeting | Note | NDA | Document | AI Update
subject	text (required)	Activity title
body	text (long)	Full notes
date	date (required)	Default: today
outlook_message_id	text	For Outlook sync integration
attachments	text[]	File URLs (linked to File Storage)
ai_generated	boolean	True if AI-created. Default: false
created_by	uuid (FK)	Auto-set
created_at	timestamp	Auto-managed

Side effects: Creating an Activity auto-updates Contact.last_interaction_date, Deal.last_activity_date, Deal.last_contacted (if Email/Call/Meeting), Deal.next_activity_date (if future-dated), and Deal Participant.last_activity_date.
6.6 Entity Relationships
•	Company 1:N Contact — optional; contacts can exist without a company.
•	Deal M:N Contact via Deal Participant.
•	Deal / Contact / Company 1:N Activity.
•	User 1:N Deal (owner/collaborator), User 1:N Contact (owner).
•	File attachments linked to any entity via polymorphic File entity.
 
7. Feature Modules
7.1 Dashboard
7.1.1 Default KPI Cards
•	Total Active Deals (count where stage is not Closed/Pass), Active Contacts (count where lead_status is set), Total Deal Amount (sum of amount across active deals). Additional KPIs (e.g., equity raise totals) can be configured once the relevant custom fields exist.
7.1.2 KPI Customization (Super Admin)
Up to 8 KPI cards configurable in Settings: label, metric (count/sum/avg), entity, field, filter. Changes apply to all users immediately.
7.1.3 Charts
•	Bar chart: Deals by Stage. Pie chart: Contacts by Lead Status (or by any enum field configured in Settings, such as contact_type if added).
7.1.4 Recent Deals & Activity
10 most recently updated active deals. 20 most recent activities with type icons and AI badges. All names linked to detail pages.

7.2 Deals Board (Kanban)
•	Columns per pipeline stage (configurable order). Deal cards: name, asset class, location, amount, close date, priority dot. Additional fields (equity raise, progress bar) appear on cards when custom fields are added.
•	Drag-and-drop stage changes with optimistic UI and rollback on failure.
•	Quick-edit slide-out panel on card click. Full detail page link.
•	Create Deal modal with schema-driven dynamic fields.
•	Toggle between Kanban and filterable list view.
•	Custom views for Deals: saved filter/column combinations, stored in database.

7.3 Detail Page Layout
Consistent across Deal, Contact, and Company (described in Section 3.5).
•	Left (~30%): summary card + all editable fields grouped by category.
•	Center (~50%): full-width tab toggle — Activities | Deal Participants | NDA Tracking. One tab visible at a time.
•	Right (~20%): associations (linked entities) + file attachments.

7.4 Contacts Page
•	Paginated table (50 rows default) supporting 50K+ records. Full-text search on name, email, company.
•	Custom views: saved filter + column combinations. Default “All Contacts” always available.
•	Sortable by any visible column. Configurable column set.
•	Add Contact modal with company auto-create/append. Edit via detail page. Soft delete with confirmation.

7.5 Companies Page
•	Paginated table: name, type, investor category, AUM, HQ location, contact count, website.
•	Search on company name. Add Company modal. Click name for detail page.

7.6 Activity Log
•	Global activity feed. Search on subject/body. Multi-select type filter.
•	Rows: type icon, subject, date, linked deal/contact, AI badge. Expandable body.
•	Create Activity modal with deal/contact/company dropdowns and file attachment.

7.7 Settings (Super Admin Only)
•	Deal Fields / Contact Fields / Company Fields tabs: add, edit, remove fields. Manage enum options. Locked fields protected.
•	Dashboard KPI Configuration tab: configure up to 8 KPI cards.
•	Pipeline Stages: add, remove, reorder stages (updates Kanban column order).
•	Schema stored in PostgreSQL (schema_config table). Versioned for cache invalidation. Changes immediate.

7.8 Auto-Fill for Text Fields
To improve data consistency and reduce manual typing, all text input fields across the platform provide auto-fill suggestions based on existing data in the database.

7.8.1 Behavior
•	When a user begins typing in a text field, the system queries existing values for that field across all records and displays a dropdown of matching suggestions.
•	Suggestions are ranked by frequency (most commonly used values appear first) and filtered by the user’s input as they type.
•	The user can select a suggestion to auto-complete the field, or continue typing a new value.
•	Auto-fill works on all text fields: location, city, state, industry, job title, company name, street address, next steps, and any custom text fields added via Settings.

7.8.2 Examples
•	Location field on Deal: User types “Dal” → suggestions appear: “Dallas, TX”, “Dallas-Fort Worth”, “Dallas Metro” (based on values already entered on other deals).
•	Industry field on Contact: User types “Real” → suggestions: “Real Estate”, “Real Estate Investment”, “Real Estate Development”.
•	City field: User types “Aus” → suggestions: “Austin”, “Austria” (from existing contact/company records).

7.8.3 Implementation
•	Backend endpoint: GET /api/autofill?field={field_name}&entity={entity_type}&q={query} returns top 10 matching values.
•	Query uses PostgreSQL ILIKE with prefix matching for speed. Index on frequently auto-filled columns.
•	Frontend: debounced at 200ms. Dropdown appears after 2+ characters typed. Keyboard navigable (arrow keys + Enter to select).
•	Auto-fill data is scoped to the same entity type (Deal text fields suggest from other Deals, Contact fields from other Contacts).
 
8. AI Features
All AI integrates with external providers (Claude, ChatGPT, or equivalent) via a model-agnostic adapter. Provider selected at deployment, not in code.

8.1 AI Adapter Layer
•	Unified backend service abstracting AI provider. Supports Anthropic Claude, OpenAI ChatGPT, or any provider with structured output + function calling.
•	Provider configurable via environment variable (AI_PROVIDER=anthropic|openai|custom).
•	Handles: prompt construction, response parsing, error normalization, token logging, retry logic.
•	Required model capabilities: structured JSON output, function/tool calling, 16K+ context, schema adherence.

8.2 AI Field Update (Deal Detail)
•	Trigger: User types natural language in AI update panel on Deal Detail, clicks “Update.”
•	Input: Deal context (name, stage, all fields, participants with statuses, active schema definition) + user’s free-text.
•	Output: Structured JSON: deal_updates (field changes), activity_note (summary), participant_status_updates (contact + new status + commitment + notes).

8.2.1 Propose-and-Confirm Flow
1.	AI returns proposed changes.
2.	UI shows review panel: field changes as “old → new” with per-item checkboxes. Editable activity note. Participant changes with checkboxes.
3.	User toggles individual items, edits note, clicks “Confirm” or “Cancel.”
4.	On confirm: Deal patched, Activity created (type: AI Update, ai_generated: true), Deal Participants updated.

8.2.2 Error Handling
•	Invalid JSON: error toast + manual fallback. Invalid enums: highlighted, blocked. Network timeout: retry with backoff (max 3). All interactions logged.

8.3 Global AI Chatbot
8.3.1 Overview
Floating panel accessible from every page via bottom-right FAB. Keyboard shortcut: Ctrl+K / Cmd+K. Not page-specific — can query and update any entity from any context.

8.3.2 Available Tools
Tool	Operations	Constraints
Deals	Read, Update	Cannot create or delete
Contacts	Read, Update	Cannot create or delete
Companies	Read	Read-only
Deal Participants	Read, Update, Create	Can link contacts to deals, update status/commitment
Activities	Read, Create	Cannot update or delete

8.3.3 Behavioral Rules
•	Never deletes records. Never creates Deals/Contacts/Companies.
•	Asks for clarification on ambiguous data (similar names, unclear amounts).
•	All changes follow propose-and-confirm before persistence.
•	Session-based conversation history. User identity tracked for attribution.
•	Streaming responses for real-time feedback.
 
9. File Storage & Attachments
9.1 Storage Backend
•	S3-compatible object storage (AWS S3, MinIO, GCP Cloud Storage).
•	File key: {entity_type}/{entity_id}/{uuid}_{filename}. Metadata in PostgreSQL.
•	Served via signed URLs (1-hour expiry).

9.2 Supported Files
•	Documents: PDF, DOCX, XLSX, PPTX, CSV, TXT. Images: JPG, PNG, GIF, WEBP.
•	Max file size: 25 MB. Multi-file upload: up to 10 per batch.

9.3 Interface
•	Drag-and-drop zone on each detail page (right column, under associations). Click-to-browse fallback.
•	File list: filename, type icon, size, upload date, uploader. Actions: preview (images/PDFs), download, delete.
•	Activity attachments: files can be attached when creating/editing activities.

9.4 File Data Model
Field	Type	Notes
id	uuid (PK)	
entity_type	enum	deal | contact | company | activity
entity_id	uuid	Parent entity
filename	text	Original filename
storage_key	text	S3 key
mime_type	text	
size_bytes	integer	
uploaded_by	uuid (FK)	
created_at / deleted_at	timestamp	Soft delete
 
10. Mass Import & Export
10.1 Import
Available to Super Admin and User. Supports CSV and Excel (.xlsx) for Contacts, Companies, and Deals.

1.	Select entity type, upload file.
2.	Field-matching interface: source columns → platform fields. Auto-matches by name; manual adjustment. Unmatched columns: skip, map, or create new custom field (with type inference).
3.	Preview first 10 rows. Validation errors highlighted per cell.
4.	Import. Invalid rows skipped, errors logged. Summary report downloadable as CSV.

10.1.1 Deduplication
•	Contacts: deduplicate on email address. If a matching email exists, the row is flagged. Options: skip, merge (update existing), create new.
•	Companies: deduplicate on domain (auto-extracted from website URL). If a matching domain exists, the row is flagged. Options: skip, merge, create new.

10.2 Export
•	Available to all roles. Exports current view (with active filters) as CSV or Excel.
•	Entities: Contacts, Deals, Companies, Activities.
•	Max 50K rows per file. Larger exports queued with download link emailed.
 
11. Integrations
The platform is designed for deep integration with the firm’s existing tools. Each integration follows the same architecture: webhook endpoint, event queue, worker processing, automatic activity logging.

11.1 Outlook Email Sync
•	OAuth2 connection to Microsoft 365.
•	Background sync pulls email threads and matches to contacts by email address.
•	Matched emails auto-logged as Activities (type: Email) linked to contact and associated deals.
•	Two-way: outbound emails sent from platform are logged.
•	Sync frequency: every 5 minutes. outlook_message_id field on Activity for deduplication.

11.2 DocuSign NDA Tracking
•	DocuSign Connect webhook integration.
•	NDA envelope status changes (sent, viewed, signed, declined) auto-update Deal Participant.nda_sent_date/nda_signed_date. If firm-level NDA fields exist on Contact (added via Settings), those are updated as well.
•	NDA Tracking tab shows real-time status.
•	nda_docusign_envelope_id field on Deal Participant for linkage.

11.3 Multi-Channel Chatbot
•	WhatsApp Business API, Slack bot, Microsoft Teams bot.
•	Each channel authenticates by mapping verified identities to platform user accounts.
•	Messages route through the same AI adapter and tool-calling infrastructure as the in-app chatbot.
•	Rate limit: 60 messages/user/hour.

11.4 Integration Architecture Pattern
(1) Webhook endpoint receives events → (2) events queued (Redis/database) → (3) worker processes and maps to CRUD operations → (4) activities logged automatically. Activating any integration = config change + provider auth flow, not re-architecture.
 
12. Investor Portal & Reporting
12.1 Investor Portal
•	Separate read-only web application for LPs and external investors.
•	Authenticated via unique invite links with email verification.
•	Shows deal updates, documents, and commitment status for deals the investor is associated with.
•	No editing capability. Data pulled from main platform via API.
•	Branding customizable per firm.

12.2 PDF Tear Sheets & Reports
•	Auto-generated per deal: deal summary tear sheet (one-pager with key metrics, property image, financial targets).
•	Equity raise report: all participants, commitments, progress.
•	LP report: personalized per investor showing commitments across deals.
•	Server-side PDF rendering. Downloadable and emailable.

12.3 Advanced Analytics Dashboard
•	Funnel analysis: deal stage progression over time.
•	Time-in-stage metrics: average days per stage.
•	Investor conversion rates: introduced → committed.
•	Equity raise velocity charts and deal owner performance comparisons.
 
13. Additional Platform Features
13.1 Field-Level Permissions
Extend role system to control which roles can view or edit specific fields. Configured per-field in Settings. Enables: Read-Only sees deal names but not financials; Users edit notes but not AUM.

13.2 Notifications System
•	Email and Slack alerts: deal stage changes, new commitments, NDA updates, activity on your deals, import completion.
•	Configurable per user (opt-in/out per event type).
•	In-app notification center in sidebar showing unread alerts.

13.3 Native Mobile App
•	iOS and Android (React Native, sharing component logic with web).
•	Core features: view deals/contacts, log activities, AI chatbot, push notifications.
•	Offline mode: queue changes locally, sync when online.

13.4 Multi-Pipeline Support
•	Multiple deal pipelines (e.g., Acquisition Pipeline, Development Pipeline) with independent stage definitions.
•	Pipeline selector on Deals board. Deals belong to one pipeline.
•	Configured via Settings.
 
14. Navigation, Layout & Design
14.1 Sidebar
•	Persistent left sidebar: Dashboard, Deals, Contacts, Companies, Activity. Settings at bottom (Super Admin only).
•	AI Chatbot FAB: bottom-right of viewport (independent of sidebar).
•	Mobile: sidebar collapses behind hamburger.

14.2 Route Table
Path	Component	Access
/login	Login	Unauthenticated
/	Dashboard	All authenticated
/deals	Deals Board + List Views	All authenticated
/deals/:id	Deal Detail	All authenticated
/contacts	Contacts (table + views)	All authenticated
/contacts/:id	Contact Detail	All authenticated
/companies	Companies	All authenticated
/companies/:id	Company Detail	All authenticated
/activity	Activity Log	All authenticated
/import	Mass Import	Super Admin, User
/settings	Settings	Super Admin only

14.3 Design System
Token	Value
Font	Inter (Google Fonts)
Primary	Deep navy hsl(220, 70%, 22%)
Accent	Amber hsl(38, 92%, 50%)
Background	Soft gray hsl(220, 20%, 97%)
Sidebar	Dark navy hsl(220, 30%, 14%)
Border radius	0.75rem (12px)
Success / Warning / Danger	#10B981 / #F59E0B / #EF4444

14.4 Component Dependencies
•	UI: shadcn/ui (Radix). Icons: Lucide React. Charts: Recharts. Forms: react-hook-form + zod. DnD: @hello-pangea/dnd. Animations: Framer Motion. Dates: date-fns.
 
15. Technical Architecture
15.1 Frontend
•	React 18+ with TypeScript. Vite build. React Router v6.
•	State: TanStack Query (server) + React Context (UI). Styling: Tailwind CSS + shadcn/ui.
•	Route guards: all routes check JWT + role permissions.

15.2 Backend
•	Node.js with TypeScript (Express or Fastify).
•	RESTful JSON API. Cursor-based pagination for large collections.
•	JWT auth middleware on all endpoints. Role-based authorization middleware.
•	AI Adapter service: abstracts Claude/ChatGPT behind unified interface.
•	Rate limiting: 100 req/min standard, 10 req/min AI endpoints.

15.3 Database
PostgreSQL 15+. Custom fields in JSONB columns. Schema config in dedicated table (entity_type, field_definitions JSONB, version integer). Full-text search via tsvector on Contact name/email/company.

15.3.1 Custom Schema Implementation
Custom fields added via Settings stored in custom_fields JSONB column per entity. Schema definitions stored in schema_config table. No ALTER TABLE required for admin changes. Frontend dynamically renders forms from schema config fetched on login.

15.4 Deployment
•	Containerized (Docker). Cloud-agnostic.
•	Managed PostgreSQL with automated daily backups (30-day retention, point-in-time recovery).
•	S3-compatible object storage for files.
•	Load balancer with TLS termination. CI/CD pipeline.
•	Redis for event queues (integration webhooks) and caching.
 
16. Security & Non-Functional Requirements
16.1 Authentication & Authorization
•	All routes require valid JWT. No unauthenticated access.
•	Tokens in httpOnly secure cookies. CSRF protection on all mutations.
•	Frontend route guards + backend middleware dual enforcement.
•	Session invalidation on password change / deactivation.

16.2 Data Security
•	TLS 1.2+ in transit. Database-level encryption at rest.
•	Input validation/sanitization on all endpoints (SQL injection, XSS prevention).
•	No PII in logs. Structured JSON logging.
•	Audit log: all CUD operations with user ID, timestamp, entity, changed fields.

16.3 Performance
Metric	Target
Page load (FCP)	< 2 seconds
Contact list (50 rows)	< 1 second (p95)
Full-text search	< 500ms (p95)
Kanban drag-drop save	< 500ms
AI chatbot response	< 10 seconds
Concurrent users	20+ without degradation

16.4 Reliability & Scale
•	Uptime target: 99.5%. Graceful degradation: AI outage does not affect non-AI features.
•	Scale: 50K+ contacts, 5K+ companies, 50+ deals, 500K+ activities, 20+ concurrent users.
•	Database: daily backups, 30-day retention, point-in-time recovery.
 
17. Risk & Mitigation
Risk	Likelihood	Impact	Mitigation
AI provider outage or rate limiting	Medium	Medium	Model-agnostic adapter allows hot-switching providers. Graceful degradation: all non-AI features remain functional. Retry logic with backoff.
Data migration complexity (from HubSpot)	High	Medium	Mass import with intelligent field matching and deduplication reduces manual effort. Preview and validation before commit. Phased migration: contacts first, then deals.
User adoption resistance	Medium	High	Consistent UX across all entities reduces learning curve. AI chatbot lowers barrier to data entry. Custom views match existing team workflows. Training sessions at launch.
Schema customization breaking existing data	Low	High	Custom fields in JSONB (no ALTER TABLE). Deleted fields are hidden, not purged. Schema versioning with rollback capability. Reset to Defaults option.
Integration dependency on third-party APIs (Outlook, DocuSign)	Medium	Low	Webhook-based architecture decouples integrations. Stubs built first; live connections added incrementally. Each integration can be enabled/disabled independently.
Performance at scale (50K+ contacts)	Low	High	PostgreSQL with proper indexing. Cursor-based pagination (not offset). Full-text search via tsvector. Server-side filtering. Load-tested before launch.
Security breach / unauthorized access	Low	Critical	JWT with short-lived tokens. httpOnly cookies. CSRF protection. Role-based access on every endpoint. Audit logging. No PII in logs. TLS everywhere.
Key person dependency on AI prompt engineering	Medium	Medium	System prompts are version-controlled and documented. Schema definition auto-included in prompts. Model-agnostic design means prompts work across providers with minimal tuning.
 
18. Appendix
18.1 Glossary
Term	Definition
AUM	Assets Under Management
Deal Participant	Junction entity linking a Contact to a Deal with role, status, commitment, and NDA data
GP / LP	General Partner (managing) / Limited Partner (passive investor)
HNW / UHNW	High Net Worth / Ultra High Net Worth individual
IRR	Internal Rate of Return
LOI	Letter of Intent
NDA	Non-Disclosure Agreement. Deal-specific NDAs tracked on Deal Participant. Firm-level NDA tracking available via custom fields on Contact.
Soft Circle	Informal, non-binding indication of investment interest
TREP / KH	Database source identifiers for contact origin tracking


