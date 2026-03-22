"use client";

import * as React from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { usePipelineConfig, useUpdatePipelineConfig } from "@/hooks/use-pipeline-config";
import { labelToKey } from "@/lib/utils";
import type { PipelineStage } from "@/types";

export function PipelineStagesTab() {
  const { data: config, isLoading } = usePipelineConfig();
  const updateConfig = useUpdatePipelineConfig();

  const [stages, setStages] = React.useState<PipelineStage[]>([]);
  const [newLabel, setNewLabel] = React.useState("");
  const [deleteKey, setDeleteKey] = React.useState<string | null>(null);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (config?.stages) {
      setStages(config.stages);
      setDirty(false);
    }
  }, [config]);

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
    if (stages.some((s) => s.key === key)) return;
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
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Drag to reorder stages. Changes take effect across the Deals board when saved.
      </p>

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
                      className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${
                        snap.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <span {...prov.dragHandleProps} className="cursor-grab text-muted-foreground">
                        <GripVertical className="size-4" />
                      </span>
                      <span className="flex-1 text-sm font-medium">{stage.label}</span>
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

      <div className="flex gap-2">
        <Input
          placeholder="New stage name"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />
        <Button variant="outline" onClick={handleAdd} disabled={!newLabel.trim()}>
          <Plus className="mr-2 size-4" />
          Add
        </Button>
      </div>

      {dirty && (
        <Button onClick={handleSave} disabled={updateConfig.isPending}>
          {updateConfig.isPending ? "Saving…" : "Save Changes"}
        </Button>
      )}

      <ConfirmDialog
        open={!!deleteKey}
        onOpenChange={(open) => {
          if (!open) setDeleteKey(null);
        }}
        title="Delete stage?"
        description="Deals in this stage will remain but the stage will no longer appear in the pipeline."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteKey) handleDelete(deleteKey);
        }}
      />
    </div>
  );
}
