"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/chatbot/ChatBot";
import { compressImage, fileToBase64 } from "@/lib/image-compress";
import { analyzeRoadImage } from "@/lib/gemini";
import type { AIAnalysis } from "@/lib/types";

const categories = [
  { value: "pothole", label: "Pothole", icon: "🕳️" },
  { value: "crack", label: "Road Crack", icon: "⚡" },
  { value: "waterlogging", label: "Waterlogging", icon: "💧" },
  { value: "debris", label: "Debris", icon: "🪨" },
  { value: "signage", label: "Broken Sign", icon: "🪧" },
  { value: "other", label: "Other", icon: "📋" },
];

export default function ReportPage() {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState(5);
  const [reporterName, setReporterName] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(28.6139);
  const [longitude, setLongitude] = useState(77.209);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = useCallback(async (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setAnalyzing(true);
    try {
      const compressed = await compressImage(file);
      const base64 = await fileToBase64(compressed);
      const analysis = await analyzeRoadImage(base64, file.type);
      setAiAnalysis(analysis);
      setCategory(analysis.category);
      setSeverity(analysis.severity);
      setDescription(analysis.description);
    } catch (err) {
      console.error("AI analysis failed:", err);
    } finally {
      setAnalyzing(false);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageCapture(file);
    },
    [handleImageCapture]
  );

  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          setLatitude(28.6139);
          setLongitude(77.209);
        }
      );
    }
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadData = new FormData();
        const compressed = await compressImage(imageFile);
        uploadData.append("file", compressed);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          imageUrl = url;
        }
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());
      formData.append("category", category || "other");
      formData.append("severity", severity.toString());
      formData.append("ai_summary", aiAnalysis?.description || "");
      formData.append("image_url", imageUrl);
      formData.append("reporter_name", reporterName || "Anonymous");
      formData.append("address", address);

      const res = await fetch("/api/report", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setRewardPoints(data.rewardPoints || 0);
        setSubmitted(true);
      }
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const urgencyColors: Record<string, string> = {
    low: "#34C77B",
    medium: "#F5A623",
    high: "#FF8C42",
    critical: "#FF5A5A",
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card rounded-3xl p-10 text-center"
            >
              <div className="text-6xl mb-6">✅</div>
              <h2
                className="text-2xl font-bold text-[#1A2332] mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Report Submitted!
              </h2>
              <p className="text-[#5A6B82] mb-6">
                Thank you for making your roads safer.
              </p>
              {rewardPoints > 0 && (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF8C42]/10 border border-[#FF8C42]/20 mb-6">
                  <span className="text-2xl">🏆</span>
                  <span className="text-[#FF8C42] font-semibold">
                    +{rewardPoints} points earned!
                  </span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    setSubmitted(false); setStep(1); setImageFile(null);
                    setImagePreview(null); setAiAnalysis(null);
                    setDescription(""); setCategory(""); setSeverity(5);
                  }}
                  className="btn-primary text-sm"
                >
                  Report Another
                </button>
                <a href="/map" className="btn-outline text-sm">
                  View Map
                </a>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A2332] mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Report a <span className="gradient-text">Road Hazard</span>
            </h1>
            <p className="text-[#5A6B82] max-w-lg mx-auto text-sm">
              Snap a photo or describe the issue. Our AI analyzes severity and maps it for authorities.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step >= s
                    ? "bg-gradient-to-r from-[#4A9FF5] to-[#3585DB] text-white shadow-sm"
                    : "bg-[#F5F9FF] text-[#8A9AB5] border border-[#E8F2FF]"
                }`}>
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-0.5 transition-colors duration-300 ${step > s ? "bg-[#4A9FF5]" : "bg-[#E8F2FF]"}`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1 */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="card rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#1A2332] mb-5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  📸 Capture the Issue
                </h2>
                {!imagePreview ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-[#4A9FF5]/20 rounded-2xl p-10 text-center cursor-pointer hover:border-[#4A9FF5]/40 hover:bg-[#4A9FF5]/3 transition-all duration-300">
                    <div className="text-4xl mb-3">📷</div>
                    <p className="text-[#1A2332] font-semibold mb-1 text-sm">Take a photo or upload</p>
                    <p className="text-[#8A9AB5] text-xs">Click here or drag & drop an image</p>
                    <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} className="hidden" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img src={imagePreview} alt="Captured" className="w-full h-56 object-cover" />
                      <button onClick={() => { setImagePreview(null); setImageFile(null); setAiAnalysis(null); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition text-sm">✕</button>
                    </div>
                    {analyzing && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#4A9FF5]/5 border border-[#4A9FF5]/10">
                        <div className="w-4 h-4 border-2 border-[#4A9FF5] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#4A9FF5] text-sm font-medium">AI is analyzing...</span>
                      </div>
                    )}
                    {aiAnalysis && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-base">🤖</span>
                          <span className="text-xs font-semibold text-[#4A9FF5]">AI Analysis Complete</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-[#8A9AB5] text-xs">Category:</span><span className="text-[#1A2332] ml-2 capitalize text-xs font-medium">{aiAnalysis.category}</span></div>
                          <div><span className="text-[#8A9AB5] text-xs">Severity:</span><span className="text-[#1A2332] ml-2 text-xs font-medium">{aiAnalysis.severity}/10</span></div>
                          <div><span className="text-[#8A9AB5] text-xs">Size:</span><span className="text-[#1A2332] ml-2 text-xs font-medium">{aiAnalysis.estimated_size}</span></div>
                          <div><span className="text-[#8A9AB5] text-xs">Urgency:</span><span className="ml-2 font-semibold capitalize text-xs" style={{ color: urgencyColors[aiAnalysis.urgency] || "#1A2332" }}>{aiAnalysis.urgency}</span></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between mt-6">
                  <button onClick={() => { getLocation(); setStep(2); }} className="text-[#8A9AB5] hover:text-[#1A2332] transition-colors text-sm">Skip photo →</button>
                  <button onClick={() => { getLocation(); setStep(2); }} disabled={!imagePreview || analyzing} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">Next Step →</button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="card rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#1A2332] mb-5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>📝 Describe the Issue</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-[#5A6B82] mb-2">Category</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {categories.map((cat) => (
                        <button key={cat.value} onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-xl text-center transition-all duration-200 ${category === cat.value ? "bg-[#4A9FF5]/10 border border-[#4A9FF5]/30 text-[#1A2332]" : "bg-[#F5F9FF] border border-[#E8F2FF] text-[#5A6B82] hover:bg-[#4A9FF5]/5"}`}>
                          <div className="text-lg mb-0.5">{cat.icon}</div>
                          <div className="text-[11px] font-medium">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A6B82] mb-2">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the road issue..." rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] text-[#1A2332] placeholder-[#A0B1C9] resize-none text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#5A6B82] mb-2">
                      Severity: <span className="text-[#1A2332] font-bold">{severity}/10</span>
                    </label>
                    <input type="range" min="1" max="10" value={severity} onChange={(e) => setSeverity(parseInt(e.target.value))} className="w-full accent-[#4A9FF5]" />
                    <div className="flex justify-between text-xs text-[#8A9AB5] mt-1"><span>Minor</span><span>Moderate</span><span>Critical</span></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#5A6B82] mb-2">Your Name (optional)</label>
                      <input type="text" value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Anonymous"
                        className="w-full px-4 py-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] text-[#1A2332] placeholder-[#A0B1C9] text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#5A6B82] mb-2">Address / Landmark</label>
                      <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Near City Mall..."
                        className="w-full px-4 py-3 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF] text-[#1A2332] placeholder-[#A0B1C9] text-sm" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                    <div className="flex items-center justify-between">
                      <div><span className="text-xs text-[#8A9AB5]">📍 Location:</span><span className="text-xs text-[#1A2332] ml-2 font-medium">{latitude.toFixed(4)}, {longitude.toFixed(4)}</span></div>
                      <button onClick={getLocation} className="text-xs px-3 py-1.5 rounded-lg bg-[#4A9FF5]/10 text-[#4A9FF5] hover:bg-[#4A9FF5]/15 transition-colors font-medium">Refresh GPS</button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button onClick={() => setStep(1)} className="text-[#8A9AB5] hover:text-[#1A2332] transition-colors text-sm">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!description} className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed">Review →</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }} className="card rounded-2xl p-6 sm:p-8">
                <h2 className="text-lg font-semibold text-[#1A2332] mb-5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>✅ Review & Submit</h2>
                <div className="space-y-4">
                  {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover rounded-xl" />}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-[#F5F9FF]">
                      <div className="text-xs text-[#8A9AB5] mb-1">Category</div>
                      <div className="text-[#1A2332] capitalize font-medium text-sm">{categories.find((c) => c.value === category)?.icon} {category || "Other"}</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F5F9FF]">
                      <div className="text-xs text-[#8A9AB5] mb-1">Severity</div>
                      <div className="text-[#1A2332] font-bold text-xl">{severity}/10</div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F9FF]">
                    <div className="text-xs text-[#8A9AB5] mb-1">Description</div>
                    <div className="text-[#1A2332] text-sm">{description}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F9FF]">
                    <div className="text-xs text-[#8A9AB5] mb-1">Location</div>
                    <div className="text-[#1A2332] text-sm">{address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button onClick={() => setStep(2)} className="text-[#8A9AB5] hover:text-[#1A2332] transition-colors text-sm">← Edit</button>
                  <button onClick={handleSubmit} disabled={submitting}
                    className="px-7 py-3 rounded-xl bg-gradient-to-r from-[#34C77B] to-[#28A864] text-white font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-50 flex items-center gap-2">
                    {submitting ? (<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>) : ("Submit Report 🚀")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <ChatBot />
      <Footer />
    </>
  );
}
