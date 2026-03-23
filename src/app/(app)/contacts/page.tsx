"use client";

import * as React from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Columns3,
  ArrowUpDown,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ContactsTable, ALL_COLUMNS } from "@/components/contacts/contacts-table";
import { NewContactDialog } from "@/components/contacts/new-contact-dialog";
import { useContacts, type ContactFilter } from "@/hooks/use-contacts";
import { useCustomViews, useCreateView, useDeleteView } from "@/hooks/use-custom-views";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import {
  LEAD_STATUSES,
  CAPITAL_TYPES,
  REGIONS,
  ASSET_CLASSES,
  INVESTMENT_STRATEGIES,
  EMAIL_VERIFICATIONS,
  RELATIONSHIP_TYPES,
  DATABASE_SOURCES,
} from "@/lib/constants";
import { useProfiles } from "@/hooks/use-profile";
import type { CustomView } from "@/types";

// ---------- Constants ----------

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

const DEFAULT_VISIBLE = ALL_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.key);

const FILTERABLE_FIELDS: {
  key: string;
  label: string;
  options?: readonly string[];
}[] = [
  { key: "lead_status", label: "Lead Status", options: LEAD_STATUSES },
  { key: "capital_type", label: "Capital Type", options: CAPITAL_TYPES },
  { key: "contact_owner", label: "Contact Owner" },
  { key: "region", label: "Region", options: REGIONS },
  { key: "asset_class", label: "Asset Class", options: ASSET_CLASSES },
  { key: "investment_strategy", label: "Investment Strategy", options: INVESTMENT_STRATEGIES },
  { key: "email_verification", label: "Email Verification", options: EMAIL_VERIFICATIONS },
  { key: "relationship", label: "Relationship", options: RELATIONSHIP_TYPES },
  { key: "database_source", label: "Database Source", options: DATABASE_SOURCES },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "company_name", label: "Company" },
];

const FILTER_OPERATORS = [
  { key: "equals", label: "Equals" },
  { key: "contains", label: "Contains" },
  { key: "is_empty", label: "Is empty" },
  { key: "is_not_empty", label: "Is not empty" },
  { key: "is_any_of", label: "Is any of" },
] as const;

// ---------- Helpers ----------

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

function exportToFile(
  data: Record<string, unknown>[],
  filename: string,
) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const escapeCell = (v: unknown) => {
    if (v == null) return "";
    const str = String(v);
    if (str.includes(",") || str.includes('"') || str.includes("\n"))
      return `"${str.replace(/"/g, '""')}"`;
    return str;
  };
  const rows = data.map((row) => headers.map((h) => escapeCell(row[h])).join(","));
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- Page ----------

