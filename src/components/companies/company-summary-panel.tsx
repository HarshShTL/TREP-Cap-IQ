"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InlineEditField } from "@/components/inline-edit-field";
import { useCompany, useUpdateCompany } from "@/hooks/use-companies";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import {
  COMPANY_TYPES,
  ASSET_CLASSES,
  REGIONS,
  CAPITAL_TYPES,
  INVESTMENT_STRATEGIES,
  formatCurrency,
} from "@/lib/constants";
import type { Company } from "@/types";

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
        <Skeleton className="h-8 w-40" />
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
    <div className="space-y-4">
      <div className="pb-2">
        <p className="font-semibold text-lg">{company.name}</p>
        {company.company_type && (
          <p className="text-sm text-muted-foreground">{company.company_type}</p>
        )}
        {company.domain && (
          <p className="text-xs text-muted-foreground">{company.domain}</p>
        )}
      </div>

      <Separator />

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
      <InlineEditField
        label="Capital Type"
        value={company.capital_type ?? ""}
        type="select"
        options={[...CAPITAL_TYPES]}
        onSave={save("capital_type")}
      />
      <InlineEditField
        label="Asset Class"
        value={company.asset_class ?? ""}
        type="select"
        options={[...ASSET_CLASSES]}
        onSave={save("asset_class")}
      />
      <InlineEditField
        label="Region"
        value={company.region ?? ""}
        type="select"
        options={[...REGIONS]}
        onSave={save("region")}
      />
      <InlineEditField
        label="Investment Strategy"
        value={company.investment_strategy ?? ""}
        type="select"
        options={[...INVESTMENT_STRATEGIES]}
        onSave={save("investment_strategy")}
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
      <InlineEditField
        label="Notes"
        value={company.notes ?? ""}
        type="textarea"
        onSave={save("notes")}
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
              value={(company.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateCompany.mutateAsync({
                  id: companyId,
                  custom_fields: { ...company.custom_fields, [field.key]: v || null },
                });
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
