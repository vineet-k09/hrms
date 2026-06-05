/**
 * Next.js: app/dashboard/candidate/interview-schedule/page.tsx
 * Add "use client"; at the top
 */
"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import {
  Video, Calendar, Clock, User, Bot, Mic, Laptop,
  ChevronLeft, ChevronRight, CheckCircle2, AlertCircle,
  ExternalLink, Bell, MapPin,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const interviews = [
  {
    id: 1, company: "TechNova Inc.", role: "Senior Software Engineer",
    date: "Jun 5, 2026", time: "10:00 AM", duration: "60 min",
    type: "technical", interviewers: ["Alice Zhang", "Bob Kim"],
    platform: "Google Meet", status: "upcoming", isToday: true,
    link: "#",
  },
  {
    id: 2, company: "DesignCraft", role: "Product Designer",
    date: "Jun 5, 2026", time: "2:30 PM", duration: "45 min",
    type: "hr", interviewers: ["Carol Evans"],
    platform: "Zoom", status: "upcoming", isToday: true,
    link: "#",
  },
  {
    id: 3, company: "DataPulse", role: "Data Scientist",
    date: "Jun 8, 2026", time: "11:00 AM", duration: "90 min",
    type: "ai", interviewers: ["AI Interviewer"],
    platform: "MyGreenhouse AI", status: "upcoming", isToday: false,
    link: "#",
  },
  {
    id: 4, company: "UIFlow", role: "Frontend Engineer",
    date: "Jun 12, 2026", time: "3:00 PM", duration: "45 min",
    type: "hr", interviewers: ["Sam Rivera"],
    platform: "Teams", status: "upcoming", isToday: false,
    link: "#",
  },
];

const TYPES = {
  ai:        { label: "AI Interview",  icon: Bot,    cls: "bg-purple-50 text-purple-600 border-purple-200",   dot: "bg-purple-500" },
  hr:        { label: "HR Round",      icon: User,   cls: "bg-blue-50 text-blue-600 border-blue-200",         dot: "bg-blue-500" },
  technical: { label: "Technical",     icon: Laptop, cls: "bg-amber-50 text-amber-600 border-amber-200",      dot: "bg-amber-500" },
  final:     { label: "Final Round",   icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-600 border-emerald-200", dot: "bg-emerald-500" },
};

// ─── Mini Calendar ────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function MiniCalendar() {
  const [month, setMonth] = useState(5); // June (0-indexed)
  const [year]  = useState(2026);

  const firstDay  = new Date(year, month, 1).getDay();
  const daysCount = new Date(year, month + 1, 0).getDate();
  const interviewDays = new Set([5, 8, 12]);

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysCount }, (_, i) => i + 1)];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#1E293B]">{MONTHS[month]} {year}</h3>
        <div className="flex gap-1">
          <button onClick={() => setMonth(m => Math.max(0, m - 1))} className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))} className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center text-[#64748B] transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-[#64748B] py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const hasInterview = interviewDays.has(day);
          const isToday = day === 5 && month === 5;
          return (
            <button
              key={i}
              className={`relative w-8 h-8 mx-auto flex flex-col items-center justify-center rounded-full text-xs font-medium transition-all ${
                isToday
                  ? "bg-[#2563EB] text-white"
                  : hasInterview
                  ? "bg-blue-50 text-[#2563EB] font-semibold"
                  : "text-[#64748B] hover:bg-[#F1F5F9]"
              }`}
            >
              {day}
              {hasInterview && !isToday && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[#2563EB]" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
        <div className="flex flex-wrap gap-3">
          {Object.values(TYPES).slice(0, 3).map(({ label, dot }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className={`w-2 h-2 rounded-full ${dot}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InterviewSchedulePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const todayInterviews = interviews.filter(i => i.isToday);
  const upcoming        = interviews.filter(i => !i.isToday);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Interview Schedule</h1>
              <p className="text-sm text-[#64748B] mt-0.5">{interviews.length} interviews scheduled</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-blue-700 transition-colors w-fit">
              <Bell className="w-4 h-4" /> Enable Reminders
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — interviews */}
            <div className="lg:col-span-2 space-y-4">

              {/* Today */}
              {todayInterviews.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
                    <h2 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide">Today</h2>
                  </div>
                  <div className="space-y-3">
                    {todayInterviews.map(iv => {
                      const T = TYPES[iv.type as keyof typeof TYPES];
                      const Icon = T.icon;
                      return (
                        <div
                          key={iv.id}
                          className="bg-white rounded-xl border border-[#2563EB]/30 p-5 relative overflow-hidden"
                          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563EB] rounded-l-xl" />
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="text-base font-semibold text-[#1E293B]">{iv.role}</h3>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${T.cls}`}>
                                  <Icon className="w-3 h-3" />{T.label}
                                </span>
                              </div>
                              <p className="text-sm text-[#64748B] mb-2">{iv.company}</p>
                              <div className="flex flex-wrap gap-3 text-xs text-[#64748B]">
                                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{iv.time} · {iv.duration}</span>
                                <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" />{iv.platform}</span>
                                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{iv.interviewers.join(", ")}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <a href={iv.link} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                                <Video className="w-4 h-4" /> Join Now
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              <div>
                <h2 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide mb-3">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map(iv => {
                    const T = TYPES[iv.type as keyof typeof TYPES];
                    const Icon = T.icon;
                    return (
                      <div
                        key={iv.id}
                        className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-base font-semibold text-[#1E293B]">{iv.role}</h3>
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full border ${T.cls}`}>
                                <Icon className="w-3 h-3" />{T.label}
                              </span>
                            </div>
                            <p className="text-sm text-[#64748B] mb-2">{iv.company}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-[#64748B]">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{iv.date}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{iv.time} · {iv.duration}</span>
                              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" />{iv.platform}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] text-[#64748B] text-sm hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                              <Bell className="w-3.5 h-3.5" /> Remind
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-sm hover:bg-[#F1F5F9] transition-colors">
                              <ExternalLink className="w-3.5 h-3.5" /> Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right — calendar */}
            <div className="space-y-4">
              <MiniCalendar />
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <h3 className="text-sm font-semibold text-[#1E293B] mb-3">Preparation Tips</h3>
                <div className="space-y-2.5">
                  {[
                    "Review the job description thoroughly",
                    "Prepare 3 STAR-method examples",
                    "Test your audio & video beforehand",
                    "Research the company culture",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#2563EB]">{i + 1}</span>
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
