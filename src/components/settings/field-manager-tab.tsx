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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useSchemaConfig, useUpdateSchemaConfig } from "@/hooks/use-schema-config";
import { labelToKey } from "@/lib/utils";
import type { EntityType, FieldDefinition, FieldType } from "@/types";

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Select" },
  { value: "textarea", label: "Textarea" },
  { value: "boolean", label: "Boolean" },
];

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (field: Omit<FieldDefinition, "order">) => void;
}

function AddFieldDialog({ open, onOpenChange, onAdd }: AddFieldDialogProps) {
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<FieldType>("text");
  const [optionsStr, setOptionsStr] = React.useState("");

  const handleAdd = () => {
    if (!label.trim()) return;
    const key = labelToKey(label);
    const options =
      type === "select"
        ? optionsStr
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;
    onAdd({ key, label: label.trim(), type, options });
    setLabel("");
    setType("text");
    setOptionsStr("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Custom Field</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Field Label *</label>
            <Input
              placeholder="e.g. Deal Score"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(v) => setType(v as FieldType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((ft) => (
                  <SelectItem key={ft.value} value={ft.value}>
                    {ft.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {type === "select" && (
            <div className="space-y-1">
              <label className="text-sm font-medium">Options (comma-separated)</label>
              <Input
                placeholder="Option A, Option B, Option C"
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!label.trim()}>
            Add Field
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FieldManagerTabProps {
  entityType: EntityType;
}

export function FieldManagerTab({ entityType }: FieldManagerTabProps) {
  const { data: schema, isLoading } = useSchemaConfig(entityType);
  const updateSchema = useUpdateSchemaConfig();
  const [fields, setFields] = React.useState<FieldDefinition[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [deleteKey, setDeleteKey] = React.useState<string | null>(null);
  const [dirty, setDirty] = React.useState(false);

  React.useEffect(() => {
    if (schema?.field_definitions) {
      setFields(schema.field_definitions);
      setDirty(false);
    }
  }, [schema]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const next = [...fields];
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setFields(next.map((f, i) => ({ ...f, order: i })));
    setDirty(true);
  };

  const handleAdd = (field: Omit<FieldDefinition, "order">) => {
    if (fields.some((f) => f.key === field.key)) return;
    setFields((prev) => [...prev, { ...field, order: prev.length }]);
    setDirty(true);
  };

  const handleDelete = (key: string) => {
    setFields((prev) =>
      prev.filter((f) => f.key !== key).map((f, i) => ({ ...f, order: i }))
    );
    setDeleteKey(null);
    setDirty(true);
  };

  const handleSave = async () => {
    await updateSchema.mutateAsync({ entityType, fieldDefinitions: fields });
    setDirty(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-4">
      <p className="text-sm text-muted-foreground">
        Custom fields appear in the detail view for each {entityType}. Drag to reorder.
      </p>

      {fields.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No custom fields yet. Add one below.
        </p>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
              {fields.map((field, index) => (
                <Draggable key={field.key} draggableId={field.key} index={index}>
                  {(prov, snap) => (
                    <div
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${
                        snap.isDragging ? "shadow-lg" : ""
                      }`}
                    >
                      <span
                        {...prov.dragHandleProps}
                        className={`cursor-grab text-muted-foreground ${
                          field.locked ? "opacity-30" : ""
                        }`}
                      >
                        <GripVertical className="size-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{field.label}</span>
                          {field.locked && (
                            <Badge variant="secondary" className="text-xs">
                              locked
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {field.type}
                          {field.options?.length ? ` · ${field.options.join(", ")}` : ""}
                        </p>
                      </div>
                      {!field.locked && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteKey(field.key)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
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
        <Button variant="outline" onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Custom Field
        </Button>
        {dirty && (
          <Button onClick={handleSave} disabled={updateSchema.isPending}>
            {updateSchema.isPending ? "Saving…" : "Save Changes"}
          </Button>
        )}
      </div>

      <AddFieldDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAdd} />

      <ConfirmDialog
        open={!!deleteKey}
        onOpenChange={(open) => {
          if (!open) setDeleteKey(null);
        }}
        title="Delete field?"
        description="This will remove the field from all records. Stored values will remain in custom_fields but won't be displayed."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteKey) handleDelete(deleteKey);
        }}
      />
    </div>
  );
}
