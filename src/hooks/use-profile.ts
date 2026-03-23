"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Profile } from "@/types";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async (): Promise<Profile | null> => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from("profiles")
        .select("id, role, full_name")
        .eq("id", user.id)
        .maybeSingle();
      return data as Profile | null;
    },
  });
}

export function useIsAdmin(): boolean {
  const { data } = useProfile();
  return data?.role === "super_admin";
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles", "all"],
    queryFn: async (): Promise<Profile[]> => {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("id, role, full_name");
      return (data ?? []) as Profile[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
