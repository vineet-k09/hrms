"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  Hash,
  TrendingUp,
  ClipboardList,
  DollarSign,
  Calendar,
  Bot,
  Users,
  ShieldCheck,
} from "lucide-react";

function PasswordStrengthBar({ password }: { password: string }) {
  const score = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const label = ["", "Weak", "Fair", "Good", "Strong"][score];
  const colors = ["", "#EF4444", "#F59E0B", "#10B981", "#10B981"];
  const widths = ["0%", "25%", "50%", "75%", "100%"];

  if (!password) return null;

  return (
    <div className="mt-1.5 space-y-1">
      <div className="h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: widths[score], backgroundColor: colors[score] }}
        />
      </div>
      <p className="text-xs font-medium" style={{ color: colors[score] }}>{label}</p>
    </div>
  );
}

export default function SignupPage() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    employeeId: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setField(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.employeeId.trim()) e.employeeId = "Employee ID is required";
    if (!form.role) e.role = "Role is required";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }, 1400);
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
        style={{ background: "linear-gradient(145deg, #0f172a 0%, #1e3a8a 50%, #1d4ed8 100%)" }}
      >
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-15 -right-15  w-64 h-64 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-5 h-5 rounded-sm bg-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">MyGreenhouse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-white text-4xl font-bold leading-tight mb-4">
              Join Your Team on MyGreenhouse
            </h1>
            <p className="text-blue-200 text-base leading-relaxed">
              Set up your account and get instant access to all HR tools your organization uses.
            </p>
          </div>

          <div className="mb-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/10">
                <p className="text-white text-2xl font-bold">248</p>
                <p className="text-blue-200 text-xs mt-0.5">Total Employees</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/10">
                <p className="text-white text-2xl font-bold">12</p>
                <p className="text-blue-200 text-xs mt-0.5">Departments</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/10">
                <p className="text-white text-2xl font-bold">5</p>
                <p className="text-blue-200 text-xs mt-0.5">Open Roles</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/10">
                <p className="text-white text-2xl font-bold">98%</p>
                <p className="text-blue-200 text-xs mt-0.5">Attendance Rate</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-blue-100 text-sm">{label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-3 p-4 rounded-xl bg-white/10 border border-white/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-blue-100 text-sm">Your data is encrypted and secure</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F8FAFC] p-6 overflow-y-auto">
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-sm bg-white" />
          </div>
          <span className="text-[#1E293B] font-bold text-lg">MyGreenhouse</span>
        </div>

        <div
          className="w-full bg-white border border-[#E2E8F0] rounded-xl p-8 my-6"
          style={{ maxWidth: 680, boxShadow: "0 1px 3px rgba(0,0,0,0.10)" }}
        >
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Account Created!</h2>
              <p className="text-[#64748B] text-sm">Redirecting you to your dashboard...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-[28px] font-bold text-[#1E293B]">Create Your Account</h2>
                <p className="text-[#64748B] text-sm mt-1">Fill in your details to get started with MyGreenhouse</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Full Name | Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={e => setField("fullName", e.target.value)}
                        className="pl-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        value={form.email}
                        onChange={e => setField("email", e.target.value)}
                        className="pl-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Employee ID | Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Employee ID</Label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        placeholder="e.g. EMP-10045"
                        value={form.employeeId}
                        onChange={e => setField("employeeId", e.target.value)}
                        className="pl-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    {errors.employeeId && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.employeeId}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Role</Label>
                    <Select value={form.role} onValueChange={v => setField("role", v)}>
                      <SelectTrigger className="h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-[#64748B]" />
                          <SelectValue placeholder="Select your role" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="hr_recruiter">HR Recruiter</SelectItem>
                        <SelectItem value="senior_manager">Senior Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 3: Password | Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        value={form.password}
                        onChange={e => setField("password", e.target.value)}
                        className="pl-10 pr-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <PasswordStrengthBar password={form.password} />
                    {errors.password && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-[#1E293B]">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                      <Input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={e => setField("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 h-11 border-[#E2E8F0] bg-[#F8FAFC] text-[#1E293B] placeholder:text-[#64748B] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#1E293B] transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {form.confirmPassword && form.password === form.confirmPassword && (
                      <p className="text-xs text-[#10B981] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Passwords match
                      </p>
                    )}
                    {errors.confirmPassword && (
                      <p className="text-xs text-[#EF4444] flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Account...</>
                  ) : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t border-[#E2E8F0] text-center">
                <p className="text-sm text-[#64748B]">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    onClick={e => { e.preventDefault(); router.push("/login"); }}
                    className="text-[#2563EB] font-medium hover:underline"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
