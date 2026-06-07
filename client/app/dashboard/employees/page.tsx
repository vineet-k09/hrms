"use client";

import axios from "axios";
import { useState, useEffect } from "react";

import Sidebar from "@/components/ui/sidebar";

const STATUS_META: Record<
	Status,
	{ label: string; dot: string; cls: string; icon: typeof CheckCircle2 }
> = {
	ACTIVE: {
		label: "ACTIVE",
		dot: "bg-[#10B981]",
		cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
		icon: CheckCircle2,
	},
	INACTIVE: {
		label: "INACTIVE",
		dot: "bg-[#64748B]",
		cls: "bg-slate-50 text-slate-600 border-slate-200",
		icon: XCircle,
	},
};

const AVATAR_COLORS = [
	"bg-blue-500",
	"bg-purple-500",
	"bg-emerald-500",
	"bg-amber-500",
	"bg-rose-500",
	"bg-indigo-500",
	"bg-cyan-500",
	"bg-teal-500",
];
function avatarBg(name: string) {
	return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

import {
	X,
	Clock,
	Mail,
	Phone,
	Briefcase,
	Building2,
	CircleUser,
	IdCard,
	CheckCircle2,
	XCircle,
	Users,
	Download,
	UserPlus,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Status = "ACTIVE" | "INACTIVE";

interface Employee {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	status: Status;
}

export default function LeavePage() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [selected, setSelected] = useState<Employee | null>(null);

	useEffect(() => {
		const fetchLeaves = async () => {
			try {
				const apiUrl =
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
				const { data } = await axios.get(`${apiUrl}/employee`);
				setEmployees(data);
			} catch (error) {
				console.error("Failed to fetch employees:", error);
			} finally {
			}
		};

		fetchLeaves();
	}, []);

	const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
	const inactiveCount = employees.filter((e) => e.status === "INACTIVE").length;

	
	return (
		<div className="min-h-screen flex bg-[#F8FAFC] font-sans">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<div className="flex-1 overflow-y-auto p-6 space-y-5">
					{/* ── HEADER ── */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold text-[#1E293B]">Employees</h1>
							<p className="text-sm text-[#64748B] mt-0.5">
								{employees.length} total members
							</p>
						</div>
						<div className="flex items-center gap-2">
							<button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
								<Download className="w-4 h-4" /> Export
							</button>
							<button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
								<UserPlus className="w-4 h-4" /> Add Employee
							</button>
						</div>
					</div>

					{/* ── STAT PILLS ── */}
					<div className="flex flex-wrap gap-3">
						{[
							{
								label: "Total",
								val: employees.length,
								dot: "bg-[#2563EB]",
								cls: "bg-white border-[#E2E8F0] text-[#1E293B]",
							},
							{
								label: "Active",
								val: activeCount,
								dot: "bg-[#10B981]",
								cls: "bg-emerald-50 border-emerald-200 text-emerald-700",
							},
							{
								label: "Inactive",
								val: inactiveCount,
								dot: "bg-[#64748B]",
								cls: "bg-slate-50 border-slate-200 text-slate-600",
							},
						].map(({ label, val, dot, cls }) => (
							<div
								key={label}
								className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium ${cls}`}
								style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
								<span className={`w-2 h-2 rounded-full ${dot}`} />
								{val} {label}
							</div>
						))}
					</div>

					{/* ── TABLE ── */}
					<div
						className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden"
						style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
						{/* Result count */}
						<div className="px-5 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
							<p className="text-xs text-[#64748B]">
								Showing{" "}
								<span className="font-semibold text-[#1E293B]">
									{employees.length}
								</span>{" "}
								of {employees.length} employees
							</p>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
										{(
											[
												{ key: "name", label: "Employee" },
												{ key: "id", label: "ID" },
												{ key: "department", label: "Department" },
												{ key: "role", label: "Role" },
												{ key: "status", label: "Status" },
												{ key: "joined", label: "Joined" },
											]
										).map(({ key, label }) => (
											<th
												key={key}
												className="px-4 py-3 text-left text-xs font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-[#1E293B] select-none">
												<div className="flex items-center gap-1">
													{label}
												</div>
											</th>
										))}
										<th className="px-4 py-3" />
									</tr>
								</thead>
								<tbody className="divide-y divide-[#F1F5F9]">
									{employees.length === 0 && (
										<tr>
											<td colSpan={7} className="px-5 py-12 text-center">
												<Users className="w-10 h-10 mx-auto text-[#64748B] opacity-30 mb-2" />
												<p className="text-sm text-[#64748B]">
													No employees match your filters.
												</p>
											</td>
										</tr>
									)}
									{employees.map((emp) => {
										const st = STATUS_META[emp.status];
										const isSelected = selected?.id === emp.id;
										return (
											<tr
												key={emp.id}
												className={`transition-colors ${isSelected ? "bg-blue-50" : "hover:bg-[#F8FAFC]"}`}>
												{/* Name */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<div className="flex items-center gap-3">
														<div
															className={`w-9 h-9 rounded-full ${avatarBg(emp.first_name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
															{emp.first_name.slice(0,2)}
														</div>
														<div>
															<p className="text-sm font-semibold text-[#1E293B]">
																{emp.first_name} {emp.last_name}
															</p>
															<p className="text-xs text-[#64748B]">
																{emp.email}
															</p>
														</div>
													</div>
												</td>
												{/* ID */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<span className="text-xs font-mono text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-0.5 rounded">
														{emp.id}
													</span>
												</td>
												{/* Department */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<span className="text-sm text-[#1E293B]">
														Department
													</span>
												</td>
												{/* Role */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<span className="text-sm text-[#64748B]">
														Employee
													</span>
												</td>
												{/* Status */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<span
														className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.cls}`}>
														<span
															className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
														/>
														{st.label}
													</span>
												</td>
												{/* Joined */}
												<td className="px-4 py-3.5 whitespace-nowrap">
													<div className="flex items-center gap-1.5 text-xs text-[#64748B]">
														<Clock className="w-3 h-3" />
														16-Jan-2025
													</div>
												</td>
												{/* Action */}
												<td className="px-4 py-3.5 whitespace-nowrap text-right">
													<button
														onClick={() => setSelected(isSelected ? null : emp)}
														className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
															isSelected
																? "bg-[#2563EB] text-white border-[#2563EB]"
																: "border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50"
														}`}>
														{isSelected ? "Viewing" : "View"}
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{/* Pagination mock */}
						<div className="px-5 py-3 border-t border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
							<p className="text-xs text-[#64748B]">Page 1 of 1</p>
							<div className="flex items-center gap-1">
								{[1].map((p) => (
									<button
										key={p}
										className="w-7 h-7 rounded-lg bg-[#2563EB] text-white text-xs font-semibold">
										{p}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Side panel */}
			{selected && (
				<DetailPanel emp={selected} onClose={() => setSelected(null)} />
			)}
		</div>
	);
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({ emp, onClose }: { emp: Employee; onClose: () => void }) {
	const st = STATUS_META[emp.status];
	const StIcon = st.icon;
	return (
		<>
			{/* backdrop */}
			<div
				className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-30 lg:hidden"
				onClick={onClose}
			/>

			<aside
				className="fixed right-0 top-0 h-full w-full sm:w-100px z-40 flex flex-col bg-white border-l border-[#E2E8F0] shadow-2xl transition-transform duration-200"
				style={{ boxShadow: "-4px 0 24px rgba(0,0,0,0.10)" }}>
				{/* Panel header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] shrink-0">
					<h2 className="text-base font-semibold text-[#1E293B]">
						Employee Details
					</h2>
					<button
						onClick={onClose}
						className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1E293B] transition-colors">
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Scrollable body */}
				<div className="flex-1 overflow-y-auto">
					{/* Avatar block */}
					<div
						className="p-6 pb-4 flex flex-col items-center text-center border-b border-[#E2E8F0]"
						style={{
							background: "linear-gradient(160deg, #0f172a 0%, #1a2744 100%)",
						}}>
						<div
							className={`w-16 h-16 rounded-2xl ${avatarBg(emp.first_name)} flex items-center justify-center text-white text-xl font-bold border-2 border-white/20 mb-3`}>
							{emp.first_name.slice(0,2)}
						</div>
						<p className="text-white text-lg font-bold">{emp.first_name} {emp.last_name}</p>
						<p className="text-blue-200 text-sm mt-0.5">Employee</p>
						<div className="mt-3 flex items-center gap-2">
							<span
								className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${st.cls}`}>
								<StIcon className="w-3 h-3" /> {st.label}
							</span>
							<span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/10 text-blue-200 text-xs border border-white/10">
								Department
							</span>
						</div>
					</div>

					{/* Info sections */}
					<div className="p-5 space-y-5">
						<section>
							<p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
								Contact Information
							</p>
							<div className="space-y-2.5">
								{[
									{ icon: Mail, label: emp.email },
									{ icon: Phone, label: emp.phone },
								].map(({ icon: Icon, label }) => (
									<div key={label} className="flex items-center gap-3">
										<div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
											<Icon className="w-3.5 h-3.5 text-[#64748B]" />
										</div>
										<span className="text-sm text-[#1E293B] break-all">
											{label}
										</span>
									</div>
								))}
							</div>
						</section>

						<div className="h-px bg-[#E2E8F0]" />

						<section>
							<p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
								Employment Details
							</p>
							<div className="space-y-2.5">
								{[
									{ icon: IdCard, label: "Employee ID", value: emp.id },
									{
										icon: Building2,
										label: "Department",
										value: "Department",
									},
									{ icon: Briefcase, label: "Role", value: "Employee" },
									{ icon: CircleUser, label: "Reports To", value: "Manager" },
								].map(({ icon: Icon, label, value }) => (
									<div key={label} className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
											<Icon className="w-3.5 h-3.5 text-[#64748B]" />
										</div>
										<div>
											<p className="text-xs text-[#64748B]">{label}</p>
											<p className="text-sm font-medium text-[#1E293B]">
												{value}
											</p>
										</div>
									</div>
								))}
							</div>
						</section>

						<div className="h-px bg-[#E2E8F0]" />

						{/* Quick actions */}
						<section>
							<p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
								Quick Actions
							</p>
							<div className="grid grid-cols-2 gap-2">
								{[
									"Send Email",
									"View Payslip",
									"Leave History",
									"Performance",
								].map((a) => (
									<button
										key={a}
										className="py-2 px-3 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-all text-left">
										{a}
									</button>
								))}
							</div>
						</section>
					</div>
				</div>
				{/* Panel footer */}
				<div className="px-5 py-4 border-t border-[#E2E8F0] flex gap-2 shrink-0 bg-[#F8FAFC]">
					<button className="flex-1 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
						Edit Employee
					</button>
					<button
						onClick={onClose}
						className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-medium hover:bg-[#F1F5F9] transition-colors bg-white">
						Close
					</button>
				</div>
			</aside>
		</>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// const employees: Employee[] = [
//   { id:"EMP-0001", name:"Sarah Chen",      email:"sarah.chen@company.com",    phone:"+1 (415) 234-5678", department:"Engineering",  role:"Senior Engineer",    status:"active",   location:"San Francisco, CA", joined:"Jan 12, 2022", manager:"Michael Chen",    avatarInitials:"SC" },
//   { id:"EMP-0002", name:"Marcus Hall",     email:"marcus.hall@company.com",   phone:"+1 (212) 345-6789", department:"Design",       role:"UX Lead",            status:"active",   location:"New York, NY",      joined:"Mar 3, 2021",  manager:"Lisa Park",       avatarInitials:"MH" },
//   { id:"EMP-0003", name:"Priya Sharma",    email:"priya.sharma@company.com",  phone:"+1 (650) 456-7890", department:"Marketing",    role:"Marketing Manager",  status:"on_leave", location:"Remote",            joined:"Jun 15, 2020", manager:"David Lee",       avatarInitials:"PS" },
//   { id:"EMP-0004", name:"David Kim",       email:"david.kim@company.com",     phone:"+1 (512) 567-8901", department:"Sales",        role:"Sales Executive",    status:"active",   location:"Austin, TX",        joined:"Sep 8, 2023",  manager:"Carol Evans",     avatarInitials:"DK" },
//   { id:"EMP-0005", name:"Omar Farouk",     email:"omar.farouk@company.com",   phone:"+1 (312) 678-9012", department:"Analytics",    role:"Data Scientist",     status:"active",   location:"Chicago, IL",       joined:"Feb 20, 2022", manager:"Michael Chen",    avatarInitials:"OF" },
//   { id:"EMP-0006", name:"Nina Petrov",     email:"nina.petrov@company.com",   phone:"+1 (415) 789-0123", department:"Engineering",  role:"DevOps Engineer",    status:"inactive", location:"San Francisco, CA", joined:"Nov 1, 2019",  manager:"Michael Chen",    avatarInitials:"NP" },
//   { id:"EMP-0007", name:"Alex Rivera",     email:"alex.rivera@company.com",   phone:"+1 (213) 890-1234", department:"Finance",      role:"Financial Analyst",  status:"active",   location:"Los Angeles, CA",   joined:"Apr 14, 2021", manager:"Janet Moore",     avatarInitials:"AR" },
//   { id:"EMP-0008", name:"Julia Park",      email:"julia.park@company.com",    phone:"+1 (650) 901-2345", department:"Design",       role:"Product Designer",   status:"active",   location:"Remote",            joined:"Jul 7, 2023",  manager:"Lisa Park",       avatarInitials:"JP" },
//   { id:"EMP-0009", name:"Leon Weber",      email:"leon.weber@company.com",    phone:"+1 (206) 012-3456", department:"Engineering",  role:"Backend Engineer",   status:"on_leave", location:"Seattle, WA",       joined:"Oct 30, 2020", manager:"Michael Chen",    avatarInitials:"LW" },
//   { id:"EMP-0010", name:"Aiko Tanaka",     email:"aiko.tanaka@company.com",   phone:"+1 (415) 123-4567", department:"Finance",      role:"Accountant",         status:"active",   location:"San Francisco, CA", joined:"Aug 22, 2022", manager:"Janet Moore",     avatarInitials:"AT" },
//   { id:"EMP-0011", name:"Ben Okafor",      email:"ben.okafor@company.com",    phone:"+1 (404) 234-5678", department:"Analytics",    role:"BI Analyst",         status:"active",   location:"Atlanta, GA",       joined:"Mar 17, 2023", manager:"David Lee",       avatarInitials:"BO" },
//   { id:"EMP-0012", name:"Carla Martin",    email:"carla.martin@company.com",  phone:"+1 (512) 345-6789", department:"Design",       role:"UX Researcher",      status:"active",   location:"Austin, TX",        joined:"Dec 5, 2021",  manager:"Lisa Park",       avatarInitials:"CM" },
//   { id:"EMP-0013", name:"Derek Lam",       email:"derek.lam@company.com",     phone:"+1 (650) 456-7891", department:"Engineering",  role:"Frontend Engineer",  status:"active",   location:"Remote",            joined:"May 9, 2020",  manager:"Michael Chen",    avatarInitials:"DL" },
//   { id:"EMP-0014", name:"Maria Gonzalez",  email:"maria.gonzalez@company.com",phone:"+1 (305) 567-8902", department:"HR",           role:"HR Specialist",      status:"active",   location:"Miami, FL",         joined:"Jan 28, 2022", manager:"Carol Evans",     avatarInitials:"MG" },
//   { id:"EMP-0015", name:"Tom Bradley",     email:"tom.bradley@company.com",   phone:"+1 (617) 678-9013", department:"Sales",        role:"Sales Manager",      status:"inactive", location:"Boston, MA",        joined:"Feb 14, 2019", manager:"Carol Evans",     avatarInitials:"TB" },
// ]
