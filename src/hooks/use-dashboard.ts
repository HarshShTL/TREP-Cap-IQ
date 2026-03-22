"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Deal, Activity } from "@/types";

const EXCLUDED_STAGES = "(Closed,Pass)";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: async () => {
      const supabase = createClient();
      const [dealsRes, contactsRes, amountsRes, companiesRes, totalDealsRes, contactsNeedCallRes] =
        await Promise.all([
          supabase
            .from("deals")
            .select("*", { count: "exact", head: true })
            .not("stage", "in", EXCLUDED_STAGES)
            .is("deleted_at", null),
          supabase
            .from("contacts")
            .select("*", { count: "exact", head: true })
            .is("deleted_at", null),
          supabase
            .from("deals")
            .select("amount")
            .not("stage", "in", EXCLUDED_STAGES)
            .is("deleted_at", null),
          supabase
            .from("companies")
            .select("*", { count: "exact", head: true })
            .is("deleted_at", null),
          supabase
            .from("deals")
            .select("*", { count: "exact", head: true })
            .is("deleted_at", null),
          supabase
            .from("contacts")
            .select("*", { count: "exact", head: true })
            .is("deleted_at", null)
            .in("lead_status", ["New", "Open", "Attempted"]),
        ]);

      const totalAmount = (amountsRes.data ?? []).reduce(
        (sum, d) => sum + (d.amount ?? 0),
        0,
      );

      return {
        activeDeals: dealsRes.count ?? 0,
        totalDeals: totalDealsRes.count ?? 0,
        activeContacts: contactsRes.count ?? 0,
        contactsNeedCall: contactsNeedCallRes.count ?? 0,
        companiesCount: companiesRes.count ?? 0,
        totalAmount,
      };
    },
  });
}

export function useDealsByStage() {
  return useQuery({
    queryKey: ["dashboard", "dealsByStage"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("deals")
        .select("stage, amount")
        .is("deleted_at", null);

      const grouped: Record<string, { count: number; amount: number }> = {};
      (data ?? []).forEach((d) => {
        if (d.stage) {
          const existing = grouped[d.stage] ?? { count: 0, amount: 0 };
          existing.count += 1;
          existing.amount += d.amount ?? 0;
          grouped[d.stage] = existing;
        }
      });

      return Object.entries(grouped).map(([stage, { count, amount }]) => ({
        stage,
        count,
        amount,
      }));
    },
  });
}

export function useContactsByStatus() {
  return useQuery({
    queryKey: ["dashboard", "contactsByStatus"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("contacts")
        .select("lead_status")
        .is("deleted_at", null)
        .not("lead_status", "is", null);

      const grouped: Record<string, number> = {};
      (data ?? []).forEach((c) => {
        const s = c.lead_status as string;
        grouped[s] = (grouped[s] ?? 0) + 1;
      });

      return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    },
  });
}

export function useRecentDeals() {
  return useQuery({
    queryKey: ["dashboard", "recentDeals"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("deals")
        .select("id, name, stage, amount, location, expected_close_date, updated_at")
        .not("stage", "in", EXCLUDED_STAGES)
        .is("deleted_at", null)
        .order("updated_at", { ascending: false })
        .limit(8);
      return (data ?? []) as Deal[];
    },
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ["dashboard", "recentActivities"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("activities")
        .select(
          "id, type, subject, created_at, deal_id, contact_id, deals(name), contacts(first_name, last_name, company_name, lead_status)",
        )
        .order("created_at", { ascending: false })
        .limit(8);
      return (data ?? []) as unknown as Activity[];
    },
  });
}
