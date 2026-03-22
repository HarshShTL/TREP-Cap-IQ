"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EntityAvatar } from "@/components/ui/entity-avatar";
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
import { cn } from "@/lib/utils";
import { LEAD_STATUS_BADGE_CLASSES } from "@/lib/constants";

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
        <TableRow className="border-b border-slate-100">
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Name</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Job Title</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Lead Status</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Email</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contacts.map((contact) => (
          <TableRow
            key={contact.id}
            className="hover:bg-slate-50 transition-colors border-b border-slate-100"
          >
            <TableCell className="py-3.5">
              <div className="flex items-center gap-2">
                <EntityAvatar
                  name={`${contact.first_name} ${contact.last_name}`}
                  type="contact"
                  size="sm"
                />
                <Link
                  href={`/contacts/${contact.id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {contact.first_name} {contact.last_name}
                </Link>
              </div>
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.job_title ?? "—"}
            </TableCell>
            <TableCell className="py-3.5">
              {contact.lead_status ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    LEAD_STATUS_BADGE_CLASSES[contact.lead_status] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {contact.lead_status}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.email ?? "—"}
            </TableCell>
            <TableCell className="py-3.5 text-sm">
              {contact.phone ?? "—"}
            </TableCell>
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
      <Breadcrumb
        items={[
          { label: "Companies", href: "/companies" },
          { label: company?.name ?? "Company" },
        ]}
      />

      {/* Header */}
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton className="size-14 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ) : company ? (
        <div className="flex items-center gap-4">
          <EntityAvatar name={company.name} size="lg" />
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {company.name}
            </h1>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-0.5"
              >
                <ExternalLink className="size-3.5" />
                {company.domain ?? company.website}
              </a>
            )}
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <CompanySummaryPanel companyId={id} />
        </div>

        <div className="min-h-[400px] rounded-xl border bg-card p-4">
          <Tabs defaultValue="contacts">
            <div className="mb-4 flex items-center justify-between">
              <TabsList className="h-9 gap-1 bg-muted/50 p-1">
                <TabsTrigger
                  value="contacts"
                  className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
                >
                  Contacts
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
                >
                  Activities
                </TabsTrigger>
              </TabsList>
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Log Activity
              </Button>
            </div>
            <TabsContent value="contacts" className="mt-0">
              <CompanyContactsTab companyId={id} />
            </TabsContent>
            <TabsContent value="activities" className="mt-0">
              <ActivityFeed
                companyId={id}
                onLogActivity={() => setLogOpen(true)}
              />
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

      <LogActivityDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        companyId={id}
      />
    </div>
  );
}
