"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { InlineEditField } from "@/components/inline-edit-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompany, useUpdateCompany } from "@/hooks/use-companies";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import { cn } from "@/lib/utils";
import {
  COMPANY_TYPES,
  ASSET_CLASSES,
  REGIONS,
  CAPITAL_TYPES,
  FAMILY_OFFICE_TYPES,
  INSTITUTIONAL_TYPES,
  RETAIL_TYPES,
  INDIRECT_TYPES,
  OWNERSHIP_TYPES,
  INVESTMENT_STRATEGIES,
  formatCurrency,
} from "@/lib/constants";
import type { Company } from "@/types";

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

interface CompanySummaryPanelProps {
  companyId: string;
}

export function CompanySummaryPanel({ companyId }: CompanySummaryPanelProps) {
  const { data: company, isLoading } = useCompany(companyId);
  const updateCompany = useUpdateCompany();
  const { data: schema } = useSchemaConfig("company");

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!company) return null;

  const save = (field: keyof Company) => async (value: string) => {
    await updateCompany.mutateAsync({ id: companyId, [field]: value || null });
  };

  const customFields = schema?.field_definitions ?? [];

  return (
    <div className="space-y-1">
      <CollapsibleSection title="Core Information" defaultOpen>
        <InlineEditField
          label="Company Name"
          value={company.name}
          type="text"
          onSave={save("name")}
        />
        <InlineEditField
          label="Type"
          value={company.company_type ?? ""}
          type="select"
          options={[...COMPANY_TYPES]}
          onSave={save("company_type")}
        />
        <InlineEditField
          label="Industry"
          value={company.industry ?? ""}
          type="text"
          onSave={save("industry")}
        />
        <InlineEditField
          label="Website"
          value={company.website ?? ""}
          type="text"
          onSave={save("website")}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Headquarters" defaultOpen>
        <InlineEditField
          label="HQ Address"
          value={company.hq_address ?? ""}
          type="text"
          onSave={save("hq_address")}
        />
        <InlineEditField
          label="HQ City"
          value={company.hq_city ?? ""}
          type="text"
          onSave={save("hq_city")}
        />
        <InlineEditField
          label="HQ State"
          value={company.hq_state ?? ""}
          type="text"
          onSave={save("hq_state")}
        />
        <InlineEditField
          label="HQ Country"
          value={company.hq_country ?? ""}
          type="text"
          onSave={save("hq_country")}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Investor Profile" defaultOpen>
        <InlineEditField
          label="Capital Type"
          value={company.capital_type ?? ""}
          type="select"
          options={[...CAPITAL_TYPES]}
          onSave={save("capital_type")}
        />
        <InlineEditField
          label="Family Office"
          value={company.family_office ?? ""}
          type="select"
          options={[...FAMILY_OFFICE_TYPES]}
          onSave={save("family_office")}
        />
        <InlineEditField
          label="Institutional"
          value={company.institutional ?? ""}
          type="select"
          options={[...INSTITUTIONAL_TYPES]}
          onSave={save("institutional")}
        />
        <InlineEditField
          label="Retail"
          value={company.retail ?? ""}
          type="select"
          options={[...RETAIL_TYPES]}
          onSave={save("retail")}
        />
        <InlineEditField
          label="Indirect"
          value={company.indirect ?? ""}
          type="select"
          options={[...INDIRECT_TYPES]}
          onSave={save("indirect")}
        />
        <InlineEditField
          label="Ownership"
          value={company.ownership ?? ""}
          type="select"
          options={[...OWNERSHIP_TYPES]}
          onSave={save("ownership")}
        />
        <InlineEditField
          label="Investment Strategy"
          value={company.investment_strategy ?? ""}
          type="select"
          options={[...INVESTMENT_STRATEGIES]}
          onSave={save("investment_strategy")}
        />
        <InlineEditField
          label="Region"
          value={company.region ?? ""}
          type="select"
          options={[...REGIONS]}
          onSave={save("region")}
        />
        <InlineEditField
          label="Asset Class"
          value={company.asset_class ?? ""}
          type="select"
          options={[...ASSET_CLASSES]}
          onSave={save("asset_class")}
        />
        <InlineEditField
          label="AUM ($)"
          value={company.aum ?? ""}
          type="number"
          onSave={async (v) => {
            await updateCompany.mutateAsync({ id: companyId, aum: v ? Number(v) : null });
          }}
          formatDisplay={(v) => (v ? formatCurrency(Number(v)) : "")}
        />
      </CollapsibleSection>

      <CollapsibleSection title="Notes" defaultOpen={false}>
        <InlineEditField
          label="Notes"
          value={company.notes ?? ""}
          type="textarea"
          onSave={save("notes")}
        />
      </CollapsibleSection>

      {customFields.length > 0 && (
        <CollapsibleSection title="Custom Fields" defaultOpen>
          {customFields.map((field) => (
            <InlineEditField
              key={field.key}
              label={field.label}
              value={(company.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" || field.type === "multiselect" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateCompany.mutateAsync({
                  id: companyId,
                  custom_fields: { ...company.custom_fields, [field.key]: v || null } as import("@/types/database").Json,
                });
              }}
            />
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}
