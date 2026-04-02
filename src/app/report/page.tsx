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
  { value: "debris", label: "Debris/Obstruction", icon: "🪨" },
  { value: "signage", label: "Broken Signage", icon: "🪧" },
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

    // AI analysis
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
          // Default to Delhi coordinates
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

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });

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

      const res = await fetch("/api/report", {
        method: "POST",
        body: formData,
      });

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
    low: "#22C55E",
    medium: "#EAB308",
    high: "#F97316",
    critical: "#EF4444",
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <main className="flex-1 pt-20 pb-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-3xl p-10 text-center"
            >
              <div className="text-6xl mb-6">✅</div>
              <h2
                className="text-3xl font-bold text-white mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Report Submitted!
              </h2>
              <p className="text-[#94A3B8] mb-6">
                Thank you for making your roads safer. Your report is now being
                reviewed by municipal authorities.
              </p>
              {rewardPoints > 0 && (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] mb-6">
                  <span className="text-2xl">🏆</span>
                  <span className="text-[#F59E0B] font-semibold">
                    +{rewardPoints} points earned!
                  </span>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                    setImageFile(null);
                    setImagePreview(null);
                    setAiAnalysis(null);
                    setDescription("");
                    setCategory("");
                    setSeverity(5);
                  }}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold hover:scale-105 transition-transform"
                >
                  Report Another
                </button>
                <a
                  href="/map"
                  className="px-6 py-3 rounded-xl border border-[rgba(59,130,246,0.2)] text-[#94A3B8] font-semibold hover:bg-white/5 transition-colors"
                >
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1
              className="text-3xl sm:text-4xl font-bold text-white mb-3"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Report a <span className="gradient-text">Road Hazard</span>
            </h1>
            <p className="text-[#94A3B8] max-w-xl mx-auto">
              Snap a photo or describe the issue. Our AI will analyze the
              severity and map it for authorities.
            </p>
          </motion.div>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    step >= s
                      ? "bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white glow-primary"
                      : "bg-[rgba(30,41,59,0.6)] text-[#64748B] border border-[rgba(59,130,246,0.1)]"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-0.5 transition-colors duration-300 ${
                      step > s ? "bg-[#3B82F6]" : "bg-[rgba(59,130,246,0.1)]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP 1: Image Capture */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-3xl p-8"
              >
                <h2
                  className="text-xl font-semibold text-white mb-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  📸 Capture the Issue
                </h2>

                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[rgba(59,130,246,0.3)] rounded-2xl p-12 text-center cursor-pointer hover:border-[#3B82F6] hover:bg-[rgba(59,130,246,0.05)] transition-all duration-300"
                  >
                    <div className="text-5xl mb-4">📷</div>
                    <p className="text-white font-semibold mb-2">
                      Take a photo or upload
                    </p>
                    <p className="text-[#64748B] text-sm">
                      Click here or drag & drop an image
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Captured road issue"
                        className="w-full h-64 object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                          setAiAnalysis(null);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {analyzing && (
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)]">
                        <div className="w-5 h-5 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[#3B82F6] font-medium">
                          AI is analyzing the image...
                        </span>
                      </div>
                    )}

                    {aiAnalysis && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-xl bg-[rgba(30,41,59,0.8)] border border-[rgba(59,130,246,0.2)]"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">🤖</span>
                          <span className="text-sm font-semibold text-[#3B82F6]">
                            AI Analysis Complete
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-[#64748B]">Category:</span>
                            <span className="text-white ml-2 capitalize">
                              {aiAnalysis.category}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#64748B]">Severity:</span>
                            <span className="text-white ml-2">
                              {aiAnalysis.severity}/10
                            </span>
                          </div>
                          <div>
                            <span className="text-[#64748B]">Size:</span>
                            <span className="text-white ml-2">
                              {aiAnalysis.estimated_size}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#64748B]">Urgency:</span>
                            <span
                              className="ml-2 font-semibold capitalize"
                              style={{
                                color:
                                  urgencyColors[aiAnalysis.urgency] || "#fff",
                              }}
                            >
                              {aiAnalysis.urgency}
                            </span>
                          </div>
                        </div>
                        <p className="text-[#94A3B8] text-sm mt-3">
                          {aiAnalysis.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => {
                      getLocation();
                      setStep(2);
                    }}
                    className="text-[#94A3B8] hover:text-white transition-colors text-sm"
                  >
                    Skip photo →
                  </button>
                  <button
                    onClick={() => {
                      getLocation();
                      setStep(2);
                    }}
                    disabled={!imagePreview || analyzing}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Details */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-3xl p-8"
              >
                <h2
                  className="text-xl font-semibold text-white mb-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  📝 Describe the Issue
                </h2>

                <div className="space-y-5">
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                      Category
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={`p-3 rounded-xl text-center transition-all duration-200 ${
                            category === cat.value
                              ? "bg-[rgba(59,130,246,0.2)] border border-[#3B82F6] text-white"
                              : "bg-[rgba(30,41,59,0.5)] border border-transparent text-[#94A3B8] hover:bg-[rgba(30,41,59,0.8)]"
                          }`}
                        >
                          <div className="text-xl mb-1">{cat.icon}</div>
                          <div className="text-xs">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the road issue in detail..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-[rgba(15,23,42,0.8)] border border-[rgba(59,130,246,0.15)] text-white placeholder-[#64748B] resize-none"
                    />
                  </div>

                  {/* Severity Slider */}
                  <div>
                    <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                      Severity:{" "}
                      <span className="text-white font-bold">{severity}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={severity}
                      onChange={(e) => setSeverity(parseInt(e.target.value))}
                      className="w-full accent-[#3B82F6]"
                    />
                    <div className="flex justify-between text-xs text-[#64748B] mt-1">
                      <span>Minor</span>
                      <span>Moderate</span>
                      <span>Life-threatening</span>
                    </div>
                  </div>

                  {/* Name & Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Your Name (optional)
                      </label>
                      <input
                        type="text"
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Anonymous"
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(15,23,42,0.8)] border border-[rgba(59,130,246,0.15)] text-white placeholder-[#64748B]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                        Address / Landmark
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Near City Mall, MG Road..."
                        className="w-full px-4 py-3 rounded-xl bg-[rgba(15,23,42,0.8)] border border-[rgba(59,130,246,0.15)] text-white placeholder-[#64748B]"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.6)] border border-[rgba(59,130,246,0.1)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-[#64748B]">
                          📍 Location:
                        </span>
                        <span className="text-sm text-white ml-2">
                          {latitude.toFixed(4)}, {longitude.toFixed(4)}
                        </span>
                      </div>
                      <button
                        onClick={getLocation}
                        className="text-xs px-3 py-1.5 rounded-lg bg-[rgba(59,130,246,0.15)] text-[#3B82F6] hover:bg-[rgba(59,130,246,0.25)] transition-colors"
                      >
                        Refresh GPS
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!description}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Review →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Review & Submit */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass rounded-3xl p-8"
              >
                <h2
                  className="text-xl font-semibold text-white mb-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  ✅ Review & Submit
                </h2>

                <div className="space-y-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Issue preview"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.6)]">
                      <div className="text-xs text-[#64748B] mb-1">Category</div>
                      <div className="text-white capitalize font-medium">
                        {categories.find((c) => c.value === category)?.icon}{" "}
                        {category || "Other"}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.6)]">
                      <div className="text-xs text-[#64748B] mb-1">
                        Severity
                      </div>
                      <div className="text-white font-bold text-xl">
                        {severity}/10
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.6)]">
                    <div className="text-xs text-[#64748B] mb-1">
                      Description
                    </div>
                    <div className="text-white">{description}</div>
                  </div>

                  <div className="p-4 rounded-xl bg-[rgba(15,23,42,0.6)]">
                    <div className="text-xs text-[#64748B] mb-1">Location</div>
                    <div className="text-white">
                      {address || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="text-[#94A3B8] hover:text-white transition-colors"
                  >
                    ← Edit
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report 🚀"
                    )}
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
