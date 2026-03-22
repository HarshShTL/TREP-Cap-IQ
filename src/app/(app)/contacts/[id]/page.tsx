"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Phone, Mail, FileText, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { ContactSummaryPanel } from "@/components/contacts/contact-summary-panel";
import { ActivityFeed } from "@/components/activities/activity-feed";
import { LogActivityDialog } from "@/components/activities/log-activity-dialog";
import { useContact } from "@/hooks/use-contacts";
import { useContactParticipants } from "@/hooks/use-deal-participants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, STAGE_BADGE_CLASSES, PARTICIPANT_STATUS_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";

type Props = { params: { id: string } };

function ContactDealsTab({ contactId }: { contactId: string }) {
  const { data: participants, isLoading } = useContactParticipants(contactId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!participants?.length) {
    return (
      <EmptyState
        title="No deal participation"
        description="This contact has not been added to any deals yet."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-b border-slate-100">
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Deal</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Stage</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Role</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Commitment</TableHead>
          <TableHead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((p) => (
          <TableRow key={p.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100">
            <TableCell className="py-3.5">
              {p.deals ? (
                <Link
                  href={`/deals/${p.deal_id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {p.deals.name}
                </Link>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="py-3.5">
              {p.deals?.stage ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    STAGE_BADGE_CLASSES[p.deals.stage] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {p.deals.stage}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell className="py-3.5 text-sm">{p.role ?? "—"}</TableCell>
            <TableCell className="py-3.5 text-sm tabular-nums">
              {p.commitment_amount != null
                ? formatCurrency(p.commitment_amount)
                : "—"}
            </TableCell>
            <TableCell className="py-3.5">
              {p.status ? (
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                    PARTICIPANT_STATUS_BADGE_CLASSES[p.status] ?? "bg-gray-100 text-gray-600",
                  )}
                >
                  {p.status}
                </span>
              ) : (
                "—"
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const QUICK_ACTIONS = [
  { type: "Note", icon: FileText, label: "Note" },
  { type: "Email", icon: Mail, label: "Email" },
  { type: "Call", icon: Phone, label: "Call" },
  { type: "Meeting", icon: Users, label: "Meeting" },
  { type: "NDA", icon: Calendar, label: "Task" },
] as const;

export default function ContactDetailPage({ params }: Props) {
  const { id } = params;
  const { data: contact, isLoading } = useContact(id);
  const [logOpen, setLogOpen] = React.useState(false);
  const [logType, setLogType] = React.useState<string | undefined>();

  const fullName = contact
    ? `${contact.first_name} ${contact.last_name}`.trim()
    : "Contact";

  const openLog = (type?: string) => {
    setLogType(type);
    setLogOpen(true);
  };

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Contacts", href: "/contacts" },
          { label: fullName },
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
      ) : contact ? (
        <div className="flex items-start gap-4">
          <EntityAvatar name={fullName} type="contact" size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold tracking-tight">{fullName}</h1>
            {contact.company_name && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {contact.company_id ? (
                  <Link
                    href={`/companies/${contact.company_id}`}
                    className="text-primary hover:underline"
                  >
                    {contact.company_name}
                  </Link>
                ) : (
                  contact.company_name
                )}
                {contact.job_title && ` · ${contact.job_title}`}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-foreground"
                >
                  {contact.email}
                </a>
              )}
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="hover:text-foreground"
                >
                  {contact.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Quick action buttons */}
      <div className="flex items-center gap-2">
        {QUICK_ACTIONS.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => openLog(type)}
            className="flex flex-col items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <ContactSummaryPanel contactId={id} />
        </div>

        <div className="rounded-xl border bg-card p-4 min-h-[400px]">
          <Tabs defaultValue="activities">
            <div className="mb-4 flex items-center justify-between">
              <TabsList className="h-9 gap-1 bg-muted/50 p-1">
                <TabsTrigger
                  value="activities"
                  className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="deals"
                  className="rounded-full px-4 text-sm data-active:bg-[hsl(220,70%,22%)] data-active:text-white data-active:shadow-none"
                >
                  Deals
                </TabsTrigger>
              </TabsList>
              <Button size="sm" onClick={() => openLog()}>
                <Plus className="mr-2 size-4" />
                Log Activity
              </Button>
            </div>
            <TabsContent value="activities" className="mt-0">
              <ActivityFeed
                contactId={id}
                onLogActivity={() => openLog()}
              />
            </TabsContent>
            <TabsContent value="deals" className="mt-0">
              <ContactDealsTab contactId={id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Info</p>
          <div className="space-y-2 text-sm">
            {contact?.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-primary hover:underline"
              >
                Website
              </a>
            )}
            {contact?.city && (
              <p className="text-muted-foreground">
                {[contact.city, contact.state, contact.country]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
            {contact?.database_source && (
              <p className="text-muted-foreground">
                Source: {contact.database_source}
              </p>
            )}
          </div>
        </div>
      </div>

      <LogActivityDialog
        open={logOpen}
        onOpenChange={setLogOpen}
        contactId={id}
        defaultType={logType}
      />
    </div>
  );
}
