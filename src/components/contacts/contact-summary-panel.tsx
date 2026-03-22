"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { InlineEditField } from "@/components/inline-edit-field";
import { useContact, useUpdateContact } from "@/hooks/use-contacts";
import { useSchemaConfig } from "@/hooks/use-schema-config";
import {
  LEAD_STATUSES,
  CAPITAL_TYPES,
  ASSET_CLASSES,
  REGIONS,
  INVESTMENT_STRATEGIES,
} from "@/lib/constants";
import type { Contact } from "@/types";

interface ContactSummaryPanelProps {
  contactId: string;
}

export function ContactSummaryPanel({ contactId }: ContactSummaryPanelProps) {
  const { data: contact, isLoading } = useContact(contactId);
  const updateContact = useUpdateContact();
  const { data: schema } = useSchemaConfig("contact");

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

  const initials = `${contact.first_name?.[0] ?? ""}${contact.last_name?.[0] ?? ""}`.toUpperCase();
  const customFields = schema?.field_definitions ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 pb-2 text-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
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
        label="Lead Status"
        value={contact.lead_status ?? ""}
        type="select"
        options={[...LEAD_STATUSES]}
        onSave={save("lead_status")}
      />
      <InlineEditField
        label="Capital Type"
        value={contact.capital_type ?? ""}
        type="select"
        options={[...CAPITAL_TYPES]}
        onSave={save("capital_type")}
      />
      <InlineEditField
        label="Asset Class"
        value={contact.asset_class ?? ""}
        type="select"
        options={[...ASSET_CLASSES]}
        onSave={save("asset_class")}
      />
      <InlineEditField
        label="Region"
        value={contact.region ?? ""}
        type="select"
        options={[...REGIONS]}
        onSave={save("region")}
      />
      <InlineEditField
        label="Investment Strategy"
        value={contact.investment_strategy ?? ""}
        type="select"
        options={[...INVESTMENT_STRATEGIES]}
        onSave={save("investment_strategy")}
      />
      <InlineEditField
        label="Last Interaction"
        value={contact.last_interaction_date ?? ""}
        type="date"
        onSave={save("last_interaction_date")}
      />
      <InlineEditField
        label="Relationship"
        value={contact.relationship ?? ""}
        type="textarea"
        onSave={save("relationship")}
      />
      <InlineEditField
        label="Next Steps"
        value={contact.next_steps ?? ""}
        type="textarea"
        onSave={save("next_steps")}
      />
      <InlineEditField
        label="Contact Owner"
        value={contact.contact_owner ?? ""}
        type="text"
        onSave={save("contact_owner")}
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
