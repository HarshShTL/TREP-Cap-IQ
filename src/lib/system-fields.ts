import type { FieldDefinition, EntityType } from "@/types";

const DEAL_SYSTEM_FIELDS: FieldDefinition[] = [
  { key: 'name', label: 'Deal Name', type: 'text', required: true, locked: true, order: 0 },
  { key: 'amount', label: 'Amount', type: 'number', required: false, locked: true, order: 1 },
  { key: 'stage', label: 'Stage', type: 'select', required: true, locked: true, order: 2, options: ["Overviews", "Deal Review", "Sourcing", "LOI Sent", "Closed", "On Hold", "Pass"] },
  { key: 'deal_type', label: 'Deal Type', type: 'select', required: false, locked: true, order: 3, options: ["Development", "Acquisition"] },
  { key: 'priority', label: 'Priority', type: 'select', required: false, locked: true, order: 4, options: ["Low", "Medium", "High"] },
  { key: 'close_date', label: 'Close Date', type: 'date', required: false, locked: true, order: 5 },
];

const CONTACT_SYSTEM_FIELDS: FieldDefinition[] = [
  { key: 'first_name', label: 'First Name', type: 'text', required: true, locked: true, order: 0 },
  { key: 'last_name', label: 'Last Name', type: 'text', required: true, locked: true, order: 1 },
  { key: 'email', label: 'Email', type: 'text', required: false, locked: true, order: 2 },
  { key: 'phone', label: 'Phone', type: 'text', required: false, locked: true, order: 3 },
  { key: 'job_title', label: 'Job Title', type: 'text', required: false, locked: true, order: 4 },
  { key: 'company_name', label: 'Company Name', type: 'text', required: false, locked: true, order: 5 },
];

const COMPANY_SYSTEM_FIELDS: FieldDefinition[] = [
  { key: 'name', label: 'Company Name', type: 'text', required: true, locked: true, order: 0 },
  { key: 'domain', label: 'Domain', type: 'text', required: false, locked: true, order: 1 },
  { key: 'website', label: 'Website', type: 'text', required: false, locked: true, order: 2 },
  { key: 'company_type', label: 'Company Type', type: 'select', required: false, locked: true, order: 3, options: ["Investor", "Broker", "Lender", "Legal", "Other"] },
  { key: 'industry', label: 'Industry', type: 'text', required: false, locked: true, order: 4 },
];

export const SYSTEM_FIELDS: Record<EntityType, FieldDefinition[]> = {
  deal: DEAL_SYSTEM_FIELDS,
  contact: CONTACT_SYSTEM_FIELDS,
  company: COMPANY_SYSTEM_FIELDS,
  activity: [], // No system fields for activity yet
};
