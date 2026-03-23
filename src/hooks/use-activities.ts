"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Activity } from "@/types";

const ACTIVITIES_SELECT =
  "id, type, subject, body, date, deal_id, contact_id, ai_generated, created_at, deals(id, name), contacts(id, first_name, last_name, company_name)";

interface ActivitiesParams {
  dealId?: string;
  contactId?: string;
  companyId?: string;
  type?: string;
  search?: string;
  cursor?: string;
  limit?: number;
}

export function useActivities(params: ActivitiesParams = {}) {
  const { dealId, contactId, type, search = "", cursor, limit = 50 } = params;
  return useQuery({
    queryKey: queryKeys.activities.list(params),
    queryFn: async (): Promise<Activity[]> => {
      const supabase = createClient();
      let q = supabase
        .from("activities")
        .select(ACTIVITIES_SELECT)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (dealId) q = q.eq("deal_id", dealId);
      if (contactId) q = q.eq("contact_id", contactId);
      if (type) q = q.eq("type", type as "Email" | "Call" | "Meeting" | "Note" | "NDA" | "Document" | "AI Update");
      if (search) {
        q = q.or(`subject.ilike.%${search}%,body.ilike.%${search}%`);
      }
      if (cursor) q = q.lt("created_at", cursor);

      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as Activity[];
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      activity: Omit<Activity, "id" | "created_at" | "updated_at" | "deals" | "contacts">
    ) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("activities")
        .insert(activity)
        .select(ACTIVITIES_SELECT)
        .single();
      if (error) throw error;
      return data as unknown as Activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentActivities });
      toast.success("Activity logged");
    },
    onError: () => toast.error("Failed to log activity"),
  });
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...fields
    }: { id: string } & Partial<Activity>) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("activities")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      toast.success("Activity updated");
    },
    onError: () => toast.error("Failed to update activity"),
  });
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentActivities });
      toast.success("Activity deleted");
    },
    onError: () => toast.error("Failed to delete activity"),
  });
}
