"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/empty-state";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { cn } from "@/lib/utils";
import {
  LEAD_STATUS_BADGE_CLASSES,
  EMAIL_VERIFICATION_BADGE_CLASSES,
} from "@/lib/constants";
import { useProfiles } from "@/hooks/use-profile";
import type { Contact } from "@/types";

// ---------- Column definitions ----------

export interface ColumnDef {
  key: string;
  label: string;
  defaultVisible: boolean;
  minWidth: number;
  defaultWidth: number;
}

export const ALL_COLUMNS: ColumnDef[] = [
  { key: "first_name", label: "Name", defaultVisible: true, minWidth: 180, defaultWidth: 220 },
  { key: "company_name", label: "Company Name", defaultVisible: true, minWidth: 140, defaultWidth: 180 },
  { key: "email", label: "Email", defaultVisible: true, minWidth: 180, defaultWidth: 220 },
  { key: "phone", label: "Phone Number", defaultVisible: true, minWidth: 120, defaultWidth: 140 },
  { key: "email_verification", label: "Email Verification", defaultVisible: true, minWidth: 100, defaultWidth: 130 },
  { key: "contact_owner", label: "Contact Owner", defaultVisible: true, minWidth: 130, defaultWidth: 160 },
  { key: "lead_status", label: "Lead Status", defaultVisible: true, minWidth: 110, defaultWidth: 130 },
  { key: "capital_type", label: "Capital Type", defaultVisible: true, minWidth: 120, defaultWidth: 150 },
  { key: "investment_strategy", label: "Investment Strategy", defaultVisible: true, minWidth: 120, defaultWidth: 150 },
  { key: "next_steps", label: "Next Steps", defaultVisible: true, minWidth: 140, defaultWidth: 200 },
  { key: "job_title", label: "Job Title", defaultVisible: false, minWidth: 120, defaultWidth: 160 },
  { key: "region", label: "Region", defaultVisible: false, minWidth: 100, defaultWidth: 120 },
  { key: "asset_class", label: "Asset Class", defaultVisible: false, minWidth: 120, defaultWidth: 150 },
  { key: "relationship", label: "Relationship", defaultVisible: false, minWidth: 120, defaultWidth: 150 },
  { key: "database_source", label: "Database Source", defaultVisible: false, minWidth: 100, defaultWidth: 130 },
  { key: "city", label: "City", defaultVisible: false, minWidth: 100, defaultWidth: 120 },
  { key: "state", label: "State", defaultVisible: false, minWidth: 80, defaultWidth: 100 },
  { key: "last_interaction_date", label: "Last Interaction", defaultVisible: false, minWidth: 110, defaultWidth: 130 },
  { key: "created_at", label: "Created", defaultVisible: false, minWidth: 110, defaultWidth: 130 },
];

// ---------- Props ----------

interface ContactsTableProps {
  contacts: Contact[];
  loading?: boolean;
  sortBy: string;
  sortAsc: boolean;
  onSort: (field: string) => void;
  visibleColumns: string[];
}

// ---------- Helpers ----------

function SortIcon({ field, sortBy, sortAsc }: { field: string; sortBy: string; sortAsc: boolean }) {
  if (sortBy !== field)
    return <ChevronsUpDown className="ml-1 inline size-3 text-muted-foreground/25" />;
  return sortAsc ? (
    <ChevronUp className="ml-1 inline size-3.5 text-primary" />
  ) : (
    <ChevronDown className="ml-1 inline size-3.5 text-primary" />
  );
}

function formatDateShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function Muted() {
  return <span className="text-muted-foreground/60 text-sm">--</span>;
}

// ---------- Component ----------

