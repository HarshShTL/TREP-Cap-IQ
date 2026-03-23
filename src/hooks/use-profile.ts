"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/query-keys";
import type { Profile } from "@/types";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    // TODO: REVERT AFTER SHOWCASE
    queryFn: async (): Promise<Profile | null> => {
      // TODO: REVERT AFTER SHOWCASE — replace this entire queryFn with the original Supabase auth check:
      // const supabase = createClient();
      // const { data: { user } } = await supabase.auth.getUser();
      // if (!user) return null;
      // const { data } = await supabase
      //   .from("profiles")
      //   .select("id, role, full_name")
      //   .eq("id", user.id)
      //   .maybeSingle();
      // return data as Profile | null;
      return {
        id: 'demo-123',
        email: 'demo@recapitaliq.com',
        role: 'super_admin',
        full_name: 'Demo User',
      } as unknown as Profile;
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
