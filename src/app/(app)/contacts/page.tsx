"use client";

import * as React from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { CustomViewsSidebar } from "@/components/shared/custom-views-sidebar";
import { ExportCsvButton } from "@/components/shared/export-csv-button";
import { ContactsTable } from "@/components/contacts/contacts-table";
import { NewContactDialog } from "@/components/contacts/new-contact-dialog";
import { useContacts } from "@/hooks/use-contacts";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertCircle } from "lucide-react";

export default function ContactsPage() {
  const [search, setSearch] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [allContacts, setAllContacts] = React.useState<ReturnType<typeof useContacts>["data"]>([]);
  const [newOpen, setNewOpen] = React.useState(false);
  const [activeViewId, setActiveViewId] = React.useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const params = { search: debouncedSearch, sortBy, sortAsc, cursor, limit: 50 };
  const { data, isLoading, error } = useContacts(params);

  React.useEffect(() => {
    if (!cursor) {
      setAllContacts(data ?? []);
    } else {
      setAllContacts((prev) => [...(prev ?? []), ...(data ?? [])]);
    }
  }, [data, cursor]);

  React.useEffect(() => {
    setCursor(undefined);
    setAllContacts([]);
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

  const contacts = allContacts ?? [];
  const hasMore = (data?.length ?? 0) === 50;

  const exportData = React.useMemo(() => contacts.map((c) => ({
    first_name: c.first_name,
    last_name: c.last_name,
    email: c.email ?? "",
    phone: c.phone ?? "",
    job_title: c.job_title ?? "",
    company_name: c.company_name ?? "",
    lead_status: c.lead_status ?? "",
    capital_type: c.capital_type ?? "",
    region: c.region ?? "",
    asset_class: c.asset_class ?? "",
    last_interaction_date: c.last_interaction_date ?? "",
  })), [contacts]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Contacts"
        description={`${contacts.length}${hasMore ? "+" : ""} contacts`}
        actions={
          <Button onClick={() => setNewOpen(true)}>
            <Plus className="mr-2 size-4" />
            New Contact
          </Button>
        }
      />

      <div className="flex gap-4">
        <div className="hidden lg:block">
          <CustomViewsSidebar
            entityType="contact"
            activeViewId={activeViewId}
            onSelectView={(view) => {
              setActiveViewId(view.id || null);
            }}
            currentFilters={{ search: debouncedSearch, sortBy, sortAsc }}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <ExportCsvButton data={exportData} filename="contacts.csv" />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>Failed to load contacts: {(error as Error).message}</span>
            </div>
          )}

          <ContactsTable
            contacts={contacts}
            loading={isLoading && !cursor}
            sortBy={sortBy}
            sortAsc={sortAsc}
            onSort={handleSort}
            hasMore={hasMore}
            loadingMore={isLoading && !!cursor}
            onLoadMore={() => {
              const last = contacts[contacts.length - 1];
              if (last) setCursor(last.created_at);
            }}
          />
        </div>
      </div>

      <NewContactDialog open={newOpen} onOpenChange={setNewOpen} />
    </div>
  );
}
