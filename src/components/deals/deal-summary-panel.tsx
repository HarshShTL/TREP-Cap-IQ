"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { InlineEditField } from "@/components/inline-edit-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeal, useUpdateDeal } from "@/hooks/use-deals";
import { usePipelineStages } from "@/hooks/use-pipeline-config";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import { useProfiles } from "@/hooks/use-profile";
import { formatCurrency, PRIORITIES, ASSET_CLASSES, DEAL_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Deal } from "@/types";

/* ─── Collapsible Section ─────────────────────────────────────────────────── */

function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-colors"
      >
        {title}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "mt-2 max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

/* ─── Main Panel ──────────────────────────────────────────────────────────── */

interface DealSummaryPanelProps {
  dealId: string;
}

export function DealSummaryPanel({ dealId }: DealSummaryPanelProps) {
  const { data: deal, isLoading } = useDeal(dealId);
  const updateDeal = useUpdateDeal();
  const stages = usePipelineStages();
  const { data: schema } = useSchemaConfig("deal");
  const { data: profiles = [] } = useProfiles();

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

  const profileOptions = profiles.map((p) => p.full_name ?? p.id);
  const resolveProfile = (id: string | null) =>
    profiles.find((p) => p.id === id)?.full_name ?? id ?? "";

  const customFields = schema?.field_definitions ?? [];

  return (
    <div className="space-y-1">
      <CollapsibleSection title="About this deal" defaultOpen>
        <InlineEditField
          label="Amount ($)"
          value={deal.amount ?? ""}
          type="number"
          onSave={save("amount")}
          formatDisplay={(v) => (v ? formatCurrency(Number(v)) : "")}
        />
        <InlineEditField
          label="Deal Owner"
          value={resolveProfile(deal.deal_owner)}
          type="select"
          options={profileOptions}
          onSave={async (v) => {
            const profile = profiles.find((p) => p.full_name === v);
            await updateDeal.mutateAsync({ id: dealId, deal_owner: profile?.id ?? v ?? null });
          }}
        />
        <InlineEditField
          label="Collaborator"
          value={resolveProfile(deal.deal_collaborator)}
          type="select"
          options={profileOptions}
          onSave={async (v) => {
            const profile = profiles.find((p) => p.full_name === v);
            await updateDeal.mutateAsync({ id: dealId, deal_collaborator: profile?.id ?? v ?? null });
          }}
        />
        <InlineEditField
          label="Stage"
          value={deal.stage}
          type="select"
          options={stages}
          onSave={save("stage")}
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
          label="Deal Type"
          value={deal.deal_type ?? ""}
          type="select"
          options={[...DEAL_TYPES]}
          onSave={save("deal_type")}
        />
        <InlineEditField
          label="Priority"
          value={deal.priority ?? ""}
          type="select"
          options={[...PRIORITIES]}
          onSave={save("priority")}
        />
        <InlineEditField
          label="Expected Close Date"
          value={deal.expected_close_date ?? ""}
          type="date"
          onSave={save("expected_close_date")}
        />
        <InlineEditField
          label="Description"
          value={deal.description ?? ""}
          type="textarea"
          onSave={save("description")}
        />
      </CollapsibleSection>

      {customFields.length > 0 && (
        <CollapsibleSection title="Custom Fields" defaultOpen>
          {customFields.map((field) => (
            <InlineEditField
              key={field.key}
              label={field.label}
              value={(deal.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" || field.type === "multiselect" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateDeal.mutateAsync({
                  id: dealId,
                  custom_fields: { ...deal.custom_fields, [field.key]: v || null },
                });
              }}
            />
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}
