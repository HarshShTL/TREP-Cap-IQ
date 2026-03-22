"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn, formatDate } from "@/lib/utils";
import {
  LEAD_STATUS_BADGE_CLASSES,
} from "@/lib/constants";
import { useProfiles } from "@/hooks/use-profile";
import type { Contact } from "@/types";

interface ContactsTableProps {
  contacts: Contact[];
  loading?: boolean;
  sortBy: string;
  sortAsc: boolean;
  onSort: (field: string) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
}

function SortIcon({ field, sortBy, sortAsc }: { field: string; sortBy: string; sortAsc: boolean }) {
  if (sortBy !== field)
    return <ChevronsUpDown className="ml-1 inline size-3 text-muted-foreground/25" />;
  return sortAsc
    ? <ChevronUp className="ml-1 inline size-3.5 text-primary" />
    : <ChevronDown className="ml-1 inline size-3.5 text-primary" />;
}

export function ContactsTable({
  contacts,
  loading,
  sortBy,
  sortAsc,
  onSort,
  hasMore,
  onLoadMore,
  loadingMore,
}: ContactsTableProps) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const { data: profiles = [] } = useProfiles();

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

  const resolveProfile = (id: string | null | undefined) =>
    profiles.find((p) => p.id === id)?.full_name ?? null;

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="h-10 border-b border-border bg-muted/40" />
        <div className="space-y-0 divide-y divide-border">
          {Array.from({ length: 8 }).map((_, i) => (
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

  const cols: { key: string; label: string }[] = [
    { key: "first_name", label: "Name" },
    { key: "company_name", label: "Company" },
    { key: "lead_status", label: "Status" },
    { key: "phone", label: "Phone" },
    { key: "capital_type", label: "Capital Type" },
    { key: "contact_owner", label: "Owner" },
    { key: "last_interaction_date", label: "Last Contact" },
  ];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border hover:bg-transparent">
              <TableHead className="bg-muted/40 w-10 px-4 py-3">
                <Checkbox
                  checked={contacts.length > 0 && selected.size === contacts.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              {cols.map((col) => (
                <TableHead
                  key={col.key}
                  className="bg-muted/40 cursor-pointer select-none whitespace-nowrap py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => onSort(col.key)}
                >
                  {col.label}
                  <SortIcon field={col.key} sortBy={sortBy} sortAsc={sortAsc} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contact) => {
              const fullName = `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
              const ownerName = resolveProfile(contact.contact_owner);

              return (
                <TableRow
                  key={contact.id}
                  className="cursor-pointer border-b border-border/60 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-3 px-4 w-10">
                    <Checkbox
                      checked={selected.has(contact.id)}
                      onCheckedChange={() => toggleOne(contact.id)}
                    />
                  </TableCell>

                  {/* Name */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <EntityAvatar name={fullName} type="contact" size="sm" />
                      <div className="min-w-0">
                        <Link
                          href={`/contacts/${contact.id}`}
                          className="block truncate text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {fullName}
                        </Link>
                        {contact.job_title && (
                          <p className="text-xs text-muted-foreground truncate">{contact.job_title}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="py-3 px-4 text-sm">
                    {contact.company_id ? (
                      <Link
                        href={`/companies/${contact.company_id}`}
                        className="text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {contact.company_name ?? "—"}
                      </Link>
                    ) : (
                      <span className="text-sm text-foreground">{contact.company_name ?? <span className="text-muted-foreground">—</span>}</span>
                    )}
                  </TableCell>

                  {/* Lead Status */}
                  <TableCell className="py-3 px-4">
                    {contact.lead_status ? (
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ?? "bg-gray-100 text-gray-700",
                        )}
                      >
                        {contact.lead_status}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="py-3 px-4">
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-xs text-foreground hover:text-primary transition-colors tabular-nums"
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Capital Type */}
                  <TableCell className="py-3 px-4">
                    {contact.capital_type ? (
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                        {contact.capital_type}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>

                  {/* Owner */}
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground">
                    {ownerName ?? "—"}
                  </TableCell>

                  {/* Last Contact */}
                  <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(contact.last_interaction_date)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          className="w-full rounded-lg"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading…" : "Load more contacts"}
        </Button>
      )}

      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm text-foreground">
          <span className="font-medium">{selected.size} selected</span>
        </div>
      )}
    </div>
  );
}
