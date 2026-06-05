/**
 * Next.js: app/dashboard/candidate/ai-interview/page.tsx
 * Add "use client"; at the top — HIGHEST PRIORITY UI
 */
"use client";
import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Bot, Mic, MicOff, Video, VideoOff, Send, Play, Square,
  Volume2, Wifi, Clock, Star, TrendingUp, MessageSquare,
  AlertCircle, CheckCircle2, ChevronRight, Zap, Brain,
  BarChart3, Shield, Eye,
} from "lucide-react";

// ─── Mock conversation ────────────────────────────────────────────────────────
const MOCK_MESSAGES = [
  {
    role: "ai",
    text: "Hello! I'm Maya, your AI interviewer for the Senior Software Engineer position at TechNova Inc. I'll be evaluating your technical and communication skills. Are you ready to begin?",
    time: "10:00 AM",
  },
  {
    role: "user",
    text: "Yes, I'm ready. Thank you for having me!",
    time: "10:00 AM",
  },
  {
    role: "ai",
    text: "Great! Let's start with a warm-up. Could you briefly walk me through your most recent project and the key technical challenges you solved?",
    time: "10:01 AM",
  },
  {
    role: "user",
    text: "Sure! In my last role, I led the migration of a monolithic app to microservices using Kubernetes and Docker. The biggest challenge was managing data consistency across services — we solved it using the Saga pattern with event sourcing.",
    time: "10:02 AM",
  },
  {
    role: "ai",
    text: "Excellent! That's a sophisticated approach. Now let's dive deeper — how did you handle distributed transactions where multiple services needed to update atomically?",
    time: "10:03 AM",
  },
];

const EVAL_ITEMS = [
  { label: "Confidence",    score: 88, color: "#2563EB",  icon: Shield },
  { label: "Communication", score: 92, color: "#10B981",  icon: MessageSquare },
  { label: "Technical",     score: 85, color: "#7C3AED",  icon: Brain },
  { label: "Relevance",     score: 90, color: "#F59E0B",  icon: Star },
];

const FEEDBACK = [
  { type: "positive", text: "Clear articulation of complex technical concepts" },
  { type: "positive", text: "Strong use of relevant examples (Saga pattern, K8s)" },
  { type: "neutral",  text: "Consider adding metrics to quantify your impact" },
  { type: "tip",      text: "Mention team size and cross-functional collaboration" },
];