export default function ContactsPage() {
  // Core state
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(100);
  const [newOpen, setNewOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<ContactFilter[]>([]);
  const [visibleColumns, setVisibleColumns] = React.useState<string[]>(DEFAULT_VISIBLE);
  const [activeViewId, setActiveViewId] = React.useState<string | null>(null);

  // Filter panel
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [editFilterField, setEditFilterField] = React.useState("");
  const [editFilterOp, setEditFilterOp] =
    React.useState<ContactFilter["operator"]>("equals");
  const [editFilterValue, setEditFilterValue] = React.useState("");

  // Create view modal
  const [createViewOpen, setCreateViewOpen] = React.useState(false);
  const [newViewName, setNewViewName] = React.useState("");

  const debouncedSearch = useDebounce(search, 300);

  // Hooks
  const { data: views = [] } = useCustomViews("contact");
  const createView = useCreateView();
  const deleteViewMut = useDeleteView();
  const { data: profiles = [] } = useProfiles();

  // Data
  const queryParams = React.useMemo(
    () => ({ search: debouncedSearch, sortBy, sortAsc, page, pageSize, filters }),
    [debouncedSearch, sortBy, sortAsc, page, pageSize, filters],
  );
  const { data: result, isLoading, error } = useContacts(queryParams);
  const contacts = React.useMemo(() => result?.data ?? [], [result]);
  const totalCount = result?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Reset page on search/filter/sort change
  React.useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortAsc, pageSize, filters]);

  const handleSort = React.useCallback((field: string) => {
    setSortBy((prev) => {
      if (prev === field) {
        setSortAsc((a) => !a);
        return prev;
      }
      setSortAsc(true);
      return field;
    });
  }, []);

  // ---------- View management ----------

  const applyView = React.useCallback(
    (view: Pick<CustomView, "id" | "filters" | "columns">) => {
      if (!view.id) {
        setActiveViewId(null);
        setFilters([]);
        setVisibleColumns(DEFAULT_VISIBLE);
        setSearch("");
        return;
      }
      setActiveViewId(view.id);
      if (view.filters) {
        const vf = view.filters;
        if (Array.isArray(vf.filters)) setFilters(vf.filters as ContactFilter[]);
        if (typeof vf.search === "string") setSearch(vf.search);
        if (typeof vf.sortBy === "string") setSortBy(vf.sortBy);
        if (typeof vf.sortAsc === "boolean") setSortAsc(vf.sortAsc);
      }
      if (view.columns?.length) setVisibleColumns(view.columns);
    },
    [],
  );

  const handleSaveView = async () => {
    if (!newViewName.trim()) return;
    await createView.mutateAsync({
      name: newViewName.trim(),
      entity_type: "contact",
      filters: { search: debouncedSearch, sortBy, sortAsc, filters },
      columns: visibleColumns,
    });
    setNewViewName("");
    setCreateViewOpen(false);
  };

  // ---------- Filter management ----------

  const addFilter = () => {
    if (!editFilterField) return;
    const f: ContactFilter = {
      field: editFilterField,
      operator: editFilterOp,
    };
    if (editFilterOp !== "is_empty" && editFilterOp !== "is_not_empty") {
      if (editFilterOp === "is_any_of") {
        f.value = editFilterValue
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else {
        f.value = editFilterValue;
      }
    }
    setFilters((prev) => [...prev, f]);
    setEditFilterField("");
    setEditFilterOp("equals");
    setEditFilterValue("");
    setFilterPanelOpen(false);
  };

  const removeFilter = (idx: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== idx));
  };

  const clearAllFilters = () => setFilters([]);

  // ---------- Export ----------

  const exportData = React.useMemo(
    () =>
      contacts.map((c) => {
        const row: Record<string, unknown> = {};
        for (const col of visibleColumns) {
          row[col] = (c as unknown as Record<string, unknown>)[col] ?? "";
        }
        return row;
      }),
    [contacts, visibleColumns],
  );

  // ---------- Pagination ----------

  const getPageNumbers = React.useCallback((): (number | "...")[] => {
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
  }, [page, totalPages]);

  // ---------- Display helpers ----------

  const filterFieldLabel = (field: string) =>
    FILTERABLE_FIELDS.find((f) => f.key === field)?.label ?? field;

  const filterDisplayValue = (f: ContactFilter) => {
    if (f.operator === "is_empty") return "is empty";
    if (f.operator === "is_not_empty") return "is not empty";
    if (f.field === "contact_owner") {
      const vals = Array.isArray(f.value) ? f.value : [f.value];
      return vals
        .map((v) => profiles.find((p) => p.id === v)?.full_name ?? v)
        .join(", ");
    }
    if (Array.isArray(f.value)) return f.value.join(", ");
    return String(f.value ?? "");
  };

  const selectedFilterFieldDef = FILTERABLE_FIELDS.find(
    (f) => f.key === editFilterField,
  );
  const needsValue =
    editFilterOp !== "is_empty" && editFilterOp !== "is_not_empty";

  return (
    <div className="flex flex-col h-full">
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between gap-4 pb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Contacts
          </h1>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            {formatCount(totalCount)}
          </span>
        </div>
        <Button
          className="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={() => setNewOpen(true)}
        >
          <Plus className="mr-2 size-4" />
          Add Contact
        </Button>
      </div>

      {/* ===== TAB BAR ===== */}
      <div className="flex items-center gap-1 border-b border-border pb-0 mb-4 overflow-x-auto">
        <button
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px",
            !activeViewId
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
          )}
          onClick={() =>
            applyView({ id: "", filters: null, columns: null })
          }
        >
          All Contacts
        </button>

        {views.map((view) => (
          <div
            key={view.id}
            className={cn(
              "flex items-center gap-1 px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px group",
              activeViewId === view.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border",
            )}
          >
            <button
              className="truncate max-w-[120px]"
              onClick={() =>
                applyView({
                  id: view.id,
                  filters: view.filters,
                  columns: view.columns,
                })
              }
            >
              {view.name}
            </button>
            <button
              className="ml-1 size-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
              onClick={(e) => {
                e.stopPropagation();
                deleteViewMut.mutate(
                  { id: view.id, entityType: "contact" },
                  {
                    onSuccess: () => {
                      if (activeViewId === view.id) {
                        applyView({
                          id: "",
                          filters: null,
                          columns: null,
                        });
                      }
                    },
                  },
                );
              }}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}

        <button
          className="flex items-center gap-1 px-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors -mb-px border-b-2 border-transparent"
          onClick={() => setCreateViewOpen(true)}
          title="Create new view"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          {/* Edit Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Columns3 className="mr-1.5 size-4" />
                Edit Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 max-h-80 overflow-y-auto"
            >
              {ALL_COLUMNS.map((col) => (
                <label
                  key={col.key}
                  className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted rounded-sm"
                >
                  <Checkbox
                    checked={visibleColumns.includes(col.key)}
                    onCheckedChange={(checked) => {
                      setVisibleColumns((prev) =>
                        checked
                          ? [...prev, col.key]
                          : prev.filter((k) => k !== col.key),
                      );
                    }}
                  />
                  {col.label}
                </label>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
              className="w-80 p-3"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Add Filter
                </p>
                <select
                  className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                  value={editFilterField}
                  onChange={(e) => {
                    setEditFilterField(e.target.value);
                    setEditFilterValue("");
                  }}
                >
                  <option value="">Select field...</option>
                  {FILTERABLE_FIELDS.map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>

                {editFilterField && (
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                    value={editFilterOp}
                    onChange={(e) =>
                      setEditFilterOp(
                        e.target.value as ContactFilter["operator"],
                      )
                    }
                  >
                    {FILTER_OPERATORS.map((op) => (
                      <option key={op.key} value={op.key}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                )}

                {editFilterField && needsValue && (
                  <>
                    {editFilterField === "contact_owner" ? (
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={editFilterValue}
                        onChange={(e) => setEditFilterValue(e.target.value)}
                      >
                        <option value="">Select owner...</option>
                        {profiles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name ?? (p as { email?: string }).email ?? p.id}
                          </option>
                        ))}
                      </select>
                    ) : selectedFilterFieldDef?.options ? (
                      <select
                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                        value={editFilterValue}
                        onChange={(e) => setEditFilterValue(e.target.value)}
                      >
                        <option value="">Select value...</option>
                        {selectedFilterFieldDef.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        placeholder={
                          editFilterOp === "is_any_of"
                            ? "Value 1, Value 2, ..."
                            : "Enter value..."
                        }
                        value={editFilterValue}
                        onChange={(e) => setEditFilterValue(e.target.value)}
                      />
                    )}
                  </>
                )}

                <Button
                  size="sm"
                  className="w-full"
                  onClick={addFilter}
                  disabled={
                    !editFilterField || (needsValue && !editFilterValue)
                  }
                >
                  Add Filter
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-1.5 size-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ALL_COLUMNS.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  className={cn(
                    sortBy === col.key && "font-semibold text-primary",
                  )}
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortBy === col.key && (
                    <span className="ml-auto text-xs">
                      {sortAsc ? "\u2191" : "\u2193"}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
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
                onClick={() => exportToFile(exportData, "contacts.csv")}
              >
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => exportToFile(exportData, "contacts.xlsx")}
              >
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ===== FILTER PILLS ===== */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {filters.map((f, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium"
            >
              {filterFieldLabel(f.field)}:{" "}
              <span className="text-foreground">
                {filterDisplayValue(f)}
              </span>
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
            onClick={clearAllFilters}
          >
            Clear all
          </button>
        </div>
      )}

      {/* ===== ERROR ===== */}
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-3">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>
            Failed to load contacts: {(error as Error).message}
          </span>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="flex-1 min-h-0">
        <ContactsTable
          contacts={contacts}
          loading={isLoading}
          sortBy={sortBy}
          sortAsc={sortAsc}
          onSort={handleSort}
          visibleColumns={visibleColumns}
        />
      </div>

      {/* ===== PAGINATION ===== */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between border-t border-border bg-card/50 pt-3 mt-3">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1}&ndash;
            {Math.min(page * pageSize, totalCount)} of{" "}
            {totalCount.toLocaleString()} contacts
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
                  key={`ellipsis-${idx}`}
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
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} per page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ===== NEW CONTACT DIALOG ===== */}
      <NewContactDialog open={newOpen} onOpenChange={setNewOpen} />

      {/* ===== CREATE VIEW DIALOG ===== */}
      <Dialog open={createViewOpen} onOpenChange={setCreateViewOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                View Name
              </label>
              <Input
                placeholder="e.g., KH List"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveView();
                }}
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Visible Columns
              </label>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto border border-border rounded-md p-2">
                {ALL_COLUMNS.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 text-sm cursor-pointer py-0.5"
                  >
                    <Checkbox
                      checked={visibleColumns.includes(col.key)}
                      onCheckedChange={(checked) => {
                        setVisibleColumns((prev) =>
                          checked
                            ? [...prev, col.key]
                            : prev.filter((k) => k !== col.key),
                        );
                      }}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Current filters and sort will be saved with this view.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateViewOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveView}
              disabled={!newViewName.trim() || createView.isPending}
            >
              Save View
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
