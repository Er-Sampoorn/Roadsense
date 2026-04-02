"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReports, useReportStats, useUpdateReportStatus } from "@/hooks/useReports";
import { useRealtime } from "@/hooks/useRealtime";
import { getPriorityLabel, getStatusColor } from "@/lib/scoring";
import type { Report } from "@/lib/types";

const statusOptions: Report["status"][] = [
  "pending",
  "in_progress",
  "resolved",
  "rejected",
];

export default function AdminPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "date" | "severity">(
    "priority"
  );
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const { data: reports = [], isLoading } = useReports();
  const { data: stats } = useReportStats();
  const updateStatus = useUpdateReportStatus();
  useRealtime("reports");

  const filteredAndSorted = useMemo(() => {
    let filtered = reports;
    if (filterStatus !== "all") {
      filtered = reports.filter((r) => r.status === filterStatus);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "priority":
          return b.priority_score - a.priority_score;
        case "severity":
          return b.severity_score - a.severity_score;
        case "date":
          return (
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });
  }, [reports, filterStatus, sortBy]);

  const handleStatusChange = (id: string, status: Report["status"]) => {
    updateStatus.mutate({ id, status });
    if (selectedReport?.id === id) {
      setSelectedReport({ ...selectedReport, status });
    }
  };

  const statCards = [
    {
      label: "Total Reports",
      value: stats?.total || 0,
      icon: "📋",
      color: "#3B82F6",
    },
    {
      label: "Pending Review",
      value: stats?.pending || 0,
      icon: "⏳",
      color: "#F59E0B",
    },
    {
      label: "In Progress",
      value: stats?.inProgress || 0,
      icon: "🔧",
      color: "#8B5CF6",
    },
    {
      label: "Resolved",
      value: stats?.resolved || 0,
      icon: "✅",
      color: "#22C55E",
    },
    {
      label: "Critical",
      value: stats?.critical || 0,
      icon: "🚨",
      color: "#EF4444",
    },
    {
      label: "Avg Resolution",
      value: `${stats?.avgResolutionDays || 0}d`,
      icon: "📊",
      color: "#06B6D4",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8"
          >
            <div>
              <h1
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-[#64748B] text-sm">
                Municipal report management and analytics
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-xs text-[#64748B]">
                Real-time updates active
              </span>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
          >
            {statCards.map((card) => (
              <div
                key={card.label}
                className="glass rounded-xl p-4 text-center hover:bg-card-hover transition-colors"
              >
                <div className="text-xl mb-1">{card.icon}</div>
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: card.color,
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  {card.value}
                </div>
                <div className="text-xs text-[#64748B] mt-1">{card.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Filters & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {["all", ...statusOptions].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 whitespace-nowrap ${
                    filterStatus === s
                      ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s === "all" ? "All" : s.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#64748B]">Sort:</span>
              {(["priority", "severity", "date"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                    sortBy === s
                      ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Table / Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Table */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSorted.map((report) => (
                    <motion.div
                      key={report.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setSelectedReport(report)}
                      className={`glass rounded-xl p-4 cursor-pointer transition-all duration-200 hover:bg-[rgba(30,41,59,0.8)] ${
                        selectedReport?.id === report.id
                          ? "border-[rgba(59,130,246,0.4)] ring-1 ring-[rgba(59,130,246,0.2)]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{
                              backgroundColor:
                                report.severity_score >= 8
                                  ? "#EF4444"
                                  : report.severity_score >= 5
                                  ? "#F59E0B"
                                  : "#3B82F6",
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white capitalize">
                                {report.category}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded text-xs font-bold"
                                style={{
                                  backgroundColor: `${getPriorityLabel(report.priority_score).color}20`,
                                  color: getPriorityLabel(
                                    report.priority_score
                                  ).color,
                                }}
                              >
                                {
                                  getPriorityLabel(report.priority_score)
                                    .label
                                }
                              </span>
                            </div>
                            <p className="text-xs text-[#94A3B8] truncate mt-0.5">
                              {report.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-xs text-[#64748B] hidden sm:block">
                            {new Date(
                              report.created_at
                            ).toLocaleDateString()}
                          </span>
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(
                                report.id,
                                e.target.value as Report["status"]
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-[rgba(15,23,42,0.8)] border border-[rgba(59,130,246,0.15)] text-white cursor-pointer"
                            style={{ color: getStatusColor(report.status) }}
                          >
                            {statusOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt.replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredAndSorted.length === 0 && (
                    <div className="text-center py-20 text-[#64748B]">
                      <div className="text-4xl mb-3">📭</div>
                      <p>No reports found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedReport && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-96 glass rounded-2xl p-6 h-fit sticky top-24"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Report Detail
                  </h3>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="w-6 h-6 rounded-full bg-white/5 text-[#94A3B8] flex items-center justify-center hover:bg-white/10 text-sm"
                  >
                    ✕
                  </button>
                </div>

                {selectedReport.image_url && (
                  <img
                    src={selectedReport.image_url}
                    alt="Report"
                    className="w-full h-40 object-cover rounded-xl mb-4"
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white capitalize">
                      {selectedReport.category}
                    </span>
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-bold"
                      style={{
                        backgroundColor: `${getStatusColor(selectedReport.status)}20`,
                        color: getStatusColor(selectedReport.status),
                      }}
                    >
                      {selectedReport.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-sm text-[#94A3B8]">
                    {selectedReport.description}
                  </p>

                  {selectedReport.ai_summary && (
                    <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.08)] border border-[rgba(59,130,246,0.1)]">
                      <div className="text-xs font-semibold text-[#3B82F6] mb-1">
                        🤖 AI Summary
                      </div>
                      <p className="text-xs text-[#94A3B8]">
                        {selectedReport.ai_summary}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                      <div className="text-xs text-[#64748B]">Severity</div>
                      <div className="text-white font-bold text-lg">
                        {selectedReport.severity_score}/10
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                      <div className="text-xs text-[#64748B]">Priority</div>
                      <div
                        className="font-bold text-lg"
                        style={{
                          color: getPriorityLabel(
                            selectedReport.priority_score
                          ).color,
                        }}
                      >
                        {selectedReport.priority_score}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                      <div className="text-xs text-[#64748B]">Reporter</div>
                      <div className="text-white text-sm">
                        {selectedReport.reporter_name || "Anonymous"}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                      <div className="text-xs text-[#64748B]">Upvotes</div>
                      <div className="text-white font-bold text-lg">
                        👍 {selectedReport.upvotes}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                    <div className="text-xs text-[#64748B]">Location</div>
                    <div className="text-white text-sm">
                      {selectedReport.address ||
                        `${selectedReport.latitude.toFixed(4)}, ${selectedReport.longitude.toFixed(4)}`}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[rgba(15,23,42,0.5)]">
                    <div className="text-xs text-[#64748B]">Reported</div>
                    <div className="text-white text-sm">
                      {new Date(
                        selectedReport.created_at
                      ).toLocaleString()}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="pt-3 border-t border-[rgba(59,130,246,0.1)]">
                    <div className="text-xs text-[#64748B] mb-2">
                      Update Status
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            handleStatusChange(selectedReport.id, s)
                          }
                          disabled={selectedReport.status === s}
                          className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                            selectedReport.status === s
                              ? "bg-[rgba(59,130,246,0.2)] text-[#3B82F6] cursor-default"
                              : "bg-[rgba(30,41,59,0.5)] text-[#94A3B8] hover:bg-[rgba(30,41,59,0.8)] hover:text-white"
                          }`}
                        >
                          {s.replace("_", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
