"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompanySummaryPanel } from "@/components/companies/company-summary-panel";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { EmptyState } from "@/components/empty-state";
import { useCompany, useCompanyContacts } from "@/hooks/use-companies";
import { Badge } from "@/components/ui/badge";

type Props = { params: { id: string } };

function CompanyContactsTab({ companyId }: { companyId: string }) {
  const { data: contacts, isLoading } = useCompanyContacts(companyId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!contacts?.length) {
    return (
      <EmptyState
        title="No contacts"
        description="No contacts are linked to this company yet."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Job Title</TableHead>
          <TableHead>Lead Status</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow key={contact.id}>
            <TableCell>
              <Link href={`/contacts/${contact.id}`} className="font-medium hover:underline">
                {contact.first_name} {contact.last_name}
              </Link>
            </TableCell>
            <TableCell className="text-sm">{contact.job_title ?? "—"}</TableCell>
            <TableCell>
              {contact.lead_status ? (
                <Badge variant="secondary">{contact.lead_status}</Badge>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="text-sm">{contact.email ?? "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function CompanyDetailPage({ params }: Props) {
  const { id } = params;
  const { data: company, isLoading } = useCompany(id);
  const [logOpen, setLogOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <Link
        href="/companies"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Companies
      </Link>

      {isLoading ? (
        <Skeleton className="h-8 w-64" />
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{company?.name ?? "Company"}</h1>
          {company?.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ExternalLink className="size-3.5" />
              {company.domain ?? company.website}
            </a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <CompanySummaryPanel companyId={id} />
        </div>

        <div className="min-h-[400px] rounded-xl border bg-card p-4">
          <Tabs defaultValue="activities">
            <div className="mb-4 flex items-center justify-between">
              <TabsList className="h-9 gap-1 bg-muted/50 p-1">
                <TabsTrigger value="activities" className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none">Activities</TabsTrigger>
                <TabsTrigger value="contacts" className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none">Contacts</TabsTrigger>
              </TabsList>
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Log Activity
              </Button>
            </div>
            <TabsContent value="activities" className="mt-0">
              <ActivityFeed companyId={id} onLogActivity={() => setLogOpen(true)} />
            </TabsContent>
            <TabsContent value="contacts" className="mt-0">
              <CompanyContactsTab companyId={id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Quick Info</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            {company?.hq_city && (
              <p>
                {[company.hq_city, company.hq_state, company.hq_country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {company?.industry && <p>{company.industry}</p>}
          </div>
        </div>
      </div>

      <LogActivityDialog open={logOpen} onOpenChange={setLogOpen} companyId={id} />
    </div>
  );
}
