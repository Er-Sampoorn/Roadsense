"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useRealtime(table: string = "reports") {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table },
        () => {
          // Invalidate all queries related to this table
          queryClient.invalidateQueries({ queryKey: [table] });
          queryClient.invalidateQueries({ queryKey: ["report-stats"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, queryClient, supabase]);
}