// ─── Circular Score ───────────────────────────────────────────────────────────
function CircleScore({ score, color, size = 80 }: { score: number; color: string; size?: number }) {
  const r   = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (score / 100);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth="5" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIInterviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [started, setStarted]         = useState(false);
  const [messages, setMessages]       = useState(MOCK_MESSAGES.slice(0, 1));
  const [input, setInput]             = useState("");
  const [micOn, setMicOn]             = useState(false);
  const [vidOn, setVidOn]             = useState(false);
  const [elapsed, setElapsed]         = useState(0);
  const [typing, setTyping]           = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(t);
  }, [started]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function handleStart() {
    setStarted(true);
    setMessages(MOCK_MESSAGES.slice(0, 1));
    let i = 1;
    function addNext() {
      if (i >= MOCK_MESSAGES.length) return;
      const isUser = MOCK_MESSAGES[i].role === "user";
      if (!isUser) setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, MOCK_MESSAGES[i]]);
        i++;
        setTimeout(addNext, isUser ? 800 : 1800);
      }, isUser ? 400 : 1400);
    }
    setTimeout(addNext, 900);
  }

  function handleSend() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input, time: "Now" }]);
    setInput("");
  }

  const overallScore = Math.round(EVAL_ITEMS.reduce((a, b) => a + b.score, 0) / EVAL_ITEMS.length);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-hidden p-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">AI Interview</h1>
              <p className="text-sm text-[#64748B] mt-0.5">Senior Software Engineer · TechNova Inc.</p>
            </div>
            {started && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                  <span className="text-sm font-semibold text-red-600">{formatTime(elapsed)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#10B981]">
                  <Wifi className="w-3.5 h-3.5" /> Connected
                </div>
              </div>
            )}
          </div>

          {/* Main split layout */}
          <div className="h-[calc(100vh-200px)] grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-hidden">

            {/* ── LEFT: Chat interface ── */}
            <div className="lg:col-span-3 flex flex-col rounded-2xl overflow-hidden border border-[#1e293b]/20" style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e293b 100%)" }}>

              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    {started && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0f172a]" />}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Maya — AI Interviewer</p>
                    <p className="text-slate-400 text-xs">{started ? "Interview in progress" : "Ready to start"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMicOn(m => !m)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${micOn ? "bg-[#2563EB] text-white" : "bg-white/10 text-slate-400 hover:bg-white/20"}`}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setVidOn(v => !v)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${vidOn ? "bg-[#2563EB] text-white" : "bg-white/10 text-slate-400 hover:bg-white/20"}`}
                  >
                    {vidOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">
                {!started && (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-white text-lg font-bold">Ready for your AI Interview?</p>
                      <p className="text-slate-400 text-sm mt-1">Maya will ask you questions and evaluate your responses in real-time</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      {["Adaptive Questions", "Real-time Scoring", "60 min Session"].map(f => (
                        <span key={f} className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs">{f}</span>
                      ))}
                    </div>
                    <button
                      onClick={handleStart}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 mt-2"
                    >
                      <Play className="w-5 h-5" /> Start Interview
                    </button>
                  </div>
                )}

                {started && messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    {msg.role === "ai" ? (
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/30">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 text-xs font-bold text-white">SW</div>
                    )}
                    <div className={`max-w-[80%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                      <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "ai"
                          ? "bg-white/10 text-slate-100 rounded-tl-sm"
                          : "bg-[#2563EB] text-white rounded-tr-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-500">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {started && (
                <div className="px-4 py-3 border-t border-white/10">
                  <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSend()}
                      placeholder="Type your response or use microphone..."
                      className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <button onClick={() => setMicOn(m => !m)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${micOn ? "bg-[#2563EB]" : "bg-white/10 hover:bg-white/20"}`}>
                        <Mic className="w-4 h-4 text-white" />
                      </button>
                      <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Evaluation panel ── */}
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto scrollbar-none">

              {/* Overall score */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#1E293B]">Overall AI Score</h3>
                  {started && <span className="flex items-center gap-1 text-xs text-[#10B981]"><Zap className="w-3 h-3" /> Live</span>}
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 shrink-0">
                    <CircleScore score={started ? overallScore : 0} color="#2563EB" size={80} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#1E293B]">{started ? overallScore : "--"}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#1E293B]">{started ? "Performing Well" : "Not Started"}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{started ? `Top ${100 - overallScore + 8}% of candidates` : "Start interview to see score"}</p>
                    {started && (
                      <div className="mt-2 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${overallScore}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Per-metric scores */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  {EVAL_ITEMS.map(({ label, score, color, icon: Icon }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="relative w-14 h-14 mx-auto mb-2">
                        <CircleScore score={started ? score : 0} color={color} size={56} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#1E293B]">{started ? score : "--"}</p>
                      <p className="text-xs text-[#64748B]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-semibold text-[#1E293B]">AI Feedback</h3>
                </div>
                {!started ? (
                  <p className="text-xs text-[#64748B] text-center py-4">Feedback will appear as you answer questions</p>
                ) : (
                  <div className="space-y-2.5">
                    {FEEDBACK.map(({ type, text }, i) => (
                      <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                        type === "positive" ? "bg-emerald-50 border border-emerald-100" :
                        type === "neutral"  ? "bg-amber-50 border border-amber-100" :
                        "bg-blue-50 border border-blue-100"
                      }`}>
                        {type === "positive"
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                          : type === "neutral"
                          ? <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          : <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />}
                        <span className={
                          type === "positive" ? "text-emerald-700" :
                          type === "neutral"  ? "text-amber-700" :
                          "text-blue-700"
                        }>{text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Session info */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between text-xs text-[#64748B]">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Duration: 60 min</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {messages.length} exchanges</span>
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Proctored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
