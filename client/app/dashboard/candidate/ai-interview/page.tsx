"use client";

import { useState, useRef, useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Bot, Mic, MicOff, Video, VideoOff, Send, Play, Wifi, Clock, Star, MessageSquare,
  AlertCircle, CheckCircle2, ChevronRight, Zap, Brain, Shield, Eye, Loader2, RotateCcw
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: "ai" | "user";
  text: string;
  time: string;
}

interface InterviewResult {
  candidateId: string;
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

interface EvalItem {
  label: string;
  score: number;
  color: string;
  icon: React.ElementType;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "http://localhost:8000";

// ─── Circular Score ─────────────────────────────────────────────────────────
function CircleScore({ score, color, size = 80 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
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
  
  // Interview state
  const [phase, setPhase] = useState<"setup" | "interview" | "processing" | "results">("setup");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [vidOn, setVidOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Results
  const [result, setResult] = useState<InterviewResult | null>(null);
  const [evalItems, setEvalItems] = useState<EvalItem[]>([
    { label: "Confidence", score: 0, color: "#2563EB", icon: Shield },
    { label: "Communication", score: 0, color: "#10B981", icon: MessageSquare },
    { label: "Technical", score: 0, color: "#7C3AED", icon: Brain },
    { label: "Relevance", score: 0, color: "#F59E0B", icon: Star },
  ]);
  const [feedback, setFeedback] = useState<{type: string; text: string}[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ─── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (phase === "interview") {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Speech recognition init
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setMicOn(false);
      };

      recognitionRef.current.onerror = () => {
        setMicOn(false);
        setError("Speech error. Type instead.");
      };

      recognitionRef.current.onend = () => setMicOn(false);
    }

    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // ─── Helpers ────────────────────────────────────────────────────────────────
  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setVidOn(true);
      return true;
    } catch {
      setError("Camera access denied. Allow camera permissions.");
      return false;
    }
  }

  function toggleMic() {
    if (!recognitionRef.current) {
      setError("Speech recognition not supported. Use Chrome/Edge.");
      return;
    }
    if (micOn) {
      recognitionRef.current.stop();
      setMicOn(false);
    } else {
      setError("");
      recognitionRef.current.start();
      setMicOn(true);
    }
  }

  // ─── Start Interview ────────────────────────────────────────────────────────
  async function handleStart() {
    setError("");
    const hasCamera = await startCamera();
    if (!hasCamera) return;

    setPhase("interview");
    setMessages([]);
    setElapsed(0);

    // Get first AI question
    setIsLoading(true);
    try {
      const res = await fetch(`${FASTAPI_URL}/interview/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: "CAND-001",
          role: "Senior Software Engineer",
          jobDescription: "We are looking for a Senior Software Engineer with strong system design, microservices, and cloud experience. Must have 5+ years experience with Kubernetes, Docker, and distributed systems.",
          messages: []
        })
      });
      const data = await res.json();
      setMessages([{ role: "ai", text: data.question, time: getCurrentTime() }]);
    } catch (err) {
      setError("Failed to start interview. Check backend is running.");
      setPhase("setup");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Send Answer ────────────────────────────────────────────────────────────
  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: input.trim(), time: getCurrentTime() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        text: m.text
      }));

      const res = await fetch(`${FASTAPI_URL}/interview/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: "CAND-001",
          role: "Senior Software Engineer",
          jobDescription: "We are looking for a Senior Software Engineer with strong system design, microservices, and cloud experience. Must have 5+ years experience with Kubernetes, Docker, and distributed systems.",
          messages: apiMessages
        })
      });
      const data = await res.json();

