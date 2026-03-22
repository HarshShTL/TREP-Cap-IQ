"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { formatCurrency, COMPANY_TYPE_BADGE_CLASSES } from "@/lib/constants";
import type { Company } from "@/types";

interface CompaniesTableProps {
  companies: Company[];
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

export function CompaniesTable({
  companies,
  loading,
  sortBy,
  sortAsc,
  onSort,
  hasMore,
  onLoadMore,
  loadingMore,
}: CompaniesTableProps) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggleAll = () => {
    if (selected.size === companies.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(companies.map((c) => c.id)));
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

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!companies.length) {
    return (
      <EmptyState
        title="No companies found"
        description="Try adjusting your search or filters."
      />
    );
  }

  const cols: { key: string; label: string; sortable?: boolean }[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "company_type", label: "Type", sortable: true },
    { key: "industry", label: "Industry", sortable: true },
    { key: "hq_city", label: "HQ City", sortable: true },
    { key: "aum", label: "AUM", sortable: true },
    { key: "website", label: "Website", sortable: false },
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100">
            <TableHead className="bg-slate-50/80 w-10 px-4 py-2.5">
              <Checkbox
                checked={
                  companies.length > 0 && selected.size === companies.length
                }
                onCheckedChange={toggleAll}
              />
            </TableHead>
            {cols.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "bg-slate-50/80 whitespace-nowrap py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-500",
                  col.sortable && "cursor-pointer select-none",
                )}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                {col.label}
                {col.sortable && (
                  <SortIcon
                    field={col.key}
                    sortBy={sortBy}
                    sortAsc={sortAsc}
                  />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => {
            const domain = company.domain || (company.website
              ? company.website
                  .replace(/^https?:\/\//, "")
                  .replace(/\/.*$/, "")
              : null);

            return (
              <TableRow
                key={company.id}
                className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <TableCell className="py-3.5 px-4 w-10">
                  <Checkbox
                    checked={selected.has(company.id)}
                    onCheckedChange={() => toggleOne(company.id)}
                  />
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <EntityAvatar name={company.name} size="sm" />
                    <div className="min-w-0">
                      <Link
                        href={`/companies/${company.id}`}
                        className="font-medium text-primary hover:underline block truncate"
                      >
                        {company.name}
                      </Link>
                      {domain && (
                        <p className="text-xs text-muted-foreground truncate">
                          {domain}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  {company.company_type ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        COMPANY_TYPE_BADGE_CLASSES[company.company_type] ??
                          "bg-gray-50 text-gray-600 border border-gray-200",
                      )}
                    >
                      {company.company_type}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {company.industry ?? "—"}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm">
                  {[company.hq_city, company.hq_state]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm tabular-nums">
                  {company.aum != null ? formatCurrency(company.aum) : "—"}
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  {company.website ? (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="size-3" />
                      {domain || "Link"}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
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
