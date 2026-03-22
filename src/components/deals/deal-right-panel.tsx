"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, File, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useDealParticipants } from "@/hooks/use-deal-participants";
import { useFiles, useUploadFile, useDeleteFile } from "@/hooks/use-files";
import { formatFileSize } from "@/lib/constants";
import type { FileRecord } from "@/types";

interface DealRightPanelProps {
  dealId: string;
}

export function DealRightPanel({ dealId }: DealRightPanelProps) {
  const { data: participants, isLoading: participantsLoading } = useDealParticipants(dealId);
  const { data: files, isLoading: filesLoading } = useFiles({ dealId });
  const uploadFile = useUploadFile();
  const deleteFile = useDeleteFile();
  const [deleteTarget, setDeleteTarget] = React.useState<FileRecord | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    uploadFile.mutate({ file, dealId });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    Array.from(e.dataTransfer.files).forEach(handleUpload);
  };

  const contacts = React.useMemo(() => {
    const seen = new Set<string>();
    return (participants ?? [])
      .filter((p) => {
        if (!p.contacts || seen.has(p.contact_id)) return false;
        seen.add(p.contact_id);
        return true;
      })
      .map((p) => p.contacts!);
  }, [participants]);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium">Linked Contacts</p>
        {participantsLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : contacts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No contacts linked yet.</p>
        ) : (
          <div className="space-y-0.5">
            {contacts.map((c) => (
              <Link
                key={c.id}
                href={`/contacts/${c.id}`}
                className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
              >
                <span>
                  {c.first_name} {c.last_name}
                </span>
                <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Files</p>
        <div
          className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-muted hover:border-muted-foreground/40"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => Array.from(e.target.files ?? []).forEach(handleUpload)}
          />
          <button
            type="button"
            className="flex w-full flex-col items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-5" />
            <span>Drop files or click to upload</span>
          </button>
        </div>

        {filesLoading ? (
          <div className="mt-2 space-y-1">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="mt-2 space-y-0.5">
            {(files ?? []).map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/60"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <File className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{f.filename}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatFileSize(f.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setDeleteTarget(f)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete file?"
        description={`This will permanently delete "${deleteTarget?.filename}".`}
        confirmLabel="Delete"
        loading={deleteFile.isPending}
        onConfirm={() => {
          if (deleteTarget) {
            deleteFile.mutate(
              { file: deleteTarget, params: { dealId } },
              { onSuccess: () => setDeleteTarget(null) }
            );
          }
        }}
      />
    </div>
  );
}
