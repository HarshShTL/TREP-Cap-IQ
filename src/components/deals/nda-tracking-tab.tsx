"use client";

import Link from "next/link";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineEditField } from "@/components/inline-edit-field";
import { EmptyState } from "@/components/empty-state";
import { useDealParticipants, useUpdateParticipant } from "@/hooks/use-deal-participants";

function NdaStatus({ sent, signed }: { sent: string | null; signed: string | null }) {
  if (signed) {
    return (
      <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 dark:bg-green-900/30">
        <CheckCircle2 className="size-3" />
        Signed
      </Badge>
    );
  }
  if (sent) {
    return (
      <Badge variant="secondary" className="gap-1 text-amber-700 bg-amber-100 dark:bg-amber-900/30">
        <Clock className="size-3" />
        Sent
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 text-muted-foreground">
      <XCircle className="size-3" />
      Not Sent
    </Badge>
  );
}

interface NdaTrackingTabProps {
  dealId: string;
}

export function NdaTrackingTab({ dealId }: NdaTrackingTabProps) {
  const { data: participants, isLoading } = useDealParticipants(dealId);
  const updateParticipant = useUpdateParticipant();

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
        title="No participants"
        description="Add participants to this deal to track NDAs."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Contact</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>NDA Sent</TableHead>
          <TableHead>NDA Signed</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {participants.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              {p.contacts ? (
                <Link
                  href={`/contacts/${p.contact_id}`}
                  className="font-medium hover:underline"
                >
                  {p.contacts.first_name} {p.contacts.last_name}
                </Link>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground">{p.role ?? "—"}</TableCell>
            <TableCell>
              <InlineEditField
                label=""
                value={p.nda_sent_date ?? ""}
                type="date"
                className="min-w-[140px]"
                formatDisplay={(v) =>
                  v ? format(new Date(String(v)), "MMM d, yyyy") : "—"
                }
                onSave={async (v) => {
                  await updateParticipant.mutateAsync({
                    id: p.id,
                    dealId,
                    nda_sent_date: v || null,
                  });
                }}
              />
            </TableCell>
            <TableCell>
              <InlineEditField
                label=""
                value={p.nda_signed_date ?? ""}
                type="date"
                className="min-w-[140px]"
                formatDisplay={(v) =>
                  v ? format(new Date(String(v)), "MMM d, yyyy") : "—"
                }
                onSave={async (v) => {
                  await updateParticipant.mutateAsync({
                    id: p.id,
                    dealId,
                    nda_signed_date: v || null,
                  });
                }}
              />
            </TableCell>
            <TableCell>
              <NdaStatus sent={p.nda_sent_date} signed={p.nda_signed_date} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
