"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { FileRecord } from "@/types";

const STORAGE_BUCKET = "files";

interface FilesParams {
  dealId?: string;
  contactId?: string;
  companyId?: string;
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
      const supabase = createClient();
      let q = supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (params.dealId) q = q.eq("deal_id", params.dealId);
      else if (params.contactId) q = q.eq("contact_id", params.contactId);
      else if (params.companyId) q = q.eq("company_id", params.companyId);

      const { data, error } = await q;
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
      if (!dealId && !contactId && !companyId) {
        throw new Error("At least one of dealId, contactId, or companyId is required");
      }
      const supabase = createClient();
      const folder = dealId
        ? `deal/${dealId}`
        : contactId
        ? `contact/${contactId}`
        : `company/${companyId}`;
      const storageKey = `${folder}/${crypto.randomUUID()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storageKey, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from("files")
        .insert({
          deal_id: dealId ?? null,
          contact_id: contactId ?? null,
          company_id: companyId ?? null,
          filename: file.name,
          size: file.size,
          storage_key: storageKey,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as FileRecord;
    },
    onSuccess: (data, { dealId, contactId, companyId }) => {
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
