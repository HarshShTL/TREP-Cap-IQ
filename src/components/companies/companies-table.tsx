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
    return <ChevronsUpDown className="ml-1 inline size-3.5 text-muted-foreground/50" />;
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

  const cols: { key: string; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "company_type", label: "Type" },
    { key: "industry", label: "Industry" },
    { key: "hq_city", label: "HQ City" },
    { key: "aum", label: "AUM" },
    { key: "website", label: "Website" },
  ];

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((col) => (
              <TableHead
                key={col.key}
                className={col.key !== "website" ? "cursor-pointer select-none whitespace-nowrap" : ""}
                onClick={col.key !== "website" ? () => onSort(col.key) : undefined}
              >
                {col.label}
                {col.key !== "website" && (
                  <SortIcon field={col.key} sortBy={sortBy} sortAsc={sortAsc} />
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="cursor-pointer">
              <TableCell>
                <Link href={`/companies/${company.id}`} className="font-medium hover:underline">
                  {company.name}
                </Link>
                {company.domain && (
                  <p className="text-xs text-muted-foreground">{company.domain}</p>
                )}
              </TableCell>
              <TableCell className="text-sm">{company.company_type ?? "—"}</TableCell>
              <TableCell className="text-sm">{company.industry ?? "—"}</TableCell>
              <TableCell className="text-sm">
                {[company.hq_city, company.hq_state].filter(Boolean).join(", ") || "—"}
              </TableCell>
              <TableCell className="text-sm tabular-nums">
                {company.aum != null ? formatCurrency(company.aum) : "—"}
              </TableCell>
              <TableCell>
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
