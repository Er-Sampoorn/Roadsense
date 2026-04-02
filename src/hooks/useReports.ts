"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { Report } from "@/lib/types";

function getSupabase() {
  return createClient();
}

export function useReports(status?: string) {
  return useQuery<Report[]>({
    queryKey: ["reports", status],
    queryFn: async () => {
      let query = getSupabase()
        .from("reports")
        .select("*")
        .order("priority_score", { ascending: false });

      if (status && status !== "all") {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as Report[]) || [];
    },
  });
}

export function useReport(id: string) {
  return useQuery<Report>({
    queryKey: ["report", id],
    queryFn: async () => {
      const { data, error } = await getSupabase()
        .from("reports")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Report;
    },
    enabled: !!id,
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create report");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useUpdateReportStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Report["status"];
    }) => {
      const updateData: Record<string, unknown> = { status };
      if (status === "resolved") {
        updateData.resolved_at = new Date().toISOString();
      }

      const { data, error } = await getSupabase()
        .from("reports")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useUpvoteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await getSupabase().rpc("increment_upvotes", {
        report_id: id,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
}

export function useReportStats() {
  return useQuery({
    queryKey: ["report-stats"],
    queryFn: async () => {
      const { data: all } = await getSupabase()
        .from("reports")
        .select("id, status, severity_score, created_at, resolved_at");

      interface ReportRow {
        id: string;
        status: string;
        severity_score: number | null;
        created_at: string;
        resolved_at: string | null;
      }

      const reports = (all as ReportRow[]) || [];
      const total = reports.length;
      const pending = reports.filter((r) => r.status === "pending").length;
      const inProgress = reports.filter(
        (r) => r.status === "in_progress"
      ).length;
      const resolved = reports.filter((r) => r.status === "resolved").length;
      const critical = reports.filter(
        (r) => (r.severity_score ?? 0) >= 8
      ).length;

      const avgResolutionMs = reports
        .filter((r) => r.resolved_at)
        .map(
          (r) =>
            new Date(r.resolved_at!).getTime() -
            new Date(r.created_at).getTime()
        );

      const avgResolutionDays =
        avgResolutionMs.length > 0
          ? Math.round(
              avgResolutionMs.reduce((a, b) => a + b, 0) /
                avgResolutionMs.length /
                86400000
            )
          : 0;

      return { total, pending, inProgress, resolved, critical, avgResolutionDays };
    },
  });
}
