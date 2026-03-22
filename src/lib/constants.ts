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
  "Need to Call",
  "Left VM",
  "Call Scheduled",
  "Had Call",
  "Tag to Deal",
  "Hold off for now",
] as const;

// ─── Capital Type (5 separate investor-type dropdowns) ────────────────────────

export const CAPITAL_TYPES = [
  "Senior Debt",
  "GP Equity",
  "LP - Large",
  "LP - Mid",
  "Subordinated Debt/Pref Equity",
  "Senior Debt - TX Banks",
  "LP - Small",
] as const;

export const FAMILY_OFFICE_TYPES = [
  "Family Office - Single",
  "Family Office - Multi",
] as const;

export const INSTITUTIONAL_TYPES = [
  "Fund Manager/Allocator",
  "Sovereign Wealth",
  "Life Company",
] as const;

export const RETAIL_TYPES = [
  "HNW",
  "Emerging",
  "HNW (TX)",
  "UHNW",
] as const;

export const INDIRECT_TYPES = [
  "Pension Fund",
  "Foundation",
  "Endowment",
  "RIA",
] as const;

export const OWNERSHIP_TYPES = [
  "Direct Owner",
] as const;

// ─── Relationship ─────────────────────────────────────────────────────────────

export const RELATIONSHIP_TYPES = [
  "J - No Relationship",
  "A - Very Well",
  "B - Warm",
  "H - Call",
  "X - Going Concern",
  "Y - Lender",
  "W - Sponsor",
  "Z - Existing",
] as const;

// ─── Asset Class ──────────────────────────────────────────────────────────────

export const ASSET_CLASSES = [
  "Residential - For Rent",
  "Residential - For Sale",
  "Retail",
  "Office",
  "Industrial/Storage",
  "Hotel",
  "Healthcare/Senior",
  "Land",
  "Datacenter",
  "Other",
] as const;

// ─── Region ───────────────────────────────────────────────────────────────────

export const REGIONS = [
  "Mid-West",
  "Northeast",
  "Southeast",
  "Southwest",
  "West",
  "International",
] as const;

// ─── Investment Strategy ──────────────────────────────────────────────────────

export const INVESTMENT_STRATEGIES = [
  "Development",
  "Acquisition",
] as const;

// ─── Deal Types ───────────────────────────────────────────────────────────────

export const DEAL_TYPES = ["Development", "Acquisition"] as const;

// ─── Company Types ────────────────────────────────────────────────────────────

export const COMPANY_TYPES = [
  "Investor",
  "Broker",
  "Lender",
  "Legal",
  "Other",
] as const;

// ─── Deal Participant ─────────────────────────────────────────────────────────

export const PARTICIPANT_ROLES = [
  "Lead Investor",
  "Co-Investor",
  "Broker",
  "Lender",
  "Legal",
  "Other",
] as const;

export const PARTICIPANT_STATUSES = [
  "Introduced",
  "NDA Sent",
  "NDA Signed",
  "Reviewing Deck",
  "Meeting Scheduled",
  "Soft Circle",
  "Committed",
  "Passed",
  "Closed",
] as const;

// ─── Data & Outreach ──────────────────────────────────────────────────────────

export const DATABASE_SOURCES = ["TREP", "KH"] as const;

export const EMAIL_VERIFICATIONS = [
  "valid",
  "accept_all_unverifiable",
  "invalid",
  "unknown",
] as const;

export const TREP_CAPITAL_TYPE_PRIOR_OUTREACH_OPTIONS = [
  "Programmatic Equity - TLHC IRF Income",
  "Equity - Daytona",
  "Equity - Healthcare",
  "Equity - Wood River Valley Syndication",
  "Transaction Prospects - Mountain West",
  "Equity - TPP",
  "Debt - Healthcare",
  "Debt - Mountain West Banks",
  "Debt - PAM Aiken",
] as const;

export const TREP_DEAL_PRIOR_OUTREACH_OPTIONS = [
  "Tomoka Gate",
  "Carpenter",
  "Rivana",
  "Magdalena",
  "NNN Medical",
  "MicroBay",
  "1600 SoCO",
  "SoCo Hotel",
  "Clear Sky",
  "PAM Aiken",
  "PAM Dover",
  "TMC Pref",
  "Rivana Recap",
  "SunGate Recap",
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
  "Need to Call": "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "Left VM": "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
  "Call Scheduled": "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "Had Call": "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
  "Tag to Deal": "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  "Hold off for now": "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
};

export const PARTICIPANT_STATUS_BADGE_CLASSES: Record<string, string> = {
  Introduced: "bg-slate-50 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700",
  "NDA Sent": "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "NDA Signed": "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  "Reviewing Deck": "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "Meeting Scheduled": "bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "Soft Circle": "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  Committed: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  Passed: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  Closed: "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-700",
};

export const EMAIL_VERIFICATION_BADGE_CLASSES: Record<string, string> = {
  valid: "bg-green-50 text-green-700 border border-green-200",
  invalid: "bg-red-50 text-red-700 border border-red-200",
  unknown: "bg-gray-50 text-gray-600 border border-gray-200",
  accept_all_unverifiable: "bg-amber-50 text-amber-700 border border-amber-200",
};

export const COMPANY_TYPE_BADGE_CLASSES: Record<string, string> = {
  Investor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Broker: "bg-blue-50 text-blue-700 border border-blue-200",
  Lender: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  Legal: "bg-purple-50 text-purple-700 border border-purple-200",
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
