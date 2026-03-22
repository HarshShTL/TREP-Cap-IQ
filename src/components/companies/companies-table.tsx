"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink } from "lucide-react";
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
import { formatCurrency } from "@/lib/constants";
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

function SortIcon({ field, sortBy, sortAsc }: { field: string; sortBy: string; sortAsc: boolean }) {
  if (sortBy !== field)
    return <ChevronsUpDown className="ml-1 inline size-3 text-muted-foreground/30" />;
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
      <EmptyState title="No companies found" description="Try adjusting your search or filters." />
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
        <TableHeader className="bg-muted/40">
          <TableRow>
            {cols.map((col) => (
              <TableHead
                key={col.key}
                className={
                  col.sortable
                    ? "cursor-pointer select-none whitespace-nowrap py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    : "py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                }
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                {col.label}
                {col.sortable && (
                  <SortIcon field={col.key} sortBy={sortBy} sortAsc={sortAsc} />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              className="cursor-pointer transition-colors even:bg-muted/20 hover:bg-primary/5"
            >
              <TableCell className="py-3 px-4">
                <Link href={`/companies/${company.id}`} className="font-medium hover:underline">
                  {company.name}
                </Link>
                {company.domain && (
                  <p className="text-xs text-muted-foreground">{company.domain}</p>
                )}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm">{company.company_type ?? "—"}</TableCell>
              <TableCell className="py-3 px-4 text-sm">{company.industry ?? "—"}</TableCell>
              <TableCell className="py-3 px-4 text-sm">
                {[company.hq_city, company.hq_state].filter(Boolean).join(", ") || "—"}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm tabular-nums">
                {company.aum != null ? formatCurrency(company.aum) : "—"}
              </TableCell>
              <TableCell className="py-3 px-4">
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="size-3" />
                    Link
                  </a>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
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
