"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { InlineEditField } from "@/components/inline-edit-field";
import { useDeal, useUpdateDeal } from "@/hooks/use-deals";
import { usePipelineStages } from "@/hooks/use-pipeline-config";
import { formatCurrency, PRIORITIES, ASSET_CLASSES, DEAL_TYPES } from "@/lib/constants";
import type { Deal } from "@/types";

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
  const updateDeal = useUpdateDeal();
  const stages = usePipelineStages();

  const save = (field: keyof Deal) => async (value: string) => {
    if (!dealId) return;
    await updateDeal.mutateAsync({
      id: dealId,
      [field]: value || null,
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:max-w-[420px] overflow-y-auto">
        {isLoading || !deal ? (
          <div className="space-y-4 p-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-3 pt-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <SheetHeader className="p-0 pr-8">
              <div className="flex items-start justify-between gap-2">
                <SheetTitle className="text-base font-semibold leading-snug">
                  {deal.name}
                </SheetTitle>
                <Link
                  href={`/deals/${deal.id}`}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  title="Open full view"
                >
                  <ExternalLink className="size-4" />
                </Link>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="secondary">{deal.stage}</Badge>
                {deal.amount != null && (
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {formatCurrency(deal.amount)}
                  </span>
                )}
              </div>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              <InlineEditField label="Stage" value={deal.stage} type="select" options={stages} onSave={save("stage")} />
              <InlineEditField label="Amount ($)" value={deal.amount ?? ""} type="number" onSave={save("amount")} formatDisplay={(v) => (v ? formatCurrency(Number(v)) : "")} />
              <InlineEditField label="Priority" value={deal.priority ?? ""} type="select" options={[...PRIORITIES]} onSave={save("priority")} />
              <InlineEditField label="Deal Type" value={deal.deal_type ?? ""} type="select" options={[...DEAL_TYPES]} onSave={save("deal_type")} />
              <InlineEditField label="Asset Class" value={deal.asset_class ?? ""} type="select" options={[...ASSET_CLASSES]} onSave={save("asset_class")} />
              <InlineEditField label="Location" value={deal.location ?? ""} type="text" onSave={save("location")} />
              <InlineEditField label="Expected Close Date" value={deal.expected_close_date ?? ""} type="date" onSave={save("expected_close_date")} />
              <InlineEditField label="Deal Owner" value={deal.deal_owner ?? ""} type="text" onSave={save("deal_owner")} />
              <InlineEditField label="Description" value={deal.description ?? ""} type="textarea" onSave={save("description")} />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