      if (data.isComplete || data.questionNumber >= 5) {
        // Interview done → score it
        await finishInterview([...newMessages, { role: "ai", text: data.question, time: getCurrentTime() }]);
      } else {
        setMessages([...newMessages, { role: "ai", text: data.question, time: getCurrentTime() }]);
      }
  } catch (err: any) {
    if (err.message?.includes('429') || err.message?.includes('rate limit')) {
        setError("Too many requests. Waiting 5 seconds... retrying automatically.");
        setTimeout(() => handleSend(), 5000); // Auto-retry after 5s
    } else {
        setError("Failed to get response. Try again.");
    }
}
    finally {
      setIsLoading(false);
    }
  }

  // ─── Finish & Score ─────────────────────────────────────────────────────────
  async function finishInterview(finalMessages: Message[]) {
    setPhase("processing");
    setIsLoading(true);
    streamRef.current?.getTracks().forEach(t => t.stop());
    setVidOn(false);

    const apiMessages = finalMessages.map(m => ({
      role: m.role === "user" ? "user" : "model",
      text: m.text
    }));

    try {
      const res = await fetch(`${FASTAPI_URL}/interview/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: "CAND-001",
          role: "Senior Software Engineer",
          jobDescription: "We are looking for a Senior Software Engineer with strong system design, microservices, and cloud experience. Must have 5+ years experience with Kubernetes, Docker, and distributed systems.",
          messages: apiMessages
        })
      });
      const data: InterviewResult = await res.json();
      setResult(data);

      // Map result to eval items
      setEvalItems([
        { label: "Confidence", score: Math.round(data.score * 0.9), color: "#2563EB", icon: Shield },
        { label: "Communication", score: Math.round(data.score * 0.95), color: "#10B981", icon: MessageSquare },
        { label: "Technical", score: data.score, color: "#7C3ED", icon: Brain },
        { label: "Relevance", score: Math.round(data.score * 0.92), color: "#F59E0B", icon: Star },
      ]);

      // Build feedback from strengths & improvements
      const fb = [
        ...data.strengths.map(s => ({ type: "positive", text: s })),
        ...data.improvements.map(i => ({ type: "neutral", text: i })),
      ];
      setFeedback(fb);

      setPhase("results");
    } catch (err) {
      setError("Scoring failed. Try again.");
      setPhase("interview");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleReset() {
    setPhase("setup");
    setMessages([]);
    setInput("");
    setResult(null);
    setError("");
    setElapsed(0);
    setEvalItems([
      { label: "Confidence", score: 0, color: "#2563EB", icon: Shield },
      { label: "Communication", score: 0, color: "#10B981", icon: MessageSquare },
      { label: "Technical", score: 0, color: "#7C3AED", icon: Brain },
      { label: "Relevance", score: 0, color: "#F59E0B", icon: Star },
    ]);
    setFeedback([]);
    streamRef.current?.getTracks().forEach(t => t.stop());
  }

  const overallScore = result?.score || Math.round(evalItems.reduce((a, b) => a + b.score, 0) / evalItems.length);

  // ─── RENDER ─────────────────────────────────────────────────────────────────
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
            {phase !== "setup" && phase !== "results" && (
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

          {/* Results View */}
          {phase === "results" && result && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-[#1E293B] mb-1">Interview Complete</h1>
                <p className="text-[#64748B] text-sm mb-6">Senior Software Engineer · CAND-001</p>
                
                <div className="text-6xl font-bold text-[#2563EB] mb-2">
                  {result.score}<span className="text-2xl text-[#CBD5E1]">/100</span>
                </div>
                
                <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${
                  result.recommendation === "strong_yes" ? "bg-green-100 text-green-700" :
                  result.recommendation === "yes" ? "bg-blue-100 text-blue-700" :
                  result.recommendation === "maybe" ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {result.recommendation.replace("_", " ")}
                </div>

                <p className="text-[#64748B] text-sm mt-4 leading-relaxed max-w-md mx-auto">{result.summary}</p>

                <button
                  onClick={handleReset}
                  className="mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E293B] text-white font-semibold hover:bg-gray-800 transition-all mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  Start New Interview
                </button>
              </div>

              {/* Score breakdown in results */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 mb-4">
                <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Score Breakdown</h3>
                <div className="grid grid-cols-2 gap-3">
                  {evalItems.map(({ label, score, color, icon: Icon }) => (
                    <div key={label} className="text-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <div className="relative w-14 h-14 mx-auto mb-2">
                        <CircleScore score={score} color={color} size={56} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                      </div>
                      <p className="text-lg font-bold text-[#1E293B]">{score}</p>
                      <p className="text-xs text-[#64748B]">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-semibold text-[#1E293B]">AI Feedback</h3>
                </div>
                <div className="space-y-2.5">
                  {feedback.map(({ type, text }, i) => (
                    <div key={i} className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                      type === "positive" ? "bg-emerald-50 border border-emerald-100" :
                      type === "neutral" ? "bg-amber-50 border border-amber-100" :
                      "bg-blue-50 border border-blue-100"
                    }`}>
                      {type === "positive"
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        : type === "neutral"
                        ? <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        : <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />}
                      <span className={type === "positive" ? "text-emerald-700" : type === "neutral" ? "text-amber-700" : "text-blue-700"}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Raw data for DB */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs text-gray-400 font-mono mb-1">// Save to DB:</p>
                <pre className="text-xs text-gray-600 overflow-x-auto">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* Processing View */}
          {phase === "processing" && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Bot className="w-16 h-16 text-purple-500 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Analyzing Interview</h2>
                <p className="text-[#64748B]">Gemini AI is evaluating your responses...</p>
                <div className="mt-4 flex justify-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {/* Interview / Setup View */}
          {(phase === "setup" || phase === "interview") && (
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
                      {phase === "interview" && <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0f172a]" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Maya — AI Interviewer</p>
                      <p className="text-slate-400 text-xs">{phase === "interview" ? "Interview in progress" : "Ready to start"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMic}
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
                  {phase === "setup" && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Bot className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-lg font-bold">Ready for your AI Interview?</p>
                        <p className="text-slate-400 text-sm mt-1">Maya will ask adaptive questions and evaluate your responses with Gemini AI</p>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-1">
                        {["Adaptive Questions", "Real-time Scoring", "Voice Input"].map(f => (
                          <span key={f} className="px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs">{f}</span>
                        ))}
                      </div>
                      <button
                        onClick={handleStart}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 mt-2"
                      >
                        <Play className="w-5 h-5" /> Start Interview
                      </button>
                      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    </div>
                  )}

                  {phase === "interview" && messages.map((msg, i) => (
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

                  {isLoading && phase === "interview" && (
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
                {phase === "interview" && (
                  <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5">
                      <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={micOn ? "Listening..." : "Type your response or use microphone..."}
                        className="flex-1 bg-transparent text-white text-sm placeholder:text-slate-500 outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={toggleMic} 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${micOn ? "bg-[#EF4444] animate-pulse" : "bg-white/10 hover:bg-white/20"}`}
                        >
                          <Mic className="w-4 h-4 text-white" />
                        </button>
                        <button 
                          onClick={handleSend} 
                          disabled={!input.trim() || isLoading}
                          className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
                  </div>
                )}
              </div>

              {/* ── RIGHT: Evaluation panel ── */}
              <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto scrollbar-none">

                {/* Overall score */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[#1E293B]">Overall AI Score</h3>
                    {phase === "interview" && <span className="flex items-center gap-1 text-xs text-[#10B981]"><Zap className="w-3 h-3" /> Live</span>}
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-20 shrink-0">
                      <CircleScore score={phase === "interview" ? overallScore : 0} color="#2563EB" size={80} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-[#1E293B]">{phase === "interview" ? overallScore : "--"}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#1E293B]">{phase === "interview" ? "Analyzing..." : "Not Started"}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">{phase === "interview" ? "AI evaluating responses" : "Start interview to see score"}</p>
                      {phase === "interview" && (
                        <div className="mt-2 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB] rounded-full animate-pulse" style={{ width: `${Math.min(100, messages.length * 15)}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Per-metric scores */}
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                  <h3 className="text-sm font-semibold text-[#1E293B] mb-4">Score Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {evalItems.map(({ label, score, color, icon: Icon }) => (
                      <div key={label} className="text-center p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="relative w-14 h-14 mx-auto mb-2">
                          <CircleScore score={phase === "interview" ? score : 0} color={color} size={56} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                        </div>
                        <p className="text-lg font-bold text-[#1E293B]">{phase === "interview" ? score : "--"}</p>
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
                  {phase === "setup" ? (
                    <p className="text-xs text-[#64748B] text-center py-4">Feedback will appear as you answer questions</p>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
                        <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] shrink-0 mt-0.5" />
                        <span className="text-blue-700 text-xs">Answer the current question to receive AI feedback</span>
                      </div>
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
          )}

        </div>
      </div>
    </div>
  );
}