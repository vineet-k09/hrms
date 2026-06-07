/**
 * Next.js: app/dashboard/payroll/page.tsx
 * Add "use client"; at the top
 *
 * Payslip model fields used:
 *   basic_salary, bonus, deductions, net_salary, month, year
 *
 * Standard calculation method applied:
 *   Gross Earnings  = Basic + HRA (40% basic) + Special Allowance + Bonus
 *   Total Deductions = PF (12% basic) + Professional Tax + Health Insurance + Income Tax (TDS)
 *   Net Salary      = Gross Earnings − Total Deductions
 */
"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import {
  DollarSign, Download, TrendingUp, TrendingDown, ChevronRight,
  FileText, Calendar, Banknote, Receipt, ShieldCheck, HeartPulse,
  Building2, BadgePercent, Printer, Info,
} from "lucide-react";

// ─── Calculation helpers ──────────────────────────────────────────────────────

function calcSlip(basic: number, bonus: number, deductions: number) {
  const hra           = +(basic * 0.40).toFixed(2);
  const specialAllow  = +(basic * 0.20).toFixed(2);
  const grossEarnings = +(basic + hra + specialAllow + bonus).toFixed(2);

  // Standard deduction split
  const pf            = +(basic * 0.12).toFixed(2);
  const profTax       = 200;
  const healthIns     = 500;
  const tds           = +(deductions - pf - profTax - healthIns > 0
    ? deductions - pf - profTax - healthIns
    : 0).toFixed(2);
  const totalDeductions = +(pf + profTax + healthIns + tds).toFixed(2);
  const netSalary     = +(grossEarnings - totalDeductions).toFixed(2);

  return { hra, specialAllow, grossEarnings, pf, profTax, healthIns, tds, totalDeductions, netSalary };
}

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ─── Mock payslip history (matches Payslip model fields) ─────────────────────
const HISTORY = [
  { month: 6, year: 2026, basic_salary: 75000, bonus: 5000,  deductions: 12000 },
  { month: 5, year: 2026, basic_salary: 75000, bonus: 0,     deductions: 11500 },
  { month: 4, year: 2026, basic_salary: 75000, bonus: 8000,  deductions: 11500 },
  { month: 3, year: 2026, basic_salary: 70000, bonus: 0,     deductions: 10800 },
  { month: 2, year: 2026, basic_salary: 70000, bonus: 3000,  deductions: 10800 },
  { month: 1, year: 2026, basic_salary: 70000, bonus: 0,     deductions: 10800 },
];

const CURRENT = HISTORY[0];

