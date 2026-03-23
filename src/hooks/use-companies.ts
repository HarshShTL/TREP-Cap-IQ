"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Company, CompanyInsert, CompanyUpdate, Contact } from "@/types";

const COMPANIES_SELECT =
  "id, name, website, domain, company_type, industry, hq_address, hq_city, hq_state, hq_country, capital_type, family_office, institutional, retail, indirect, ownership, investment_strategy, region, asset_class, aum, notes, custom_fields, deleted_at, updated_at, created_at";

const CONTACTS_SELECT =
  "id, first_name, last_name, email, phone, job_title, company_name, lead_status, updated_at, created_at";

interface CompaniesParams {
  search?: string;
  cursor?: string;
  sortBy?: string;
  sortAsc?: boolean;
  limit?: number;
}

function extractDomain(website: string): string {
  try {
    const url = website.startsWith("http") ? website : `https://${website}`;
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, "");
  } catch {
    return website.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  }
}

export function useCompanies(params: CompaniesParams = {}) {
  const { search = "", cursor, sortBy = "created_at", sortAsc = false, limit = 50 } = params;
  return useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: async (): Promise<Company[]> => {
      const supabase = createClient();
      let q = supabase
        .from("companies")
        .select(COMPANIES_SELECT)
        .is("deleted_at", null)
        .order(sortBy, { ascending: sortAsc })
        .limit(limit);

      if (search) {
        q = q.ilike("name", `%${search}%`);
      }
      if (cursor) {
        q = sortAsc ? q.gt(sortBy, cursor) : q.lt(sortBy, cursor);
      }

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Company[];
    },
  });
}

export function useCompany(id: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: async (): Promise<Company> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("companies")
        .select(COMPANIES_SELECT)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Company;
    },
    enabled: !!id,
  });
}

export function useCompanyContacts(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companyContacts(companyId),
    queryFn: async (): Promise<Contact[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("contacts")
        .select(CONTACTS_SELECT)
        .eq("company_id", companyId)
        .is("deleted_at", null)
        .order("first_name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as Contact[];
    },
    enabled: !!companyId,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (company: CompanyInsert) => {
      const supabase = createClient();
      const domain = company.website ? extractDomain(company.website) : null;
      const { data, error } = await supabase
        .from("companies")
        .insert({ ...company, domain })
        .select(COMPANIES_SELECT)
        .single();
      if (error) throw error;
      return data as Company;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success("Company created");
    },
    onError: () => toast.error("Failed to create company"),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: { id: string } & CompanyUpdate) => {
      const supabase = createClient();
      const updates = { ...fields } as Record<string, unknown>;
      if (fields.website) {
        updates.domain = extractDomain(fields.website);
      }
      const { data, error } = await supabase
        .from("companies")
        .update(updates)
        .eq("id", id)
        .select(COMPANIES_SELECT)
        .single();
      if (error) throw error;
      return data as Company;
    },
    onMutate: async ({ id, ...fields }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.companies.detail(id) });
      const prev = queryClient.getQueryData<Company>(queryKeys.companies.detail(id));
      queryClient.setQueryData(queryKeys.companies.detail(id), (old: Company | undefined) =>
        old ? { ...old, ...fields } : old
      );
      return { prev };
    },
    onError: (err, { id }, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.companies.detail(id), context.prev);
      }
      toast.error("Failed to save company");
    },
    onSettled: (data, err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.list() });
    },
    onSuccess: () => toast.success("Company saved"),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("companies")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      toast.success("Company deleted");
    },
    onError: () => toast.error("Failed to delete company"),
  });
}
