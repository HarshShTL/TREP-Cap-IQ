export const queryKeys = {
  deals: {
    all: ["deals"] as const,
    list: (filters?: object) => ["deals", "list", filters ?? {}] as const,
    detail: (id: string) => ["deals", id] as const,
  },
  contacts: {
    all: ["contacts"] as const,
    list: (params?: object) => ["contacts", "list", params ?? {}] as const,
    detail: (id: string) => ["contacts", id] as const,
  },
  companies: {
    all: ["companies"] as const,
    list: (params?: object) => ["companies", "list", params ?? {}] as const,
    detail: (id: string) => ["companies", id] as const,
  },
  activities: {
    all: ["activities"] as const,
    list: (params?: object) => ["activities", "list", params ?? {}] as const,
  },
  dealParticipants: (dealId: string) => ["deal-participants", dealId] as const,
  contactParticipants: (contactId: string) =>
    ["contact-participants", contactId] as const,
  companyContacts: (companyId: string) => ["company-contacts", companyId] as const,
  files: {
    all: ["files"] as const,
    byDeal: (dealId: string) => ["files", "deal", dealId] as const,
    byContact: (contactId: string) => ["files", "contact", contactId] as const,
    byCompany: (companyId: string) => ["files", "company", companyId] as const,
  },
  customViews: (entityType: string) => ["custom-views", entityType] as const,
  schemaConfig: (entityType: string) => ["schema-config", entityType] as const,
  pipelineConfig: ["pipeline-config"] as const,
  profile: ["profile"] as const,
  dashboard: {
    stats: ["dashboard", "stats"] as const,
    dealsByStage: ["dashboard", "dealsByStage"] as const,
    contactsByStatus: ["dashboard", "contactsByStatus"] as const,
    recentDeals: ["dashboard", "recentDeals"] as const,
    recentActivities: ["dashboard", "recentActivities"] as const,
  },
};
