// ─── Pipeline / Stage ────────────────────────────────────────────────────────

export const DEAL_STAGES = [
  "Overviews",
  "Deal Review",
  "Sourcing",
  "LOI Sent",
  "Closed",
  "On Hold",
  "Pass",
] as const;

// ─── Priority ─────────────────────────────────────────────────────────────────

export const PRIORITY_DOT_COLORS: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-500",
  Low: "bg-green-500",
};

export const PRIORITIES = ["High", "Medium", "Low"] as const;

// ─── Activity ─────────────────────────────────────────────────────────────────

export const ACTIVITY_TYPES = [
  "Call",
  "Email",
  "Meeting",
  "Note",
  "NDA",
  "Document",
] as const;

// ─── Lead / Contact ───────────────────────────────────────────────────────────

export const LEAD_STATUSES = [
  "New",
  "Open",
  "In Progress",
  "Qualified",
  "Unqualified",
  "Attempted",
  "Connected",
  "Bad Timing",
  "Nurture",
  "Do Not Contact",
] as const;

export const CAPITAL_TYPES = [
  "Equity",
  "Debt",
  "Preferred Equity",
  "Mezzanine",
  "JV Equity",
  "Bridge",
  "Construction",
  "Permanent",
  "CMBS",
  "Other",
] as const;

export const ASSET_CLASSES = [
  "Multifamily",
  "Office",
  "Industrial",
  "Retail",
  "Hotel",
  "Mixed Use",
  "Land",
  "Healthcare",
  "Self Storage",
  "Senior Housing",
  "Data Center",
  "Other",
] as const;

export const REGIONS = [
  "Northeast",
  "Southeast",
  "Midwest",
  "Southwest",
  "West",
  "Mountain West",
  "National",
  "International",
] as const;

export const INVESTMENT_STRATEGIES = [
  "Core",
  "Core Plus",
  "Value Add",
  "Opportunistic",
  "Development",
  "Ground Lease",
  "Net Lease",
] as const;

export const DEAL_TYPES = ["Development", "Acquisition", "Other"] as const;

export const COMPANY_TYPES = [
  "Family Office",
  "Institutional",
  "REIT",
  "Private Equity",
  "Pension Fund",
  "Insurance",
  "Endowment",
  "Developer",
  "Broker",
  "Bank",
  "Other",
] as const;

export const PARTICIPANT_ROLES = [
  "Investor",
  "LP",
  "GP",
  "Lender",
  "Broker",
  "Advisor",
  "Other",
] as const;

export const PARTICIPANT_STATUSES = [
  "Active",
  "Interested",
  "Passed",
  "Pending",
  "Committed",
] as const;

// ─── Formatting ───────────────────────────────────────────────────────────────

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000) {
    return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  }
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyFull(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
