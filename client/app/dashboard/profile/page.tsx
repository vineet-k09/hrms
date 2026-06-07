"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import Sidebar from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";

import {
  User,
  Mail,
  Briefcase,
  Shield,
  LogOut,
  Pencil,
  Camera,
  CheckCircle2,
  IdCard,
  Menu,
} from "lucide-react";

type UserRole =
  | "admin"
  | "senior_manager"
  | "hr_recruiter"
  | "employee"
  | "candidate";

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin",
  senior_manager: "Senior Manager",
  hr_recruiter: "HR Recruiter",
  employee: "Employee",
  candidate: "Candidate",
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-purple-50 text-purple-600 border-purple-200",
  senior_manager: "bg-amber-50 text-amber-600 border-amber-200",
  hr_recruiter: "bg-blue-50 text-blue-600 border-blue-200",
  employee: "bg-emerald-50 text-emerald-600 border-emerald-200",
  candidate: "bg-slate-50 text-slate-600 border-slate-200",
};

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-indigo-500",
];

function avatarColor(name?: string) {
  if (!name) return AVATAR_COLORS[0];

  return AVATAR_COLORS[
    name.charCodeAt(0) % AVATAR_COLORS.length
  ];
}

export default function ProfilePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuth();

  const initials = useMemo(() => {
    if (!user?.full_name) return "U";

    return user.full_name
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-sm text-slate-500">
          Loading profile...
        </div>
      </div>
    );
  }

  const role = (
    [
      "admin",
      "senior_manager",
      "hr_recruiter",
      "employee",
      "candidate",
    ].includes(user.role)
      ? user.role
      : "employee"
  ) as UserRole;

  const roleLabel = ROLE_LABELS[role];

  const roleCls =
    ROLE_COLORS[role] ??
    "bg-slate-50 text-slate-600 border-slate-200";

  const fields = [
    {
      icon: User,
      label: "Full Name",
      value: user.full_name,
    },
    {
      icon: Mail,
      label: "Email",
      value: user.email,
    },
    {
      icon: Shield,
      label: "Role",
      value: roleLabel,
    },
    {
      icon: IdCard,
      label: "Employee ID",
      value: user.employee_id || "N/A",
    },
    {
      icon: Briefcase,
      label: "Account Type",
      value:
        user.role === "candidate"
          ? "External Candidate"
          : "Internal Staff",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-20 h-18 bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4 shrink-0">
            <button
              className="lg:hidden text-[#64748B] hover:text-[#1E293B] transition-colors mr-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">
                My Profile
              </h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                Your account details
              </p>
            </div>
          </header>

          <div className="relative">
            <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-blue-400/20 blur-2xl opacity-80" />
            <div className="absolute top-14 right-8 w-56 h-56 rounded-full bg-sky-400/25 blur-2xl opacity-80" />
            <div className="absolute top-56 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-300/20 blur-3xl opacity-70" />

            <div className="max-w-4xl mx-auto p-6 space-y-6 relative">

              {/* Profile Card */}
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <div
                className="h-24 w-full"
                style={{
                  background:
                    "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563EB 100%)",
                }}
              />

              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-10 mb-4">

                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full ${avatarColor(
                        user.full_name
                      )} flex items-center justify-center border-4 border-white shadow-md`}
                    >
                      <span className="text-white text-2xl font-bold">
                        {initials}
                      </span>
                    </div>

                    <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center border-2 border-white hover:bg-blue-700 transition-colors">
                      <Camera className="w-3 h-3 text-white" />
                    </button>
                  </div>

                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors bg-white">
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                <div className="mb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-[#1E293B]">
                      {user.full_name}
                    </h2>

                    {user.is_active && (
                      <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${roleCls}`}
                    >
                      {roleLabel}
                    </span>

                    {user.is_active && (
                      <span className="text-sm text-[#10B981]">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div
              className="bg-white rounded-2xl border border-[#E2E8F0] p-6"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <h3 className="text-sm font-semibold text-[#1E293B] uppercase tracking-wide mb-4">
                Account Information
              </h3>

              <div className="space-y-4">
                {fields.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#64748B]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#64748B]">
                        {label}
                      </p>

                      <p className="text-sm font-medium text-[#1E293B] truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-[#EF4444] font-semibold text-sm hover:bg-red-50 transition-colors bg-white"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>

          </div>
        </div>
      </div>
    </div>
    </div>
  );
}