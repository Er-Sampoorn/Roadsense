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

const statusOptions: Report["status"][] = ["pending", "in_progress", "resolved", "rejected"];

export default function AdminPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"priority" | "date" | "severity">("priority");
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
        case "priority": return b.priority_score - a.priority_score;
        case "severity": return b.severity_score - a.severity_score;
        case "date": return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return 0;
      }
    });
  }, [reports, filterStatus, sortBy]);

  const handleStatusChange = (id: string, status: Report["status"]) => {
    updateStatus.mutate({ id, status });
    if (selectedReport?.id === id) setSelectedReport({ ...selectedReport, status });
  };

  const statCards = [
    { label: "Total Reports", value: stats?.total || 0, icon: "📋", color: "#4A9FF5" },
    { label: "Pending", value: stats?.pending || 0, icon: "⏳", color: "#F5A623" },
    { label: "In Progress", value: stats?.inProgress || 0, icon: "🔧", color: "#8B5CF6" },
    { label: "Resolved", value: stats?.resolved || 0, icon: "✅", color: "#34C77B" },
    { label: "Critical", value: stats?.critical || 0, icon: "🚨", color: "#FF5A5A" },
    { label: "Avg Resolution", value: `${stats?.avgResolutionDays || 0}d`, icon: "📊", color: "#06B6D4" },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2332] mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-[#8A9AB5] text-sm">Municipal report management</p>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <span className="w-2 h-2 rounded-full bg-[#34C77B] animate-pulse" />
              <span className="text-xs text-[#8A9AB5]">Real-time updates</span>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {statCards.map((card) => (
              <div key={card.label} className="card rounded-xl p-4 text-center">
                <div className="text-lg mb-1">{card.icon}</div>
                <div className="text-2xl font-bold" style={{ color: card.color, fontFamily: "Space Grotesk, sans-serif" }}>{card.value}</div>
                <div className="text-[11px] text-[#8A9AB5] mt-0.5">{card.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {["all", ...statusOptions].map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition-all duration-200 whitespace-nowrap ${
                    filterStatus === s ? "bg-[#4A9FF5]/10 text-[#4A9FF5]" : "text-[#8A9AB5] hover:text-[#1A2332] hover:bg-[#4A9FF5]/5"
                  }`}>{s === "all" ? "All" : s.replace("_", " ")}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8A9AB5]">Sort:</span>
              {(["priority", "severity", "date"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                    sortBy === s ? "bg-[#4A9FF5]/10 text-[#4A9FF5]" : "text-[#8A9AB5] hover:text-[#1A2332]"
                  }`}>{s}</button>
              ))}
            </div>
          </div>

          {/* Reports */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-5 h-5 border-2 border-[#4A9FF5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredAndSorted.map((report) => (
                    <div key={report.id} onClick={() => setSelectedReport(report)}
                      className={`card rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedReport?.id === report.id ? "border-[#4A9FF5]/30 ring-1 ring-[#4A9FF5]/15" : ""
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: report.severity_score >= 8 ? "#FF5A5A" : report.severity_score >= 5 ? "#F5A623" : "#4A9FF5" }} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#1A2332] capitalize">{report.category}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                                style={{ backgroundColor: `${getPriorityLabel(report.priority_score).color}15`, color: getPriorityLabel(report.priority_score).color }}>
                                {getPriorityLabel(report.priority_score).label}
                              </span>
                            </div>
                            <p className="text-xs text-[#8A9AB5] truncate mt-0.5">{report.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className="text-xs text-[#8A9AB5] hidden sm:block">{new Date(report.created_at).toLocaleDateString()}</span>
                          <select value={report.status}
                            onChange={(e) => handleStatusChange(report.id, e.target.value as Report["status"])}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 rounded-lg text-xs font-medium bg-[#F5F9FF] border border-[#E8F2FF] text-[#1A2332] cursor-pointer"
                            style={{ color: getStatusColor(report.status) }}>
                            {statusOptions.map((opt) => (<option key={opt} value={opt}>{opt.replace("_", " ")}</option>))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredAndSorted.length === 0 && (
                    <div className="text-center py-16 text-[#8A9AB5]">
                      <div className="text-3xl mb-3">📭</div><p className="text-sm">No reports found</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Detail Panel */}
            {selectedReport && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="w-full lg:w-96 card rounded-2xl p-6 h-fit sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-[#1A2332]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Report Detail</h3>
                  <button onClick={() => setSelectedReport(null)} className="w-6 h-6 rounded-full bg-[#F5F9FF] text-[#8A9AB5] flex items-center justify-center hover:bg-[#E8F2FF] text-xs">✕</button>
                </div>
                {selectedReport.image_url && <img src={selectedReport.image_url} alt="Report" className="w-full h-36 object-cover rounded-xl mb-4" />}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#1A2332] capitalize">{selectedReport.category}</span>
                    <span className="px-3 py-1 rounded-lg text-xs font-bold" style={{ backgroundColor: `${getStatusColor(selectedReport.status)}15`, color: getStatusColor(selectedReport.status) }}>
                      {selectedReport.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-[#5A6B82]">{selectedReport.description}</p>
                  {selectedReport.ai_summary && (
                    <div className="p-3 rounded-lg bg-[#4A9FF5]/5 border border-[#4A9FF5]/10">
                      <div className="text-xs font-semibold text-[#4A9FF5] mb-1">🤖 AI Summary</div>
                      <p className="text-xs text-[#5A6B82]">{selectedReport.ai_summary}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-lg bg-[#F5F9FF]"><div className="text-xs text-[#8A9AB5]">Severity</div><div className="text-[#1A2332] font-bold text-lg">{selectedReport.severity_score}/10</div></div>
                    <div className="p-3 rounded-lg bg-[#F5F9FF]"><div className="text-xs text-[#8A9AB5]">Priority</div><div className="font-bold text-lg" style={{ color: getPriorityLabel(selectedReport.priority_score).color }}>{selectedReport.priority_score}</div></div>
                    <div className="p-3 rounded-lg bg-[#F5F9FF]"><div className="text-xs text-[#8A9AB5]">Reporter</div><div className="text-[#1A2332] text-sm">{selectedReport.reporter_name || "Anonymous"}</div></div>
                    <div className="p-3 rounded-lg bg-[#F5F9FF]"><div className="text-xs text-[#8A9AB5]">Upvotes</div><div className="text-[#1A2332] font-bold text-lg">👍 {selectedReport.upvotes}</div></div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F5F9FF]">
                    <div className="text-xs text-[#8A9AB5]">Location</div>
                    <div className="text-[#1A2332] text-sm">{selectedReport.address || `${selectedReport.latitude.toFixed(4)}, ${selectedReport.longitude.toFixed(4)}`}</div>
                  </div>
                  <div className="pt-3 border-t border-[#E8F2FF]">
                    <div className="text-xs text-[#8A9AB5] mb-2">Update Status</div>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((s) => (
                        <button key={s} onClick={() => handleStatusChange(selectedReport.id, s)} disabled={selectedReport.status === s}
                          className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all duration-200 ${
                            selectedReport.status === s ? "bg-[#4A9FF5]/10 text-[#4A9FF5] cursor-default" : "bg-[#F5F9FF] text-[#5A6B82] hover:bg-[#E8F2FF] hover:text-[#1A2332]"
                          }`}>{s.replace("_", " ")}</button>
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
