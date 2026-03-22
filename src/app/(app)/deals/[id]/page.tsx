"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useDeal } from "@/hooks/use-deals";
import { useProfiles } from "@/hooks/use-profile";
import { DealSummaryPanel } from "@/components/deals/deal-summary-panel";
import { DealCenterPanel } from "@/components/deals/deal-center-panel";
import { DealRightPanel } from "@/components/deals/deal-right-panel";
import { formatCurrency, STAGE_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = { params: { id: string } };

export default function DealDetailPage({ params }: Props) {
  const { id } = params;
  const { data: deal, isLoading } = useDeal(id);
  const { data: profiles = [] } = useProfiles();

  const ownerName = profiles.find((p) => p.id === deal?.deal_owner)?.full_name;

  return (
    <div className="space-y-4">
      <Breadcrumb
        items={[
          { label: "Deals", href: "/deals" },
          { label: deal?.name ?? "Deal" },
        ]}
      />

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {deal?.name ?? "Deal"}
            </h1>
            {deal?.stage && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
                  STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700",
                )}
              >
                {deal.stage}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {ownerName && <span>Owner: <span className="font-medium text-foreground">{ownerName}</span></span>}
            {deal?.amount != null && (
              <span className="text-xl font-bold text-foreground tabular-nums">
                {formatCurrency(deal.amount)}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <DealSummaryPanel dealId={id} />
        </div>

        <div className="rounded-xl border bg-card p-4 min-h-[400px]">
          <DealCenterPanel dealId={id} />
        </div>

        <div className="rounded-xl border bg-card p-4">
          <DealRightPanel dealId={id} />
        </div>
      </div>
    </div>
  );
}
