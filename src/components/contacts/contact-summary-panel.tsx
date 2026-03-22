"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InlineEditField } from "@/components/inline-edit-field";
import { EntityAvatar } from "@/components/ui/entity-avatar";
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
  INVESTMENT_STRATEGIES,
  DATABASE_SOURCES,
  EMAIL_VERIFICATIONS,
  TREP_CAPITAL_TYPE_PRIOR_OUTREACH_OPTIONS,
  TREP_DEAL_PRIOR_OUTREACH_OPTIONS,
} from "@/lib/constants";
import type { Contact } from "@/types";

interface ContactSummaryPanelProps {
  contactId: string;
}

export function ContactSummaryPanel({ contactId }: ContactSummaryPanelProps) {
  const { data: contact, isLoading } = useContact(contactId);
  const updateContact = useUpdateContact();
  const { data: schema } = useSchemaConfig("contact");
  const { data: profiles = [] } = useProfiles();

  const resolveProfile = (id: string | null | undefined) =>
    profiles.find((p) => p.id === id)?.full_name ?? id ?? "";

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 pb-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 pb-2 text-center">
        <EntityAvatar name={fullName} type="contact" size="lg" />
        <div>
          <p className="font-semibold">
            {contact.first_name} {contact.last_name}
          </p>
          {contact.job_title && (
            <p className="text-sm text-muted-foreground">{contact.job_title}</p>
          )}
          {contact.company_name && (
            <p className="text-sm text-muted-foreground">{contact.company_name}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Personal Information */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Personal Information</div>
      <InlineEditField
        label="First Name"
        value={contact.first_name}
        type="text"
        onSave={save("first_name")}
      />
      <InlineEditField
        label="Last Name"
        value={contact.last_name}
        type="text"
        onSave={save("last_name")}
      />
      <InlineEditField
        label="Email"
        value={contact.email ?? ""}
        type="text"
        onSave={save("email")}
      />
      <InlineEditField
        label="Phone"
        value={contact.phone ?? ""}
        type="text"
        onSave={save("phone")}
      />
      <InlineEditField
        label="Job Title"
        value={contact.job_title ?? ""}
        type="text"
        onSave={save("job_title")}
      />
      <InlineEditField
        label="Company"
        value={contact.company_name ?? ""}
        type="text"
        onSave={save("company_name")}
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

      <Separator />

      {/* Location */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</div>
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

      <Separator />

      {/* Lifecycle & Ownership */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Lifecycle & Ownership</div>
      <InlineEditField
        label="Lead Status"
        value={contact.lead_status ?? ""}
        type="select"
        options={[...LEAD_STATUSES]}
        onSave={save("lead_status")}
      />
      <InlineEditField
        label="Contact Owner"
        value={resolveProfile(contact.contact_owner)}
        type="text"
        onSave={save("contact_owner")}
      />
      <InlineEditField
        label="Relationship"
        value={contact.relationship ?? ""}
        type="select"
        options={[...RELATIONSHIP_TYPES]}
        onSave={save("relationship")}
      />
      <InlineEditField
        label="Last Interaction"
        value={contact.last_interaction_date ?? ""}
        type="date"
        onSave={save("last_interaction_date")}
      />
      <InlineEditField
        label="Next Steps"
        value={contact.next_steps ?? ""}
        type="textarea"
        onSave={save("next_steps")}
      />

      <Separator />

      {/* Investor Type */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Investor Type</div>
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
        label="Ownership"
        value={contact.ownership ?? ""}
        type="select"
        options={[...OWNERSHIP_TYPES]}
        onSave={save("ownership")}
      />

      <Separator />

      {/* Investment Preferences */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Investment Preferences</div>
      <InlineEditField
        label="Investment Strategy"
        value={contact.investment_strategy ?? ""}
        type="select"
        options={[...INVESTMENT_STRATEGIES]}
        onSave={save("investment_strategy")}
      />
      <InlineEditField
        label="Region"
        value={contact.region ?? ""}
        type="select"
        options={[...REGIONS]}
        onSave={save("region")}
      />
      <InlineEditField
        label="Asset Class"
        value={contact.asset_class ?? ""}
        type="select"
        options={[...ASSET_CLASSES]}
        onSave={save("asset_class")}
      />

      <Separator />

      {/* Data & Prior Outreach */}
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Data & Prior Outreach</div>
      <InlineEditField
        label="Database Source"
        value={contact.database_source ?? ""}
        type="select"
        options={[...DATABASE_SOURCES]}
        onSave={save("database_source")}
      />
      <InlineEditField
        label="Email Verification"
        value={contact.email_verification ?? ""}
        type="select"
        options={[...EMAIL_VERIFICATIONS]}
        onSave={save("email_verification")}
      />
      <InlineEditField
        label="Capital Type (Prior Outreach)"
        value={contact.trep_capital_type_prior_outreach ?? ""}
        type="select"
        options={[...TREP_CAPITAL_TYPE_PRIOR_OUTREACH_OPTIONS]}
        onSave={save("trep_capital_type_prior_outreach")}
      />
      <InlineEditField
        label="Deal (Prior Outreach)"
        value={contact.trep_deal_prior_outreach ?? ""}
        type="select"
        options={[...TREP_DEAL_PRIOR_OUTREACH_OPTIONS]}
        onSave={save("trep_deal_prior_outreach")}
      />

      {customFields.length > 0 && (
        <>
          <Separator />
          <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Custom Fields
          </div>
          {customFields.map((field) => (
            <InlineEditField
              key={field.key}
              label={field.label}
              value={(contact.custom_fields?.[field.key] as string | undefined) ?? ""}
              type={field.type === "boolean" ? "text" : field.type}
              options={field.options}
              onSave={async (v) => {
                await updateContact.mutateAsync({
                  id: contactId,
                  custom_fields: { ...contact.custom_fields, [field.key]: v || null },
                });
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
