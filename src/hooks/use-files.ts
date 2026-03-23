"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { FileRecord, EntityType } from "@/types";

const STORAGE_BUCKET = "files";

interface FilesParams {
  dealId?: string;
  contactId?: string;
  companyId?: string;
}

function getEntityInfo(params: FilesParams): { entityId: string; entityType: EntityType } | null {
  if (params.dealId) return { entityId: params.dealId, entityType: "deal" };
  if (params.contactId) return { entityId: params.contactId, entityType: "contact" };
  if (params.companyId) return { entityId: params.companyId, entityType: "company" };
  return null;
}

function getQueryKey(params: FilesParams) {
  if (params.dealId) return queryKeys.files.byDeal(params.dealId);
  if (params.contactId) return queryKeys.files.byContact(params.contactId);
  if (params.companyId) return queryKeys.files.byCompany(params.companyId);
  return queryKeys.files.all;
}

export function useFiles(params: FilesParams) {
  return useQuery({
    queryKey: getQueryKey(params),
    queryFn: async (): Promise<FileRecord[]> => {
      const entity = getEntityInfo(params);
      if (!entity) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("entity_id", entity.entityId)
        .eq("entity_type", entity.entityType)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as FileRecord[];
    },
    enabled: !!(params.dealId || params.contactId || params.companyId),
  });
}

interface UploadFileParams {
  file: File;
  dealId?: string;
  contactId?: string;
  companyId?: string;
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, dealId, contactId, companyId }: UploadFileParams) => {
      const entity = getEntityInfo({ dealId, contactId, companyId });
      if (!entity) {
        throw new Error("At least one of dealId, contactId, or companyId is required");
      }
      const supabase = createClient();
      const folder = `${entity.entityType}/${entity.entityId}`;
      const storageKey = `${folder}/${crypto.randomUUID()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageKey, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("files")
        .insert({
          entity_id: entity.entityId,
          entity_type: entity.entityType,
          filename: file.name,
          size_bytes: file.size,
          mime_type: file.type || null,
          storage_key: storageKey,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as FileRecord;
    },
    onSuccess: (_, { dealId, contactId, companyId }) => {
      queryClient.invalidateQueries({ queryKey: getQueryKey({ dealId, contactId, companyId }) });
      toast.success("File uploaded");
    },
    onError: () => toast.error("Failed to upload file"),
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
    }: {
      file: FileRecord;
      params: FilesParams;
    }) => {
      const supabase = createClient();
      await supabase.storage.from(STORAGE_BUCKET).remove([file.storage_key]);
      const { error } = await supabase.from("files").delete().eq("id", file.id);
      if (error) throw error;
    },
    onSuccess: (_, { params }) => {
      queryClient.invalidateQueries({ queryKey: getQueryKey(params) });
      toast.success("File deleted");
    },
    onError: () => toast.error("Failed to delete file"),
  });
}

/** Returns the public URL for a storage key. Call outside render cycles or memoize the result. */
export function getFilePublicUrl(storageKey: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}

/** Returns a signed URL (1-hour expiry) for a storage key. */
export async function getFileSignedUrl(storageKey: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(storageKey, 3600);
  if (error || !data?.signedUrl) throw error ?? new Error("Failed to create signed URL");
  return data.signedUrl;
}