// ─── Mini donut SVG ───────────────────────────────────────────────────────────
function Donut({
  slices,
  size = 120,
}: {
  slices: { value: number; color: string }[];
  size?: number;
}) {
  const r    = size / 2 - 12;
  const cx   = size / 2;
  const cy   = size / 2;
  const circ = 2 * Math.PI * r;
  const total = slices.reduce((a, s) => a + s.value, 0);
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {slices.map((s, i) => {
        const dash = (s.value / total) * circ;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${dash - 2} ${circ - dash + 2}`}
            strokeDashoffset={-offset}
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PayrollPage() {
  const { user }        = useAuth();
  const [sidebarOpen]   = useState(false);
  const [selected, setSelected] = useState(0); // index into HISTORY

  const slip = HISTORY[selected];
  const calc = calcSlip(slip.basic_salary, slip.bonus, slip.deductions);

  const earnings = [
    { label: "Basic Salary",       value: slip.basic_salary, icon: Banknote,    color: "#2563EB" },
    { label: "HRA (40% of Basic)", value: calc.hra,          icon: Building2,   color: "#7C3AED" },
    { label: "Special Allowance",  value: calc.specialAllow, icon: BadgePercent,color: "#06B6D4" },
    { label: "Performance Bonus",  value: slip.bonus,        icon: TrendingUp,  color: "#10B981" },
  ];

  const deductions = [
    { label: "Provident Fund (12%)",    value: calc.pf,       icon: ShieldCheck, color: "#EF4444" },
    { label: "Professional Tax",        value: calc.profTax,  icon: Receipt,     color: "#F59E0B" },
    { label: "Health Insurance",        value: calc.healthIns,icon: HeartPulse,  color: "#EC4899" },
    { label: "Income Tax (TDS)",        value: calc.tds,      icon: FileText,    color: "#EF4444" },
  ];

  const donutSlices = [
    { value: slip.basic_salary, color: "#2563EB" },
    { value: calc.hra,          color: "#7C3AED" },
    { value: calc.specialAllow, color: "#06B6D4" },
    { value: slip.bonus,        color: "#10B981" },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Payroll</h1>
              <p className="text-sm text-[#64748B] mt-0.5">
                {user?.full_name} 
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors w-fit shadow-sm">
              <Download className="w-4 h-4" /> Download Payslip
            </button>
          </div>

          {/* ── HERO NET SALARY ── */}
          <div
            className="relative rounded-2xl overflow-hidden p-6 sm:p-8"
            style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a2744 50%, #1e3a8a 100%)" }}
          >
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-600/10" />
            <div className="absolute -bottom-8 right-1/3 w-32 h-32 rounded-full bg-indigo-500/10" />
            <div className="absolute top-1/2 -translate-y-1/2 right-0 w-64 h-64 rounded-full bg-blue-500/5" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium">
                    {MONTHS[slip.month - 1]} {slip.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium">
                    Credited
                  </span>
                </div>
                <p className="text-blue-200 text-sm mt-2 mb-1">Net Take-Home Salary</p>
                <p className="text-white text-4xl sm:text-5xl font-extrabold tracking-tight">
                  {fmt(calc.netSalary)}
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div>
                    <p className="text-blue-300 text-xs">Gross Earnings</p>
                    <p className="text-white text-base font-semibold">{fmt(calc.grossEarnings)}</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-blue-300 text-xs">Total Deductions</p>
                    <p className="text-red-300 text-base font-semibold">−{fmt(calc.totalDeductions)}</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <p className="text-blue-300 text-xs">Bonus</p>
                    <p className="text-emerald-300 text-base font-semibold">+{fmt(slip.bonus)}</p>
                  </div>
                </div>
              </div>

              {/* right: donut chart */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative w-28 h-28">
                  <Donut slices={donutSlices} size={112} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-white text-xs font-bold leading-none">
                      {Math.round((calc.netSalary / calc.grossEarnings) * 100)}%
                    </p>
                    <p className="text-blue-300 text-[9px] mt-0.5">take-home</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {[
                    { label: "Basic",   color: "#2563EB" },
                    { label: "HRA",     color: "#7C3AED" },
                    { label: "Special", color: "#06B6D4" },
                    { label: "Bonus",   color: "#10B981" },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[10px] text-blue-200">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI STRIP ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Basic Salary",    value: fmt(slip.basic_salary), icon: Banknote,   color: "bg-blue-50",   iconCls: "text-[#2563EB]",  border: "border-blue-100" },
              { label: "Bonus",           value: fmt(slip.bonus),        icon: TrendingUp, color: "bg-emerald-50",iconCls: "text-[#10B981]",  border: "border-emerald-100" },
              { label: "Total Deductions",value: fmt(calc.totalDeductions),icon:TrendingDown,color:"bg-red-50",   iconCls: "text-[#EF4444]",  border: "border-red-100" },
              { label: "YTD Earnings",    value: fmt(HISTORY.slice(0, 6).reduce((a, s) => a + calcSlip(s.basic_salary, s.bonus, s.deductions).netSalary, 0)),
                icon: Calendar, color: "bg-purple-50", iconCls: "text-purple-500", border: "border-purple-100" },
            ].map(({ label, value, icon: Icon, color, iconCls, border }) => (
              <div key={label} className={`bg-white rounded-xl border ${border} p-4`} style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${iconCls}`} />
                </div>
                <p className="text-lg font-bold text-[#1E293B] truncate">{value}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* ── PAYSLIP BREAKDOWN ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Earnings */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between"
                style={{ background: "linear-gradient(90deg, #0f172a, #1e3a8a)" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-300" />
                  <h3 className="text-sm font-semibold text-white">Earnings</h3>
                </div>
                <span className="text-sm font-bold text-emerald-300">{fmt(calc.grossEarnings)}</span>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {earnings.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="flex-1 text-sm text-[#64748B]">{label}</span>
                    <span className="text-sm font-semibold text-[#1E293B]">{fmt(value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC]">
                  <span className="text-sm font-bold text-[#1E293B]">Gross Total</span>
                  <span className="text-sm font-bold text-[#10B981]">{fmt(calc.grossEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between"
                style={{ background: "linear-gradient(90deg, #1a0a1e, #4c0519)" }}>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-300" />
                  <h3 className="text-sm font-semibold text-white">Deductions</h3>
                </div>
                <span className="text-sm font-bold text-red-300">−{fmt(calc.totalDeductions)}</span>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {deductions.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: color + "18" }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="flex-1 text-sm text-[#64748B]">{label}</span>
                    <span className="text-sm font-semibold text-[#EF4444]">−{fmt(value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#F8FAFC]">
                  <span className="text-sm font-bold text-[#1E293B]">Total Deductions</span>
                  <span className="text-sm font-bold text-[#EF4444]">−{fmt(calc.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── NET SALARY SUMMARY BAR ── */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="text-sm font-semibold text-[#1E293B]">Salary Split</h3>
              <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <Info className="w-3.5 h-3.5" />
                Take-home is {Math.round((calc.netSalary / calc.grossEarnings) * 100)}% of gross
              </div>
            </div>
            <div className="flex h-5 rounded-full overflow-hidden gap-0.5">
              {[
                { pct: (slip.basic_salary / calc.grossEarnings) * 100, color: "#2563EB",  label: "Basic" },
                { pct: (calc.hra          / calc.grossEarnings) * 100, color: "#7C3AED",  label: "HRA" },
                { pct: (calc.specialAllow / calc.grossEarnings) * 100, color: "#06B6D4",  label: "Special" },
                { pct: (slip.bonus        / calc.grossEarnings) * 100, color: "#10B981",  label: "Bonus" },
                { pct: (calc.totalDeductions / calc.grossEarnings) * 100, color: "#EF4444", label: "Deductions" },
              ].filter(s => s.pct > 0).map(({ pct, color, label }) => (
                <div
                  key={label}
                  className="h-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                  title={`${label}: ${pct.toFixed(1)}%`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
              {[
                { label: "Basic",       color: "#2563EB" },
                { label: "HRA",         color: "#7C3AED" },
                { label: "Special",     color: "#06B6D4" },
                { label: "Bonus",       color: "#10B981" },
                { label: "Deductions",  color: "#EF4444" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── PAYSLIP HISTORY TABLE ── */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1E293B]">Payslip History</h3>
                <p className="text-xs text-[#64748B] mt-0.5">Last 6 months</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline">
                <Printer className="w-3.5 h-3.5" /> Print All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    {["Month","Basic Salary","Bonus","Deductions","Net Salary",""].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {HISTORY.map((s, i) => {
                    const c = calcSlip(s.basic_salary, s.bonus, s.deductions);
                    const isSelected = i === selected;
                    return (
                      <tr
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-[#F8FAFC]"}`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                            <span className={`text-sm font-medium ${isSelected ? "text-[#2563EB]" : "text-[#1E293B]"}`}>
                              {MONTHS[s.month - 1]} {s.year}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#64748B] whitespace-nowrap">{fmt(s.basic_salary)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {s.bonus > 0
                            ? <span className="text-sm font-medium text-[#10B981]">+{fmt(s.bonus)}</span>
                            : <span className="text-sm text-[#64748B]">—</span>}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-[#EF4444] whitespace-nowrap">−{fmt(c.totalDeductions)}</td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#1E293B]">{fmt(c.netSalary)}</span>
                        </td>
                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <button
                            onClick={e => { e.stopPropagation(); }}
                            className="flex items-center gap-1 text-xs text-[#2563EB] hover:underline"
                          >
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── FORMULA NOTE ── */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#2563EB]" />
            <div className="space-y-0.5">
              <p className="font-semibold text-[#1E293B]">Standard Payslip Calculation</p>
              <p>Gross = Basic + HRA (40% of Basic) + Special Allowance (20% of Basic) + Bonus</p>
              <p>Deductions = PF (12% of Basic) + Professional Tax (₹200) + Health Insurance (₹500) + TDS (remainder)</p>
              <p>Net Salary = Gross Earnings − Total Deductions</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}