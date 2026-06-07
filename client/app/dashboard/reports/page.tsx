"use client"

import { useState } from "react";

import {
  Users, TrendingUp, TrendingDown, Clock, CheckCircle2,
  Download, RefreshCw, Briefcase, DollarSign,
  BarChart3, AlertTriangle, Award, Target,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/ui/sidebar";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  blue:    "#2563EB",
  navy:    "#1e3a8a",
  purple:  "#7C3AED",
  emerald: "#10B981",
  amber:   "#F59E0B",
  rose:    "#EF4444",
  cyan:    "#06B6D4",
  slate:   "#64748B",
};

// ─── Mock data ────────────────────────────────────────────────────────────────

// Headcount + attrition by month (Jan–Jun 2026)
const headcountTrend = [
  { month: "Jan", headcount: 218, joined: 8,  left: 3 },
  { month: "Feb", headcount: 223, joined: 7,  left: 2 },
  { month: "Mar", headcount: 228, joined: 9,  left: 4 },
  { month: "Apr", headcount: 235, joined: 10, left: 3 },
  { month: "May", headcount: 241, joined: 8,  left: 2 },
  { month: "Jun", headcount: 248, joined: 9,  left: 2 },
];

// Department breakdown
const deptBreakdown = [
  { name: "Engineering", value: 82, color: C.blue    },
  { name: "Sales",       value: 45, color: C.emerald },
  { name: "Design",      value: 28, color: C.purple  },
  { name: "Marketing",   value: 32, color: C.amber   },
  { name: "Finance",     value: 25, color: C.cyan    },
  { name: "Analytics",   value: 18, color: C.rose    },
  { name: "HR",          value: 18, color: C.slate   },
];

// Recruitment funnel (last quarter)
const recruitmentFunnel = [
  { stage: "Applied",   count: 312, fill: C.slate  },
  { stage: "Screened",  count: 148, fill: C.cyan   },
  { stage: "Interview", count:  72, fill: C.blue   },
  { stage: "Offer",     count:  24, fill: C.amber  },
  { stage: "Hired",     count:  18, fill: C.emerald},
];

// Payroll cost trend (₹ in lakhs)
const payrollTrend = [
  { month: "Jan", cost: 182, bonus: 12 },
  { month: "Feb", cost: 185, bonus: 8  },
  { month: "Mar", cost: 189, bonus: 22 },
  { month: "Apr", cost: 194, bonus: 10 },
  { month: "May", cost: 197, bonus: 15 },
  { month: "Jun", cost: 204, bonus: 18 },
];

// Leave analysis
const leaveData = [
  { dept: "Eng",    annual: 42, sick: 18, other: 6 },
  { dept: "Sales",  annual: 35, sick: 12, other: 4 },
  { dept: "Design", annual: 22, sick: 8,  other: 2 },
  { dept: "Mktg",   annual: 28, sick: 10, other: 5 },
  { dept: "Fin",    annual: 20, sick: 7,  other: 3 },
  { dept: "HR",     annual: 15, sick: 6,  other: 2 },
];

// Performance distribution
const perfData = [
  { label: "Exceptional", value: 42, fill: "#10B981" },
  { label: "Exceeds",     value: 88, fill: "#2563EB" },
  { label: "Meets",       value: 96, fill: "#7C3AED" },
  { label: "Below",       value: 18, fill: "#F59E0B" },
  { label: "Critical",    value: 4,  fill: "#EF4444" },
];

// Gender + age breakdown (for Diversity card)
const genderData = [
  { name: "Male",       value: 138, color: C.blue   },
  { name: "Female",     value: 98,  color: C.purple },
  { name: "Non-binary", value: 12,  color: C.cyan   },
];

// Time-to-hire by dept (days)
const timeToHire = [
  { dept: "Engineering", days: 38 },
  { dept: "Design",      days: 25 },
  { dept: "Sales",       days: 18 },
  { dept: "Marketing",   days: 22 },
  { dept: "Finance",     days: 28 },
  { dept: "Analytics",   days: 32 },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: {
  active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f172a] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      {label && <p className="text-slate-400 mb-1.5 font-medium">{label}</p>}
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
          <span className="text-slate-300">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-[#E2E8F0] ${className}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      {children}
    </div>
  );
}

function CardHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-[#E2E8F0]">
      <div>
        <h3 className="text-sm font-semibold text-[#1E293B]">{title}</h3>
        {sub && <p className="text-xs text-[#64748B] mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [sidebarOpen] = useState(false);
  const [period, setPeriod] = useState("H1 2026");

  const PERIODS = ["Q1 2026","Q2 2026","H1 2026","FY 2025"];

  const kpis = [
    {
      label:    "Total Headcount",
      value:    "248",
      change:   "+14",
      up:       true,
      sub:      "vs Jan 2026",
      icon:     Users,
      bg:       "bg-blue-50",
      iconCls:  "text-[#2563EB]",
      border:   "border-blue-100",
    },
    {
      label:    "Attrition Rate",
      value:    "6.5%",
      change:   "−1.2%",
      up:       false,
      sub:      "vs last period",
      icon:     TrendingDown,
      bg:       "bg-emerald-50",
      iconCls:  "text-[#10B981]",
      border:   "border-emerald-100",
    },
    {
      label:    "Avg Time-to-Hire",
      value:    "27d",
      change:   "−3d",
      up:       false,
      sub:      "across all roles",
      icon:     Clock,
      bg:       "bg-purple-50",
      iconCls:  "text-purple-500",
      border:   "border-purple-100",
    },
    {
      label:    "Offer Acceptance",
      value:    "81%",
      change:   "+5%",
      up:       true,
      sub:      "last 90 days",
      icon:     CheckCircle2,
      bg:       "bg-amber-50",
      iconCls:  "text-amber-500",
      border:   "border-amber-100",
    },
    {
      label:    "Open Positions",
      value:    "18",
      change:   "+3",
      up:       true,
      sub:      "actively hiring",
      icon:     Briefcase,
      bg:       "bg-cyan-50",
      iconCls:  "text-cyan-500",
      border:   "border-cyan-100",
    },
    {
      label:    "Payroll Cost",
      value:    "₹204L",
      change:   "+12%",
      up:       true,
      sub:      "Jun 2026",
      icon:     DollarSign,
      bg:       "bg-rose-50",
      iconCls:  "text-rose-500",
      border:   "border-rose-100",
    },
    {
      label:    "Avg Perf Score",
      value:    "78%",
      change:   "+3%",
      up:       true,
      sub:      "last review cycle",
      icon:     Award,
      bg:       "bg-indigo-50",
      iconCls:  "text-indigo-500",
      border:   "border-indigo-100",
    },
    {
      label:    "eNPS Score",
      value:    "42",
      change:   "+6",
      up:       true,
      sub:      "Q2 2026 survey",
      icon:     Target,
      bg:       "bg-teal-50",
      iconCls:  "text-teal-500",
      border:   "border-teal-100",
    },
  ];

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] font-sans">
      <Sidebar open={sidebarOpen} onClose={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1E293B]">Analytics & Reports</h1>
              <p className="text-sm text-[#64748B] mt-0.5">Company-wide HR metrics and insights</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Period selector */}
              <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1">
                {PERIODS.map(p => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      period === p ? "bg-[#2563EB] text-white shadow-sm" : "text-[#64748B] hover:text-[#1E293B]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── KPI GRID ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {kpis.map(({ label, value, change, up, sub, icon: Icon, bg, iconCls, border }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl border ${border} p-4 hover:shadow-md transition-shadow`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconCls}`} />
                  </div>
                  <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-[#1E293B]">{value}</p>
                <p className="text-xs font-medium text-[#64748B] mt-0.5">{label}</p>
                <p className="text-[10px] text-[#64748B]/70 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* ── ROW: Headcount trend + Dept breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Headcount trend — AreaChart */}
            <Card className="lg:col-span-2">
              <CardHeader
                title="Headcount & Attrition Trend"
                sub={`Jan–Jun 2026 · Total net growth: +30 employees`}
                action={
                  <div className="flex items-center gap-3 text-xs text-[#64748B]">
                    {[{c:C.blue,l:"Headcount"},{c:C.emerald,l:"Joined"},{c:C.rose,l:"Left"}].map(({c,l})=>(
                      <div key={l} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:c}}/>
                        {l}
                      </div>
                    ))}
                  </div>
                }
              />
              <div className="p-5">
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={headcountTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={C.blue} stopOpacity={0.15}/>
                        <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="headcount" name="Headcount" stroke={C.blue}   strokeWidth={2.5} fill="url(#hcGrad)" dot={false}/>
                    <Bar  dataKey="joined"    name="Joined"    fill={C.emerald} radius={[3,3,0,0]}/>
                    <Bar  dataKey="left"      name="Left"      fill={C.rose}    radius={[3,3,0,0]}/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Dept breakdown — Pie */}
            <Card>
              <CardHeader title="By Department" sub={`248 total · 7 departments`}/>
              <div className="p-5 flex flex-col gap-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={deptBreakdown}
                      cx="50%" cy="50%"
                      innerRadius={48} outerRadius={74}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {deptBreakdown.map(({ color }, i) => (
                        <Cell key={i} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {deptBreakdown.map(({ name, value, color }) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-xs text-[#64748B] flex-1 truncate">{name}</span>
                      <span className="text-xs font-semibold text-[#1E293B]">{value}</span>
                      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(value/248)*100}%`, backgroundColor: color }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* ── ROW: Recruitment funnel + Payroll cost ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Recruitment funnel */}
            <Card>
              <CardHeader
                title="Recruitment Funnel"
                sub="Q2 2026 · 18 offers accepted · 81% acceptance rate"
              />
              <div className="p-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={recruitmentFunnel}
                    layout="vertical"
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <YAxis dataKey="stage" type="category" width={68} tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="count" name="Candidates" radius={[0,6,6,0]} label={{ position:"right", fontSize:11, fill:"#64748B" }}>
                      {recruitmentFunnel.map(({ fill }, i) => (
                        <Cell key={i} fill={fill}/>
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* conversion rates */}
                <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
                  {[
                    { label: "Screen Rate", val: "47%" },
                    { label: "Interview",   val: "49%" },
                    { label: "Offer Rate",  val: "33%" },
                    { label: "Accept Rate", val: "81%" },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center">
                      <p className="text-base font-bold text-[#1E293B]">{val}</p>
                      <p className="text-[10px] text-[#64748B] mt-0.5 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Payroll cost trend */}
            <Card>
              <CardHeader
                title="Payroll Cost Trend"
                sub="₹ in Lakhs · Jan–Jun 2026"
                action={
                  <div className="flex gap-3 text-xs text-[#64748B]">
                    {[{c:C.blue,l:"Base"},{c:C.amber,l:"Bonus"}].map(({c,l})=>(
                      <div key={l} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{backgroundColor:c}}/>
                        {l}
                      </div>
                    ))}
                  </div>
                }
              />
              <div className="p-5">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={payrollTrend} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="cost"  name="Base Payroll" stackId="a" fill={C.blue}  radius={[0,0,0,0]}/>
                    <Bar dataKey="bonus" name="Bonus"        stackId="a" fill={C.amber} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8F0] text-xs">
                  <span className="text-[#64748B]">H1 Total</span>
                  <span className="font-bold text-[#1E293B]">₹1,151 Lakhs</span>
                  <span className="text-[#10B981] flex items-center gap-1">
                    <TrendingUp className="w-3 h-3"/> +12% YoY
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* ── ROW: Leave analysis + Performance + Time-to-hire ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Leave analysis */}
            <Card className="lg:col-span-1">
              <CardHeader title="Leave Analysis" sub="By department · H1 2026"/>
              <div className="p-5">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={leaveData} margin={{ top: 0, right: 0, bottom: 0, left: -28 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="dept" tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fontSize: 10, fill: "#64748B" }} axisLine={false} tickLine={false}/>
                    <Tooltip content={<ChartTooltip />}/>
                    <Bar dataKey="annual" name="Annual"  stackId="a" fill={C.blue}   radius={[0,0,0,0]}/>
                    <Bar dataKey="sick"   name="Sick"    stackId="a" fill={C.amber}  radius={[0,0,0,0]}/>
                    <Bar dataKey="other"  name="Other"   stackId="a" fill={C.purple} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3 pt-3 border-t border-[#E2E8F0]">
                  {[{c:C.blue,l:"Annual"},{c:C.amber,l:"Sick"},{c:C.purple,l:"Other"}].map(({c,l})=>(
                    <div key={l} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <span className="w-2 h-2 rounded-sm" style={{backgroundColor:c}}/>{l}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Performance distribution */}
            <Card className="lg:col-span-1">
              <CardHeader title="Performance Distribution" sub="248 employees · last review cycle"/>
              <div className="p-5 space-y-3">
                {perfData.map(({ label, value, fill }) => {
                  const pct = Math.round((value / 248) * 100);
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: fill }}/>
                          <span className="text-xs text-[#64748B]">{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#1E293B]">{value}</span>
                          <span className="text-[10px] text-[#64748B] w-7 text-right">{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: fill }}/>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Avg Score</span>
                  <span className="font-bold text-[#10B981]">78% — Good</span>
                </div>
              </div>
            </Card>

            {/* Time-to-hire by dept + Diversity */}
            <Card className="lg:col-span-1 flex flex-col">
              <CardHeader title="Time-to-Hire by Department" sub="Average days · Q2 2026"/>
              <div className="p-5 flex-1 space-y-3">
                {timeToHire.map(({ dept, days }) => (
                  <div key={dept}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#64748B]">{dept}</span>
                      <span className={`text-xs font-semibold ${days > 30 ? "text-[#EF4444]" : days > 22 ? "text-amber-500" : "text-[#10B981]"}`}>
                        {days}d
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(days / 40) * 100}%`,
                          backgroundColor: days > 30 ? C.rose : days > 22 ? C.amber : C.emerald,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-5 mb-5 pt-4 border-t border-[#E2E8F0]">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Workforce Diversity</p>
                <ResponsiveContainer width="100%" height={90}>
                  <PieChart>
                    <Pie data={genderData} cx="50%" cy="50%" outerRadius={40} dataKey="value" paddingAngle={2}>
                      {genderData.map(({ color }, i) => <Cell key={i} fill={color}/>)}
                    </Pie>
                    <Tooltip content={<ChartTooltip />}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {genderData.map(({ name, value, color }) => (
                    <div key={name} className="text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}/>
                        <span className="text-[10px] text-[#64748B]">{name}</span>
                      </div>
                      <p className="text-xs font-bold text-[#1E293B]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* ── INSIGHTS STRIP ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 border-amber-200", title: "High Attrition Risk", body: "Engineering dept has 3 employees with tenure < 6 months. Recommend engagement check-in." },
              { icon: TrendingUp,    color: "text-[#10B981]", bg: "bg-emerald-50 border-emerald-200", title: "Strong Hiring Momentum", body: "Q2 saw 38 new hires — the highest single quarter. Offer acceptance rate improved by 5%." },
              { icon: BarChart3,     color: "text-[#2563EB]", bg: "bg-blue-50 border-blue-200", title: "Payroll Efficiency", body: "Cost per employee stable at ₹82.3K/mo despite 6% headcount growth. Strong margin management." },
            ].map(({ icon: Icon, color, bg, title, body }) => (
              <div key={title} className={`rounded-2xl border p-4 ${bg}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white/70`}>
                    <Icon className={`w-4 h-4 ${color}`}/>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1E293B] mb-1">{title}</p>
                    <p className="text-xs text-[#64748B] leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}