"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Deal } from "@/types";

const DEALS_SELECT =
  "id, name, stage, amount, deal_type, priority, location, asset_class, description, expected_close_date, deal_owner, deal_collaborator, custom_fields, deleted_at, updated_at, created_at";

export function useDeals() {
  return useQuery({
    queryKey: queryKeys.deals.list(),
    queryFn: async (): Promise<Deal[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deals")
        .select(DEALS_SELECT)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Deal[];
    },
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id),
    queryFn: async (): Promise<Deal> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deals")
        .select(DEALS_SELECT)
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Deal;
    },
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (deal: Omit<Deal, "id" | "deleted_at" | "updated_at" | "created_at">) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deals")
        .insert(deal)
        .select(DEALS_SELECT)
        .single();
      if (error) throw error;
      return data as Deal;
    },
    onSuccess: (newDeal) => {
      queryClient.setQueryData(queryKeys.deals.list(), (old: Deal[] | undefined) =>
        [newDeal, ...(old ?? [])]
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("Deal created");
    },
    onError: () => toast.error("Failed to create deal"),
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: { id: string } & Partial<Deal>) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deals")
        .update(fields)
        .eq("id", id)
        .select(DEALS_SELECT)
        .single();
      if (error) throw error;
      return data as Deal;
    },
    onMutate: async ({ id, ...fields }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.deals.detail(id) });
      const previousDeal = queryClient.getQueryData<Deal>(queryKeys.deals.detail(id));
      queryClient.setQueryData(queryKeys.deals.detail(id), (old: Deal | undefined) =>
        old ? { ...old, ...fields } : old
      );
      return { previousDeal };
    },
    onError: (err, { id }, context) => {
      if (context?.previousDeal) {
        queryClient.setQueryData(queryKeys.deals.detail(id), context.previousDeal);
      }
      toast.error("Failed to save deal");
    },
    onSettled: (data, err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.list() });
    },
    onSuccess: () => toast.success("Deal saved"),
  });
}

export function useUpdateDealStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("deals")
        .update({ stage })
        .eq("id", id);
      if (error) throw error;
    },
    onMutate: async ({ id, stage }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.deals.list() });
      const previousDeals = queryClient.getQueryData<Deal[]>(queryKeys.deals.list());
      queryClient.setQueryData(queryKeys.deals.list(), (old: Deal[] | undefined) =>
        (old ?? []).map((d) => (d.id === id ? { ...d, stage } : d))
      );
      return { previousDeals };
    },
    onError: (err, vars, context) => {
      if (context?.previousDeals) {
        queryClient.setQueryData(queryKeys.deals.list(), context.previousDeals);
      }
      toast.error("Failed to move deal");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.list() });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("deals")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
      toast.success("Deal deleted");
    },
    onError: () => toast.error("Failed to delete deal"),
  });
}
