"use client";
import { useState } from "react";
import  {useRouter} from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  DollarSign,
  UserSearch,
  Bot,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Briefcase,
  ChevronRight,
  Menu,
  X,
  MoreHorizontal,
  Clock,
  Cake,
  Video,
  FileText,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
	{ icon: LayoutDashboard, label: "Dashboard", active: true, link: "dashboard" },
	{ icon: Users, label: "Employees", link: "" },
	{ icon: CalendarCheck, label: "Attendance", link: "" },
	{ icon: ClipboardList, label: "Leave", link: "/leave" },
	{ icon: DollarSign, label: "Payroll", link: "" },
	{ icon: UserSearch, label: "Recruitment", link: "" },
	{ icon: Bot, label: "AI Evaluation", link: "" },
	{ icon: Settings, label: "Settings", link: "" },

];

const stats = [
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

const attendanceBreakdown = [
  { label: "Present", value: 201, total: 248, color: "#10B981" },
  { label: "On Leave", value: 12, total: 248, color: "#F59E0B" },
  { label: "Remote", value: 28, total: 248, color: "#2563EB" },
  { label: "Absent", value: 7, total: 248, color: "#EF4444" },
];

const leaveRequests = [
  { name: "Sarah Chen", dept: "Engineering", type: "Annual Leave", days: 3, status: "pending" },
  { name: "Marcus Hall", dept: "Design", type: "Sick Leave", days: 1, status: "approved" },
  { name: "Priya Sharma", dept: "Marketing", type: "Maternity", days: 90, status: "approved" },
  { name: "David Kim", dept: "Sales", type: "Annual Leave", days: 5, status: "pending" },
];

const pipeline = [
  { stage: "Applied", count: 48, color: "#64748B" },
  { stage: "Screening", count: 22, color: "#F59E0B" },
  { stage: "Interview", count: 11, color: "#2563EB" },
  { stage: "Offer", count: 4, color: "#10B981" },
  { stage: "Hired", count: 2, color: "#7C3AED" },
];

const applications = [
  { name: "Alex Rivera", role: "Senior Engineer", score: 92, status: "interview" },
  { name: "Julia Park", role: "Product Designer", score: 88, status: "screening" },
  { name: "Omar Farouk", role: "Data Scientist", score: 95, status: "offer" },
  { name: "Nina Petrov", role: "DevOps Lead", score: 79, status: "applied" },
];

const interviews = [
  { candidate: "Alex Rivera", role: "Senior Engineer", time: "10:00 AM", date: "Today", type: "Technical" },
  { candidate: "Julia Park", role: "Product Designer", time: "2:30 PM", date: "Today", type: "Portfolio" },
  { candidate: "Omar Farouk", role: "Data Scientist", time: "11:00 AM", date: "Tomorrow", type: "Final" },
];

const birthdays = [
  { name: "Maria Gonzalez", dept: "HR", date: "Today" },
  { name: "Tom Bradley", dept: "Engineering", date: "Jun 3" },
  { name: "Aiko Tanaka", dept: "Finance", date: "Jun 5" },
  { name: "Leon Weber", dept: "Sales", date: "Jun 8" },
];

const reviews = [
  { name: "Derek Lam", role: "Senior Dev", due: "Jun 5", progress: 65 },
  { name: "Carla Martin", role: "UX Lead", due: "Jun 7", progress: 40 },
  { name: "Ben Okafor", role: "Analyst", due: "Jun 10", progress: 80 },
];

const activityLog = [
  { name: "Sarah Chen", action: "Applied for leave", dept: "Engineering", date: "Jun 1, 2026", status: "pending" },
  { name: "Marcus Hall", action: "Completed onboarding", dept: "Design", date: "Jun 1, 2026", status: "success" },
  { name: "Priya Sharma", action: "Updated profile", dept: "Marketing", date: "May 31, 2026", status: "success" },
  { name: "David Kim", action: "Missed check-in", dept: "Sales", date: "May 31, 2026", status: "error" },
  { name: "Omar Farouk", action: "Submitted report", dept: "Analytics", date: "May 30, 2026", status: "success" },
  { name: "Nina Petrov", action: "Applied for leave", dept: "Engineering", date: "May 30, 2026", status: "pending" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending: { label: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    approved: { label: "Approved", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    rejected: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200" },
    success: { label: "Done", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    error: { label: "Alert", cls: "bg-red-50 text-red-600 border-red-200" },
    interview: { label: "Interview", cls: "bg-blue-50 text-blue-600 border-blue-200" },
    screening: { label: "Screening", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    offer: { label: "Offer", cls: "bg-purple-50 text-purple-600 border-purple-200" },
    applied: { label: "Applied", cls: "bg-slate-50 text-slate-600 border-slate-200" },
    hired: { label: "Hired", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500"];
function avatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      router.replace("/auth/login");
    }
  }, [router])

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      {/* ── SIDEBAR ── */}
      <>
        {/* mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 h-full z-40 flex flex-col
            w-70 transition-transform duration-300
            lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ background: "linear-gradient(180deg, #0f172a 0%, #1a2744 100%)" }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
              <div className="w-4 h-4 rounded-sm bg-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">MyGreenhouse</span>
            <button
              className="ml-auto lg:hidden text-white/60 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {navItems.map(({ icon: Icon, label, active, link }) => (
              <button
                key={label}
                onClick={() => router.push(link)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group relative
                  ${active
                    ? "bg-[#2563EB]/20 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}
                `}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#2563EB] rounded-r-full" />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#2563EB]" : ""}`} />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
              </button>
            ))}
          </nav>

          {/* User profile */}
          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">JD</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">John Doe</p>
                <p className="text-slate-400 text-xs truncate">HR Recruiter</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-slate-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => router.push("/auth/login")}
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>
      </>

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
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white text-xs font-bold">JD</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#1E293B] leading-none">John Doe</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
                  HR Recruiter
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
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)" }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-blue-500/10" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30">
                    <span className="text-white text-sm font-bold">JD</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/30 mb-1">
                      HR Recruiter
                    </span>
                    <p className="text-blue-200 text-xs">{today}</p>
                  </div>
                </div>
                <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">Welcome back, John 👋</h2>
                <p className="text-blue-200 text-sm max-w-md">
                  You have <strong className="text-white">3 pending leave requests</strong>, <strong className="text-white">2 interviews</strong> today, and <strong className="text-white">5 open positions</strong> to review.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                  <p className="text-white text-xl font-bold">3</p>
                  <p className="text-blue-200 text-xs mt-0.5">Pending Actions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                  <p className="text-white text-xl font-bold">2</p>
                  <p className="text-blue-200 text-xs mt-0.5">Interviews Today</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                  <p className="text-white text-xl font-bold">5</p>
                  <p className="text-blue-200 text-xs mt-0.5">Open Positions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 border border-white/20 text-center">
                  <p className="text-white text-xl font-bold">12</p>
                  <p className="text-blue-200 text-xs mt-0.5">Leave Requests</p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, trend, up, color, iconColor, trendLabel }) => (
              <div
                key={label}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-semibold ${up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {trend}
                  </span>
                </div>
                <p className="text-3xl font-bold text-[#1E293B]">{value}</p>
                <p className="text-sm text-[#64748B] mt-0.5">{label}</p>
                <p className="text-xs text-[#64748B]/70 mt-1">{trendLabel}</p>
              </div>
            ))}
          </div>

          {/* ROW 2: Attendance + Leave Requests */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Attendance Overview */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B]">Attendance Overview</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">Today — Jun 1, 2026</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
                  Live
                </span>
              </div>
              <div className="space-y-3.5">
                {attendanceBreakdown.map(({ label, value, total, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-sm text-[#64748B]">{label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#1E293B]">{value}</span>
                        <span className="text-xs text-[#64748B]">{Math.round(value / total * 100)}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(value / total) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave Requests */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B]">Leave Requests</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">4 pending review</p>
                </div>
                <button className="text-xs text-[#2563EB] font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {leaveRequests.map(({ name, dept, type, days, status }) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                    <div className={`w-8 h-8 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{initials(name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B] truncate">{name}</p>
                      <p className="text-xs text-[#64748B]">{dept} · {type} · {days}d</p>
                    </div>
                    <StatusBadge status={status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 3: Recruitment Pipeline + Recent Applications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Pipeline */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B]">Recruitment Pipeline</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">87 total candidates</p>
                </div>
                <BarChart3 className="w-4 h-4 text-[#64748B]" />
              </div>
              <div className="space-y-3">
                {pipeline.map(({ stage, count, color }) => (
                  <div key={stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#64748B]">{stage}</span>
                      <span className="text-sm font-semibold text-[#1E293B]">{count}</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${(count / 48) * 100}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B]">Recent Applications</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">AI-scored candidates</p>
                </div>
                <button className="text-xs text-[#2563EB] font-medium hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {applications.map(({ name, role, score, status }) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                    <div className={`w-9 h-9 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{initials(name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B] truncate">{name}</p>
                      <p className="text-xs text-[#64748B] truncate">{role}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100">
                        <Bot className="w-3 h-3 text-purple-500" />
                        <span className="text-xs font-semibold text-purple-600">{score}</span>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ROW 4: Interviews + Birthdays + Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Upcoming Interviews */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Video className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-base font-semibold text-[#1E293B]">Upcoming Interviews</h3>
              </div>
              <div className="space-y-3">
                {interviews.map(({ candidate, role, time, date, type }) => (
                  <div key={candidate} className="p-3 rounded-lg border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-[#1E293B]">{candidate}</p>
                        <p className="text-xs text-[#64748B]">{role}</p>
                      </div>
                      <span className="px-2 py-0.5 text-xs bg-blue-50 text-[#2563EB] rounded-full border border-blue-100 shrink-0">
                        {type}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="w-3 h-3 text-[#64748B]" />
                      <span className="text-xs text-[#64748B]">{date} at {time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Birthdays */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Cake className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-semibold text-[#1E293B]">Upcoming Birthdays</h3>
              </div>
              <div className="space-y-3">
                {birthdays.map(({ name, dept, date }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}>
                      <span className="text-white text-xs font-bold">{initials(name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1E293B] truncate">{name}</p>
                      <p className="text-xs text-[#64748B]">{dept}</p>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ${date === "Today" ? "text-amber-600" : "text-[#64748B]"}`}>
                      {date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Reviews */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-[#10B981]" />
                <h3 className="text-base font-semibold text-[#1E293B]">Upcoming Reviews</h3>
              </div>
              <div className="space-y-4">
                {reviews.map(({ name, role, due, progress }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-medium text-[#1E293B]">{name}</p>
                        <p className="text-xs text-[#64748B]">{role} · Due {due}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#2563EB]">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: progress >= 70 ? "#10B981" : progress >= 40 ? "#F59E0B" : "#EF4444",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RECENT ACTIVITY TABLE */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B]">Recent Activity</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Latest employee actions and updates</p>
              </div>
              <button className="text-xs text-[#2563EB] font-medium hover:underline">Export</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    {["Employee", "Action", "Department", "Date", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {activityLog.map(({ name, action, dept, date, status }) => (
                    <tr key={`${name}-${date}`} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${avatarColor(name)} flex items-center justify-center shrink-0`}>
                            <span className="text-white text-xs font-bold">{initials(name)}</span>
                          </div>
                          <span className="text-sm font-medium text-[#1E293B] whitespace-nowrap">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">{action}</td>
                      <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">{dept}</td>
                      <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">{date}</td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
