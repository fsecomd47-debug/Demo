"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Bot,
  User,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/design-system";
import { initWebsiteAPI } from "@/lib/website-api";
import { useVoice } from "@/hooks/use-voice";

const funcRegex = /\{function:([^|]+)(?:\|([^}]+))?\}/g;

function stripFunctions(text: string): string {
  return text.replace(funcRegex, "").trim();
}

function renderMessageContent(text: string) {
  const parts = text.split(/(https?:\/\/[^\s]+|#booking)/g);
  return parts.map((part, i) => {
    if (part === "#booking") {
      return <a key={i} href="#booking" className="text-[#00B5C8] underline font-medium hover:text-[#00B5C8]/80 transition-colors">book online</a>;
    }
    if (part.startsWith("http")) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-[#00B5C8] underline font-medium hover:text-[#00B5C8]/80 transition-colors">{part}</a>;
    }
    return part;
  });
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const quickReplies = [
  "What services do you offer?",
  "What are your working hours?",
  "How do I book an appointment?",
  "Do you accept insurance?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome to Panthi Dental Clinic! I'm AI assistant. Ask me anything about our services, pricing, or book an appointment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [onCall, setOnCall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const callTimerRef = useRef<any>(null);
  const processedFuncs = useRef<Set<number>>(new Set());

  const voice = useVoice();

  const conversationRef = useRef(false);
  const callHistoryRef = useRef<Message[]>([]);
  const silenceCountRef = useRef(0);

  const VOICE_ALLOWED_FUNCTIONS = new Set([
    "type", "fillForm", "navigate", "scrollToSection", "openBooking",
    "highlight", "focus", "select", "nextBookingStep", "prevBookingStep",
    "submitBooking", "playConfetti", "callClinic", "openGoogleMaps",
    "openWhatsApp", "showToast",
  ]);

  const executeFunctionMarkers = useCallback(async (text: string) => {
    const matches = text.matchAll(funcRegex);
    for (const match of matches) {
      if (!conversationRef.current) break;
      const [, name, argsStr] = match;
      if (!VOICE_ALLOWED_FUNCTIONS.has(name)) continue;
      const args = argsStr ? argsStr.split("|") : [];
      const fn = (window as any).website?.[name];
      if (typeof fn === "function") {
        try { fn(...args); } catch {}
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }, []);

  const startConversation = useCallback(async () => {
    voice.interrupt();
    await voice.getToken();
    conversationRef.current = true;
    callHistoryRef.current = [];
    silenceCountRef.current = 0;

    await voice.speakText("Hello! Welcome to Panthi Dental Clinic. How can I help you today?");

    while (conversationRef.current) {
      const transcript = await voice.startListening();
      if (!conversationRef.current) break;

      if (!transcript) {
        if (voice.isMutedSync()) {
          await new Promise((r) => setTimeout(r, 300));
          continue;
        }
        silenceCountRef.current++;
        if (silenceCountRef.current >= 3 && conversationRef.current) {
          await voice.speakText("Are you still there? If you need help, just let me know.");
          silenceCountRef.current = 0;
        }
        continue;
      }

      silenceCountRef.current = 0;
      callHistoryRef.current.push({ role: "user", content: transcript });

      let retries = 0;
      let rawReply = "";
      while (retries < 2 && conversationRef.current) {
        try {
          const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: transcript,
              history: callHistoryRef.current.slice(-8),
              voice: true,
            }),
          });
          const data = await res.json();
          rawReply = data.reply || "Please call us at 984-7857569 for assistance.";
          break;
        } catch {
          retries++;
          if (retries >= 2 || !conversationRef.current) {
            rawReply = "";
          } else {
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }

      if (!rawReply) {
        if (conversationRef.current) {
          await voice.speakText("I'm having trouble connecting. Please try again.");
        }
        continue;
      }

      callHistoryRef.current.push({ role: "assistant", content: rawReply });
      await executeFunctionMarkers(rawReply);

      if (!conversationRef.current) break;

      const cleanReply = stripFunctions(rawReply);
      if (cleanReply) {
        const bargeIn = await voice.speakWithBargeIn(cleanReply);
        if (bargeIn) {
          silenceCountRef.current = 0;
          callHistoryRef.current.push({ role: "user", content: bargeIn });
        }
      }
    }
  }, [voice, executeFunctionMarkers]);

  const stopVoice = useCallback(() => {
    conversationRef.current = false;
    voice.interrupt();
  }, [voice]);

  useEffect(() => {
    if (onCall) {
      startConversation();
    } else {
      stopVoice();
    }
    return () => { stopVoice(); };
  }, [onCall]);

  useEffect(() => { initWebsiteAPI(); }, []);

  useEffect(() => { silenceCountRef.current = 0; }, [muted]);

  const ALLOWED_FUNCTIONS = new Set([
    "type", "fillForm", "navigate", "scrollToSection", "openBooking",
    "highlight", "focus", "select", "nextBookingStep", "prevBookingStep",
    "submitBooking", "playConfetti", "callClinic", "openGoogleMaps",
    "openWhatsApp", "showToast", "startVoice", "stopVoice",
  ]);

  useEffect(() => {
    for (let i = 0; i < messages.length; i++) {
      if (processedFuncs.current.has(i)) continue;
      const msg = messages[i];
      if (msg.role !== "assistant") continue;
      const matches = msg.content.matchAll(funcRegex);
      let hasCall = false;
      for (const match of matches) {
        hasCall = true;
        const [, name, argsStr] = match;
        if (!ALLOWED_FUNCTIONS.has(name)) continue;
        const args = argsStr ? argsStr.split("|") : [];
        const fn = (window as any).website?.[name];
        if (typeof fn === "function") {
          setTimeout(() => { try { fn(...args); } catch {} }, 0);
        }
      }
      if (hasCall) processedFuncs.current.add(i);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (onCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current !== null) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => { if (callTimerRef.current !== null) clearInterval(callTimerRef.current); };
  }, [onCall]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or call us directly." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (onCall) {
      setOnCall(false);
      setVoiceMode(false);
      return;
    }
    setVoiceMode(true);
  };

  const voiceStatusText = voice.isMuted ? "Muted" : voice.isListening ? "Listening..." : voice.isProcessing ? "AI is thinking..." : voice.isSpeaking ? "Speaking..." : "";

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300",
          open ? "bg-[#EF4444] hover:bg-[#DC2626]" : "bg-[#0F172A] hover:bg-[#1e293b]"
        )}
      >
        {open ? <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />}
      </motion.button>

      {/* Mobile backdrop blur */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              onClick={() => setOpen(false)}
            />
            <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed z-50 rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-[rgba(0,0,0,0.06)] overflow-hidden",
              "bottom-20 sm:bottom-24",
              "left-2 right-2 sm:left-auto sm:right-4 sm:origin-bottom-right",
              "sm:w-80 md:w-96 max-w-md"
            )}
          >
            {voiceMode && onCall ? (
              /* ===== REAL CALL UI ===== */
              <div className="bg-[#0F172A] text-white">
                <div className="flex flex-col items-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 150 }}
                    className="w-20 h-20 rounded-full bg-[#00B5C8]/20 flex items-center justify-center mb-4"
                  >
                    <Phone className="h-8 w-8 text-[#00B5C8]" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">AI Receptionist</h3>
                  <p className="text-sm text-white/50 mt-1">Panthi Dental Clinic</p>

                  {voiceStatusText && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-xs text-[#00B5C8] font-medium"
                    >
                      {voiceStatusText}
                    </motion.p>
                  )}

                  {/* Call timer */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 text-4xl font-light tracking-[0.1em] text-white/80 tabular-nums"
                  >
                    {formatTime(callDuration)}
                  </motion.div>

                  {/* Waveform animation */}
                  <div className="mt-8 flex items-center gap-0.5 h-8">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: voice.isListening ? [4, Math.random() * 28 + 4, 4] : voice.isSpeaking ? [12, 8, 12] : [4, 6, 4],
                        }}
                        transition={{
                          duration: 0.8 + Math.random() * 0.4,
                          repeat: Infinity,
                          delay: i * 0.05,
                          ease: "easeInOut",
                        }}
                        className="w-1 rounded-full bg-[#00B5C8]/60"
                      />
                    ))}
                  </div>

                  <p className="text-xs text-white/30 mt-6">
                    {voice.isMuted ? "Muted" : voice.isListening ? "Listening..." : voice.isSpeaking ? "Speaking..." : voice.isProcessing ? "Processing..." : "AI-powered voice conversation"}
                  </p>
                </div>

                {/* Call controls */}
                <div className="flex items-center justify-center gap-4 sm:gap-8 pb-8 sm:pb-10 pt-4">
                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => { const next = !muted; setMuted(next); voice.setMuted(next); }}
                      animate={muted ? { scale: [1, 0.85, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                        muted
                          ? "bg-[#EF4444] text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      )}
                    >
                      {muted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                    </motion.button>
                    <span className="text-[10px] text-white/40">Mic</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleVoice}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EF4444] text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:bg-[#DC2626] transition-colors"
                  >
                    <PhoneOff className="h-7 w-7" />
                  </motion.button>

                  <div className="flex flex-col items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSpeakerMuted(!speakerMuted)}
                      animate={speakerMuted ? { scale: [1, 0.85, 1] } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full transition-all",
                        speakerMuted
                          ? "bg-[#F59E0B] text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                          : "bg-white/10 text-white/70 hover:bg-white/20"
                      )}
                    >
                      {speakerMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                    </motion.button>
                    <span className="text-[10px] text-white/40">Speaker</span>
                  </div>
                </div>
              </div>
            ) : voiceMode && !onCall ? (
              /* ===== VOICE CALL PRE-LAUNCH ===== */
              <div className="bg-[#0F172A] text-white">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#00B5C8]" />
                    <span className="text-sm font-medium">Voice Call</span>
                  </div>
                  <button onClick={() => { setVoiceMode(false); setOnCall(false); }} className="text-white/40 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex flex-col items-center py-12 px-6">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 rounded-full bg-[#00B5C8]/15 flex items-center justify-center mb-5"
                  >
                    <Phone className="h-8 w-8 text-[#00B5C8]" />
                  </motion.div>
                  <h3 className="text-lg font-semibold">Call AI Receptionist</h3>
                  <p className="text-sm text-white/50 mt-1 text-center max-w-xs">
                    Have a natural conversation with our AI assistant. Ask anything about our services.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setOnCall(true)}
                    className="mt-8 flex items-center gap-3 bg-[#22C55E] text-white px-8 py-4 rounded-full font-semibold shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_8px_30px_rgba(34,197,94,0.4)] transition-all"
                  >
                    <Phone className="h-5 w-5" />
                    Start Call
                  </motion.button>
                  <p className="text-xs text-white/30 mt-4">Free · No sign-up needed</p>
                </div>
              </div>
            ) : (
              /* ===== TEXT CHAT UI ===== */
              <>
                {/* Header */}
                <div className="bg-[#0F172A] px-4 py-3.5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#00B5C8]/20 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-[#00B5C8]" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold leading-tight">AI Assistant</h4>
                        <p className="text-[10px] text-white/50">Panthi Dental Clinic</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => { setVoiceMode(true); setOnCall(false); }}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        title="Voice call"
                      >
                        <Phone className="h-3.5 w-3.5 text-white/70" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-72 sm:h-80 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "none" }}>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={cn("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00B5C8]/10 mt-0.5">
                          <Bot className="h-3.5 w-3.5 text-[#00B5C8]" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "bg-[#0F172A] text-white rounded-br-sm"
                            : "bg-[#F3F4F6] text-[#111827] rounded-bl-sm"
                        )}
                      >
                        {renderMessageContent(stripFunctions(msg.content))}
                      </div>
                      {msg.role === "user" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A]/5 mt-0.5">
                          <User className="h-3.5 w-3.5 text-[#0F172A]/50" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00B5C8]/10">
                        <Bot className="h-3.5 w-3.5 text-[#00B5C8]" />
                      </div>
                      <div className="rounded-2xl bg-[#F3F4F6] px-3.5 py-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-[#6B7280]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick replies */}
                {messages.length === 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                    {quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={async () => {
                          setMessages((prev) => [...prev, { role: "user", content: qr }]);
                          setLoading(true);
                          try {
                            const res = await fetch("/api/chat", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ message: qr, history: [] }),
                            });
                            const data = await res.json();
                            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
                          } catch {
                            setMessages((prev) => [
                              ...prev,
                              { role: "assistant", content: "Sorry, I'm having trouble connecting. Please try again or call us directly." },
                            ]);
                          } finally {
                            setLoading(false);
                          }
                        }}
                        className="rounded-full bg-[#F3F4F6] px-3 py-1.5 text-xs text-[#6B7280] hover:bg-[#00B5C8]/10 hover:text-[#00B5C8] transition-colors"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-[rgba(0,0,0,0.06)] p-3">
                  <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-2xl px-4 py-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
                    />
                    {input.trim() ? (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        disabled={loading}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-white disabled:opacity-50 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </motion.button>
                    ) : (
                      <button
                        onClick={() => { setVoiceMode(true); setOnCall(false); }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00B5C8]/10 text-[#00B5C8] hover:bg-[#00B5C8]/20 transition-colors"
                      >
                        <Phone className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
