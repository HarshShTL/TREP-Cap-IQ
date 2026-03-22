// ─── Enums / Union Types ──────────────────────────────────────────────────────

export type DealStage =
  | "Overviews"
  | "Deal Review"
  | "Sourcing"
  | "LOI Sent"
  | "Closed"
  | "On Hold"
  | "Pass";

export type Priority = "High" | "Medium" | "Low";

export type DealType = "Development" | "Acquisition";

export type ActivityType =
  | "Call"
  | "Email"
  | "Meeting"
  | "Note"
  | "NDA"
  | "Document"
  | "AI Update";

export type EntityType = "deal" | "contact" | "company";

export type LeadStatus =
  | "Need to Call"
  | "Left VM"
  | "Call Scheduled"
  | "Had Call"
  | "Tag to Deal"
  | "Hold off for now";

export type CapitalType =
  | "Senior Debt"
  | "GP Equity"
  | "LP - Large"
  | "LP - Mid"
  | "Subordinated Debt/Pref Equity"
  | "Senior Debt - TX Banks"
  | "LP - Small";

export type FieldType = "text" | "number" | "date" | "select" | "boolean" | "textarea";

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  order: number;
  locked?: boolean;
}

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface Deal {
  id: string;
  name: string;
  stage: string;
  amount: number | null;
  deal_type: string | null;
  priority: string | null;
  location: string | null;
  asset_class: string | null;
  description: string | null;
  expected_close_date: string | null;
  deal_owner: string | null;
  deal_collaborator: string | null;
  custom_fields: Record<string, unknown> | null;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  job_title: string | null;
  company_name: string | null;
  company_id: string | null;
  lead_status: string | null;
  capital_type: string | null;
  family_office: string | null;
  institutional: string | null;
  retail: string | null;
  indirect: string | null;
  ownership: string | null;
  investment_strategy: string | null;
  region: string | null;
  asset_class: string | null;
  relationship: string | null;
  next_steps: string | null;
  database_source: string | null;
  email_verification: string | null;
  trep_capital_type_prior_outreach: string | null;
  trep_deal_prior_outreach: string | null;
  contact_owner: string | null;
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  time_zone: string | null;
  industry: string | null;
  website: string | null;
  last_interaction_date: string | null;
  search_vector?: unknown;
  custom_fields: Record<string, unknown> | null;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  website: string | null;
  domain: string | null;
  company_type: string | null;
  industry: string | null;
  hq_address: string | null;
  hq_city: string | null;
  hq_state: string | null;
  hq_country: string | null;
  capital_type: string | null;
  family_office: string | null;
  institutional: string | null;
  retail: string | null;
  indirect: string | null;
  ownership: string | null;
  investment_strategy: string | null;
  region: string | null;
  asset_class: string | null;
  aum: number | null;
  notes: string | null;
  custom_fields: Record<string, unknown> | null;
  deleted_at: string | null;
  updated_at: string;
  created_at: string;
}

export interface DealParticipant {
  id: string;
  deal_id: string;
  contact_id: string;
  role: string | null;
  status: string | null;
  commitment_amount: number | null;
  nda_sent_date: string | null;
  nda_signed_date: string | null;
  // joined fields
  contacts?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    job_title: string | null;
    company_name: string | null;
  } | null;
  deals?: {
    id: string;
    name: string;
    stage: string;
  } | null;
}

export interface Activity {
  id: string;
  type: string;
  subject: string;
  body?: string | null;
  date?: string | null;
  deal_id: string | null;
  contact_id: string | null;
  created_at: string;
  updated_at?: string;
  // joined fields
  deals?: { id: string; name: string } | null;
  contacts?: { id: string; first_name: string; last_name: string } | null;
}

export interface FileRecord {
  id: string;
  deal_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  filename: string;
  size: number | null;
  storage_key: string;
  created_at: string;
}

export interface SchemaConfig {
  id: string;
  entity_type: string;
  field_definitions: FieldDefinition[];
  created_at: string;
  updated_at: string;
}

export interface PipelineStage {
  key: string;
  label: string;
}

export interface PipelineConfig {
  id: string;
  stages: PipelineStage[];
  created_at: string;
  updated_at: string;
}

export interface CustomView {
  id: string;
  name: string;
  entity_type: string;
  filters: Record<string, unknown> | null;
  columns: string[] | null;
  created_at: string;
}

export interface Profile {
  id: string;
  role: string | null;
  full_name: string | null;
  avatar_url: string | null;
}
