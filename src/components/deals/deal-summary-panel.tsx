"use client";

import { InlineEditField } from "@/components/inline-edit-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeal, useUpdateDeal } from "@/hooks/use-deals";
import { usePipelineStages } from "@/hooks/use-pipeline-config";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import { formatCurrency, PRIORITIES, ASSET_CLASSES, DEAL_TYPES } from "@/lib/constants";
import type { Deal } from "@/types";

interface DealSummaryPanelProps {
  dealId: string;
}

export function DealSummaryPanel({ dealId }: DealSummaryPanelProps) {
  const { data: deal, isLoading } = useDeal(dealId);
  const updateDeal = useUpdateDeal();
  const stages = usePipelineStages();
  const { data: schema } = useSchemaConfig("deal");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!deal) return null;

  const save = (field: keyof Deal) => async (value: string) => {
    await updateDeal.mutateAsync({ id: dealId, [field]: value || null });
  };

  const customFields = schema?.field_definitions ?? [];

  return (
    <div className="space-y-4">
      <InlineEditField
        label="Stage"
        value={deal.stage}
        type="select"
        options={stages}
        onSave={save("stage")}
      />
      <InlineEditField
        label="Amount ($)"
        value={deal.amount ?? ""}
        type="number"
        onSave={save("amount")}
        formatDisplay={(v) => (v ? formatCurrency(Number(v)) : "")}
      />
      <InlineEditField
        label="Priority"
        value={deal.priority ?? ""}
        type="select"
        options={[...PRIORITIES]}
        onSave={save("priority")}
      />
      <InlineEditField
        label="Deal Type"
        value={deal.deal_type ?? ""}
        type="select"
        options={[...DEAL_TYPES]}
        onSave={save("deal_type")}
      />
      <InlineEditField
        label="Asset Class"
        value={deal.asset_class ?? ""}
        type="select"
        options={[...ASSET_CLASSES]}
        onSave={save("asset_class")}
      />
      <InlineEditField
        label="Location"
        value={deal.location ?? ""}
        type="text"
        onSave={save("location")}
      />
      <InlineEditField
        label="Expected Close Date"
        value={deal.expected_close_date ?? ""}
        type="date"
        onSave={save("expected_close_date")}
      />
      <InlineEditField
        label="Deal Owner"
        value={deal.deal_owner ?? ""}
        type="text"
        onSave={save("deal_owner")}
      />
      <InlineEditField
        label="Collaborator"
        value={deal.deal_collaborator ?? ""}
        type="text"
        onSave={save("deal_collaborator")}
      />
      <InlineEditField
        label="Description"
        value={deal.description ?? ""}
        type="textarea"
        onSave={save("description")}
      />

      {customFields.length > 0 && (
        <>
          <div className="border-t pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Custom Fields
          </div>
          {customFields.map((field) => (
            <InlineEditField
              key={field.key}
              label={field.label}
              value={(deal.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateDeal.mutateAsync({
                  id: dealId,
                  custom_fields: { ...deal.custom_fields, [field.key]: v || null },
                });
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
