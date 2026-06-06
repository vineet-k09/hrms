/**
 * Next.js: app/dashboard/candidate/my-applications/page.tsx
 * Add "use client"; at the top — layout/sidebar already provided by layout.tsx
 * The <div className="p-6 ..."> block below is the full page content.
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/sidebar";
// import { useAuth } from "@/context/AuthContext";
import {
  Briefcase, Bot, Clock, MapPin, ExternalLink, Search,
  TrendingUp, FileText, CheckCircle2, XCircle, ChevronRight,
  Building2, Star, Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── Mock data ────────────────────────────────────────────────────────────────
const applications = [
  {
    id: 1, role: "Senior Software Engineer", company: "TechNova Inc.",
    location: "San Francisco, CA (Remote)", appliedDate: "May 28, 2026",
    status: "interview", aiScore: 92, type: "Full-time",
    logo: "TN", logoColor: "bg-blue-500",
    nextStep: "Technical interview on Jun 5",
  },
  {
    id: 2, role: "Product Designer", company: "DesignCraft",
    location: "New York, NY (Hybrid)", appliedDate: "May 20, 2026",
    status: "screening", aiScore: 85, type: "Full-time",
    logo: "DC", logoColor: "bg-purple-500",
    nextStep: "Portfolio review in progress",
  },
  {
    id: 3, role: "Data Scientist", company: "DataPulse",
    location: "Remote", appliedDate: "May 15, 2026",
    status: "offer", aiScore: 96, type: "Full-time",
    logo: "DP", logoColor: "bg-emerald-500",
    nextStep: "Offer deadline: Jun 10, 2026",
  },
  {
    id: 4, role: "DevOps Lead", company: "CloudBase",
    location: "Austin, TX", appliedDate: "May 10, 2026",
    status: "rejected", aiScore: 78, type: "Contract",
    logo: "CB", logoColor: "bg-slate-500",
    nextStep: null,
  },
  {
    id: 5, role: "Frontend Engineer", company: "UIFlow",
    location: "Remote", appliedDate: "Jun 1, 2026",
    status: "applied", aiScore: 88, type: "Full-time",
    logo: "UF", logoColor: "bg-amber-500",
    nextStep: "Application under review",
  },
];

const STATUS = {
  applied:   { label: "Applied",    cls: "bg-slate-50 text-slate-600 border-slate-200" },
  screening: { label: "Screening",  cls: "bg-amber-50 text-amber-600 border-amber-200" },
  interview: { label: "Interview",  cls: "bg-blue-50 text-blue-600 border-blue-200" },
  offer:     { label: "Offer",      cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  rejected:  { label: "Rejected",   cls: "bg-red-50 text-red-600 border-red-200" },
};

const TABS = ["All", "Active", "Closed"];
const ACTIVE = ["applied", "screening", "interview", "offer"];
const CLOSED = ["rejected"];

// ─── Component ────────────────────────────────────────────────────────────────
export default function MyApplicationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = applications.filter(a => {
    const matchTab =
      tab === "All" ? true :
      tab === "Active" ? ACTIVE.includes(a.status) :
      CLOSED.includes(a.status);
    const matchSearch =
      a.role.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ── PAGE CONTENT START (copy from here for Next.js) ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">My Applications</h1>
              <p className="text-sm text-[#64748B] mt-0.5">{applications.length} total applications submitted</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <Input
                  placeholder="Search role or company..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-9 h-9 w-64 text-sm bg-white border-[#E2E8F0]"
                />
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total",     val: applications.length,                           color: "text-[#1E293B]",   bg: "bg-slate-50",   border: "border-slate-200" },
              { label: "Active",    val: applications.filter(a => ACTIVE.includes(a.status)).length, color: "text-[#2563EB]", bg: "bg-blue-50", border: "border-blue-200" },
              { label: "Offer",     val: applications.filter(a => a.status === "offer").length, color: "text-[#10B981]", bg: "bg-emerald-50", border: "border-emerald-200" },
              { label: "Rejected",  val: applications.filter(a => a.status === "rejected").length, color: "text-[#EF4444]", bg: "bg-red-50", border: "border-red-200" },
            ].map(({ label, val, color, bg, border }) => (
              <div key={label} className={`rounded-xl border ${border} ${bg} p-4 text-center`}>
                <p className={`text-3xl font-bold ${color}`}>{val}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  tab === t
                    ? "bg-[#2563EB] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#1E293B]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Application cards */}
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-12 text-[#64748B]">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No applications found</p>
              </div>
            )}
            {filtered.map(app => {
              const st = STATUS[app.status as keyof typeof STATUS];
              const isClosed = CLOSED.includes(app.status);
              return (
                <div
                  key={app.id}
                  className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all duration-200 ${
                    isClosed ? "border-[#E2E8F0] opacity-70" : "border-[#E2E8F0] hover:border-[#2563EB]/30"
                  }`}
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Logo */}
                    <div className={`w-12 h-12 rounded-xl ${app.logoColor} flex items-center justify-center shrink-0 text-white font-bold text-sm`}>
                      {app.logo}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start gap-2 mb-1">
                        <h3 className="text-base font-semibold text-[#1E293B]">{app.role}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${st.cls}`}>
                          {st.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-[#64748B] mb-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {app.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {app.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Applied {app.appliedDate}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">{app.type}</span>
                      </div>

                      {app.nextStep && (
                        <div className="flex items-center gap-2 text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0] w-fit">
                          <ChevronRight className="w-3.5 h-3.5 text-[#2563EB]" />
                          {app.nextStep}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
                      {/* AI Score */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100">
                        <Bot className="w-3.5 h-3.5 text-purple-500" />
                        <span className="text-sm font-bold text-purple-600">{app.aiScore}</span>
                        <span className="text-xs text-purple-400">/ 100</span>
                      </div>
                      {!isClosed && (
                        <button className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline">
                          View Details <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* ── PAGE CONTENT END ── */}
      </div>
    </div>
  );
}
