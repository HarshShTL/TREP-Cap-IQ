"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonRow } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency, PRIORITY_DOT_COLORS, STAGE_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Deal } from "@/types";

type SortKey = "name" | "stage" | "amount" | "asset_class" | "location" | "expected_close_date" | "priority" | "updated_at";

interface DealsListViewProps {
  deals: Deal[];
  loading?: boolean;
}

function SortHeader({
  label,
  sortKey,
  currentSort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  currentSort: { key: SortKey; asc: boolean };
  onSort: (key: SortKey) => void;
}) {
  const active = currentSort.key === sortKey;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
    >
      {label}
      {active ? (
        currentSort.asc ? (
          <ChevronUpIcon className="size-3" />
        ) : (
          <ChevronDownIcon className="size-3" />
        )
      ) : (
        <ChevronsUpDown className="size-3 text-muted-foreground/30" />
      )}
    </button>
  );
}

export function DealsListView({ deals, loading }: DealsListViewProps) {
  const [sort, setSort] = React.useState<{ key: SortKey; asc: boolean }>({
    key: "updated_at",
    asc: false,
  });

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key ? { key, asc: !prev.asc } : { key, asc: true }
    );
  };

  const sorted = React.useMemo(() => {
    return [...deals].sort((a, b) => {
      const av = a[sort.key] ?? "";
      const bv = b[sort.key] ?? "";
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.asc ? cmp : -cmp;
    });
  }, [deals, sort]);

  if (loading) {
    return (
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            {["Name", "Stage", "Asset Class", "Location", "Amount", "Close Date", "Priority"].map((h) => (
              <TableHead
                key={h}
                className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRow key={i} cols={7} />
          ))}
        </TableBody>
      </Table>
    );
  }

  if (!sorted.length) {
    return <EmptyState title="No deals found" description="Create your first deal to get started." />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="py-3 px-4">
              <SortHeader label="Name" sortKey="name" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Stage" sortKey="stage" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Asset Class" sortKey="asset_class" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Location" sortKey="location" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Amount" sortKey="amount" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Close Date" sortKey="expected_close_date" currentSort={sort} onSort={handleSort} />
            </TableHead>
            <TableHead className="py-3 px-4">
              <SortHeader label="Priority" sortKey="priority" currentSort={sort} onSort={handleSort} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((deal) => (
            <TableRow
              key={deal.id}
              className="cursor-pointer transition-colors even:bg-muted/20 hover:bg-primary/5"
            >
              <TableCell className="py-3 px-4">
                <Link
                  href={`/deals/${deal.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                >
                  {deal.name}
                </Link>
              </TableCell>
              <TableCell className="py-3 px-4">
                {deal.stage ? (
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700"
                    )}
                  >
                    {deal.stage}
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {deal.asset_class ?? "—"}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {deal.location ?? "—"}
              </TableCell>
              <TableCell className="py-3 px-4 tabular-nums text-sm text-muted-foreground">
                {formatCurrency(deal.amount)}
              </TableCell>
              <TableCell className="py-3 px-4 text-sm text-muted-foreground">
                {deal.expected_close_date
                  ? format(new Date(deal.expected_close_date), "MMM d, yyyy")
                  : "—"}
              </TableCell>
              <TableCell className="py-3 px-4">
                {deal.priority ? (
                  <div className="flex items-center gap-1.5 text-sm">
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        PRIORITY_DOT_COLORS[deal.priority]
                      )}
                    />
                    {deal.priority}
                  </div>
                ) : (
                  "—"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
