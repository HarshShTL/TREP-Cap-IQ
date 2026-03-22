"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { CustomViewsSidebar } from "@/components/shared/custom-views-sidebar";
import { ExportCsvButton } from "@/components/shared/export-csv-button";
import { CompaniesTable } from "@/components/companies/companies-table";
import { NewCompanyDialog } from "@/components/companies/new-company-dialog";
import { useCompanies } from "@/hooks/use-companies";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/constants";
import type { Company } from "@/types";

export default function CompaniesPage() {
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [allCompanies, setAllCompanies] = React.useState<Company[]>([]);
  const [newOpen, setNewOpen] = React.useState(false);
  const [activeViewId, setActiveViewId] = React.useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const params = { search: debouncedSearch, sortBy, sortAsc, cursor, limit: 50 };
  const { data, isLoading } = useCompanies(params);

  React.useEffect(() => {
    if (!cursor) {
      setAllCompanies(data ?? []);
    } else {
      setAllCompanies((prev) => [...prev, ...(data ?? [])]);
    }
  }, [data, cursor]);

  React.useEffect(() => {
    setCursor(undefined);
    setAllCompanies([]);
  }, [debouncedSearch, sortBy, sortAsc]);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCursor(undefined);
  };

  const hasMore = (data?.length ?? 0) === 50;

  const exportData = React.useMemo(() => allCompanies.map((c) => ({
    name: c.name,
    company_type: c.company_type ?? "",
    industry: c.industry ?? "",
    hq_city: c.hq_city ?? "",
    hq_state: c.hq_state ?? "",
    aum: c.aum != null ? formatCurrency(c.aum) : "",
    website: c.website ?? "",
    domain: c.domain ?? "",
  })), [allCompanies]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Companies"
        description={`${allCompanies.length}${hasMore ? "+" : ""} companies`}
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="mr-2 size-4" />
            New Company
          </Button>
        }
      />

      <div className="flex gap-4">
        <div className="hidden lg:block">
          <CustomViewsSidebar
            entityType="company"
            activeViewId={activeViewId}
            onSelectView={(view) => setActiveViewId(view.id || null)}
            currentFilters={{ search: debouncedSearch, sortBy, sortAsc }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <ExportCsvButton data={exportData} filename="companies.csv" />
          </div>

          <CompaniesTable
            companies={allCompanies}
            loading={isLoading && !cursor}
            sortBy={sortBy}
            sortAsc={sortAsc}
            onSort={handleSort}
            hasMore={hasMore}
            loadingMore={isLoading && !!cursor}
            onLoadMore={() => {
              const last = allCompanies[allCompanies.length - 1];
              if (last) setCursor(last.created_at);
            }}
          />
        </div>
      </div>

      <NewCompanyDialog open={newOpen} onOpenChange={setNewOpen} />
    </div>
  );
}
