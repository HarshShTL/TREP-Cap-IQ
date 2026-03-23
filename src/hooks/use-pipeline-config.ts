"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import { DEAL_STAGES } from "@/lib/constants";
import type { PipelineConfig, PipelineStage } from "@/types";
import type { Json } from "@/types/database";

export function usePipelineConfig() {
  return useQuery({
    queryKey: queryKeys.pipelineConfig,
    queryFn: async (): Promise<PipelineConfig | null> => {
      const supabase = createClient();
      const { data } = await supabase
        .from("pipeline_config")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as PipelineConfig | null;
    },
  });
}

export function usePipelineStages(): string[] {
  const { data } = usePipelineConfig();
  if (data?.stages?.length) {
    return data.stages.map((s: PipelineStage) => s.label);
  }
  return [...DEAL_STAGES];
}

export function useUpdatePipelineConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stages: PipelineStage[]) => {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from("pipeline_config")
        .select("id")
        .limit(1)
        .maybeSingle();
      const payload = existing?.id
        ? { id: existing.id, stages: stages as unknown as Json }
        : { stages: stages as unknown as Json };
      const { error } = await supabase
        .from("pipeline_config")
        .upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pipelineConfig });
      toast.success("Pipeline stages saved");
    },
    onError: () => toast.error("Failed to save pipeline stages"),
  });
}
