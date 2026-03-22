"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { SchemaConfig, FieldDefinition, EntityType } from "@/types";

export function useSchemaConfig(entityType: EntityType) {
  return useQuery({
    queryKey: queryKeys.schemaConfig(entityType),
    queryFn: async (): Promise<SchemaConfig | null> => {
      const supabase = createClient();
      const { data } = await supabase
        .from("schema_config")
        .select("*")
        .eq("entity_type", entityType)
        .maybeSingle();
      return data as SchemaConfig | null;
    },
  });
}

export function useUpdateSchemaConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      entityType,
      fieldDefinitions,
    }: {
      entityType: EntityType;
      fieldDefinitions: FieldDefinition[];
    }) => {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from("schema_config")
        .select("id")
        .eq("entity_type", entityType)
        .maybeSingle();

      const payload = existing?.id
        ? { id: existing.id, entity_type: entityType, field_definitions: fieldDefinitions }
        : { entity_type: entityType, field_definitions: fieldDefinitions };
      const { error } = await supabase.from("schema_config").upsert(payload);
      if (error) throw error;
    },
    onSuccess: (_, { entityType }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.schemaConfig(entityType),
      });
      toast.success("Fields saved");
    },
    onError: () => toast.error("Failed to save fields"),
  });
}
