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
  "AI Update",
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

// ─── Badge Colors ─────────────────────────────────────────────────────────────

export const STAGE_BADGE_CLASSES: Record<string, string> = {
  Overviews: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "Deal Review": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Sourcing: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "LOI Sent": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Closed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "On Hold": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Pass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const LEAD_STATUS_BADGE_CLASSES: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Open: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  "In Progress": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  Qualified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Unqualified: "bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-400",
  Attempted: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  Connected: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  "Bad Timing": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Nurture: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  "Do Not Contact": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const PARTICIPANT_STATUS_BADGE_CLASSES: Record<string, string> = {
  Introduced: "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  "NDA Sent": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "NDA Signed": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Reviewing Deck": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  "Soft Circle": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Committed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Passed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Interested: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

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
