"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/ui/sidebar";
import useAuth from "../../hooks/useAuth";
import {
  Users,
  CalendarCheck,
  ClipboardList,
  Bot,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Menu,
  Clock,
  Cake,
  Video,
  FileText,
  BarChart3,
  CheckCircle2,
  Star,
  Mail,
  FileSearch,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

import { Input } from "@/components/ui/input";

// ─── Role-specific mock data ─────────────────────────────────────────────────

const orgStats = [
  {
    label: "Total Employees",
    value: "248",
    icon: Users,
    trend: "+4",
    up: true,
    color: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    trendLabel: "this month",
  },
  {
    label: "Present Today",
    value: "201",
    icon: CalendarCheck,
    trend: "+2.1%",
    up: true,
    color: "bg-emerald-50",
    iconColor: "text-[#10B981]",
    trendLabel: "vs yesterday",
  },
  {
    label: "On Leave",
    value: "12",
    icon: ClipboardList,
    trend: "-3",
    up: false,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    trendLabel: "vs last week",
  },
  {
    label: "Open Positions",
    value: "5",
    icon: Briefcase,
    trend: "+2",
    up: true,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    trendLabel: "new this week",
  },
];

const employeeStats = [
  {
    label: "Days Present",
    value: "18",
    icon: CalendarCheck,
    trend: "+2",
    up: true,
    color: "bg-emerald-50",
    iconColor: "text-[#10B981]",
    trendLabel: "this month",
  },
  {
    label: "Leave Balance",
    value: "9d",
    icon: ClipboardList,
    trend: "3 used",
    up: false,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    trendLabel: "of 12 days",
  },
  {
    label: "Tasks Done",
    value: "14",
    icon: CheckCircle2,
    trend: "+5",
    up: true,
    color: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    trendLabel: "this sprint",
  },
  {
    label: "Perf. Score",
    value: "87%",
    icon: TrendingUp,
    trend: "+3%",
    up: true,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    trendLabel: "vs last review",
  },
];

const candidateStats = [
  {
    label: "Applications",
    value: "3",
    icon: FileText,
    trend: "active",
    up: true,
    color: "bg-blue-50",
    iconColor: "text-[#2563EB]",
    trendLabel: "submitted",
  },
  {
    label: "Interviews",
    value: "2",
    icon: Video,
    trend: "1 today",
    up: true,
    color: "bg-purple-50",
    iconColor: "text-purple-500",
    trendLabel: "scheduled",
  },
  {
    label: "AI Score",
    value: "92",
    icon: Bot,
    trend: "top 8%",
    up: true,
    color: "bg-emerald-50",
    iconColor: "text-[#10B981]",
    trendLabel: "percentile",
  },
  {
    label: "Offer Status",
    value: "1",
    icon: Mail,
    trend: "pending",
    up: true,
    color: "bg-amber-50",
    iconColor: "text-amber-500",
    trendLabel: "under review",
  },
];

const attendanceBreakdown = [
  { label: "Present", value: 201, total: 248, color: "#10B981" },
  { label: "On Leave", value: 12, total: 248, color: "#F59E0B" },
  { label: "Remote", value: 28, total: 248, color: "#2563EB" },
  { label: "Absent", value: 7, total: 248, color: "#EF4444" },
];

const personalAttendance = [
  { label: "Present", value: 18, total: 22, color: "#10B981" },
  { label: "On Leave", value: 3, total: 22, color: "#F59E0B" },
  { label: "Remote", value: 1, total: 22, color: "#2563EB" },
];

const allLeaveRequests = [
  {
    name: "Sarah Chen",
    dept: "Engineering",
    type: "Annual Leave",
    days: 3,
    status: "pending",
  },
  {
    name: "Marcus Hall",
    dept: "Design",
    type: "Sick Leave",
    days: 1,
    status: "approved",
  },
  {
    name: "Priya Sharma",
    dept: "Marketing",
    type: "Maternity",
    days: 90,
    status: "approved",
  },
  {
    name: "David Kim",
    dept: "Sales",
    type: "Annual Leave",
    days: 5,
    status: "pending",
  },
];

const myLeaveRequests = [
  {
    name: "Alex Johnson",
    dept: "Product",
    type: "Annual Leave",
    days: 3,
    status: "approved",
  },
  {
    name: "Alex Johnson",
    dept: "Product",
    type: "Sick Leave",
    days: 1,
    status: "pending",
  },
];

const pipeline = [
  { stage: "Applied", count: 48, color: "#64748B" },
  { stage: "Screening", count: 22, color: "#F59E0B" },
  { stage: "Interview", count: 11, color: "#2563EB" },
  { stage: "Offer", count: 4, color: "#10B981" },
  { stage: "Hired", count: 2, color: "#7C3AED" },
];

const allApplications = [
  {
    name: "Alex Rivera",
    role: "Senior Engineer",
    score: 92,
    status: "interview",
  },
  {
    name: "Julia Park",
    role: "Product Designer",
    score: 88,
    status: "screening",
  },
  { name: "Omar Farouk", role: "Data Scientist", score: 95, status: "offer" },
  { name: "Nina Petrov", role: "DevOps Lead", score: 79, status: "applied" },
];

const myApplications = [
  {
    name: "Sam Wilson",
    role: "Senior Engineer",
    score: 92,
    status: "interview",
  },
  {
    name: "Sam Wilson",
    role: "Product Designer",
    score: 88,
    status: "screening",
  },
];

const allInterviews = [
  {
    candidate: "Alex Rivera",
    role: "Senior Engineer",
    time: "10:00 AM",
    date: "Today",
    type: "Technical",
  },
  {
    candidate: "Julia Park",
    role: "Product Designer",
    time: "2:30 PM",
    date: "Today",
    type: "Portfolio",
  },
  {
    candidate: "Omar Farouk",
    role: "Data Scientist",
    time: "11:00 AM",
    date: "Tomorrow",
    type: "Final",
  },
];

const myInterviews = [
  {
    candidate: "Sam Wilson",
    role: "Senior Engineer",
    time: "10:00 AM",
    date: "Today",
    type: "Technical",
  },
  {
    candidate: "Sam Wilson",
    role: "Data Scientist",
    time: "11:00 AM",
    date: "Tomorrow",
    type: "Final",
  },
];

const birthdays = [
  { name: "Maria Gonzalez", dept: "HR", date: "Today" },
  { name: "Tom Bradley", dept: "Engineering", date: "Jun 3" },
  { name: "Aiko Tanaka", dept: "Finance", date: "Jun 5" },
  { name: "Leon Weber", dept: "Sales", date: "Jun 8" },
];

const allReviews = [
  { name: "Derek Lam", role: "Senior Dev", due: "Jun 5", progress: 65 },
  { name: "Carla Martin", role: "UX Lead", due: "Jun 7", progress: 40 },
  { name: "Ben Okafor", role: "Analyst", due: "Jun 10", progress: 80 },
];

const myReview = [
  { name: "Alex Johnson", role: "Product Mgr", due: "Jun 12", progress: 55 },
];

const activityLog = [
  {
    name: "Sarah Chen",
    action: "Applied for leave",
    dept: "Engineering",
    date: "Jun 1, 2026",
    status: "pending",
  },
  {
    name: "Marcus Hall",
    action: "Completed onboarding",
    dept: "Design",
    date: "Jun 1, 2026",
    status: "success",
  },
  {
    name: "Priya Sharma",
    action: "Updated profile",
    dept: "Marketing",
    date: "May 31, 2026",
    status: "success",
  },
  {
    name: "David Kim",
    action: "Missed check-in",
    dept: "Sales",
    date: "May 31, 2026",
    status: "error",
  },
  {
    name: "Omar Farouk",
    action: "Submitted report",
    dept: "Analytics",
    date: "May 30, 2026",
    status: "success",
  },
  {
    name: "Nina Petrov",
    action: "Applied for leave",
    dept: "Engineering",
    date: "May 30, 2026",
    status: "pending",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: {
      label: "Pending",
      cls: "bg-amber-50 text-amber-600 border-amber-200",
    },
    approved: {
      label: "Approved",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-red-50 text-red-600 border-red-200",
    },
    success: {
      label: "Done",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    error: { label: "Alert", cls: "bg-red-50 text-red-600 border-red-200" },
    interview: {
      label: "Interview",
      cls: "bg-blue-50 text-blue-600 border-blue-200",
    },
    screening: {
      label: "Screening",
      cls: "bg-amber-50 text-amber-600 border-amber-200",
    },
    offer: {
      label: "Offer",
      cls: "bg-purple-50 text-purple-600 border-purple-200",
    },
    applied: {
      label: "Applied",
      cls: "bg-slate-50 text-slate-600 border-slate-200",
    },
    hired: {
      label: "Hired",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    scheduled: {
      label: "Scheduled",
      cls: "bg-blue-50 text-blue-600 border-blue-200",
    },
    completed: {
      label: "Completed",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    active: {
      label: "Active",
      cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  };
  const { label, cls } =
    map[status] ?? { label: status, cls: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${cls}`}
    >
      {label}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const avatarColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];
function avatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  up,
  color,
  iconColor,
  trendLabel,
}: (typeof orgStats)[0]) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-[#10B981]" : "text-[#EF4444]"}`}
        >
          {up ? (
            <TrendingUp className="w-3.5 h-3.5" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" />
          )}
          {trend}
        </span>
      </div>
      <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
      <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
      <p className="text-xs text-[#64748B]/70 mt-1">{trendLabel}</p>
    </div>
  );
}

function AttendanceCard({
  data,
  label,
  canAction,
}: {
  data: typeof attendanceBreakdown;
  label: string;
  canAction: boolean;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#1E293B]">{label}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Today —{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {canAction && (
            <button className="text-xs text-[#2563EB] font-medium hover:underline">
              Manage
            </button>
          )}
          <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
            Live
          </span>
        </div>
      </div>
      <div className="space-y-3.5">
        {data.map(({ label: l, value, total, color }) => (
          <div key={l}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-[#64748B]">{l}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#1E293B]">
                  {value}
                </span>
                <span className="text-xs text-[#64748B]">
                  {Math.round((value / total) * 100)}%
                </span>
              </div>
            </div>
            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(value / total) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaveCard({
  requests,
  canAction,
  label,
}: {
  requests: typeof allLeaveRequests;
  canAction: boolean;
  label: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base font-semibold text-[#1E293B]">{label}</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            {requests.filter((r) => r.status === "pending").length} pending review
          </p>
        </div>
        <button className="text-xs text-[#2563EB] font-medium hover:underline">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {requests.map(({ name, dept, type, days, status }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}
            >
              <span className="text-white text-xs font-bold">
                {initials(name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1E293B] truncate">
                {name}
              </p>
              <p className="text-xs text-[#64748B]">
                {dept} · {type} · {days}d
              </p>
            </div>
            {canAction && status === "pending" ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium hover:bg-emerald-100 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Approve
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-200 text-xs font-medium hover:bg-red-100 transition-colors">
                  <ThumbsDown className="w-3 h-3" /> Reject
                </button>
              </div>
            ) : (
              <StatusBadge status={status} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewsCard({
  reviews,
  label,
}: {
  reviews: typeof allReviews;
  label: string;
}) {
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] p-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-[#10B981]" />
        <h3 className="text-base font-semibold text-[#1E293B]">{label}</h3>
      </div>
      <div className="space-y-4">
        {reviews.map(({ name, role, due, progress }) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <p className="text-sm font-medium text-[#1E293B]">{name}</p>
                <p className="text-xs text-[#64748B]">
                  {role} · Due {due}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#2563EB]">
                {progress}%
              </span>
            </div>
            <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor:
                    progress >= 70
                      ? "#10B981"
                      : progress >= 40
                        ? "#F59E0B"
                        : "#EF4444",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Role label helper ────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  senior_manager: "Senior Manager",
  hr_recruiter: "HR Recruiter",
  employee: "Employee",
  candidate: "Candidate",
};

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
    }
  }, []);

  const role = user?.role;
  const isHR = role === "hr_recruiter" || role === "admin";
  const isManager = role === "senior_manager";
  const isEmployee = role === "employee";
  const isCandidate = role === "candidate";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const userInitials = initials(user?.full_name ?? "U");
  const userAvatarColor = avatarColor(user?.full_name ?? "U");
  const roleLabel = ROLE_LABELS[role ?? ""] ?? role ?? "User";

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-20 h-18 bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4 shrink-0">
          <button
            className="lg:hidden text-[#64748B] hover:text-[#1E293B] transition-colors mr-1"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base font-semibold text-[#1E293B]">Dashboard</h1>
            <p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
          </div>

          <div className="flex-1 max-w-xs ml-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                type="search"
                placeholder="Search employees, jobs..."
                className="pl-9 h-9 text-sm bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div
                className={`w-8 h-8 rounded-full ${userAvatarColor} flex items-center justify-center`}
              >
                <span className="text-white text-xs font-bold">
                  {userInitials}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#1E293B] leading-none">
                  {user?.full_name ?? "Loading..."}
                </p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
                  {roleLabel}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* WELCOME HERO */}
          <div
            className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
            style={{
              background:
                "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-blue-500/10" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-12 h-12 rounded-full ${userAvatarColor} flex items-center justify-center border-2 border-white/30`}
                  >
                    <span className="text-white text-sm font-bold">
                      {userInitials}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/30 mb-1">
                      {roleLabel}
                    </span>
                    <p className="text-blue-200 text-xs">{today}</p>
                  </div>
                </div>

                {(isHR || isManager) && (
                  <>
                    <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">
                      Welcome back, {firstName} 👋
                    </h2>
                    <p className="text-blue-200 text-sm max-w-md">
                      You have{" "}
                      <strong className="text-white">
                        3 pending leave requests
                      </strong>
                      , <strong className="text-white">2 interviews</strong>{" "}
                      today, and{" "}
                      <strong className="text-white">5 open positions</strong>{" "}
                      to review.
                    </p>
                  </>
                )}

                {isEmployee && (
                  <>
                    <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">
                      Good morning, {firstName} 👋
                    </h2>
                    <p className="text-blue-200 text-sm max-w-md">
                      You have{" "}
                      <strong className="text-white">
                        1 pending leave request
                      </strong>{" "}
                      and your performance review is due{" "}
                      <strong className="text-white">Jun 12</strong>.
                    </p>
                  </>
                )}

                {isCandidate && (
                  <>
                    <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">
                      Hey {firstName}, you're on track! 🚀
                    </h2>
                    <p className="text-blue-200 text-sm max-w-md">
                      You have{" "}
                      <strong className="text-white">1 interview today</strong>{" "}
                      at 10:00 AM and your AI score is in the{" "}
                      <strong className="text-white">top 8%</strong>.
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                {(isHR || isManager) && (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">3</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Pending Actions
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">2</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Interviews Today
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">5</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Open Positions
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">12</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Leave Requests
                      </p>
                    </div>
                  </>
                )}
                {isEmployee && (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">18</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Days Present
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">9d</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Leave Balance
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">87%</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Perf. Score
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">14</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Tasks Done
                      </p>
                    </div>
                  </>
                )}
                {isCandidate && (
                  <>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">3</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Applications
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">2</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Interviews
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">92</p>
                      <p className="text-blue-200 text-xs mt-0.5">AI Score</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                      <p className="text-white text-xl font-bold">1</p>
                      <p className="text-blue-200 text-xs mt-0.5">
                        Offer Pending
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* KPI STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {(isHR || isManager) &&
              orgStats.map((s) => <StatCard key={s.label} {...s} />)}
            {isEmployee &&
              employeeStats.map((s) => <StatCard key={s.label} {...s} />)}
            {isCandidate &&
              candidateStats.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          {/* ROW 2: Attendance + Leave */}
          {(isHR || isManager || isEmployee) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AttendanceCard
                data={isEmployee ? personalAttendance : attendanceBreakdown}
                label={isEmployee ? "My Attendance" : "Attendance Overview"}
                canAction={isHR}
              />
              <LeaveCard
                requests={isEmployee ? myLeaveRequests : allLeaveRequests}
                canAction={isHR}
                label={isEmployee ? "My Leave Requests" : "Leave Requests"}
              />
            </div>
          )}

          {/* ROW 3: Recruitment Pipeline + Applications */}
          {(isHR || isManager || isCandidate) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recruitment Pipeline — HR/Manager only */}
              {(isHR || isManager) && (
                <div
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-semibold text-[#1E293B]">
                        Recruitment Pipeline
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        87 total candidates
                      </p>
                    </div>
                    <BarChart3 className="w-4 h-4 text-[#64748B]" />
                  </div>
                  <div className="space-y-3">
                    {pipeline.map(({ stage, count, color }) => (
                      <div key={stage}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-[#64748B]">{stage}</span>
                          <span className="text-sm font-semibold text-[#1E293B]">
                            {count}
                          </span>
                        </div>
                        <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${(count / 48) * 100}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications — HR/Manager see all; Candidate sees own */}
              {(isHR || isManager || isCandidate) && (
                <div
                  className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-base font-semibold text-[#1E293B]">
                        {isCandidate
                          ? "My Applications"
                          : "Recent Applications"}
                      </h3>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {isCandidate
                          ? "Track your submitted applications"
                          : "AI-scored candidates"}
                      </p>
                    </div>
                    <button className="text-xs text-[#2563EB] font-medium hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(isCandidate ? myApplications : allApplications).map(
                      ({ name, role: r, score, status }, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
                        >
                          <div
                            className={`w-9 h-9 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}
                          >
                            <span className="text-white text-xs font-bold">
                              {initials(name)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#1E293B] truncate">
                              {r}
                            </p>
                            {!isCandidate && (
                              <p className="text-xs text-[#64748B] truncate">
                                {name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100">
                              <Bot className="w-3 h-3 text-purple-500" />
                              <span className="text-xs font-semibold text-purple-600">
                                {score}
                              </span>
                            </div>
                            <StatusBadge status={status} />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ROW 4: Interviews + Birthdays + Reviews */}
          {(isHR || isManager || isCandidate || isEmployee) &&
            (() => {
              const showInterviews = isHR || isManager || isCandidate;
              const showBirthdays = isHR;
              const showReviews = isHR || isManager || isEmployee;
              const colCount = [
                showInterviews,
                showBirthdays,
                showReviews,
              ].filter(Boolean).length;
              if (colCount === 0) return null;

              return (
                <div
                  className={`grid grid-cols-1 gap-4 ${colCount === 3 ? "md:grid-cols-3" : colCount === 2 ? "md:grid-cols-2" : ""}`}
                >
                  {showInterviews && (
                    <div
                      className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Video className="w-4 h-4 text-[#2563EB]" />
                        <h3 className="text-base font-semibold text-[#1E293B]">
                          {isCandidate
                            ? "My Interviews"
                            : "Upcoming Interviews"}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {(isCandidate ? myInterviews : allInterviews).map(
                          ({ candidate, role: r, time, date, type }) => (
                            <div
                              key={candidate + time}
                              className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-colors"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-medium text-[#1E293B]">
                                    {isCandidate ? r : candidate}
                                  </p>
                                  {!isCandidate && (
                                    <p className="text-xs text-[#64748B]">
                                      {r}
                                    </p>
                                  )}
                                </div>
                                <span className="px-2 py-0.5 text-xs bg-blue-50 text-[#2563EB] rounded-full border border-blue-100 shrink-0">
                                  {type}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="w-3 h-3 text-[#64748B]" />
                                <span className="text-xs text-[#64748B]">
                                  {date} at {time}
                                </span>
                                {isCandidate && (
                                  <button className="ml-auto text-xs text-[#2563EB] font-medium hover:underline">
                                    Join
                                  </button>
                                )}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {showBirthdays && (
                    <div
                      className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Cake className="w-4 h-4 text-amber-500" />
                        <h3 className="text-base font-semibold text-[#1E293B]">
                          Upcoming Birthdays
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {birthdays.map(({ name, dept, date }) => (
                          <div key={name} className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}
                            >
                              <span className="text-white text-xs font-bold">
                                {initials(name)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1E293B] truncate">
                                {name}
                              </p>
                              <p className="text-xs text-[#64748B]">{dept}</p>
                            </div>
                            <span
                              className={`text-xs font-medium shrink-0 ${date === "Today" ? "text-amber-600" : "text-[#64748B]"}`}
                            >
                              {date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showReviews && (
                    <ReviewsCard
                      reviews={isEmployee ? myReview : allReviews}
                      label={
                        isEmployee
                          ? "My Performance Review"
                          : "Upcoming Reviews"
                      }
                    />
                  )}
                </div>
              );
            })()}

          {/* RECENT ACTIVITY TABLE — HR / Admin only */}
          {isHR && (
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    Recent Activity
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Latest employee actions and updates
                  </p>
                </div>
                <button className="text-xs text-[#2563EB] font-medium hover:underline">
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      {[
                        "Employee",
                        "Action",
                        "Department",
                        "Date",
                        "Status",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {activityLog.map(({ name, action, dept, date, status }) => (
                      <tr
                        key={`${name}-${date}`}
                        className="hover:bg-[#F8FAFC] transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}
                            >
                              <span className="text-white text-xs font-bold">
                                {initials(name)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">
                              {name}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">
                          {action}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">
                          {dept}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">
                          {date}
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <StatusBadge status={status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CANDIDATE ONLY CARDS */}
          {isCandidate && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* AI Interview Card */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-500" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    AI Interview
                  </h3>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-[#1E293B]">
                        Senior Engineer Role
                      </p>
                      <StatusBadge status="scheduled" />
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3 text-[#64748B]" />
                      <span className="text-xs text-[#64748B]">
                        Today at 10:00 AM · 45 min
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-100">
                    <Star className="w-4 h-4 text-purple-500" />
                    <div>
                      <p className="text-xs font-semibold text-purple-700">
                        Your AI Score: 92 / 100
                      </p>
                      <p className="text-xs text-purple-500">
                        Top 8% of candidates
                      </p>
                    </div>
                  </div>
                </div>
                <button className="w-full h-9 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                  Start AI Interview
                </button>
              </div>

              {/* Resume Status Card */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    Resume Status
                  </h3>
                </div>
                <div className="space-y-3">
                  {[
                    { stage: "Uploaded", done: true },
                    { stage: "AI Parsed", done: true },
                    { stage: "HR Reviewed", done: true },
                    { stage: "Shortlisted", done: false },
                  ].map(({ stage, done }) => (
                    <div key={stage} className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-[#10B981]" : "bg-[#E2E8F0]"}`}
                      >
                        {done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${done ? "text-[#1E293B] font-medium" : "text-[#64748B]"}`}
                      >
                        {stage}
                      </span>
                      {done && (
                        <span className="ml-auto text-xs text-[#10B981] font-medium">
                          Done
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#64748B]">
                      Overall Progress
                    </span>
                    <span className="text-xs font-semibold text-[#2563EB]">
                      75%
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2563EB] rounded-full"
                      style={{ width: "75%" }}
                    />
                  </div>
                </div>
              </div>

              {/* Offer Letter Card */}
              <div
                className="bg-white rounded-xl border border-[#E2E8F0] p-5"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <h3 className="text-base font-semibold text-[#1E293B]">
                    Offer Letter
                  </h3>
                </div>
                <div className="p-4 rounded-xl bg-linear-to-br from-emerald-50 to-blue-50 border border-emerald-100 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-semibold text-[#10B981]">
                      Offer Extended
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#1E293B]">
                    Senior Engineer
                  </p>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    MyGreenhouse · Full Time
                  </p>
                  <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-xs text-[#64748B]">Deadline</span>
                    <span className="text-xs font-semibold text-amber-600">
                      Jun 10, 2026
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 h-9 bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors">
                    Accept
                  </button>
                  <button className="flex-1 h-9 border border-[#E2E8F0] text-[#64748B] hover:border-red-300 hover:text-red-600 text-sm font-medium rounded-lg transition-colors">
                    Decline
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}