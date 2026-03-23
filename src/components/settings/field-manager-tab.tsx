"use client";

import * as React from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  Pencil,
  Lock,
  Save,
  X,
} from "lucide-react";
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
  DialogDescription,
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
import { toast } from "@/components/ui/toast";
import { useSchemaConfig, useUpdateSchemaConfig } from "@/hooks/use-schema-config";
import { labelToKey, cn } from "@/lib/utils";
import type { EntityType, FieldDefinition, FieldType } from "@/types";

/* ─── Constants ───────────────────────────────────────────────────────────── */

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "select", label: "Single Select" },
  { value: "multiselect", label: "Multi Select" },
  { value: "textarea", label: "Textarea" },
  { value: "boolean", label: "Boolean" },
];

const FIELD_TYPE_COLORS: Record<string, string> = {
  text: "bg-blue-100 text-blue-700 border-blue-200",
  number: "bg-emerald-100 text-emerald-700 border-emerald-200",
  date: "bg-purple-100 text-purple-700 border-purple-200",
  select: "bg-amber-100 text-amber-700 border-amber-200",
  multiselect: "bg-orange-100 text-orange-700 border-orange-200",
  textarea: "bg-slate-100 text-slate-700 border-slate-200",
  boolean: "bg-pink-100 text-pink-700 border-pink-200",
};

const FIELD_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  number: "Number",
  date: "Date",
  select: "Select",
  multiselect: "Multi Select",
  textarea: "Textarea",
  boolean: "Boolean",
};

const ENTITY_LABELS: Record<EntityType, string> = {
  deal: "Deal",
  contact: "Contact",
  company: "Company",
  activity: "Activity",
};

const ENTITY_DESCRIPTIONS: Record<EntityType, string> = {
  deal: "Manage fields that appear on deal records. Drag to reorder.",
  contact: "Manage fields that appear on contact records. Drag to reorder.",
  company: "Manage fields that appear on company records. Drag to reorder.",
  activity: "Manage fields that appear on activity records. Drag to reorder.",
};

/* ─── Field Dialog (Add / Edit) ───────────────────────────────────────────── */

interface FieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (field: Omit<FieldDefinition, "order">) => void;
  initial?: FieldDefinition | null;
  existingKeys?: string[];
}

