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
  EMAIL_VERIFICATION_BADGE_CLASSES,
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

function SortIcon({
  field,
  sortBy,
  sortAsc,
}: {
  field: string;
  sortBy: string;
  sortAsc: boolean;
}) {
  if (sortBy !== field)
    return (
      <ChevronsUpDown className="ml-1 inline size-3 text-muted-foreground/30" />
    );
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
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const { data: profiles = [] } = useProfiles();

  const toggleAll = () => {
    if (selected.size === contacts.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(contacts.map((c) => c.id)));
    }
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
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <EmptyState
        title="No contacts found"
        description="Try adjusting your search or filters."
      />
    );
  }

  const cols: { key: string; label: string }[] = [
    { key: "first_name", label: "Name" },
    { key: "company_name", label: "Company" },
    { key: "lead_status", label: "Lead Status" },
    { key: "email_verification", label: "Email" },
    { key: "contact_owner", label: "Owner" },
    { key: "capital_type", label: "Capital Type" },
    { key: "last_interaction_date", label: "Last Interaction" },
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100">
            <TableHead className="bg-slate-50/80 w-10 px-4 py-2.5">
              <Checkbox
                checked={
                  contacts.length > 0 && selected.size === contacts.length
                }
                onCheckedChange={toggleAll}
              />
            </TableHead>
            {cols.map((col) => (
              <TableHead
                key={col.key}
                className="bg-slate-50/80 cursor-pointer select-none whitespace-nowrap py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
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
            const fullName =
              `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
            const ownerName = resolveProfile(contact.contact_owner);
            const emailVerification = (
              contact as Contact & { email_verification?: string }
            ).email_verification;

            return (
              <TableRow
                key={contact.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <TableCell className="py-3.5 px-4 w-10">
                  <Checkbox
                    checked={selected.has(contact.id)}
                    onCheckedChange={() => toggleOne(contact.id)}
                  />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <EntityAvatar
                      name={fullName}
                      type="contact"
                      size="sm"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/contacts/${contact.id}`}
                        className="font-medium text-primary hover:underline block truncate"
                      >
                        {fullName}
                      </Link>
                      {contact.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {contact.email}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {contact.company_id ? (
                    <Link
                      href={`/companies/${contact.company_id}`}
                      className="text-primary hover:underline"
                    >
                      {contact.company_name ?? "—"}
                    </Link>
                  ) : (
                    contact.company_name ?? "—"
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  {contact.lead_status ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ??
                          "bg-gray-100 text-gray-700",
                      )}
                    >
                      {contact.lead_status}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  {emailVerification ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        EMAIL_VERIFICATION_BADGE_CLASSES[emailVerification] ??
                          "bg-gray-50 text-gray-600 border border-gray-200",
                      )}
                    >
                      {emailVerification}
                    </span>
                  ) : contact.email ? (
                    <span className="text-xs text-muted-foreground">
                      {contact.email}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {ownerName ?? "—"}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {contact.capital_type ?? "—"}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {formatDate(contact.last_interaction_date)}
                </TableCell>
              </TableRow>
            );
          })}
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
          {loadingMore ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
