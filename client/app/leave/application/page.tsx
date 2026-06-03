"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Menu,
  X,
  MoreHorizontal,
  ChevronRight,
  ArrowLeft,
  Calendar,
} from "lucide-react";

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

const leaveTypes = [
  { value: "SICK", label: "Sick Leave" },
  { value: "CASUAL", label: "Casual Leave" },
  { value: "ANNUAL", label: "Annual Leave" },
  { value: "UNPAID", label: "Unpaid Leave" },
];

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function LeaveApplicationPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile] = useState({ name: "John Doe", role: "HR Recruiter" });

  const [formData, setFormData] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.leave_type || !formData.start_date || !formData.end_date || !formData.reason) {
      setError("All fields are required");
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      // TODO: Get actual employee_id from auth context
      const res = await fetch(`${apiUrl}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: "00000000-0000-0000-0000-000000000000",
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit leave request");
      }

      setSuccess("Leave request submitted successfully!");
      setFormData({ leave_type: "CASUAL", start_date: "", end_date: "", reason: "" });

      setTimeout(() => {
        router.push("/leave");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <div>
            <h1 className="text-base font-semibold text-[#1E293B]">Apply for Leave</h1>
            <p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
              <Bell className="w-4 h-4" />
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
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Leave Type */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Leave Type</label>
                  <select
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                  >
                    {leaveTypes.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                      <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1E293B] mb-2">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                      <input
                        type="date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        className="w-full pl-9 pr-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E293B] mb-2">Reason</label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    placeholder="Enter reason for leave..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB] resize-none"
                  />
                </div>

                {/* Messages */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg">
                    {success}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2563EB] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Leave Request"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