function FieldDialog({ open, onOpenChange, onSave, initial, existingKeys = [] }: FieldDialogProps) {
  const isEditing = !!initial;
  const [label, setLabel] = React.useState("");
  const [type, setType] = React.useState<FieldType>("text");
  const [options, setOptions] = React.useState<string[]>([]);
  const [newOption, setNewOption] = React.useState("");
  const [required, setRequired] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const hasOptions = type === "select" || type === "multiselect";

  React.useEffect(() => {
    if (open && initial) {
      setLabel(initial.label);
      setType(initial.type);
      setOptions(initial.options ?? []);
      setRequired(initial.required ?? false);
      setDescription("");
    } else if (open) {
      setLabel("");
      setType("text");
      setOptions([]);
      setNewOption("");
      setRequired(false);
      setDescription("");
    }
  }, [open, initial]);

  const handleAddOption = () => {
    if (!newOption.trim() || options.includes(newOption.trim())) return;
    setOptions((prev) => [...prev, newOption.trim()]);
    setNewOption("");
  };

  const handleRemoveOption = (opt: string) => {
    setOptions((prev) => prev.filter((o) => o !== opt));
  };

  const handleSave = () => {
    if (!label.trim()) return;
    const key = initial?.key ?? labelToKey(label);
    if (!isEditing && existingKeys.includes(key)) {
      toast.error("A field with that name already exists");
      return;
    }
    onSave({
      key,
      label: label.trim(),
      type,
      options: hasOptions ? options : undefined,
      required: required || undefined,
      locked: initial?.locked,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Field" : "Add Custom Field"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the field configuration."
              : "Define a new custom field for this entity type."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Field Name *</label>
            <Input
              placeholder="e.g. Deal Score"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
              disabled={isEditing}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Field Type</label>
            <Select value={type} onValueChange={(v: string) => setType(v as FieldType)} disabled={isEditing}>
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

          {/* Select / Multi Select options */}
          {hasOptions && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add an option..."
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
                <Button variant="outline" size="sm" onClick={handleAddOption} disabled={!newOption.trim()}>
                  <Plus className="size-4" />
                </Button>
              </div>
              {options.length > 0 && (
                <div className="space-y-1 rounded-lg border border-border p-2">
                  {options.map((opt) => (
                    <div
                      key={opt}
                      className="flex items-center justify-between rounded px-2 py-1 text-sm bg-muted/30"
                    >
                      <span>{opt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(opt)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Required toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={required}
              onClick={() => setRequired(!required)}
              className={cn(
                "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                required ? "bg-amber-600" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block size-4 rounded-full bg-white shadow-sm transition-transform",
                  required ? "translate-x-4" : "translate-x-0",
                )}
              />
            </button>
            <label className="text-sm font-medium">Required field</label>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Help Text <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Input
              placeholder="Displayed below the field as guidance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-dashed border-border bg-muted/10 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                {label || "Field Name"}
                {required && <span className="text-destructive ml-0.5">*</span>}
              </label>
              {type === "text" && <div className="h-9 rounded-md border border-border bg-background" />}
              {type === "number" && <div className="h-9 rounded-md border border-border bg-background" />}
              {type === "textarea" && <div className="h-20 rounded-md border border-border bg-background" />}
              {type === "date" && <div className="h-9 rounded-md border border-border bg-background" />}
              {type === "boolean" && (
                <div className="flex items-center gap-2">
                  <div className="size-4 rounded border border-border bg-background" />
                  <span className="text-sm text-muted-foreground">Yes / No</span>
                </div>
              )}
              {type === "select" && (
                <div className="h-9 rounded-md border border-border bg-background px-3 flex items-center text-sm text-muted-foreground">
                  {options.length > 0 ? options[0] : "Select..."}
                </div>
              )}
              {type === "multiselect" && (
                <div className="min-h-9 rounded-md border border-border bg-background px-3 py-1.5 flex flex-wrap gap-1 items-center text-sm text-muted-foreground">
                  {options.length > 0
                    ? options.slice(0, 3).map((opt) => (
                        <span key={opt} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs">
                          {opt}
                        </span>
                      ))
                    : "Select multiple..."}
                </div>
              )}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!label.trim()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isEditing ? "Update Field" : "Add Field"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────────── */

interface FieldManagerTabProps {
  entityType: EntityType;
}

export function FieldManagerTab({ entityType }: FieldManagerTabProps) {
  const { data: schema, isLoading } = useSchemaConfig(entityType);
  const updateSchema = useUpdateSchemaConfig();
  const [fields, setFields] = React.useState<FieldDefinition[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editField, setEditField] = React.useState<FieldDefinition | null>(null);
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

  const handleSaveField = (field: Omit<FieldDefinition, "order">) => {
    const existing = fields.findIndex((f) => f.key === field.key);
    if (existing >= 0) {
      // Update existing
      setFields((prev) =>
        prev.map((f) => (f.key === field.key ? { ...f, ...field } : f)),
      );
    } else {
      // Add new
      setFields((prev) => [...prev, { ...field, order: prev.length }]);
    }
    setEditField(null);
    setDirty(true);
  };

  const handleDelete = (key: string) => {
    setFields((prev) =>
      prev.filter((f) => f.key !== key).map((f, i) => ({ ...f, order: i })),
    );
    setDeleteKey(null);
    setDirty(true);
  };

  const handleSave = async () => {
    await updateSchema.mutateAsync({ entityType, fieldDefinitions: fields });
    setDirty(false);
    toast.success("Fields saved");
  };

  const openAdd = () => {
    setEditField(null);
    setDialogOpen(true);
  };

  const openEdit = (field: FieldDefinition) => {
    setEditField(field);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted/40" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{ENTITY_LABELS[entityType]} Fields</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {ENTITY_DESCRIPTIONS[entityType]}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={openAdd}>
            <Plus className="mr-2 size-4" />
            Add Custom Field
          </Button>
          {dirty && (
            <Button
              onClick={handleSave}
              disabled={updateSchema.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Save className="mr-2 size-4" />
              {updateSchema.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>
      </div>

      {fields.length === 0 && (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No fields configured yet. Add a custom field to get started.
          </p>
        </div>
      )}

      {/* Field list */}
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
                      className={cn(
                        "flex items-center gap-3 rounded-lg border bg-card p-3 transition-shadow",
                        snap.isDragging ? "shadow-lg ring-2 ring-amber-200" : "shadow-sm",
                      )}
                    >
                      {/* Drag handle */}
                      <span
                        {...prov.dragHandleProps}
                        className={cn(
                          "cursor-grab text-muted-foreground hover:text-foreground",
                          field.locked && "opacity-30",
                        )}
                      >
                        <GripVertical className="size-4" />
                      </span>

                      {/* Field info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{field.label}</span>
                          {/* Type badge */}
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border",
                              FIELD_TYPE_COLORS[field.type] ?? "bg-slate-100 text-slate-700 border-slate-200",
                            )}
                          >
                            {FIELD_TYPE_LABELS[field.type] ?? field.type}
                          </span>
                          {field.required && (
                            <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-red-100 text-red-700 border border-red-200">
                              Required
                            </Badge>
                          )}
                          {field.locked && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground" title="System field — cannot be modified">
                              <Lock className="size-3" />
                              System
                            </span>
                          )}
                        </div>
                        {field.options?.length ? (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {field.options.join(", ")}
                          </p>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 shrink-0">
                        {!field.locked ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-foreground"
                              onClick={() => openEdit(field)}
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteKey(field.key)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="size-7" />
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add/Edit dialog */}
      <FieldDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveField}
        initial={editField}
        existingKeys={fields.map((f) => f.key)}
      />

      {/* Delete confirmation */}
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