export function ContactsTable({
  contacts,
  loading,
  sortBy,
  sortAsc,
  onSort,
  visibleColumns,
}: ContactsTableProps) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const { data: profiles = [] } = useProfiles();
  const [colWidths, setColWidths] = React.useState<Record<string, number>>({});
  const resizingRef = React.useRef<{ key: string; startX: number; startW: number } | null>(null);

  const columns = React.useMemo(
    () => ALL_COLUMNS.filter((c) => visibleColumns.includes(c.key)),
    [visibleColumns],
  );

  const toggleAll = () => {
    setSelected(selected.size === contacts.length ? new Set() : new Set(contacts.map((c) => c.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const resolveProfile = React.useCallback(
    (id: string | null | undefined) => profiles.find((p) => p.id === id),
    [profiles],
  );

  // Column resizing
  const onMouseDown = React.useCallback(
    (e: React.MouseEvent, col: ColumnDef) => {
      e.preventDefault();
      e.stopPropagation();
      const startW = colWidths[col.key] ?? col.defaultWidth;
      resizingRef.current = { key: col.key, startX: e.clientX, startW };

      const onMouseMove = (ev: MouseEvent) => {
        if (!resizingRef.current) return;
        const diff = ev.clientX - resizingRef.current.startX;
        const minW = col.minWidth;
        const newW = Math.max(minW, resizingRef.current.startW + diff);
        setColWidths((prev) => ({ ...prev, [resizingRef.current!.key]: newW }));
      };

      const onMouseUp = () => {
        resizingRef.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [colWidths],
  );

  // Loading skeleton
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="h-10 border-b border-border bg-muted/40" />
        <div className="space-y-0 divide-y divide-border">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-8 w-8 rounded-full shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <EmptyState
        title="No contacts found"
        description="Try adjusting your search or filters, or add your first contact."
      />
    );
  }

  // ---------- Cell renderer ----------
  function renderCell(contact: Contact, colKey: string) {
    const fullName = `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();

    switch (colKey) {
      case "first_name": {
        return (
          <div className="flex items-center gap-3">
            <EntityAvatar name={fullName} type="contact" size="sm" />
            <div className="min-w-0">
              <Link
                href={`/contacts/${contact.id}`}
                className="block truncate text-sm font-semibold text-foreground hover:text-primary transition-colors"
              >
                {fullName || <Muted />}
              </Link>
              {contact.job_title && (
                <p className="text-xs text-muted-foreground truncate">{contact.job_title}</p>
              )}
            </div>
          </div>
        );
      }

      case "company_name": {
        if (!contact.company_name) return <Muted />;
        return contact.company_id ? (
          <Link
            href={`/companies/${contact.company_id}`}
            className="text-sm text-foreground hover:text-primary transition-colors truncate block"
          >
            {contact.company_name}
          </Link>
        ) : (
          <span className="text-sm truncate block">{contact.company_name}</span>
        );
      }

      case "email": {
        if (!contact.email) return <Muted />;
        return (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1 text-sm text-foreground hover:text-primary transition-colors truncate"
          >
            <span className="truncate">{contact.email}</span>
            <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
          </a>
        );
      }

      case "phone": {
        if (!contact.phone) return <Muted />;
        return (
          <a
            href={`tel:${contact.phone}`}
            className="text-sm text-foreground hover:text-primary transition-colors tabular-nums"
          >
            {contact.phone}
          </a>
        );
      }

      case "email_verification": {
        if (!contact.email_verification) return <Muted />;
        const label =
          contact.email_verification === "accept_all_unverifiable"
            ? "Unverifiable"
            : contact.email_verification;
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              EMAIL_VERIFICATION_BADGE_CLASSES[contact.email_verification] ??
                "bg-gray-100 text-gray-700",
            )}
          >
            {label}
          </span>
        );
      }

      case "contact_owner": {
        const profile = resolveProfile(contact.contact_owner);
        if (!profile?.full_name) return <Muted />;
        return (
          <div className="flex items-center gap-2">
            <EntityAvatar name={profile.full_name} type="contact" size="sm" />
            <span className="text-sm truncate">{profile.full_name}</span>
          </div>
        );
      }

      case "lead_status": {
        if (!contact.lead_status) return <Muted />;
        return (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
              LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ?? "bg-gray-100 text-gray-700",
            )}
          >
            {contact.lead_status}
          </span>
        );
      }

      case "capital_type": {
        if (!contact.capital_type) return <Muted />;
        return (
          <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground whitespace-nowrap">
            {contact.capital_type}
          </span>
        );
      }

      case "investment_strategy": {
        if (!contact.investment_strategy) return <Muted />;
        return <span className="text-sm">{contact.investment_strategy}</span>;
      }

      case "next_steps": {
        if (!contact.next_steps) return <Muted />;
        return (
          <span className="text-sm truncate block max-w-[200px]" title={contact.next_steps}>
            {contact.next_steps}
          </span>
        );
      }

      case "last_interaction_date":
      case "created_at": {
        const val = contact[colKey as keyof Contact] as string | null;
        if (!val) return <Muted />;
        return (
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {formatDateShort(val)}
          </span>
        );
      }

      default: {
        const val = contact[colKey as keyof Contact];
        if (val == null || val === "") return <Muted />;
        return <span className="text-sm truncate block">{String(val)}</span>;
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="bg-muted/40 w-10 px-3 py-3 sticky left-0 z-10">
                <Checkbox
                  checked={contacts.length > 0 && selected.size === contacts.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="bg-muted/40 select-none whitespace-nowrap py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors relative group"
                  style={{
                    width: colWidths[col.key] ?? col.defaultWidth,
                    minWidth: col.minWidth,
                  }}
                >
                  <button
                    type="button"
                    className="flex items-center hover:text-foreground transition-colors"
                    onClick={() => onSort(col.key)}
                  >
                    {col.label}
                    <SortIcon field={col.key} sortBy={sortBy} sortAsc={sortAsc} />
                  </button>
                  {/* Resize handle */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-primary/20 active:bg-primary/40"
                    onMouseDown={(e) => onMouseDown(e, col)}
                  />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow
                key={contact.id}
                className="border-b border-border/60 hover:bg-muted/30 transition-colors"
              >
                <TableCell className="py-2.5 px-3 w-10 sticky left-0 bg-card z-10">
                  <Checkbox
                    checked={selected.has(contact.id)}
                    onCheckedChange={() => toggleOne(contact.id)}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="py-2.5 px-4"
                    style={{
                      width: colWidths[col.key] ?? col.defaultWidth,
                      minWidth: col.minWidth,
                    }}
                  >
                    {renderCell(contact, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm text-foreground">
          <span className="font-medium">{selected.size} selected</span>
        </div>
      )}
    </div>
  );
}
