"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leave } from "./types";

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
  Menu,
  X,
  MoreHorizontal,
  ChevronRight,
  Plus,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
  { icon: Users, label: "Employees", link: "" },
  { icon: CalendarCheck, label: "Attendance", link: "" },
  { icon: ClipboardList, label: "Leave", active: true, link: "/leave" },
  { icon: DollarSign, label: "Payroll", link: "" },
  { icon: UserSearch, label: "Recruitment", link: "" },
  { icon: Bot, label: "AI Evaluation", link: "" },
  { icon: Settings, label: "Settings", link: "" },
];


function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-600 border-amber-200" },
    APPROVED: { label: "Approved", cls: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

const avatarColors = ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-indigo-500"];
function avatarColor(name: string) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function LeavePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({ name: "John Doe", role: "HR Recruiter" });

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
        const res = await fetch(`${apiUrl}/leave`);
        if (res.ok) {
          const data = await res.json();
          setLeaves(data);
        }
      } catch (error) {
        console.error("Failed to fetch leaves:", error);
        // TODO: Add error toast/notification
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const approvedCount = leaves.filter(l => l.status === "APPROVED").length;
  const pendingCount = leaves.filter(l => l.status === "PENDING").length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      {/* ── SIDEBAR ── */}
      <>
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

          <div className="px-3 py-4 border-t border-white/10">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{initials(userProfile.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{userProfile.name}</p>
                <p className="text-slate-400 text-xs truncate">{userProfile.role}</p>
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
            <h1 className="text-base font-semibold text-[#1E293B]">Leave Management</h1>
            <p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
          </div>

          <div className="flex-1 max-w-xs ml-4 hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <Input
                type="search"
                placeholder="Search leaves..."
                className="pl-9 h-9 text-sm bg-[#F8FAFC] border-[#E2E8F0] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
              <Bell className="w-4 h-4" />
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
              )}
            </button>

            <div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
              <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials(userProfile.name)}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[#1E293B] leading-none">{userProfile.name}</p>
                <span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
                  {userProfile.role}
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
                    <span className="text-white text-sm font-bold">{initials(userProfile.name)}</span>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-blue-500/30 text-blue-200 rounded-full border border-blue-400/30 mb-1">
                      {userProfile.role}
                    </span>
                    <p className="text-blue-200 text-xs">{today}</p>
                  </div>
                </div>
                <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">Welcome back, {userProfile.name.split(" ")[0]} 👋</h2>
                <p className="text-blue-200 text-sm max-w-md">
                  You have <strong className="text-white">{pendingCount} pending leaves</strong> and <strong className="text-white">{approvedCount} approved</strong> in the system.
                </p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button
                  onClick={() => router.push("/leave/application")}
                  className="flex items-center gap-2 bg-white text-[#0f172a] px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Apply Leave
                </button>
                <button
                  onClick={() => router.push("/leave/review")}
                  className="flex items-center gap-2 bg-blue-600/20 border border-blue-400/30 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600/30 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Review Leaves
                </button>
              </div>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#2563EB]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{leaves.length}</p>
              <p className="text-sm text-[#64748B] mt-0.5">Total Leaves</p>
            </div>

            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{approvedCount}</p>
              <p className="text-sm text-[#64748B] mt-0.5">Approved</p>
            </div>

            <div
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{pendingCount}</p>
              <p className="text-sm text-[#64748B] mt-0.5">Pending</p>
            </div>
          </div>

          {/* LEAVES LIST */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B]">All Leaves</h3>
                <p className="text-xs text-[#64748B] mt-0.5">{leaves.length} total requests</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-[#64748B]">Loading leaves...</div>
            ) : leaves.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-[#64748B]/40 mx-auto mb-2" />
                <p className="text-[#64748B]">No leaves found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaves.map(({ id, leave_type, start_date, end_date, status, reason }) => {
                  const startDate = new Date(start_date);
                  const endDate = new Date(end_date);
                  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

                  return (
                    <div key={id} className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-[#2563EB]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1E293B]">{leave_type}</p>
                        <p className="text-xs text-[#64748B]">
                          {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()} · {days} days
                        </p>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}