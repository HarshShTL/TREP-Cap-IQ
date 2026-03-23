"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronsUpDown,
  Search,
  SlidersHorizontal,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SkeletonRow } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import {
  formatCurrency,
  PRIORITY_DOT_COLORS,
  STAGE_BADGE_CLASSES,
  DEAL_STAGES,
  PRIORITIES,
  ASSET_CLASSES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useProfiles } from "@/hooks/use-profile";
import type { Deal } from "@/types";

// ---------- Types ----------

type SortKey =
  | "name"
  | "stage"
  | "amount"
  | "asset_class"
  | "location"
  | "deal_owner"
  | "expected_close_date"
  | "priority"
  | "days_open"
  | "updated_at";

interface DealFilter {
  field: string;
  value: string;
}

interface DealsListViewProps {
  deals: Deal[];
  loading?: boolean;
}

// ---------- Constants ----------

const PAGE_SIZES = [25, 50, 100] as const;

const FILTERABLE_FIELDS = [
  { key: "stage", label: "Stage", options: DEAL_STAGES },
  { key: "priority", label: "Priority", options: PRIORITIES },
  { key: "asset_class", label: "Asset Class", options: ASSET_CLASSES },
  { key: "deal_owner", label: "Deal Owner" },
] as const;

// ---------- Helpers ----------

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
      className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      {active ? (
        currentSort.asc ? (
          <ChevronUpIcon className="size-3" />
        ) : (
          <ChevronDownIcon className="size-3" />
        )
      ) : (
        <ChevronsUpDown className="size-3 text-muted-foreground/25" />
      )}
    </button>
  );
}

function daysOpen(deal: Deal): number {
  return differenceInCalendarDays(new Date(), new Date(deal.created_at));
}

