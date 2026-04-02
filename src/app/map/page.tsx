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

const MapContainer = nextDynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = nextDynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const CircleMarker = nextDynamic(() => import("react-leaflet").then((m) => m.CircleMarker), { ssr: false });
const Popup = nextDynamic(() => import("react-leaflet").then((m) => m.Popup), { ssr: false });

const LeafletCSS = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
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

  const stats = useMemo(() => ({
    total: reports.length,
    critical: reports.filter((r) => r.severity_score >= 8).length,
    resolved: reports.filter((r) => r.status === "resolved").length,
  }), [reports]);

  const getMarkerColor = (report: Report) => {
    if (report.status === "resolved") return "#34C77B";
    if (report.severity_score >= 8) return "#FF5A5A";
    if (report.severity_score >= 5) return "#F5A623";
    return "#4A9FF5";
  };

  return (
    <>
      <Navbar />
      <LeafletCSS />
      <main className="flex-1 pt-16">
        <div className="glass-strong border-b border-[#E8F2FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1A2332]" style={{ fontFamily: "Space Grotesk" }}>
                  Road Health <span className="gradient-text">Map</span>
                </h1>
                <p className="text-[#8A9AB5] text-xs mt-1">Real-time road hazard visualization</p>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { color: "#4A9FF5", label: `${stats.total} Total` },
                  { color: "#FF5A5A", label: `${stats.critical} Critical` },
                  { color: "#34C77B", label: `${stats.resolved} Fixed` },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E8F2FF] text-xs">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[#5A6B82]">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 overflow-x-auto no-scrollbar">
              {statusFilters.map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition-all whitespace-nowrap ${
                    filter === s ? "bg-[#4A9FF5]/10 text-[#4A9FF5]" : "text-[#8A9AB5] hover:text-[#1A2332] hover:bg-[#4A9FF5]/5"
                  }`}>{s === "all" ? "All Reports" : s.replace("_", " ")}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)]">
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-[#F0F7FF]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-[#4A9FF5] border-t-transparent rounded-full animate-spin" />
                  <span className="text-[#8A9AB5] text-sm">Loading map...</span>
                </div>
              </div>
            ) : (
              <MapContainer center={[28.6139, 77.209]} zoom={12} className="h-full w-full z-0" style={{ background: "#F0F7FF" }}>
                <TileLayer attribution='&copy; <a href="https://carto.com">CARTO</a>' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                {filteredReports.map((report) => (
                  <CircleMarker key={report.id} center={[report.latitude, report.longitude]} radius={report.severity_score >= 8 ? 10 : 7}
                    pathOptions={{ color: getMarkerColor(report), fillColor: getMarkerColor(report), fillOpacity: 0.6, weight: 2 }}
                    eventHandlers={{ click: () => setSelectedReport(report) }}>
                    <Popup>
                      <div className="text-xs min-w-[160px]">
                        <div className="font-bold text-sm mb-1 capitalize">{report.category}</div>
                        <div className="mb-1 text-gray-600">{report.description}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${getStatusColor(report.status)}15`, color: getStatusColor(report.status) }}>{report.status}</span>
                          <span className="font-bold">{report.severity_score}/10</span>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            )}
            <div className="absolute bottom-4 left-4 z-[1000] card rounded-xl p-3">
              <div className="text-xs font-semibold text-[#1A2332] mb-2">Legend</div>
              <div className="space-y-1.5">
                {[{ color: "#FF5A5A", label: "Critical (8-10)" }, { color: "#F5A623", label: "Medium (5-7)" }, { color: "#4A9FF5", label: "Low (1-4)" }, { color: "#34C77B", label: "Resolved" }].map((i) => (
                  <div key={i.label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: i.color }} />
                    <span className="text-xs text-[#5A6B82]">{i.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-[#E8F2FF] bg-white/80 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-[#1A2332] mb-3">{selectedReport ? "Report Detail" : "Recent Reports"}</h3>
              {selectedReport ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                  <button onClick={() => setSelectedReport(null)} className="text-xs text-[#4A9FF5] hover:underline">← Back</button>
                  <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="capitalize font-semibold text-[#1A2332] text-sm">{selectedReport.category}</span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: `${getStatusColor(selectedReport.status)}15`, color: getStatusColor(selectedReport.status) }}>{selectedReport.status}</span>
                    </div>
                    <p className="text-xs text-[#5A6B82] mb-3">{selectedReport.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-white"><div className="text-[#8A9AB5]">Severity</div><div className="text-[#1A2332] font-bold">{selectedReport.severity_score}/10</div></div>
                      <div className="p-2 rounded-lg bg-white"><div className="text-[#8A9AB5]">Priority</div><div className="font-bold" style={{ color: getPriorityLabel(selectedReport.priority_score).color }}>{getPriorityLabel(selectedReport.priority_score).label}</div></div>
                      <div className="p-2 rounded-lg bg-white"><div className="text-[#8A9AB5]">Upvotes</div><div className="text-[#1A2332] font-bold">👍 {selectedReport.upvotes}</div></div>
                      <div className="p-2 rounded-lg bg-white"><div className="text-[#8A9AB5]">Reported</div><div className="text-[#1A2332] text-xs">{new Date(selectedReport.created_at).toLocaleDateString()}</div></div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {filteredReports.slice(0, 20).map((report) => (
                    <div key={report.id} onClick={() => setSelectedReport(report)}
                      className="p-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] cursor-pointer hover:bg-[#E8F2FF] transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#1A2332] capitalize">{report.category}</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getMarkerColor(report) }} />
                      </div>
                      <p className="text-xs text-[#5A6B82] line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[#8A9AB5]">Severity: {report.severity_score}/10</span>
                        <span className="text-xs capitalize" style={{ color: getStatusColor(report.status) }}>{report.status}</span>
                      </div>
                    </div>
                  ))}
                  {filteredReports.length === 0 && <div className="text-center py-8 text-[#8A9AB5] text-sm">No reports found</div>}
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
