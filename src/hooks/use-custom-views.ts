"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { CustomView, CustomViewInsert, EntityType } from "@/types";

export function useCustomViews(entityType: EntityType) {
  return useQuery({
    queryKey: queryKeys.customViews(entityType),
    queryFn: async (): Promise<CustomView[]> => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("custom_views")
        .select("*")
        .eq("entity_type", entityType)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CustomView[];
    },
  });
}

export function useCreateView() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (view: CustomViewInsert) => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("custom_views")
        .insert(view)
        .select("*")
        .single();
      if (error) throw error;
      return data as CustomView;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customViews(data.entity_type as EntityType),
      });
      toast.success("View saved");
    },
    onError: () => toast.error("Failed to save view"),
  });
}

export function useDeleteView() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
    }: {
      id: string;
      entityType: EntityType;
    }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("custom_views")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { entityType }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customViews(entityType),
      });
      toast.success("View deleted");
    },
    onError: () => toast.error("Failed to delete view"),
  });
}
