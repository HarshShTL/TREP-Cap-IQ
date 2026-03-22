"use client";

import * as React from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Phone,
  Mail,
  Users,
  FileText,
  Shield,
  File,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActivities, useDeleteActivity } from "@/hooks/use-activities";
import { formatDate } from "@/lib/utils";
import type { Activity } from "@/types";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Call: <Phone className="size-4" />,
  Email: <Mail className="size-4" />,
  Meeting: <Users className="size-4" />,
  Note: <FileText className="size-4" />,
  NDA: <Shield className="size-4" />,
  Document: <File className="size-4" />,
  "AI Update": <Sparkles className="size-4" />,
};

interface ActivityFeedProps {
  dealId?: string;
  contactId?: string;
  companyId?: string;
  typeFilter?: string;
  search?: string;
  onLogActivity?: () => void;
}

export function ActivityFeed({
  dealId,
  contactId,
  companyId,
  typeFilter,
  search,
  onLogActivity,
}: ActivityFeedProps) {
  const [cursor, setCursor] = React.useState<string | undefined>();
  const [allActivities, setAllActivities] = React.useState<Activity[]>([]);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());
  const deleteActivity = useDeleteActivity();

  const params = { dealId, contactId, companyId, type: typeFilter, search, cursor, limit: 20 };
  const { data, isLoading, error } = useActivities(params);

  React.useEffect(() => {
    if (!cursor) {
      setAllActivities(data ?? []);
    } else {
      setAllActivities((prev) => [...prev, ...(data ?? [])]);
    }
  }, [data, cursor]);

  React.useEffect(() => {
    setCursor(undefined);
    setAllActivities([]);
  }, [dealId, contactId, companyId, typeFilter, search]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading && !cursor) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
        <span>Failed to load activities: {(error as Error).message}</span>
      </div>
    );
  }

  if (!allActivities.length && !isLoading) {
    return (
      <EmptyState
        title="No activities yet"
        description="Log a call, email, or note to get started."
        action={
          onLogActivity ? (
            <Button size="sm" onClick={onLogActivity}>
              <Plus className="mr-2 size-4" />
              Log Activity
            </Button>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="divide-y divide-border">
        {allActivities.map((activity) => {
          const isExpanded = expanded.has(activity.id);
          const hasLongBody = (activity.body?.length ?? 0) > 150;
          const displayBody =
            hasLongBody && !isExpanded
              ? activity.body!.slice(0, 150) + "…"
              : activity.body;
          const ts = activity.date ?? activity.created_at;

          return (
            <div key={activity.id} className="flex gap-3 py-3 px-0">
              {/* Left: type icon circle */}
              <div className="size-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
                {TYPE_ICONS[activity.type] ?? <FileText className="size-4" />}
              </div>

              {/* Right: content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {/* Subject + badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium text-foreground truncate">
                        {activity.subject}
                      </span>
                      <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-xs text-muted-foreground">
                        {activity.type}
                      </span>
                      {(activity as Activity & { ai_generated?: boolean }).ai_generated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.5 text-xs font-medium">
                          <Sparkles className="size-3" />
                          AI
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    {displayBody && (
                      <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-wrap break-words">
                        {displayBody}
                        {hasLongBody && (
                          <button
                            className="ml-1 inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                            onClick={() => toggleExpand(activity.id)}
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="size-3" />
                                Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="size-3" />
                                More
                              </>
                            )}
                          </button>
                        )}
                      </p>
                    )}

                    {/* Meta row */}
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      {activity.contacts && (
                        <Link
                          href={`/contacts/${activity.contact_id}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {activity.contacts.first_name} {activity.contacts.last_name}
                        </Link>
                      )}
                      {activity.deals && (
                        <Link
                          href={`/deals/${activity.deal_id}`}
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {activity.deals.name}
                        </Link>
                      )}
                      <span title={format(new Date(ts), "PPP p")}>
                        {formatDate(ts)}
                      </span>
                    </div>
                  </div>

                  {/* Actions menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-7 shrink-0">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setDeleteId(activity.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(data?.length ?? 0) === 20 && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => {
            const last = allActivities[allActivities.length - 1];
            if (last) setCursor(last.created_at);
          }}
        >
          Load More
        </Button>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        title="Delete activity?"
        description="This cannot be undone."
        confirmLabel="Delete"
        loading={deleteActivity.isPending}
        onConfirm={() => {
          if (deleteId) {
            deleteActivity.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
          }
        }}
      />
    </>
  );
}
