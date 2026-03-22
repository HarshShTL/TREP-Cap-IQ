"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeal } from "@/hooks/use-deals";
import { DealSummaryPanel } from "@/components/deals/deal-summary-panel";
import { DealCenterPanel } from "@/components/deals/deal-center-panel";
import { DealRightPanel } from "@/components/deals/deal-right-panel";
import { formatCurrency, STAGE_BADGE_CLASSES } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = { params: { id: string } };

export default function DealDetailPage({ params }: Props) {
  const { id } = params;
  const { data: deal, isLoading } = useDeal(id);

  return (
    <div className="space-y-4">
      <Link
        href="/deals"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="size-4" />
        Deals
      </Link>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{deal?.name ?? "Deal"}</h1>
            {deal?.stage && (
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium",
                  STAGE_BADGE_CLASSES[deal.stage] ?? "bg-gray-100 text-gray-700"
                )}
              >
                {deal.stage}
              </span>
            )}
          </div>
          {deal?.amount != null && (
            <span className="text-xl font-bold text-foreground tabular-nums">
              {formatCurrency(deal.amount)}
            </span>
          )}
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
