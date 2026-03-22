"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { useDeal, useUpdateDealStage } from "@/hooks/use-deals";
import { usePipelineStages } from "@/hooks/use-pipeline-config";
import { useProfiles } from "@/hooks/use-profile";
import { useDealParticipants } from "@/hooks/use-deal-participants";
import {
  formatCurrency,
  STAGE_BADGE_CLASSES,
  STAGE_DOT_COLORS,
  PARTICIPANT_STATUS_BADGE_CLASSES,
} from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";

interface DealQuickEditSheetProps {
  dealId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DealQuickEditSheet({
  dealId,
  open,
  onOpenChange,
}: DealQuickEditSheetProps) {
  const { data: deal, isLoading } = useDeal(dealId ?? "");
  const stages = usePipelineStages();
  const updateStage = useUpdateDealStage();
  const { data: profiles = [] } = useProfiles();
  const { data: participants = [] } = useDealParticipants(dealId ?? "");

  const resolveProfile = (id: string | null | undefined) =>
    profiles.find((p) => p.id === id)?.full_name ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        {isLoading || !deal ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold leading-snug">
                {deal.name}
              </DialogTitle>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700",
                  )}
                >
                  {deal.stage}
                </span>
                {deal.asset_class && (
                  <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                    {deal.asset_class}
                  </span>
                )}
              </div>
            </DialogHeader>

            {/* Two-column details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Deal Owner</span>
                <p className="font-medium">
                  {resolveProfile(deal.deal_owner) ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Location</span>
                <p className="font-medium">{deal.location ?? "—"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Amount</span>
                <p className="font-medium">
                  {deal.amount != null ? formatCurrency(deal.amount) : "—"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Close Date</span>
                <p className="font-medium">
                  {formatDate(deal.expected_close_date)}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Created</span>
                <p className="font-medium">{formatDate(deal.created_at)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Priority</span>
                <p className="font-medium">{deal.priority ?? "—"}</p>
              </div>
            </div>

            {/* Move to Stage */}
            <div className="pt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Move to Stage
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => {
                      if (stage !== deal.stage && dealId) {
                        updateStage.mutate({ id: dealId, stage });
                      }
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer",
                      stage === deal.stage
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        STAGE_DOT_COLORS[stage] ?? "bg-slate-400",
                      )}
                    />
                    {stage}
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
            {participants.length > 0 && (
              <div className="pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Contacts ({participants.length})
                </p>
                <div className="space-y-2">
                  {participants.slice(0, 6).map((p) => {
                    const name = p.contacts
                      ? `${p.contacts.first_name} ${p.contacts.last_name}`.trim()
                      : "Unknown";
                    return (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <EntityAvatar name={name} type="contact" size="sm" />
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/contacts/${p.contact_id}`}
                            className="text-sm font-medium text-primary hover:underline truncate block"
                          >
                            {name}
                          </Link>
                          {p.contacts?.company_name && (
                            <p className="text-xs text-muted-foreground truncate">
                              {p.contacts.company_name}
                            </p>
                          )}
                        </div>
                        {p.status && (
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              PARTICIPANT_STATUS_BADGE_CLASSES[p.status] ?? "bg-gray-100 text-gray-600",
                            )}
                          >
                            {p.status}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Link href={`/deals/${deal.id}`} className="flex-1">
                <Button variant="default" className="w-full">
                  <ExternalLink className="size-4 mr-2" />
                  Open Full View
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
