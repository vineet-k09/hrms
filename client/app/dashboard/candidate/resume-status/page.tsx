/**
 * Next.js: app/dashboard/candidate/resume-status/page.tsx
 * Add "use client"; at the top
 */
"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  FileText, CheckCircle2, Clock, Upload, Bot, Brain,
  User, Star, TrendingUp, Eye, Download, RefreshCw,
  AlertCircle, Zap, BarChart3,
} from "lucide-react";

// ─── Pipeline ─────────────────────────────────────────────────────────────────
const PIPELINE = [
  { id: 1, label: "Uploaded",    icon: Upload,      done: true,  time: "May 28, 2026",  detail: "resume_sam_wilson_v2.pdf" },
  { id: 2, label: "AI Parsed",   icon: Bot,         done: true,  time: "May 28, 2026",  detail: "12 skills · 5 yrs exp extracted" },
  { id: 3, label: "AI Scored",   icon: Brain,       done: true,  time: "May 29, 2026",  detail: "Score: 92/100 — Excellent match" },
  { id: 4, label: "HR Review",   icon: User,        done: true,  time: "Jun 1, 2026",   detail: "Reviewed by Alice Zhang" },
  { id: 5, label: "Shortlisted", icon: Star,        done: false, time: "Pending",        detail: "Awaiting final decision" },
];

const SKILLS_MATCHED = [
  { skill: "React / Next.js",  match: 98 },
  { skill: "Node.js",          match: 92 },
  { skill: "TypeScript",       match: 95 },
  { skill: "System Design",    match: 80 },
  { skill: "Docker / K8s",     match: 88 },
  { skill: "PostgreSQL",       match: 75 },
];

const INSIGHTS = [
  { type: "positive", text: "Strong frontend engineering background with React & TypeScript" },
  { type: "positive", text: "Microservices experience is highly relevant to this role" },
  { type: "neutral",  text: "Add quantifiable impact metrics (e.g. 40% reduction in load time)" },
  { type: "tip",      text: "Leadership experience could be highlighted more prominently" },
];

export default function ResumeStatusPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const done = PIPELINE.filter(p => p.done).length;
  const pct  = Math.round((done / PIPELINE.length) * 100);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Resume Status</h1>
              <p className="text-sm text-[#64748B] mt-0.5">Tracking: Senior Software Engineer @ TechNova Inc.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                <Upload className="w-4 h-4" /> Update Resume
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT: Pipeline + progress ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Overall progress */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-[#1E293B]">Application Progress</h3>
                  <span className="text-sm font-bold text-[#2563EB]">{pct}%</span>
                </div>
                <div className="h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: "linear-gradient(90deg, #2563EB, #7C3AED)" }}
                  />
                </div>
                <p className="text-xs text-[#64748B]">{done} of {PIPELINE.length} stages complete</p>
              </div>

              {/* Pipeline steps */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <h3 className="text-base font-semibold text-[#1E293B] mb-5">Review Pipeline</h3>
                <div className="relative">
                  {/* Connector line */}
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-[#E2E8F0]" />
                  <div
                    className="absolute left-6 top-6 w-0.5 bg-linear-to-b from-[#2563EB] to-[#7C3AED] transition-all duration-700"
                    style={{ height: `${((done - 1) / (PIPELINE.length - 1)) * 100}%` }}
                  />

                  <div className="space-y-6">
                    {PIPELINE.map(({ id, label, icon: Icon, done: d, time, detail }) => (
                      <div key={id} className="flex items-start gap-4 relative z-10">
                        {/* Step icon */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                          d
                            ? "bg-[#2563EB] border-[#2563EB] shadow-md shadow-blue-200"
                            : "bg-white border-[#E2E8F0]"
                        }`}>
                          <Icon className={`w-5 h-5 ${d ? "text-white" : "text-[#64748B]"}`} />
                        </div>

                        <div className={`flex-1 pb-2 ${d ? "" : "opacity-50"}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-[#1E293B]">{label}</p>
                            {d ? (
                              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                            ) : (
                              <Clock className="w-4 h-4 text-[#64748B]" />
                            )}
                          </div>
                          <p className="text-xs text-[#64748B]">{detail}</p>
                          <p className={`text-xs mt-1 font-medium ${d ? "text-[#10B981]" : "text-[#64748B]"}`}>{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <h3 className="text-base font-semibold text-[#1E293B]">AI Resume Insights</h3>
                </div>
                <div className="space-y-2.5">
                  {INSIGHTS.map(({ type, text }, i) => (
                    <div key={i} className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${
                      type === "positive" ? "bg-emerald-50 border border-emerald-100" :
                      type === "neutral"  ? "bg-amber-50 border border-amber-100" :
                      "bg-blue-50 border border-blue-100"
                    }`}>
                      {type === "positive"
                        ? <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        : type === "neutral"
                        ? <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        : <Zap className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />}
                      <span className={
                        type === "positive" ? "text-emerald-700" :
                        type === "neutral"  ? "text-amber-700" : "text-blue-700"
                      }>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Score card + skills ── */}
            <div className="space-y-4">

              {/* AI Score card */}
              <div
                className="rounded-xl p-5 text-center text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563EB 60%, #7C3AED 100%)" }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-blue-200" />
                    <span className="text-xs text-blue-200 font-medium">AI Score</span>
                  </div>
                  <p className="text-6xl font-bold mb-1">92</p>
                  <p className="text-blue-200 text-sm">out of 100</p>
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex justify-between text-xs text-blue-200 mb-1">
                      <span>Job Match</span><span className="text-white font-semibold">96%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: "96%" }} />
                    </div>
                  </div>
                  <p className="text-xs text-blue-200 mt-3">Top 8% of all applicants</p>
                </div>
              </div>

              {/* Skills match */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                  <h3 className="text-sm font-semibold text-[#1E293B]">Skills Match</h3>
                </div>
                <div className="space-y-3">
                  {SKILLS_MATCHED.map(({ skill, match }) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#1E293B]">{skill}</span>
                        <span className="text-xs font-bold text-[#2563EB]">{match}%</span>
                      </div>
                      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${match}%`,
                            backgroundColor: match >= 90 ? "#10B981" : match >= 80 ? "#2563EB" : "#F59E0B",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume file info */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1E293B] truncate">resume_sam_wilson_v2.pdf</p>
                    <p className="text-xs text-[#64748B]">248 KB · Uploaded May 28, 2026</p>
                  </div>
                  <button className="text-[#2563EB] hover:text-blue-700 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
