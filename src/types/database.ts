export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          ai_generated: boolean
          attachments: string[] | null
          body: string | null
          company_id: string | null
          contact_id: string | null
          created_at: string
          created_by: string | null
          date: string
          deal_id: string | null
          id: string
          outlook_message_id: string | null
          subject: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          ai_generated?: boolean
          attachments?: string[] | null
          body?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          deal_id?: string | null
          id?: string
          outlook_message_id?: string | null
          subject: string
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          ai_generated?: boolean
          attachments?: string[] | null
          body?: string | null
          company_id?: string | null
          contact_id?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          deal_id?: string | null
          id?: string
          outlook_message_id?: string | null
          subject?: string
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activities_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          asset_class: Database["public"]["Enums"]["asset_class"] | null
          aum: number | null
          capital_type: Database["public"]["Enums"]["capital_type"] | null
          company_type: Database["public"]["Enums"]["company_type"] | null
          created_at: string
          created_by: string | null
          custom_fields: Json | null
          deleted_at: string | null
          domain: string | null
          family_office:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          hq_address: string | null
          hq_city: string | null
          hq_country: string | null
          hq_state: string | null
          id: string
          indirect: Database["public"]["Enums"]["indirect_type"] | null
          industry: string | null
          institutional:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          linkedin: string | null
          name: string
          notes: string | null
          ownership: Database["public"]["Enums"]["ownership_type"] | null
          region: Database["public"]["Enums"]["region_type"] | null
          retail: Database["public"]["Enums"]["retail_type"] | null
          updated_at: string
          website: string | null
        }
        Insert: {
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          aum?: number | null
          capital_type?: Database["public"]["Enums"]["capital_type"] | null
          company_type?: Database["public"]["Enums"]["company_type"] | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          domain?: string | null
          family_office?:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          hq_address?: string | null
          hq_city?: string | null
          hq_country?: string | null
          hq_state?: string | null
          id?: string
          indirect?: Database["public"]["Enums"]["indirect_type"] | null
          industry?: string | null
          institutional?:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy?:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          linkedin?: string | null
          name: string
          notes?: string | null
          ownership?: Database["public"]["Enums"]["ownership_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          retail?: Database["public"]["Enums"]["retail_type"] | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          aum?: number | null
          capital_type?: Database["public"]["Enums"]["capital_type"] | null
          company_type?: Database["public"]["Enums"]["company_type"] | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          deleted_at?: string | null
          domain?: string | null
          family_office?:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          hq_address?: string | null
          hq_city?: string | null
          hq_country?: string | null
          hq_state?: string | null
          id?: string
          indirect?: Database["public"]["Enums"]["indirect_type"] | null
          industry?: string | null
          institutional?:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy?:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          linkedin?: string | null
          name?: string
          notes?: string | null
          ownership?: Database["public"]["Enums"]["ownership_type"] | null
          region?: Database["public"]["Enums"]["region_type"] | null
          retail?: Database["public"]["Enums"]["retail_type"] | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          asset_class: Database["public"]["Enums"]["asset_class"] | null
          capital_type: Database["public"]["Enums"]["capital_type"] | null
          city: string | null
          company_id: string | null
          company_name: string | null
          contact_owner: string | null
          country: string | null
          created_at: string
          created_by: string | null
          custom_fields: Json | null
          database_source: Database["public"]["Enums"]["database_source"] | null
          deleted_at: string | null
          email: string | null
          email_verification:
            | Database["public"]["Enums"]["email_verification_status"]
            | null
          family_office:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          first_name: string
          id: string
          indirect: Database["public"]["Enums"]["indirect_type"] | null
          industry: string | null
          institutional:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          job_title: string | null
          last_interaction_date: string | null
          last_name: string
          lead_status: Database["public"]["Enums"]["lead_status"] | null
          next_steps: string | null
          ownership: Database["public"]["Enums"]["ownership_type"] | null
          phone: string | null
          postal_code: string | null
          region: Database["public"]["Enums"]["region_type"] | null
          relationship: Database["public"]["Enums"]["relationship_type"] | null
          retail: Database["public"]["Enums"]["retail_type"] | null
          search_vector: unknown
          state: string | null
          street_address: string | null
          time_zone: string | null
          trep_capital_type_prior_outreach: string | null
          trep_deal_prior_outreach: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          capital_type?: Database["public"]["Enums"]["capital_type"] | null
          city?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_owner?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          database_source?:
            | Database["public"]["Enums"]["database_source"]
            | null
          deleted_at?: string | null
          email?: string | null
          email_verification?:
            | Database["public"]["Enums"]["email_verification_status"]
            | null
          family_office?:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          first_name: string
          id?: string
          indirect?: Database["public"]["Enums"]["indirect_type"] | null
          industry?: string | null
          institutional?:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy?:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          job_title?: string | null
          last_interaction_date?: string | null
          last_name: string
          lead_status?: Database["public"]["Enums"]["lead_status"] | null
          next_steps?: string | null
          ownership?: Database["public"]["Enums"]["ownership_type"] | null
          phone?: string | null
          postal_code?: string | null
          region?: Database["public"]["Enums"]["region_type"] | null
          relationship?: Database["public"]["Enums"]["relationship_type"] | null
          retail?: Database["public"]["Enums"]["retail_type"] | null
          search_vector?: unknown
          state?: string | null
          street_address?: string | null
          time_zone?: string | null
          trep_capital_type_prior_outreach?: string | null
          trep_deal_prior_outreach?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          capital_type?: Database["public"]["Enums"]["capital_type"] | null
          city?: string | null
          company_id?: string | null
          company_name?: string | null
          contact_owner?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          database_source?:
            | Database["public"]["Enums"]["database_source"]
            | null
          deleted_at?: string | null
          email?: string | null
          email_verification?:
            | Database["public"]["Enums"]["email_verification_status"]
            | null
          family_office?:
            | Database["public"]["Enums"]["family_office_type"]
            | null
          first_name?: string
          id?: string
          indirect?: Database["public"]["Enums"]["indirect_type"] | null
          industry?: string | null
          institutional?:
            | Database["public"]["Enums"]["institutional_type"]
            | null
          investment_strategy?:
            | Database["public"]["Enums"]["investment_strategy"]
            | null
          job_title?: string | null
          last_interaction_date?: string | null
          last_name?: string
          lead_status?: Database["public"]["Enums"]["lead_status"] | null
          next_steps?: string | null
          ownership?: Database["public"]["Enums"]["ownership_type"] | null
          phone?: string | null
          postal_code?: string | null
          region?: Database["public"]["Enums"]["region_type"] | null
          relationship?: Database["public"]["Enums"]["relationship_type"] | null
          retail?: Database["public"]["Enums"]["retail_type"] | null
          search_vector?: unknown
          state?: string | null
          street_address?: string | null
          time_zone?: string | null
          trep_capital_type_prior_outreach?: string | null
          trep_deal_prior_outreach?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_contact_owner_fkey"
            columns: ["contact_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_views: {
        Row: {
          columns: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          entity_type: string
          filters: Json | null
          id: string
          is_default: boolean | null
          is_shared: boolean | null
          name: string
          per_page: number | null
          pinned_by: string[] | null
          sort_direction: string | null
          sort_field: string | null
          updated_at: string
        }
        Insert: {
          columns?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name: string
          per_page?: number | null
          pinned_by?: string[] | null
          sort_direction?: string | null
          sort_field?: string | null
          updated_at?: string
        }
        Update: {
          columns?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_type?: string
          filters?: Json | null
          id?: string
          is_default?: boolean | null
          is_shared?: boolean | null
          name?: string
          per_page?: number | null
          pinned_by?: string[] | null
          sort_direction?: string | null
          sort_field?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_views_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deal_participants: {
        Row: {
          commitment_amount: number | null
          contact_id: string
          created_at: string
          deal_id: string
          id: string
          last_activity_date: string | null
          nda_sent_date: string | null
          nda_signed_date: string | null
          notes: string | null
          role: Database["public"]["Enums"]["participant_role"] | null
          status: Database["public"]["Enums"]["participant_status"] | null
          updated_at: string
        }
        Insert: {
          commitment_amount?: number | null
          contact_id: string
          created_at?: string
          deal_id: string
          id?: string
          last_activity_date?: string | null
          nda_sent_date?: string | null
          nda_signed_date?: string | null
          notes?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          status?: Database["public"]["Enums"]["participant_status"] | null
          updated_at?: string
        }
        Update: {
          commitment_amount?: number | null
          contact_id?: string
          created_at?: string
          deal_id?: string
          id?: string
          last_activity_date?: string | null
          nda_sent_date?: string | null
          nda_signed_date?: string | null
          notes?: string | null
          role?: Database["public"]["Enums"]["participant_role"] | null
          status?: Database["public"]["Enums"]["participant_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deal_participants_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_participants_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          amount: number | null
          asset_class: Database["public"]["Enums"]["asset_class"] | null
          close_date: string | null
          create_date: string
          created_at: string
          created_by: string | null
          currency: Database["public"]["Enums"]["deal_currency"] | null
          custom_fields: Json | null
          days_to_close: number | null
          deal_collaborator: string | null
          deal_owner: string | null
          deal_type: Database["public"]["Enums"]["deal_type"] | null
          deleted_at: string | null
          description: string | null
          expected_close_date: string | null
          id: string
          last_activity_date: string | null
          last_contacted: string | null
          location: string | null
          name: string
          next_activity_date: string | null
          pipeline: Database["public"]["Enums"]["deal_pipeline"] | null
          priority: Database["public"]["Enums"]["deal_priority"] | null
          stage: Database["public"]["Enums"]["deal_stage"]
          updated_at: string
        }
        Insert: {
          amount?: number | null
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          close_date?: string | null
          create_date?: string
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["deal_currency"] | null
          custom_fields?: Json | null
          days_to_close?: number | null
          deal_collaborator?: string | null
          deal_owner?: string | null
          deal_type?: Database["public"]["Enums"]["deal_type"] | null
          deleted_at?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          last_contacted?: string | null
          location?: string | null
          name: string
          next_activity_date?: string | null
          pipeline?: Database["public"]["Enums"]["deal_pipeline"] | null
          priority?: Database["public"]["Enums"]["deal_priority"] | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
        }
        Update: {
          amount?: number | null
          asset_class?: Database["public"]["Enums"]["asset_class"] | null
          close_date?: string | null
          create_date?: string
          created_at?: string
          created_by?: string | null
          currency?: Database["public"]["Enums"]["deal_currency"] | null
          custom_fields?: Json | null
          days_to_close?: number | null
          deal_collaborator?: string | null
          deal_owner?: string | null
          deal_type?: Database["public"]["Enums"]["deal_type"] | null
          deleted_at?: string | null
          description?: string | null
          expected_close_date?: string | null
          id?: string
          last_activity_date?: string | null
          last_contacted?: string | null
          location?: string | null
          name?: string
          next_activity_date?: string | null
          pipeline?: Database["public"]["Enums"]["deal_pipeline"] | null
          priority?: Database["public"]["Enums"]["deal_priority"] | null
          stage?: Database["public"]["Enums"]["deal_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_deal_collaborator_fkey"
            columns: ["deal_collaborator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_deal_owner_fkey"
            columns: ["deal_owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          created_at: string
          deleted_at: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          filename: string
          id: string
          mime_type: string | null
          size_bytes: number | null
          storage_key: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          filename: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_key: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          filename?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number | null
          storage_key?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          role: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          role?: string
        }
        Relationships: []
      }
      pipeline_config: {
        Row: {
          id: string
          pipeline_name: string
          stages: Json
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          id?: string
          pipeline_name?: string
          stages?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          id?: string
          pipeline_name?: string
          stages?: Json
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          full_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      schema_config: {
        Row: {
          entity_type: string
          field_definitions: Json
          id: string
          updated_at: string
          updated_by: string | null
          version: number
        }
        Insert: {
          entity_type: string
          field_definitions?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Update: {
          entity_type?: string
          field_definitions?: Json
          id?: string
          updated_at?: string
          updated_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "schema_config_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_write: { Args: never; Returns: boolean }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      activity_type:
        | "Email"
        | "Call"
        | "Meeting"
        | "Note"
        | "NDA"
        | "Document"
        | "AI Update"
      asset_class:
        | "Residential - For Rent"
        | "Residential - For Sale"
        | "Retail"
        | "Office"
        | "Industrial/Storage"
        | "Hotel"
        | "Healthcare/Senior"
        | "Land"
        | "Datacenter"
        | "Other"
      capital_type:
        | "Senior Debt"
        | "GP Equity"
        | "LP - Large"
        | "LP - Mid"
        | "Subordinated Debt/Pref Equity"
        | "Senior Debt - TX Banks"
        | "LP - Small"
      company_type: "Investor" | "Broker" | "Lender" | "Legal" | "Other"
      database_source: "TREP" | "KH"
      deal_currency: "USD"
      deal_pipeline: "Deal Pipeline"
      deal_priority: "Low" | "Medium" | "High"
      deal_stage:
        | "Overviews"
        | "Deal Review"
        | "Sourcing"
        | "LOI Sent"
        | "Closed"
        | "On Hold"
        | "Pass"
      deal_type: "Development" | "Acquisition"
      email_verification_status:
        | "valid"
        | "accept_all_unverifiable"
        | "invalid"
        | "unknown"
      entity_type: "deal" | "contact" | "company" | "activity"
      family_office_type: "Family Office - Single" | "Family Office - Multi"
      indirect_type: "Pension Fund" | "Foundation" | "Endowment" | "RIA"
      institutional_type:
        | "Fund Manager/Allocator"
        | "Sovereign Wealth"
        | "Life Company"
      investment_strategy: "Development" | "Acquisition"
      lead_status:
        | "Need to Call"
        | "Left VM"
        | "Call Scheduled"
        | "Had Call"
        | "Tag to Deal"
        | "Hold off for now"
      ownership_type: "Direct Owner"
      participant_role:
        | "Lead Investor"
        | "Co-Investor"
        | "Broker"
        | "Lender"
        | "Legal"
        | "Other"
      participant_status:
        | "Introduced"
        | "NDA Sent"
        | "NDA Signed"
        | "Reviewing Deck"
        | "Meeting Scheduled"
        | "Soft Circle"
        | "Committed"
        | "Passed"
        | "Closed"
      region_type:
        | "Mid-West"
        | "Northeast"
        | "Southeast"
        | "Southwest"
        | "West"
        | "International"
      relationship_type:
        | "J - No Relationship"
        | "A - Very Well"
        | "B - Warm"
        | "H - Call"
        | "X - Going Concern"
        | "Y - Lender"
        | "W - Sponsor"
        | "Z - Existing"
      retail_type: "HNW" | "Emerging" | "HNW (TX)" | "UHNW"
      user_role: "super_admin" | "user" | "read_only"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_type: [
        "Email",
        "Call",
        "Meeting",
        "Note",
        "NDA",
        "Document",
        "AI Update",
      ],
      asset_class: [
        "Residential - For Rent",
        "Residential - For Sale",
        "Retail",
        "Office",
        "Industrial/Storage",
        "Hotel",
        "Healthcare/Senior",
        "Land",
        "Datacenter",
        "Other",
      ],
      capital_type: [
        "Senior Debt",
        "GP Equity",
        "LP - Large",
        "LP - Mid",
        "Subordinated Debt/Pref Equity",
        "Senior Debt - TX Banks",
        "LP - Small",
      ],
      company_type: ["Investor", "Broker", "Lender", "Legal", "Other"],
      database_source: ["TREP", "KH"],
      deal_currency: ["USD"],
      deal_pipeline: ["Deal Pipeline"],
      deal_priority: ["Low", "Medium", "High"],
      deal_stage: [
        "Overviews",
        "Deal Review",
        "Sourcing",
        "LOI Sent",
        "Closed",
        "On Hold",
        "Pass",
      ],
      deal_type: ["Development", "Acquisition"],
      email_verification_status: [
        "valid",
        "accept_all_unverifiable",
        "invalid",
        "unknown",
      ],
      entity_type: ["deal", "contact", "company", "activity"],
      family_office_type: ["Family Office - Single", "Family Office - Multi"],
      indirect_type: ["Pension Fund", "Foundation", "Endowment", "RIA"],
      institutional_type: [
        "Fund Manager/Allocator",
        "Sovereign Wealth",
        "Life Company",
      ],
      investment_strategy: ["Development", "Acquisition"],
      lead_status: [
        "Need to Call",
        "Left VM",
        "Call Scheduled",
        "Had Call",
        "Tag to Deal",
        "Hold off for now",
      ],
      ownership_type: ["Direct Owner"],
      participant_role: [
        "Lead Investor",
        "Co-Investor",
        "Broker",
        "Lender",
        "Legal",
        "Other",
      ],
      participant_status: [
        "Introduced",
        "NDA Sent",
        "NDA Signed",
        "Reviewing Deck",
        "Meeting Scheduled",
        "Soft Circle",
        "Committed",
        "Passed",
        "Closed",
      ],
      region_type: [
        "Mid-West",
        "Northeast",
        "Southeast",
        "Southwest",
        "West",
        "International",
      ],
      relationship_type: [
        "J - No Relationship",
        "A - Very Well",
        "B - Warm",
        "H - Call",
        "X - Going Concern",
        "Y - Lender",
        "W - Sponsor",
        "Z - Existing",
      ],
      retail_type: ["HNW", "Emerging", "HNW (TX)", "UHNW"],
      user_role: ["super_admin", "user", "read_only"],
    },
  },
} as const
