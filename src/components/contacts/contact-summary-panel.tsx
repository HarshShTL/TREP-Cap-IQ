"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineEditField } from "@/components/inline-edit-field";
import { EntityAvatar } from "@/components/ui/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useContact, useUpdateContact } from "@/hooks/use-contacts";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import { useProfiles } from "@/hooks/use-profile";
import {
  LEAD_STATUSES,
  CAPITAL_TYPES,
  FAMILY_OFFICE_TYPES,
  INSTITUTIONAL_TYPES,
  RETAIL_TYPES,
  INDIRECT_TYPES,
  OWNERSHIP_TYPES,
  RELATIONSHIP_TYPES,
  ASSET_CLASSES,
  REGIONS,
  DATABASE_SOURCES,
  TREP_CAPITAL_TYPE_PRIOR_OUTREACH_OPTIONS,
  TREP_DEAL_PRIOR_OUTREACH_OPTIONS,
} from "@/lib/constants";
import type { Contact } from "@/types";

// ─── Collapsible Section ───────────────────────────────────────────────────────

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
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "mt-2 max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

// ─── Multi-select tags (for Asset Class) ────────────────────────────────────────

function MultiSelectTags({
  label,
  values,
  options,
  onSave,
}: {
  label: string;
  values: string[];
  options: readonly string[];
  onSave: (value: string) => Promise<void>;
}) {
  const [adding, setAdding] = React.useState(false);
  const available = options.filter((o) => !values.includes(o));

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-1">
        {values.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
          >
            {v}
            <button
              type="button"
              className="ml-0.5 text-slate-400 hover:text-slate-600"
              onClick={async () => {
                const next = values.filter((x) => x !== v).join(", ");
                await onSave(next);
              }}
            >
              &times;
            </button>
          </span>
        ))}
        {!adding && available.length > 0 && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex items-center rounded-full border border-dashed border-slate-300 px-2 py-0.5 text-xs text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors"
          >
            + Add
          </button>
        )}
      </div>
      {adding && (
        <select
          autoFocus
          className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-200"
          onChange={async (e) => {
            const picked = e.target.value;
            if (picked) {
              const next = [...values, picked].join(", ");
              await onSave(next);
            }
            setAdding(false);
          }}
          onBlur={() => setAdding(false)}
        >
          <option value="">Select...</option>
          {available.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

// ─── Main Panel ─────────────────────────────────────────────────────────────────

interface ContactSummaryPanelProps {
  contactId: string;
}

export function ContactSummaryPanel({ contactId }: ContactSummaryPanelProps) {
  const { data: contact, isLoading } = useContact(contactId);
  const updateContact = useUpdateContact();
  const { data: schema } = useSchemaConfig("contact");
  const { data: profiles = [] } = useProfiles();
  const [copied, setCopied] = React.useState(false);

  const profileOptions = profiles.map((p) => p.full_name ?? p.id);

  const resolveProfile = (id: string | null | undefined) =>
    profiles.find((p) => p.id === id)?.full_name ?? id ?? "";

  if (isLoading) {
    return (
      <div className="space-y-4 p-1">
        <div className="flex flex-col items-center gap-3 pb-4">
          <Skeleton className="size-20 rounded-full" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!contact) return null;

  const save = (field: keyof Contact) => async (value: string) => {
    await updateContact.mutateAsync({ id: contactId, [field]: value || null });
  };

  const fullName = `${contact.first_name ?? ""} ${contact.last_name ?? ""}`.trim();
  const customFields = schema?.field_definitions ?? [];

  const copyEmail = () => {
    if (contact.email) {
      navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const assetClassValues = contact.asset_class
    ? contact.asset_class.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-3">
      {/* Contact Header */}
      <div className="flex flex-col items-center gap-2 pb-2 text-center">
        <EntityAvatar name={fullName} type="contact" size="lg" className="size-20 text-xl" />
        <div className="space-y-0.5">
          <h1 className="text-lg font-bold text-slate-900">{fullName}</h1>
          {contact.company_name && (
            <p className="text-sm text-muted-foreground">
              {contact.company_id ? (
                <Link
                  href={`/companies/${contact.company_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {contact.company_name}
                </Link>
              ) : (
                contact.company_name
              )}
            </p>
          )}
          {contact.email && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <a
                href={`mailto:${contact.email}`}
                className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
              >
                {contact.email}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Copy email"
              >
                {copied ? (
                  <Check className="size-3.5 text-green-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
              <a
                href={`mailto:${contact.email}`}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                title="Open in email client"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Key Information */}
      <CollapsibleSection title="Key Information" defaultOpen>
        <InlineEditField
          label="Phone Number"
          value={contact.phone ?? ""}
          type="text"
          onSave={save("phone")}
        />
        <InlineEditField
          label="Contact Owner"
          value={resolveProfile(contact.contact_owner)}
          type="select"
          options={profileOptions}
          onSave={async (v) => {
            const match = profiles.find((p) => p.full_name === v);
            await save("contact_owner")(match?.id ?? v);
          }}
        />
        <InlineEditField
          label="Next Steps"
          value={contact.next_steps ?? ""}
          type="textarea"
          onSave={save("next_steps")}
        />
        <InlineEditField
          label="Lead Status"
          value={contact.lead_status ?? ""}
          type="select"
          options={[...LEAD_STATUSES]}
          onSave={save("lead_status")}
          formatDisplay={(v) => {
            if (!v) return "";
            return String(v);
          }}
        />
        <InlineEditField
          label="Database Source"
          value={contact.database_source ?? ""}
          type="select"
          options={[...DATABASE_SOURCES]}
          onSave={save("database_source")}
        />
        <InlineEditField
          label="Relationship"
          value={contact.relationship ?? ""}
          type="select"
          options={[...RELATIONSHIP_TYPES]}
          onSave={save("relationship")}
        />
        <InlineEditField
          label="Ownership"
          value={contact.ownership ?? ""}
          type="select"
          options={[...OWNERSHIP_TYPES]}
          onSave={save("ownership")}
        />
        <InlineEditField
          label="Region"
          value={contact.region ?? ""}
          type="select"
          options={[...REGIONS]}
          onSave={save("region")}
        />
        <MultiSelectTags
          label="Asset Class"
          values={assetClassValues}
          options={ASSET_CLASSES}
          onSave={save("asset_class")}
        />
      </CollapsibleSection>

      {/* Investor Type */}
      <CollapsibleSection title="Investor Type" defaultOpen={false}>
        <InlineEditField
          label="Capital Type"
          value={contact.capital_type ?? ""}
          type="select"
          options={[...CAPITAL_TYPES]}
          onSave={save("capital_type")}
        />
        <InlineEditField
          label="Family Office"
          value={contact.family_office ?? ""}
          type="select"
          options={[...FAMILY_OFFICE_TYPES]}
          onSave={save("family_office")}
        />
        <InlineEditField
          label="Institutional"
          value={contact.institutional ?? ""}
          type="select"
          options={[...INSTITUTIONAL_TYPES]}
          onSave={save("institutional")}
        />
        <InlineEditField
          label="Retail"
          value={contact.retail ?? ""}
          type="select"
          options={[...RETAIL_TYPES]}
          onSave={save("retail")}
        />
        <InlineEditField
          label="Indirect"
          value={contact.indirect ?? ""}
          type="select"
          options={[...INDIRECT_TYPES]}
          onSave={save("indirect")}
        />
        <InlineEditField
          label="TREP Capital Type Prior Outreach"
          value={contact.trep_capital_type_prior_outreach ?? ""}
          type="select"
          options={[...TREP_CAPITAL_TYPE_PRIOR_OUTREACH_OPTIONS]}
          onSave={save("trep_capital_type_prior_outreach")}
        />
        <InlineEditField
          label="TREP Deal Prior Outreach"
          value={contact.trep_deal_prior_outreach ?? ""}
          type="select"
          options={[...TREP_DEAL_PRIOR_OUTREACH_OPTIONS]}
          onSave={save("trep_deal_prior_outreach")}
        />
      </CollapsibleSection>

      {/* Location */}
      <CollapsibleSection title="Location" defaultOpen={false}>
        <InlineEditField
          label="Street Address"
          value={contact.street_address ?? ""}
          type="text"
          onSave={save("street_address")}
        />
        <InlineEditField
          label="City"
          value={contact.city ?? ""}
          type="text"
          onSave={save("city")}
        />
        <InlineEditField
          label="State"
          value={contact.state ?? ""}
          type="text"
          onSave={save("state")}
        />
        <InlineEditField
          label="Postal Code"
          value={contact.postal_code ?? ""}
          type="text"
          onSave={save("postal_code")}
        />
        <InlineEditField
          label="Country"
          value={contact.country ?? ""}
          type="text"
          onSave={save("country")}
        />
        <InlineEditField
          label="Time Zone"
          value={contact.time_zone ?? ""}
          type="text"
          onSave={save("time_zone")}
        />
      </CollapsibleSection>

      {/* Company & Work */}
      <CollapsibleSection title="Company & Work" defaultOpen={false}>
        <InlineEditField
          label="Company Name"
          value={contact.company_name ?? ""}
          type="text"
          onSave={save("company_name")}
        />
        <InlineEditField
          label="Job Title"
          value={contact.job_title ?? ""}
          type="text"
          onSave={save("job_title")}
        />
        <InlineEditField
          label="Industry"
          value={contact.industry ?? ""}
          type="text"
          onSave={save("industry")}
        />
        <InlineEditField
          label="Website"
          value={contact.website ?? ""}
          type="text"
          onSave={save("website")}
        />
      </CollapsibleSection>

      {/* Custom Fields */}
      {customFields.length > 0 && (
        <CollapsibleSection title="Custom Fields" defaultOpen={false}>
          {customFields.map((field) => (
            <InlineEditField
              key={field.key}
              label={field.label}
              value={(contact.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" || field.type === "multiselect" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateContact.mutateAsync({
                  id: contactId,
                  custom_fields: { ...contact.custom_fields, [field.key]: v || null } as import("@/types/database").Json,
                });
              }}
            />
          ))}
        </CollapsibleSection>
      )}
    </div>
  );
}
