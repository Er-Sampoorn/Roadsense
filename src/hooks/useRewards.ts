"use client";

import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { RewardEntry } from "@/lib/types";

const supabase = createClient();

export function useRewards(userId?: string) {
  return useQuery({
    queryKey: ["rewards", userId],
    queryFn: async () => {
      if (!userId) {
        return { entries: [], totalPoints: 0 };
      }

      const { data, error } = await supabase
        .from("rewards_ledger")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const entries = (data as RewardEntry[]) || [];
      const totalPoints = entries.reduce((sum, e) => sum + e.points, 0);

      return { entries, totalPoints };
    },
    enabled: !!userId,
  });
}

// For demo/public view without auth
export function usePublicRewardStats() {
  return useQuery({
    queryKey: ["reward-stats"],
    queryFn: async () => {
      const { count } = await supabase
        .from("rewards_ledger")
        .select("*", { count: "exact", head: true });

      return {
        totalRewardsIssued: count || 0,
        tiers: [
          { name: "Bronze Reporter", minPoints: 0, icon: "🥉", perks: ["Basic badge", "Report tracking"] },
          { name: "Silver Citizen", minPoints: 100, icon: "🥈", perks: ["Priority support", "Monthly digest"] },
          { name: "Gold Guardian", minPoints: 500, icon: "🥇", perks: ["Transit credits", "Early access"] },
          { name: "Platinum Sentinel", minPoints: 1000, icon: "💎", perks: ["City council invite", "VIP events"] },
        ],
      };
    },
  });
}
