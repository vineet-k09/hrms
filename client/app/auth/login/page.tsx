"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Users,
  Calendar,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  ClipboardList,
  DollarSign,
  Bot,
} from "lucide-react";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("employee");

  // Store JWT in localStorage and redirect based on role
  function storeTokenAndRedirect(token: string, role: string) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userRole", role);

    // Role-based redirect
    const roleRedirects: Record<string, string> = {
      employee: "/dashboard",
      hr_recruiter: "/dashboard",
      senior_manager: "/dashboard",
      admin: "/dashboard",
      candidate: "/dashboard",
    };

    const redirectPath = roleRedirects[role] || "/dashboard";
    setTimeout(() => router.push(redirectPath), 800);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Validate input
    if (activeTab === "employee") {
      if (!employeeId.trim()) {
        setError("Employee ID is required");
        return;
      }
      if (!password.trim()) {
        setError("Password is required");
        return;
      }
    } else {
      if (!email.trim()) {
        setError("Email is required");
        return;
      }
      if (!password.trim()) {
        setError("Password is required");
        return;
      }
    }

    setLoading(true);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const loginData = {
      identifier: activeTab === "employee" ? employeeId : email,
      password,
    };

    fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          // Store the token
          localStorage.setItem("authToken", data.access_token);

          // Store user info as a JSON string
          localStorage.setItem("user", JSON.stringify(data.user));

          const role =
            data.user?.role ||
            (activeTab === "employee" ? "employee" : "candidate");

          storeTokenAndRedirect(data.access_token, role);
        } else {
          let errorMessage = "Login failed. Please try again.";

          if (typeof data.detail === "string") {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) => err.msg).join(", ");
          }

          setError(errorMessage);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message || "An error occurred. Please try again.");
        setLoading(false);
      });
  }

  const features = [
    { icon: Users, label: "Employee Management" },
    { icon: Calendar, label: "Attendance Tracking" },
    { icon: ClipboardList, label: "Leave Management" },
    { icon: DollarSign, label: "Payroll Processing" },
    { icon: Bot, label: "AI Candidate Evaluation" },
  ];

  return (
    <div className="min-h-screen flex font-sans">
      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col w-[45%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)",
        }}
      >
        {/* background circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-15 -right-15 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/3 -right-10 w-48 h-48 rounded-full bg-blue-400/10" />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-5 h-5 rounded-sm bg-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              MyTeamHQ
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Manage Your Workforce Smarter
            </h1>
            <p className="text-blue-200 text-base leading-relaxed">
              Track attendance, payroll, recruitment and employee performance
              from a single platform.
            </p>
          </div>

          {/* HR illustration placeholder */}
          <div
            className="mb-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6 flex items-center justify-center"
            style={{ minHeight: 160 }}
          >
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center"
                  >
                    <User className="w-5 h-5 text-white/70" />
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-2 mb-2">
                {[40, 65, 50, 80, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-5 rounded-t-sm bg-white/30"
                    style={{ height: h }}
                  />
                ))}
              </div>
              <p className="text-blue-200 text-xs mt-2">Workforce Analytics</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-blue-100 text-sm">{label}</span>
              </div>
            ))}
          </div>

          {/* Floating metric cards */}
          <div className="mt-auto flex gap-3">
            <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-blue-200 text-xs">Present Today</span>
              </div>
              <p className="text-white text-2xl font-bold">201</p>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-blue-200 text-xs">Open Positions</span>
              </div>
              <p className="text-white text-2xl font-bold">5</p>
            </div>
            <div className="flex-1 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-blue-200 text-xs">Leave Requests</span>
              </div>
              <p className="text-white text-2xl font-bold">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFC] p-6">
        {/* mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-white" />
          </div>
          <span className="text-[#1E293B] font-bold text-lg">MyTeamHQ</span>
        </div>

        <div
          className="w-full bg-white border border-[#E2E8F0] rounded-xl p-8"
          style={{ maxWidth: 420, boxShadow: "0 1px 3px rgba(0,0,0,0.10)" }}
        >
          <div className="mb-6">
            <h2 className="text-[28px] font-bold text-[#1E293B]">
              Welcome Back
            </h2>
            <p className="text-[#64748B] text-sm mt-1">
              Sign in to continue to your workspace
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg">
              <TabsTrigger
                value="employee"
                className="flex-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1E293B] data-[state=active]:shadow-sm text-[#64748B] rounded-md transition-all"
              >
                Employee
              </TabsTrigger>
              <TabsTrigger
                value="candidate"
                className="flex-1 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#1E293B] data-[state=active]:shadow-sm text-[#64748B] rounded-md transition-all"
              >
                Candidate
              </TabsTrigger>
            </TabsList>

            {/* Employee Tab */}
            <TabsContent value="employee" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <p className="text-[#EF4444] text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="emp-id"
                    className="text-sm font-medium text-[#1E293B]"
                  >
                    Employee ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <Input
                      id="emp-id"
                      type="text"
                      placeholder="e.g. EMP-10045"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="pl-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="emp-password"
                    className="text-sm font-medium text-[#1E293B]"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <Input
                      id="emp-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-xs text-[#2563EB] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Candidate Tab */}
            <TabsContent value="candidate" className="mt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
                    <p className="text-[#EF4444] text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cand-email"
                    className="text-sm font-medium text-[#1E293B]"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <Input
                      id="cand-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="cand-password"
                    className="text-sm font-medium text-[#1E293B]"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                    <Input
                      id="cand-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-xs text-[#2563EB] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                      in...
                    </>
                  ) : (
                    "Sign In as Candidate"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
            <p className="text-sm text-[#64748B]">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/auth/signup");
                }}
                className="text-[#2563EB] font-medium hover:underline"
              >
                Create Account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
