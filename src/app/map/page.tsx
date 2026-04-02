"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import nextDynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { useReports } from "@/hooks/useReports";
import { useRealtime } from "@/hooks/useRealtime";
import { getPriorityLabel, getStatusColor } from "@/lib/scoring";
import type { Report } from "@/lib/types";

// Leaflet must be loaded client-side only
const MapContainer = nextDynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = nextDynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const CircleMarker = nextDynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  { ssr: false }
);
const Popup = nextDynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);

// We'll need the CSS for leaflet
const LeafletCSS = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return null;
};

const statusFilters = ["all", "pending", "in_progress", "resolved", "rejected"];

export default function MapPage() {
  const [filter, setFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const { data: reports = [], isLoading } = useReports();
  useRealtime("reports");

  const filteredReports = useMemo(() => {
    if (filter === "all") return reports;
    return reports.filter((r) => r.status === filter);
  }, [reports, filter]);

  const stats = useMemo(() => {
    return {
      total: reports.length,
      critical: reports.filter((r) => r.severity_score >= 8).length,
      resolved: reports.filter((r) => r.status === "resolved").length,
    };
  }, [reports]);

  const getMarkerColor = (report: Report) => {
    if (report.status === "resolved") return "#22C55E";
    if (report.severity_score >= 8) return "#EF4444";
    if (report.severity_score >= 5) return "#F59E0B";
    return "#3B82F6";
  };

  return (
    <>
      <Navbar />
      <LeafletCSS />
      <main className="flex-1 pt-16">
        {/* Header Bar */}
        <div className="glass-strong border-b border-[rgba(59,130,246,0.1)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl font-bold text-white"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Road Health <span className="gradient-text">Map</span>
                </h1>
                <p className="text-[#64748B] text-sm mt-1">
                  Real-time road hazard visualization across your city
                </p>
              </div>

              {/* Stats Chips */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(30,41,59,0.6)] text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-[#94A3B8]">{stats.total} Total</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(30,41,59,0.6)] text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                  <span className="text-[#94A3B8]">
                    {stats.critical} Critical
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(30,41,59,0.6)] text-xs">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                  <span className="text-[#94A3B8]">
                    {stats.resolved} Fixed
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200 whitespace-nowrap ${
                    filter === s
                      ? "bg-[#3B82F6]/20 text-[#3B82F6]"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s === "all" ? "All Reports" : s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Map + Sidebar */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)]">
          {/* Map */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#94A3B8]">Loading map...</span>
                </div>
              </div>
            ) : (
              <MapContainer
                center={[28.6139, 77.209]}
                zoom={12}
                className="h-full w-full z-0"
                style={{ background: "#0A0E1A" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                {filteredReports.map((report) => (
                  <CircleMarker
                    key={report.id}
                    center={[report.latitude, report.longitude]}
                    radius={report.severity_score >= 8 ? 12 : 8}
                    pathOptions={{
                      color: getMarkerColor(report),
                      fillColor: getMarkerColor(report),
                      fillOpacity: 0.7,
                      weight: 2,
                    }}
                    eventHandlers={{
                      click: () => setSelectedReport(report),
                    }}
                  >
                    <Popup>
                      <div className="text-xs min-w-[180px]">
                        <div className="font-bold text-sm mb-1 capitalize">
                          {report.category}
                        </div>
                        <div className="mb-1">{report.description}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span
                            className="px-2 py-0.5 rounded text-xs font-bold"
                            style={{
                              backgroundColor: `${getStatusColor(report.status)}20`,
                              color: getStatusColor(report.status),
                            }}
                          >
                            {report.status}
                          </span>
                          <span className="font-bold">
                            {report.severity_score}/10
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 z-[1000] glass rounded-xl p-3">
              <div className="text-xs font-semibold text-white mb-2">
                Legend
              </div>
              <div className="space-y-1.5">
                {[
                  { color: "#EF4444", label: "Critical (8-10)" },
                  { color: "#F59E0B", label: "Medium (5-7)" },
                  { color: "#3B82F6", label: "Low (1-4)" },
                  { color: "#22C55E", label: "Resolved" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-[#94A3B8]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-[rgba(59,130,246,0.1)] bg-[rgba(10,14,26,0.95)] overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-white mb-3">
                {selectedReport ? "Report Detail" : "Recent Reports"}
              </h3>

              {selectedReport ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-xs text-[#3B82F6] hover:underline"
                  >
                    ← Back to list
                  </button>
                  <div className="p-4 rounded-xl bg-[rgba(30,41,59,0.6)] border border-[rgba(59,130,246,0.1)]">
                    <div className="flex items-center justify-between mb-3">
                      <span className="capitalize font-semibold text-white">
                        {selectedReport.category}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          backgroundColor: `${getStatusColor(selectedReport.status)}20`,
                          color: getStatusColor(selectedReport.status),
                        }}
                      >
                        {selectedReport.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#94A3B8] mb-3">
                      {selectedReport.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[rgba(15,23,42,0.5)]">
                        <div className="text-[#64748B]">Severity</div>
                        <div className="text-white font-bold">
                          {selectedReport.severity_score}/10
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-[rgba(15,23,42,0.5)]">
                        <div className="text-[#64748B]">Priority</div>
                        <div
                          className="font-bold"
                          style={{
                            color: getPriorityLabel(
                              selectedReport.priority_score
                            ).color,
                          }}
                        >
                          {
                            getPriorityLabel(selectedReport.priority_score)
                              .label
                          }
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-[rgba(15,23,42,0.5)]">
                        <div className="text-[#64748B]">Upvotes</div>
                        <div className="text-white font-bold">
                          👍 {selectedReport.upvotes}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-[rgba(15,23,42,0.5)]">
                        <div className="text-[#64748B]">Reported</div>
                        <div className="text-white text-xs">
                          {new Date(
                            selectedReport.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {filteredReports.slice(0, 20).map((report) => (
                    <div
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="p-3 rounded-xl bg-[rgba(30,41,59,0.4)] border border-[rgba(59,130,246,0.08)] cursor-pointer hover:bg-[rgba(30,41,59,0.7)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white capitalize">
                          {report.category}
                        </span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: getMarkerColor(report),
                          }}
                        />
                      </div>
                      <p className="text-xs text-[#94A3B8] line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#64748B]">
                          Severity: {report.severity_score}/10
                        </span>
                        <span
                          className="text-xs capitalize"
                          style={{
                            color: getStatusColor(report.status),
                          }}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {filteredReports.length === 0 && (
                    <div className="text-center py-8 text-[#64748B] text-sm">
                      No reports found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <ChatBot />
      <Footer />
    </>
  );
}
