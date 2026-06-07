"use client";

/**
 * MyTeamHQ – Role-aware Sidebar
 *
 * Next.js usage (swap the two imports below):
 *   import { usePathname, useRouter } from "next/navigation";
 *   const pathname = usePathname();
 *   const router  = useRouter();
 *   onClick={() => router.push(item.href)
 *
 * Vite / wouter (current demo):
 *   import { useLocation } from "wouter";
 *   const [pathname, navigate] = useLocation();
 *   onClick={() => navigate(item.href)
 */

import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  DollarSign,
  Briefcase,
  FileSearch,
  Bot,
  BarChart2,
  Settings,
  TrendingUp,
  FileText,
  Mail,
  User,
  X,
  MoreHorizontal,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ─── Nav definitions ─────────────────────────────────────────────────────────

type NavItem = { label: string; icon: React.ElementType; href: string };

const NAV: Record<string, NavItem[]> = {
	admin: [
		{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
		{ label: "Employees", icon: Users, href: "/dashboard/employees" },
		{ label: "Payroll", icon: DollarSign, href: "/dashboard/payroll" },
		{ label: "Leave", icon: ClipboardList, href: "/dashboard/leave" },
		{ label: "Recruitment", icon: Briefcase, href: "/recruitment" },
		{
			label: "Resume Ranking",
			icon: FileSearch,
			href: "/dashboard/resume-ranking",
		},
		{ label: "Reports", icon: BarChart2, href: "dashboard/reports" },
	],
	hr_recruiter: [
		{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
		{ label: "Employees", icon: Users, href: "/dashboard/employees" },
		{ label: "Leave", icon: ClipboardList, href: "/dashboard/leave" },
		{ label: "Payroll", icon: DollarSign, href: "/dashboard/payroll" },
		{ label: "Recruitment", icon: Briefcase, href: "/recruitment" },
		{
			label: "Resume Ranking",
			icon: FileSearch,
			href: "/dashboard/resume-ranking",
		},
		{ label: "Reports", icon: BarChart2, href: "dashboard/reports" },
	],
	senior_manager: [
		{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
		{ label: "Workforce Overview", icon: Users, href: "/workforce" },
		{ label: "Leave", icon: ClipboardList, href: "/dashboard/leave" },
		{ label: "Payroll Overview", icon: DollarSign, href: "/dashboard/payroll" },
		{ label: "Recruitment Pipeline", icon: Briefcase, href: "/recruitment" },
		{ label: "Analytics", icon: TrendingUp, href: "/analytics" },
		{ label: "Reports", icon: BarChart2, href: "dashboard/reports" },
	],
	employee: [
		{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
		{ label: "My Profile", icon: User, href: "/dashboard/profile" },
		{ label: "Leave", icon: ClipboardList, href: "/dashboard/leave" },
		{ label: "My Payslips", icon: DollarSign, href: "/dashboard/payroll"},
	],
	candidate: [
		{
			label: "My Applications",
			icon: FileText,
			href: "/dashboard/candidate/my-application",
		},
		{
			label: "Interview Schedule",
			icon: Calendar,
			href: "/dashboard/candidate/interview-schedule",
		},
		{
			label: "AI Interview",
			icon: Bot,
			href: "/dashboard/candidate/ai-interview",
		},
		{
			label: "Resume Status",
			icon: FileSearch,
			href: "/dashboard/candidate/resume-status",
		},
		{
			label: "Offer Letter",
			icon: Mail,
			href: "/dashboard/candidate/offer-letter",
		},
		{ label: "My Profile", icon: User, href: "/dashboard/profile" },
	],
};

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  hr_recruiter: "HR Recruiter",
  senior_manager: "Senior Manager",
  employee: "Employee",
  candidate: "Candidate",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
// ─── Component ────────────────────────────────────────────────────────────────

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const role = user?.role ?? "employee";

  const navItems = NAV[role] ?? NAV.employee;
  const roleLabel = ROLE_LABELS[role] ?? role;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          // REPLACE WITH
          "fixed top-0 left-0 h-screen z-40 flex flex-col  w-70",
          "transition-transform duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto lg:shrink-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        style={{
          background: "linear-gradient(180deg, #0f172a 0%, #1a2744 100%)",
        }}
      >
        {/* ── Logo ── */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-sm bg-white" />
          </div>
          <span className="text-white font-bold text-[17px] tracking-tight">
            MyTeamHQ
          </span>
          {onClose && (
            <button
              className="ml-auto lg:hidden text-white/50 hover:text-white transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── Role badge ── */}
        <div className="px-6 pt-4 pb-2 shrink-0">
          <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-full bg-[#2563EB]/20 text-blue-300 border border-blue-500/20">
            {roleLabel}
          </span>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-none">
          {navItems.map(({ label, icon: Icon, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={[
                  "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium",
                  "relative transition-all duration-150 group",
                  active
                    ? "bg-[#2563EB]/20 text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                ].join(" ")}
              >
                {/* left active bar */}
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#2563EB] rounded-r-full" />
                )}
                <Icon
                  className={[
                    "w-4 h-4 shrink-0 transition-colors",
                    active
                      ? "text-[#2563EB]"
                      : "text-slate-500 group-hover:text-slate-300",
                  ].join(" ")}
                />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── User profile ── */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors">
            {/* Avatar circle with initials */}
            <div className="w-9 h-9 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">
                {getInitials(user?.full_name ?? "")}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.full_name || "User"}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {user?.role || "Role"}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-slate-400 hover:text-white transition-colors shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-44">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    logout();
                    router.replace("/auth/login");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
    </>
  );
}
