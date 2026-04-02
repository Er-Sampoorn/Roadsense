"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage } from "@/lib/types";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm RoadSense AI. I can help you report road issues, check area safety, or answer questions. Try me in any language!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.response || "Sorry, I couldn't process that.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "⚠️ Connection error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-[#4A9FF5] to-[#3585DB] text-white flex items-center justify-center shadow-lg glow-primary hover:scale-110 transition-transform"
        whileTap={{ scale: 0.9 }}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] bg-white rounded-2xl flex flex-col overflow-hidden shadow-xl border border-[#E8F2FF]"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E8F2FF] flex items-center gap-3 bg-[#F5F9FF]">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4A9FF5] to-[#3585DB] flex items-center justify-center">
                <span className="text-base">🤖</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A2332]" style={{ fontFamily: "Space Grotesk, sans-serif" }}>RoadSense AI</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C77B] animate-pulse" />
                  <span className="text-xs text-[#8A9AB5]">Online • Multilingual</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar bg-[#FAFCFF]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-[#4A9FF5] to-[#3585DB] text-white rounded-br-md"
                        : "bg-white text-[#1A2332] border border-[#E8F2FF] rounded-bl-md shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E8F2FF] px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-[#4A9FF5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-[#4A9FF5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-[#4A9FF5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-[#E8F2FF]">
              {["Report pothole", "Area safety?", "My rewards"].map((q) => (
                <button key={q} onClick={() => { setInput(q); setTimeout(() => sendMessage(), 0); }}
                  className="flex-shrink-0 px-3 py-1 rounded-full bg-[#4A9FF5]/8 text-[#4A9FF5] text-xs font-medium hover:bg-[#4A9FF5]/15 transition-colors border border-[#4A9FF5]/10">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-4 pb-4 pt-2">
              <div className="flex items-center gap-2 p-1.5 rounded-xl bg-[#F5F9FF] border border-[#E8F2FF]">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type in any language..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm text-[#1A2332] placeholder-[#A0B1C9] outline-none border-none"
                  style={{ boxShadow: "none" }}
                />
                <button onClick={sendMessage} disabled={!input.trim() || isTyping}
                  className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#4A9FF5] to-[#3585DB] text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-40 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
