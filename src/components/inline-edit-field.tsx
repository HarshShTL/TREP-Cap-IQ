"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FieldType = "text" | "number" | "date" | "textarea" | "select";

interface InlineEditFieldProps {
  label: string;
  value: string | number | null | undefined;
  onSave: (value: string) => Promise<void> | void;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  className?: string;
  formatDisplay?: (value: string | number | null | undefined) => string;
}

export function InlineEditField({
  label,
  value,
  onSave,
  type = "text",
  options = [],
  placeholder = "—",
  className,
  formatDisplay,
}: InlineEditFieldProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(value ?? ""));
  const [saving, setSaving] = React.useState(false);

  const displayValue = formatDisplay
    ? formatDisplay(value)
    : value != null && value !== ""
    ? String(value)
    : null;

  const handleEdit = () => {
    setDraft(String(value ?? ""));
    setEditing(true);
  };

  const handleSave = async () => {
    if (draft === String(value ?? "")) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setEditing(false);
    }
  };

  if (type === "select" && editing) {
    return (
      <div className={cn("space-y-1", className)}>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <Select
          value={draft}
          onValueChange={(v) => {
            setDraft(v);
            setSaving(true);
            Promise.resolve(onSave(v)).finally(() => {
              setSaving(false);
              setEditing(false);
            });
          }}
          onOpenChange={(open) => {
            if (!open) setEditing(false);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {editing ? (
        <div className="relative">
          {type === "textarea" ? (
            <Textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              rows={3}
              className="resize-none text-sm"
            />
          ) : (
            <Input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="h-8 text-sm"
            />
          )}
          {saving && (
            <Loader2 className="absolute right-2 top-1/2 size-3 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={handleEdit}
          className="min-h-[28px] w-full cursor-text rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {saving ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Saving…
            </span>
          ) : displayValue ? (
            <span>{displayValue}</span>
          ) : (
            <span className="text-muted-foreground/60">{placeholder}</span>
          )}
        </button>
      )}
    </div>
  );
}
