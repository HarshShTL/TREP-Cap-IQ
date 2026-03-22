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
  Overviews: "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
  "Deal Review": "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Sourcing: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "LOI Sent": "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  Closed: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "On Hold": "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Pass: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

export const STAGE_BAR_COLORS: Record<string, string> = {
  Overviews: "bg-slate-400",
  "Deal Review": "bg-blue-400",
  Sourcing: "bg-indigo-400",
  "LOI Sent": "bg-amber-400",
  Closed: "bg-emerald-400",
  "On Hold": "bg-orange-400",
  Pass: "bg-red-400",
};

export const STAGE_DOT_COLORS: Record<string, string> = {
  Overviews: "bg-slate-400",
  "Deal Review": "bg-blue-500",
  Sourcing: "bg-indigo-500",
  "LOI Sent": "bg-amber-500",
  Closed: "bg-emerald-500",
  "On Hold": "bg-orange-500",
  Pass: "bg-red-500",
};

export const LEAD_STATUS_BADGE_CLASSES: Record<string, string> = {
  New: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Open: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800",
  "In Progress": "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  Qualified: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Unqualified: "bg-gray-50 text-gray-600 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-400 dark:border-gray-700",
  Attempted: "bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
  Connected: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  "Bad Timing": "bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800",
  Nurture: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "Do Not Contact": "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
};

export const PARTICIPANT_STATUS_BADGE_CLASSES: Record<string, string> = {
  Introduced: "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
  "NDA Sent": "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "NDA Signed": "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  "Reviewing Deck": "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "Soft Circle": "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  Committed: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Passed: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  Active: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Interested: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export const EMAIL_VERIFICATION_BADGE_CLASSES: Record<string, string> = {
  valid: "bg-green-50 text-green-700 border border-green-200",
  invalid: "bg-red-50 text-red-700 border border-red-200",
  unknown: "bg-gray-50 text-gray-600 border border-gray-200",
  accept_all_unverifiable: "bg-amber-50 text-amber-700 border border-amber-200",
};

export const COMPANY_TYPE_BADGE_CLASSES: Record<string, string> = {
  "Family Office": "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Institutional: "bg-blue-50 text-blue-700 border border-blue-200",
  REIT: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Private Equity": "bg-purple-50 text-purple-700 border border-purple-200",
  "Pension Fund": "bg-teal-50 text-teal-700 border border-teal-200",
  Insurance: "bg-cyan-50 text-cyan-700 border border-cyan-200",
  Endowment: "bg-amber-50 text-amber-700 border border-amber-200",
  Developer: "bg-orange-50 text-orange-700 border border-orange-200",
  Broker: "bg-blue-50 text-blue-700 border border-blue-200",
  Bank: "bg-slate-50 text-slate-700 border border-slate-200",
  Other: "bg-gray-50 text-gray-600 border border-gray-200",
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
