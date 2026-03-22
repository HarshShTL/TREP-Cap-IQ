"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Contact } from "@/types";

const CONTACTS_SELECT =
  "id, first_name, last_name, email, phone, job_title, company_name, company_id, lead_status, capital_type, family_office, institutional, retail, indirect, ownership, investment_strategy, region, asset_class, relationship, next_steps, database_source, email_verification, trep_capital_type_prior_outreach, trep_deal_prior_outreach, contact_owner, street_address, city, state, postal_code, country, time_zone, industry, website, linkedin, last_interaction_date, custom_fields, deleted_at, updated_at, created_at";

interface ContactsParams {
  search?: string;
  cursor?: string;
  sortBy?: string;
  sortAsc?: boolean;
  limit?: number;
}

export function useContacts(params: ContactsParams = {}) {
  const { search = "", cursor, sortBy = "created_at", sortAsc = false, limit = 50 } = params;
  return useQuery({
    queryKey: queryKeys.contacts.list(params),
    queryFn: async (): Promise<Contact[]> => {
      const supabase = createClient();
      let q = supabase
        .from("contacts")
        .select(CONTACTS_SELECT)
        .is("deleted_at", null)
        .order(sortBy, { ascending: sortAsc })
        .limit(limit);

      if (search) {
        q = q.textSearch("search_vector", search, { type: "websearch" });
      }

      if (cursor) {
        q = sortAsc
          ? q.gt(sortBy, cursor)
          : q.lt(sortBy, cursor);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Contact[];
    },
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: async (): Promise<Contact> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .select(CONTACTS_SELECT)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Contact;
    },
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      contact: Omit<Contact, "id" | "deleted_at" | "updated_at" | "created_at" | "search_vector">
    ) => {
      const supabase = createClient();

      // Auto-link or create company
      let company_id = contact.company_id;
      if (!company_id && contact.company_name) {
        const { data: existing } = await supabase
          .from("companies")
          .select("id")
          .ilike("name", contact.company_name)
          .is("deleted_at", null)
          .limit(1)
          .maybeSingle();
        if (existing?.id) {
          company_id = existing.id;
        } else {
          const { data: created } = await supabase
            .from("companies")
            .insert({ name: contact.company_name })
            .select("id")
            .single();
          if (created?.id) company_id = created.id;
        }
      }

      const { data, error } = await supabase
        .from("contacts")
        .insert({ ...contact, company_id })
        .select(CONTACTS_SELECT)
        .single();
      if (error) throw error;
      return data as Contact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("Contact created");
    },
    onError: () => toast.error("Failed to create contact"),
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: { id: string } & Partial<Contact>) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .update(fields)
        .eq("id", id)
        .select(CONTACTS_SELECT)
        .single();
      if (error) throw error;
      return data as Contact;
    },
    onMutate: async ({ id, ...fields }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.contacts.detail(id) });
      const prev = queryClient.getQueryData<Contact>(queryKeys.contacts.detail(id));
      queryClient.setQueryData(queryKeys.contacts.detail(id), (old: Contact | undefined) =>
        old ? { ...old, ...fields } : old
      );
      return { prev };
    },
    onError: (err, { id }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.contacts.detail(id), context.prev);
      }
      toast.error("Failed to save contact");
    },
    onSettled: (data, err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.list() });
    },
    onSuccess: () => toast.success("Contact saved"),
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("contacts")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("Contact deleted");
    },
    onError: () => toast.error("Failed to delete contact"),
  });
}
