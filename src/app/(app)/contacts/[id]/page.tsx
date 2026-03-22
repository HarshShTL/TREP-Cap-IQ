"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/constants";
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
    return <EmptyState title="No deal participation" description="This contact has not been added to any deals yet." />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Deal</TableHead>
          <TableHead>Stage</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Commitment</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              {p.deals ? (
                <Link href={`/deals/${p.deal_id}`} className="font-medium hover:underline">
                  {p.deals.name}
                </Link>
              ) : (
                "—"
              )}
            </TableCell>
            <TableCell>{p.deals?.stage ?? "—"}</TableCell>
            <TableCell>{p.role ?? "—"}</TableCell>
            <TableCell>
              {p.commitment_amount != null ? formatCurrency(p.commitment_amount) : "—"}
            </TableCell>
            <TableCell>
              {p.status ? <Badge variant="secondary">{p.status}</Badge> : "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ContactDetailPage({ params }: Props) {
  const { id } = params;
  const { data: contact, isLoading } = useContact(id);
  const [logOpen, setLogOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Contacts
      </Link>

      {isLoading ? (
        <Skeleton className="h-8 w-64" />
      ) : (
        <h1 className="text-2xl font-semibold tracking-tight">
          {contact ? `${contact.first_name} ${contact.last_name}` : "Contact"}
        </h1>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <ContactSummaryPanel contactId={id} />
        </div>

        <div className="rounded-xl border bg-card p-4 min-h-[400px]">
          <Tabs defaultValue="activities">
            <div className="mb-4 flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="activities">Activities</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
              </TabsList>
              <Button size="sm" onClick={() => setLogOpen(true)}>
                <Plus className="mr-2 size-4" />
                Log Activity
              </Button>
            </div>
            <TabsContent value="activities" className="mt-0">
              <ActivityFeed contactId={id} onLogActivity={() => setLogOpen(true)} />
            </TabsContent>
            <TabsContent value="deals" className="mt-0">
              <ContactDealsTab contactId={id} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="rounded-xl border bg-card p-4">
          <p className="mb-3 text-sm font-medium">Info</p>
          <div className="space-y-2 text-sm">
            {contact?.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-primary hover:underline"
              >
                LinkedIn
              </a>
            )}
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
                {[contact.city, contact.state, contact.country].filter(Boolean).join(", ")}
              </p>
            )}
            {contact?.database_source && (
              <p className="text-muted-foreground">Source: {contact.database_source}</p>
            )}
          </div>
        </div>
      </div>

      <LogActivityDialog open={logOpen} onOpenChange={setLogOpen} contactId={id} />
    </div>
  );
}
