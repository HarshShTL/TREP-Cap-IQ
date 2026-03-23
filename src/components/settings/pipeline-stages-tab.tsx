"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2, Save } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { usePipelineConfig, useUpdatePipelineConfig } from "@/hooks/use-pipeline-config";
import { useDeals } from "@/hooks/use-deals";
import { labelToKey } from "@/lib/utils";
import type { PipelineStage } from "@/types";

const STAGE_COLORS = [
  "bg-blue-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-500",
];

export function PipelineStagesTab() {
  const { data: config, isLoading: configLoading } = usePipelineConfig();
  const { data: deals = [] } = useDeals();
  const updateConfig = useUpdatePipelineConfig();

  const [stages, setStages] = React.useState<PipelineStage[]>([]);
  const [newLabel, setNewLabel] = React.useState("");
  const [deleteKey, setDeleteKey] = React.useState<string | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editLabel, setEditLabel] = React.useState("");

  React.useEffect(() => {
    if (config?.stages) {
      setStages(config.stages);
      setDirty(false);
    }
  }, [config]);

  // Count deals per stage
  const dealCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    deals.forEach((d) => {
      const stage = (d as { stage?: string }).stage ?? "";
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return counts;
  }, [deals]);

  const deleteTarget = stages.find((s) => s.key === deleteKey);
  const deleteCount = deleteKey ? (dealCounts[deleteKey] ?? 0) : 0;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const next = [...stages];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setStages(next);
    setDirty(true);
  };

  const handleAdd = () => {
    if (!newLabel.trim()) return;
    const key = labelToKey(newLabel.trim());
    if (stages.some((s) => s.key === key)) {
      toast.error("A stage with that name already exists");
      return;
    }
    setStages((prev) => [...prev, { key, label: newLabel.trim() }]);
    setNewLabel("");
    setDirty(true);
  };

  const handleDelete = (key: string) => {
    setStages((prev) => prev.filter((s) => s.key !== key));
    setDeleteKey(null);
    setDirty(true);
  };

  const handleSave = async () => {
    await updateConfig.mutateAsync(stages);
    setDirty(false);
    toast.success("Pipeline stages saved");
  };

  const startEdit = (stage: PipelineStage) => {
    setEditingKey(stage.key);
    setEditLabel(stage.label);
  };

  const commitEdit = () => {
    if (!editingKey || !editLabel.trim()) {
      setEditingKey(null);
      return;
    }
    setStages((prev) =>
      prev.map((s) =>
        s.key === editingKey ? { ...s, label: editLabel.trim() } : s,
      ),
    );
    setEditingKey(null);
    setDirty(true);
  };

  if (configLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full max-w-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Pipeline Stages</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure deal pipeline stages. Drag to reorder.
          </p>
        </div>
        {dirty && (
          <Button
            onClick={handleSave}
            disabled={updateConfig.isPending}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Save className="mr-2 size-4" />
            {updateConfig.isPending ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stage list */}
        <div className="space-y-4">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="pipeline-stages">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-2"
                >
                  {stages.map((stage, index) => (
                    <Draggable key={stage.key} draggableId={stage.key} index={index}>
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          className={`flex items-center gap-3 rounded-lg border bg-card p-3 transition-shadow ${
                            snap.isDragging ? "shadow-lg ring-2 ring-amber-200" : "shadow-sm"
                          }`}
                        >
                          <span {...prov.dragHandleProps} className="cursor-grab text-muted-foreground hover:text-foreground">
                            <GripVertical className="size-4" />
                          </span>
                          <span className={`size-3 rounded-full shrink-0 ${STAGE_COLORS[index % STAGE_COLORS.length]}`} />
                          {editingKey === stage.key ? (
                            <Input
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              onBlur={commitEdit}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") commitEdit();
                                if (e.key === "Escape") setEditingKey(null);
                              }}
                              className="h-7 flex-1 text-sm"
                              autoFocus
                            />
                          ) : (
                            <span
                              className="flex-1 text-sm font-medium cursor-pointer hover:text-amber-700 transition-colors"
                              onClick={() => startEdit(stage)}
                              title="Click to edit"
                            >
                              {stage.label}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-xs tabular-nums">
                            {dealCounts[stage.key] ?? 0}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-7 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteKey(stage.key)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Add stage */}
          <div className="flex gap-2">
            <Input
              placeholder="New stage name..."
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <Button variant="outline" onClick={handleAdd} disabled={!newLabel.trim()}>
              <Plus className="mr-2 size-4" />
              Add Stage
            </Button>
          </div>
        </div>

        {/* Kanban preview */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Board Preview</p>
          <div className="rounded-xl border border-border bg-muted/20 p-4 overflow-x-auto">
            <div className="flex gap-3 min-w-0">
              {stages.map((stage, index) => (
                <div
                  key={stage.key}
                  className="flex flex-col items-center gap-2 min-w-[80px]"
                >
                  <div className="w-full rounded-lg border border-border bg-card p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`size-2 rounded-full ${STAGE_COLORS[index % STAGE_COLORS.length]}`} />
                      <span className="text-xs font-medium truncate">{stage.label}</span>
                    </div>
                    {/* Placeholder deal cards */}
                    <div className="space-y-1.5">
                      {Array.from({ length: Math.min(dealCounts[stage.key] ?? 0, 2) }).map((_, i) => (
                        <div key={i} className="h-4 rounded bg-muted/60" />
                      ))}
                      {(dealCounts[stage.key] ?? 0) === 0 && (
                        <div className="h-4 rounded border border-dashed border-border" />
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums">
                    {dealCounts[stage.key] ?? 0} deals
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteKey}
        onOpenChange={(open) => {
          if (!open) setDeleteKey(null);
        }}
        title="Delete stage?"
        description={
          deleteCount > 0
            ? `"${deleteTarget?.label}" has ${deleteCount} deal${deleteCount > 1 ? "s" : ""}. They will remain but the stage will no longer appear in the pipeline.`
            : `"${deleteTarget?.label}" will be removed from the pipeline.`
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteKey) handleDelete(deleteKey);
        }}
      />
    </div>
  );
}