function exportCsv(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const escapeCell = (v: unknown) => {
    if (v == null) return "";
    const str = String(v);
    if (str.includes(",") || str.includes('"') || str.includes("\n"))
      return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows = data.map((row) =>
    headers.map((h) => escapeCell(row[h])).join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Component ----------

export function DealsListView({ deals, loading }: DealsListViewProps) {
  const [sort, setSort] = React.useState<{ key: SortKey; asc: boolean }>({
    key: "updated_at",
    asc: false,
  });
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<DealFilter[]>([]);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [editField, setEditField] = React.useState("");
  const [editValue, setEditValue] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(100);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const { data: profiles = [] } = useProfiles();

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key ? { key, asc: !prev.asc } : { key, asc: true },
    );
  };

  // Filter + search + sort
  const processed = React.useMemo(() => {
    let result = [...deals];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.location ?? "").toLowerCase().includes(q) ||
          (d.asset_class ?? "").toLowerCase().includes(q),
      );
    }

    // Filters
    for (const f of filters) {
      if (f.field === "deal_owner") {
        result = result.filter((d) => d.deal_owner === f.value);
      } else {
        result = result.filter(
          (d) =>
            (d as unknown as Record<string, unknown>)[f.field] === f.value,
        );
      }
    }

    // Sort
    result.sort((a, b) => {
      let av: unknown;
      let bv: unknown;
      if (sort.key === "days_open") {
        av = daysOpen(a);
        bv = daysOpen(b);
      } else {
        av = a[sort.key as keyof Deal] ?? "";
        bv = b[sort.key as keyof Deal] ?? "";
      }
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.asc ? cmp : -cmp;
    });

    return result;
  }, [deals, search, filters, sort]);

  // Pagination
  const totalCount = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paged = React.useMemo(
    () => processed.slice((page - 1) * pageSize, page * pageSize),
    [processed, page, pageSize],
  );

  React.useEffect(() => {
    setPage(1);
  }, [search, filters, sort, pageSize]);

  const resolveOwner = (id: string | null) =>
    profiles.find((p) => p.id === id)?.full_name ?? null;

  // Filters
  const addFilter = () => {
    if (!editField || !editValue) return;
    setFilters((prev) => [...prev, { field: editField, value: editValue }]);
    setEditField("");
    setEditValue("");
    setFilterPanelOpen(false);
  };

  const removeFilter = (idx: number) =>
    setFilters((prev) => prev.filter((_, i) => i !== idx));

  const filterLabel = (field: string) =>
    FILTERABLE_FIELDS.find((f) => f.key === field)?.label ?? field;

  const filterDisplay = (f: DealFilter) => {
    if (f.field === "deal_owner") return resolveOwner(f.value) ?? f.value;
    return f.value;
  };

  // Selection
  const toggleAll = () => {
    setSelected(
      selected.size === paged.length
        ? new Set()
        : new Set(paged.map((d) => d.id)),
    );
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Export
  const exportData = React.useMemo(
    () =>
      processed.map((d) => ({
        name: d.name,
        stage: d.stage,
        amount: d.amount ?? "",
        asset_class: d.asset_class ?? "",
        location: d.location ?? "",
        deal_owner: resolveOwner(d.deal_owner) ?? "",
        close_date: d.expected_close_date ?? "",
        priority: d.priority ?? "",
        days_open: daysOpen(d),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [processed, profiles],
  );

  // Page numbers
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const selectedFilterDef = FILTERABLE_FIELDS.find(
    (f) => f.key === editField,
  );

  if (loading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {[
                "Name",
                "Amount",
                "Stage",
                "Asset Class",
                "Location",
                "Deal Owner",
                "Close Date",
                "Priority",
                "Days Open",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="py-3 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} cols={9} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Filters */}
          <DropdownMenu
            open={filterPanelOpen}
            onOpenChange={setFilterPanelOpen}
          >
            <DropdownMenuTrigger>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  filters.length > 0 && "border-primary text-primary",
                )}
              >
                <SlidersHorizontal className="mr-1.5 size-4" />
                Filters
                {filters.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground size-5 text-[10px] font-bold">
                    {filters.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 p-3"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Add Filter
                </p>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={editField}
                  onChange={(e) => {
                    setEditField(e.target.value);
                    setEditValue("");
                  }}
                >
                  <option value="">Select field...</option>
                  {FILTERABLE_FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {editField && (
                  <>
                    {editField === "deal_owner" ? (
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      >
                        <option value="">Select owner...</option>
                        {profiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name ?? p.id}
                          </option>
                        ))}
                      </select>
                    ) : selectedFilterDef && "options" in selectedFilterDef ? (
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      >
                        <option value="">Select value...</option>
                        {selectedFilterDef.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder="Enter value..."
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                    )}
                  </>
                )}

                <Button
                  size="sm"
                  className="w-full"
                  onClick={addFilter}
                  disabled={!editField || !editValue}
                >
                  Add Filter
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Download className="mr-1.5 size-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => exportCsv(exportData, "deals.csv")}
              >
                Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter pills */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
            >
              {filterLabel(f.field)}:{" "}
              <span className="text-foreground">{filterDisplay(f)}</span>
              <button
                className="ml-0.5 hover:text-destructive"
                onClick={() => removeFilter(idx)}
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => setFilters([])}
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      {!paged.length ? (
        <EmptyState
          title="No deals found"
          description="Try adjusting your search or filters, or create your first deal."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border hover:bg-transparent">
                <TableHead className="bg-muted/40 w-10 px-3 py-3">
                  <Checkbox
                    checked={
                      paged.length > 0 && selected.size === paged.length
                    }
                    onCheckedChange={toggleAll}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Name"
                    sortKey="name"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Amount"
                    sortKey="amount"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Stage"
                    sortKey="stage"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Asset Class"
                    sortKey="asset_class"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Location"
                    sortKey="location"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Deal Owner"
                    sortKey="deal_owner"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Close Date"
                    sortKey="expected_close_date"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Priority"
                    sortKey="priority"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="bg-muted/40 py-3 px-4">
                  <SortHeader
                    label="Days Open"
                    sortKey="days_open"
                    currentSort={sort}
                    onSort={handleSort}
                  />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((deal) => {
                const owner = resolveOwner(deal.deal_owner);
                return (
                  <TableRow
                    key={deal.id}
                    className="border-b border-border/60 hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="py-2.5 px-3 w-10">
                      <Checkbox
                        checked={selected.has(deal.id)}
                        onCheckedChange={() => toggleOne(deal.id)}
                      />
                    </TableCell>
                    <TableCell className="py-2.5 px-4">
                      <Link
                        href={`/deals/${deal.id}`}
                        className="font-semibold text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {deal.name}
                      </Link>
                    </TableCell>
                    <TableCell className="py-2.5 px-4 tabular-nums text-sm">
                      {formatCurrency(deal.amount)}
                    </TableCell>
                    <TableCell className="py-2.5 px-4">
                      {deal.stage ? (
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
                            STAGE_BADGE_CLASSES[deal.stage] ??
                              "bg-gray-100 text-gray-700",
                          )}
                        >
                          {deal.stage}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 text-sm">
                          --
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-4 text-sm text-muted-foreground">
                      {deal.asset_class ?? (
                        <span className="text-muted-foreground/60">--</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-4 text-sm text-muted-foreground">
                      {deal.location ?? (
                        <span className="text-muted-foreground/60">--</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-4 text-sm">
                      {owner ?? (
                        <span className="text-muted-foreground/60">--</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-4 text-sm text-muted-foreground whitespace-nowrap">
                      {deal.expected_close_date
                        ? format(
                            new Date(deal.expected_close_date),
                            "MMM d, yyyy",
                          )
                        : "--"}
                    </TableCell>
                    <TableCell className="py-2.5 px-4">
                      {deal.priority ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <span
                            className={cn(
                              "size-2 rounded-full",
                              PRIORITY_DOT_COLORS[deal.priority],
                            )}
                          />
                          {deal.priority}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-sm">
                          --
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-2.5 px-4 text-sm tabular-nums text-muted-foreground">
                      {daysOpen(deal)}d
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Selection bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm text-sm">
          <span className="font-medium">{selected.size} selected</span>
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}&ndash;
            {Math.min(page * pageSize, totalCount)} of {totalCount} deals
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="size-4 mr-1" />
              Prev
            </Button>
            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`e-${idx}`}
                  className="px-2 text-sm text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  className="min-w-[36px]"
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={page === totalPages}
            >
              Next
              <ChevronRight className="size-4 ml-1" />
            </Button>
            <select
              className="ml-3 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZES.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
