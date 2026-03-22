"use client";

import * as React from "react";
import { formatDistanceToNow, format } from "date-fns";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const { data, isLoading } = useActivities(params);

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
    <div className="space-y-2">
      {allActivities.map((activity) => {
        const isExpanded = expanded.has(activity.id);
        const hasLongBody = (activity.body?.length ?? 0) > 150;
        const displayBody =
          hasLongBody && !isExpanded ? activity.body!.slice(0, 150) + "…" : activity.body;
        const ts = activity.date ?? activity.created_at;

        return (
          <div key={activity.id} className="rounded-lg border bg-card p-3 text-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-0.5 shrink-0 text-muted-foreground">
                  {TYPE_ICONS[activity.type] ?? <FileText className="size-4" />}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate font-medium">{activity.subject}</span>
                    {activity.is_ai_generated && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Sparkles className="size-3" /> AI
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  {displayBody && (
                    <p className="mt-1 whitespace-pre-wrap break-words text-muted-foreground">
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
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {activity.contacts && (
                      <span>
                        {activity.contacts.first_name} {activity.contacts.last_name}
                      </span>
                    )}
                    {activity.deals && <span>{activity.deals.name}</span>}
                    {activity.companies && <span>{activity.companies.name}</span>}
                    <span title={format(new Date(ts), "PPP p")}>
                      {formatDistanceToNow(new Date(ts), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
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
        );
      })}

      {(data?.length ?? 0) === 20 && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
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
    </div>
  );
}
