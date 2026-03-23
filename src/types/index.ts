import type { Database } from "./database";

// ─── Helper ─────────────────────────────────────────────────────────────────

type WithCustomFields<T> = Omit<T, "custom_fields"> & {
  custom_fields: Record<string, unknown> | null;
};

// ─── Row types (what you GET from Supabase) ─────────────────────────────────

export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Company = WithCustomFields<Database["public"]["Tables"]["companies"]["Row"]>;
export type Contact = WithCustomFields<Database["public"]["Tables"]["contacts"]["Row"]>;
export type CustomView = Omit<
  Database["public"]["Tables"]["custom_views"]["Row"],
  "columns" | "filters"
> & {
  columns: string[] | null;
  filters: Record<string, unknown> | null;
};
export type Deal = WithCustomFields<Database["public"]["Tables"]["deals"]["Row"]>;
export type DealParticipant = Database["public"]["Tables"]["deal_participants"]["Row"];
export type FileRecord = Database["public"]["Tables"]["files"]["Row"];
export type Invite = Database["public"]["Tables"]["invites"]["Row"];
export type PipelineConfig = Omit<
  Database["public"]["Tables"]["pipeline_config"]["Row"],
  "stages"
> & {
  stages: PipelineStage[];
};
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type SchemaConfig = Omit<
  Database["public"]["Tables"]["schema_config"]["Row"],
  "field_definitions"
> & {
  field_definitions: FieldDefinition[];
};

// ─── Insert types (what you SEND to Supabase for creates) ───────────────────

export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];
export type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];
export type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
export type CustomViewInsert = Database["public"]["Tables"]["custom_views"]["Insert"];
export type DealInsert = Database["public"]["Tables"]["deals"]["Insert"];
export type DealParticipantInsert = Database["public"]["Tables"]["deal_participants"]["Insert"];
export type FileInsert = Database["public"]["Tables"]["files"]["Insert"];

// ─── Update types (what you SEND to Supabase for patches) ───────────────────

export type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"];
export type CompanyUpdate = Database["public"]["Tables"]["companies"]["Update"];
export type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];
export type DealUpdate = Database["public"]["Tables"]["deals"]["Update"];
export type DealParticipantUpdate = Database["public"]["Tables"]["deal_participants"]["Update"];

// ─── Enum types ─────────────────────────────────────────────────────────────

export type ActivityType = Database["public"]["Enums"]["activity_type"];
export type AssetClass = Database["public"]["Enums"]["asset_class"];
export type CapitalType = Database["public"]["Enums"]["capital_type"];
export type CompanyType = Database["public"]["Enums"]["company_type"];
export type DealPriority = Database["public"]["Enums"]["deal_priority"];
export type DealStage = Database["public"]["Enums"]["deal_stage"];
export type DealType = Database["public"]["Enums"]["deal_type"];
export type EntityType = Database["public"]["Enums"]["entity_type"];
export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type ParticipantRole = Database["public"]["Enums"]["participant_role"];
export type ParticipantStatus = Database["public"]["Enums"]["participant_status"];
export type UserRole = Database["public"]["Enums"]["user_role"];

// Backward-compatible aliases
export type Priority = DealPriority;

// ─── Extended types with joined data ────────────────────────────────────────

export type ActivityWithRelations = Activity & {
  deals?: { id: string; name: string } | null;
  contacts?: {
    id: string;
    first_name: string;
    last_name: string;
    company_name?: string | null;
    lead_status?: LeadStatus | null;
  } | null;
};

export type DealParticipantWithRelations = DealParticipant & {
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
    stage: DealStage;
  } | null;
};

// ─── Manual types (not in database) ─────────────────────────────────────────

export type FieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "multiselect"
  | "boolean"
  | "textarea";

export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  order: number;
  locked?: boolean;
}

export interface PipelineStage {
  key: string;
  label: string;
}
