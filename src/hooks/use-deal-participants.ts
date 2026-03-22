"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { DealParticipant } from "@/types";

const PARTICIPANT_SELECT =
  "id, deal_id, contact_id, role, status, commitment_amount, nda_sent_date, nda_signed_date, last_activity_date, contacts(id, first_name, last_name, email, job_title, company_name)";

export function useDealParticipants(dealId: string) {
  return useQuery({
    queryKey: queryKeys.dealParticipants(dealId),
    queryFn: async (): Promise<DealParticipant[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deal_participants")
        .select(PARTICIPANT_SELECT)
        .eq("deal_id", dealId)
        .order("created_at" as never, { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as DealParticipant[];
    },
    enabled: !!dealId,
  });
}

export function useContactParticipants(contactId: string) {
  return useQuery({
    queryKey: queryKeys.contactParticipants(contactId),
    queryFn: async (): Promise<DealParticipant[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deal_participants")
        .select(
          "id, deal_id, contact_id, role, status, commitment_amount, nda_sent_date, nda_signed_date, last_activity_date, deals(id, name, stage)"
        )
        .eq("contact_id", contactId);
      if (error) throw error;
      return (data ?? []) as unknown as DealParticipant[];
    },
    enabled: !!contactId,
  });
}

export function useAddParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      participant: Omit<DealParticipant, "id" | "contacts" | "deals">
    ) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("deal_participants")
        .insert(participant)
        .select(PARTICIPANT_SELECT)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data?.deal_id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.dealParticipants(data.deal_id),
        });
      }
      toast.success("Participant added");
    },
    onError: () => toast.error("Failed to add participant"),
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      dealId,
      ...fields
    }: { id: string; dealId: string } & Partial<DealParticipant>) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("deal_participants")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
      return { id, dealId };
    },
    onSuccess: ({ dealId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dealParticipants(dealId),
      });
    },
    onError: () => toast.error("Failed to update participant"),
  });
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
      dealId: string;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("deal_participants")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { dealId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dealParticipants(dealId),
      });
      toast.success("Participant removed");
    },
    onError: () => toast.error("Failed to remove participant"),
  });
}
