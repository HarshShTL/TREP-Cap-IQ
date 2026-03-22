"use client";

import * as React from "react";
import { Bookmark, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useCustomViews, useCreateView, useDeleteView } from "@/hooks/use-custom-views";
import { cn } from "@/lib/utils";
import type { EntityType } from "@/types";

interface CustomViewsSidebarProps {
  entityType: EntityType;
  activeViewId?: string | null;
  onSelectView: (view: { id: string; filters: Record<string, unknown> | null }) => void;
  currentFilters?: Record<string, unknown>;
}

export function CustomViewsSidebar({
  entityType,
  activeViewId,
  onSelectView,
  currentFilters,
}: CustomViewsSidebarProps) {
  const { data: views } = useCustomViews(entityType);
  const createView = useCreateView();
  const deleteView = useDeleteView();
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [saveName, setSaveName] = React.useState("");
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    await createView.mutateAsync({
      name: saveName.trim(),
      entity_type: entityType,
      filters: currentFilters ?? null,
      columns: null,
    });
    setSaveName("");
    setSaveOpen(false);
  };

  return (
    <div className="w-48 shrink-0 space-y-1">
      <div className="mb-2 flex items-center justify-between px-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Saved Views
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-6"
          title="Save current view"
          onClick={() => setSaveOpen(true)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <button
        className={cn(
          "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted/60",
          !activeViewId && "bg-muted font-medium"
        )}
        onClick={() => onSelectView({ id: "", filters: null })}
      >
        All Records
      </button>

      {(views ?? []).map((view) => (
        <div
          key={view.id}
          className={cn(
            "group flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/60",
            activeViewId === view.id && "bg-muted font-medium"
          )}
        >
          <button
            className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
            onClick={() => onSelectView({ id: view.id, filters: view.filters })}
          >
            <Bookmark className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{view.name}</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            className="size-5 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteId(view.id)}
          >
            <Trash2 className="size-3" />
          </Button>
        </div>
      ))}

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Save View</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="View name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!saveName.trim() || createView.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete view?"
        confirmLabel="Delete"
        loading={deleteView.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteView.mutate(
              { id: deleteId, entityType },
              { onSuccess: () => setDeleteId(null) }
            );
          }
        }}
      />
    </div>
  );
}
