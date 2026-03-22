"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { LEAD_STATUS_BADGE_CLASSES } from "@/lib/constants";
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
    return <ChevronsUpDown className="ml-1 inline size-3 text-muted-foreground/30" />;
  return sortAsc ? (
    <ChevronUp className="ml-1 inline size-3.5" />
  ) : (
    <ChevronDown className="ml-1 inline size-3.5" />
  );
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
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!contacts.length) {
    return <EmptyState title="No contacts found" description="Try adjusting your search or filters." />;
  }

  const cols: { key: string; label: string }[] = [
    { key: "first_name", label: "Name" },
    { key: "company_name", label: "Company" },
    { key: "job_title", label: "Job Title" },
    { key: "lead_status", label: "Lead Status" },
    { key: "capital_type", label: "Capital Type" },
    { key: "last_interaction_date", label: "Last Interaction" },
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            {cols.map((col) => (
              <TableHead
                key={col.key}
                className="cursor-pointer select-none whitespace-nowrap py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                onClick={() => onSort(col.key)}
              >
                {col.label}
                <SortIcon field={col.key} sortBy={sortBy} sortAsc={sortAsc} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow
              key={contact.id}
              className="cursor-pointer transition-colors even:bg-muted/20 hover:bg-primary/5"
            >
              <TableCell className="py-3 px-4">
                <Link
                  href={`/contacts/${contact.id}`}
                  className="font-medium hover:underline"
                >
                  {contact.first_name} {contact.last_name}
                </Link>
                {contact.email && (
                  <p className="text-xs text-muted-foreground">{contact.email}</p>
                )}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">{contact.company_name ?? "—"}</TableCell>
              <TableCell className="py-3 px-4 text-sm">{contact.job_title ?? "—"}</TableCell>
              <TableCell className="py-3 px-4">
                {contact.lead_status ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ?? "bg-gray-100 text-gray-700"
                    )}
                  >
                    {contact.lead_status}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">{contact.capital_type ?? "—"}</TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {contact.last_interaction_date
                  ? format(new Date(contact.last_interaction_date), "MMM d, yyyy")
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {hasMore && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading…" : "Load More"}
        </Button>
      )}
    </div>
  );
}
