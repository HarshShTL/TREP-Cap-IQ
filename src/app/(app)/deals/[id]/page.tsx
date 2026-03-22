"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeal } from "@/hooks/use-deals";
import { DealSummaryPanel } from "@/components/deals/deal-summary-panel";
import { DealCenterPanel } from "@/components/deals/deal-center-panel";
import { DealRightPanel } from "@/components/deals/deal-right-panel";
import { formatCurrency } from "@/lib/constants";

type Props = { params: { id: string } };

export default function DealDetailPage({ params }: Props) {
  const { id } = params;
  const { data: deal, isLoading } = useDeal(id);

  return (
    <div className="space-y-4">
      <Link
        href="/deals"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
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
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{deal?.name ?? "Deal"}</h1>
          {deal?.stage && <Badge variant="secondary">{deal.stage}</Badge>}
          {deal?.amount != null && (
            <span className="text-muted-foreground tabular-nums">
              {formatCurrency(deal.amount)}
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_220px]">
        <div className="rounded-xl border bg-card p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Deal Details
          </p>
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
