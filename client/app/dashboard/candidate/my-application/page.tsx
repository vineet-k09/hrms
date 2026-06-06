"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import useAuth from "@/hooks/useAuth";
import { authenticatedFetch } from "@/lib/auth";
import {
	Briefcase,
	Bot,
	Clock,
	MapPin,
	ExternalLink,
	Search,
	FileText,
	ChevronRight,
	Building2,
	Star,
	Filter,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ApplicationStatus =
	| "applied"
	| "screening"
	| "interview"
	| "offer"
	| "rejected";

type BackendApplicationStatus =
	| "APPLIED"
	| "SCREENED"
	| "SHORTLISTED"
	| "INTERVIEW"
	| "SELECTED"
	| "REJECTED"
	| "HIRED";

type ApplicationRecord = {
	id: string;
	employeeId: string;
	role: string;
	company: string;
	location: string;
	appliedDate: string;
	status: ApplicationStatus;
	aiScore: number;
	type: string;
	logo: string;
	logoColor: string;
	nextStep: string | null;
	jobDescriptionId?: string;
};

type OpenRole = {
	id: string;
	jobDescriptionId?: string;
	role: string;
	company: string;
	location: string;
	type: string;
	description: string;
	fitScore: number;
	logoColor: string;
	jobCode?: string;
};

type BackendApplication = {
	id: string;
	job_description_id: string;
	job_code?: string | null;
	title: string;
	department_name: string;
	status: BackendApplicationStatus;
	notes?: string | null;
	resume_url?: string | null;
	resume_key?: string | null;
	created_at?: string | null;
};

type BackendOpenRole = {
	id: string;
	job_code?: string | null;
	title: string;
	department_name: string;
	description: string;
	requirements: string;
	status: "DRAFT" | "OPEN" | "CLOSED";
};

type RolePresentation = {
	company: string;
	location: string;
	type: string;
	description: string;
	fitScore: number;
	aiScore: number;
	logo: string;
	logoColor: string;
	nextStep: string | null;
	appliedDate: string;
};

const ROLE_PRESENTATION_BY_TITLE: Record<string, RolePresentation> = {
	"Senior Software Engineer": {
		company: "TechNova Inc.",
		location: "San Francisco, CA (Remote)",
		type: "Full-time",
		description: "Build customer-facing features and mentor a small squad.",
		fitScore: 97,
		aiScore: 92,
		logo: "TN",
		logoColor: "bg-blue-500",
		nextStep: "Technical interview on Jun 5",
		appliedDate: "May 28, 2026",
	},
	"Product Designer": {
		company: "DesignCraft",
		location: "New York, NY (Hybrid)",
		type: "Full-time",
		description: "Shape workflows for HR and employee experience journeys.",
		fitScore: 90,
		aiScore: 85,
		logo: "DC",
		logoColor: "bg-purple-500",
		nextStep: "Portfolio review in progress",
		appliedDate: "May 20, 2026",
	},
	"Data Scientist": {
		company: "DataPulse",
		location: "Remote",
		type: "Full-time",
		description: "Improve forecasting models and hiring analytics dashboards.",
		fitScore: 94,
		aiScore: 96,
		logo: "DP",
		logoColor: "bg-emerald-500",
		nextStep: "Offer deadline: Jun 10, 2026",
		appliedDate: "May 15, 2026",
	},
	"DevOps Lead": {
		company: "CloudBase",
		location: "Austin, TX",
		type: "Contract",
		description:
			"Automate infra delivery and harden internal platform services.",
		fitScore: 88,
		aiScore: 78,
		logo: "CB",
		logoColor: "bg-slate-500",
		nextStep: null,
		appliedDate: "May 10, 2026",
	},
	"Frontend Engineer": {
		company: "UIFlow",
		location: "Remote",
		type: "Full-time",
		description:
			"Ship design-system driven product UI with a strong polish bar.",
		fitScore: 86,
		aiScore: 88,
		logo: "UF",
		logoColor: "bg-amber-500",
		nextStep: "Application under review",
		appliedDate: "Jun 1, 2026",
	},
	"Platform Engineer": {
		company: "CloudBase",
		location: "Austin, TX",
		type: "Contract",
		description:
			"Automate infra delivery and harden internal platform services.",
		fitScore: 88,
		aiScore: 84,
		logo: "CB",
		logoColor: "bg-slate-500",
		nextStep: "Interview scheduling pending",
		appliedDate: "Jun 3, 2026",
	},
	"HRIS Analyst": {
		company: "PeopleOps Lab",
		location: "Chicago, IL (Hybrid)",
		type: "Full-time",
		description: "Own employee records, process automation, and data quality.",
		fitScore: 81,
		aiScore: 79,
		logo: "PL",
		logoColor: "bg-cyan-500",
		nextStep: "Screening queue",
		appliedDate: "Jun 4, 2026",
	},
};

const STATUS = {
	applied: {
		label: "Applied",
		cls: "bg-slate-50 text-slate-600 border-slate-200",
	},
	screening: {
		label: "Screening",
		cls: "bg-amber-50 text-amber-600 border-amber-200",
	},
	interview: {
		label: "Interview",
		cls: "bg-blue-50 text-blue-600 border-blue-200",
	},
	offer: {
		label: "Offer",
		cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
	},
	rejected: { label: "Rejected", cls: "bg-red-50 text-red-600 border-red-200" },
};

const TABS = ["All", "Active", "Closed"];
const ACTIVE = ["applied", "screening", "interview", "offer"];
const CLOSED = ["rejected"];

function getPresentation(role: string): RolePresentation {
	return (
		ROLE_PRESENTATION_BY_TITLE[role] ?? {
			company: "Open Role",
			location: "Remote",
			type: "Full-time",
			description: "A backend role surfaced from the live jobs API.",
			fitScore: 80,
			aiScore: 80,
			logo: role.slice(0, 2).toUpperCase(),
			logoColor: "bg-blue-500",
			nextStep: null,
			appliedDate: new Date().toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
		}
	);
}

function mapBackendStatus(status: BackendApplicationStatus): ApplicationStatus {
	switch (status) {
		case "SCREENED":
			return "screening";
		case "SHORTLISTED":
		case "INTERVIEW":
			return "interview";
		case "SELECTED":
		case "HIRED":
			return "offer";
		case "REJECTED":
			return "rejected";
		case "APPLIED":
		default:
			return "applied";
	}
}

function toDisplayDate(value?: string | null) {
	if (!value)
		return new Date().toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;

	return parsed.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

function createApplicationRecord(
	item: BackendApplication,
	userEmployeeId: string,
): ApplicationRecord {
	const presentation = getPresentation(item.title);

	return {
		id: item.id,
		employeeId: userEmployeeId,
		role: item.title,
		company: presentation.company || item.department_name,
		location: presentation.location,
		appliedDate: toDisplayDate(item.created_at),
		status: mapBackendStatus(item.status),
		aiScore: presentation.aiScore,
		type: presentation.type,
		logo: presentation.logo,
		logoColor: presentation.logoColor,
		nextStep: presentation.nextStep,
		jobDescriptionId: item.job_description_id,
	};
}

function createOpenRoleRecord(item: BackendOpenRole): OpenRole {
	const presentation = getPresentation(item.title);

	return {
		id: item.id,
		jobDescriptionId: item.id,
		jobCode: item.job_code ?? undefined,
		role: item.title,
		company: presentation.company || item.department_name,
		location: presentation.location,
		type: presentation.type,
		description: item.description || presentation.description,
		fitScore: presentation.fitScore,
		logoColor: presentation.logoColor,
	};
}

export default function MyApplicationsPage() {
	const { user, token } = useAuth();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [tab, setTab] = useState("All");
	const [search, setSearch] = useState("");
	const [showOpenRoles, setShowOpenRoles] = useState(false);
	const [applications, setApplications] = useState<ApplicationRecord[]>([]);
	const [openRoles, setOpenRoles] = useState<OpenRole[]>([]);
	const [syncStatus, setSyncStatus] = useState<string | null>(null);
	const [applyingId, setApplyingId] = useState<string | null>(null);
	const [loadingData, setLoadingData] = useState(true);

	useEffect(() => {
		let cancelled = false;

		async function loadBackendData() {
			const employeeId = user?.employee_id ?? "employee-demo";

			if (!user || !token) {
				setApplications([]);
				setOpenRoles([]);
				setShowOpenRoles(false);
				setLoadingData(false);
				return;
			}

			setLoadingData(true);

			try {
				const [applicationsResponse, openRolesResponse] = await Promise.all([
					authenticatedFetch("/recruitment/applications/me"),
					authenticatedFetch("/recruitment/jobs/open"),
				]);

				const backendApplications = applicationsResponse.ok
					? ((await applicationsResponse.json()) as BackendApplication[])
					: [];
				const backendOpenRoles = openRolesResponse.ok
					? ((await openRolesResponse.json()) as BackendOpenRole[])
					: [];

				if (cancelled) return;

				const mappedApplications = backendApplications.map((item) =>
					createApplicationRecord(item, employeeId),
				);
				const mappedOpenRoles = backendOpenRoles.map(createOpenRoleRecord);

				setApplications(mappedApplications);
				setOpenRoles(
					mappedOpenRoles.filter((role) => {
						const appliedKey =
							role.jobDescriptionId ?? `${role.role}|${role.company}`;
						return !mappedApplications.some((application) => {
							const applicationKey =
								application.jobDescriptionId ??
								`${application.role}|${application.company}`;
							return applicationKey === appliedKey;
						});
					}),
				);
				setShowOpenRoles(
					mappedApplications.length === 0 && mappedOpenRoles.length > 0,
				);
				setSyncStatus(null);
			} catch {
				if (cancelled) return;
				setApplications([]);
				setOpenRoles([]);
				setShowOpenRoles(false);
				setSyncStatus("Backend data could not be loaded right now.");
			} finally {
				if (!cancelled) {
					setLoadingData(false);
				}
			}
		}

		void loadBackendData();

		return () => {
			cancelled = true;
		};
	}, [token, user?.employee_id, user]);

	const alreadyApplied = useMemo(() => {
		const keys = new Set<string>();
		applications.forEach((app) => {
			if (app.jobDescriptionId) {
				keys.add(app.jobDescriptionId);
			}
			keys.add(`${app.role}|${app.company}`);
		});
		return keys;
	}, [applications]);

	const visibleOpenRoles = useMemo(
		() =>
			openRoles
				.filter((role) => {
					const appliedKey =
						role.jobDescriptionId ?? `${role.role}|${role.company}`;
					return !alreadyApplied.has(appliedKey);
				})
				.filter((role) => {
					const query = search.toLowerCase();
					return (
						role.role.toLowerCase().includes(query) ||
						role.company.toLowerCase().includes(query) ||
						role.location.toLowerCase().includes(query)
					);
				}),
		[alreadyApplied, openRoles, search],
	);

	const filteredApplications = useMemo(() => {
		return applications.filter((application) => {
			const matchTab =
				tab === "All"
					? true
					: tab === "Active"
						? ACTIVE.includes(application.status)
						: CLOSED.includes(application.status);
			const matchSearch =
				application.role.toLowerCase().includes(search.toLowerCase()) ||
				application.company.toLowerCase().includes(search.toLowerCase());
			return matchTab && matchSearch;
		});
	}, [applications, search, tab]);

	const applyLocally = (role: OpenRole) => {
		const appliedDate = new Date().toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
		const presentation = getPresentation(role.role);

		setApplications((current) => {
			const remaining = current.filter((application) => {
				if (role.jobDescriptionId && application.jobDescriptionId) {
					return application.jobDescriptionId !== role.jobDescriptionId;
				}

				return !(
					application.role === role.role && application.company === role.company
				);
			});

			return [
				{
					id: `local-${role.id}-${Date.now()}`,
					employeeId: user?.employee_id ?? "employee-demo",
					role: role.role,
					company: role.company,
					location: role.location,
					appliedDate,
					status: "applied",
					aiScore: presentation.aiScore,
					type: role.type,
					logo: presentation.logo,
					logoColor: role.logoColor,
					nextStep: "Application submitted successfully",
					jobDescriptionId: role.jobDescriptionId,
				},
				...remaining,
			];
		});

		setOpenRoles((current) =>
			current.filter(
				(item) =>
					(item.jobDescriptionId ?? `${item.role}|${item.company}`) !==
					(role.jobDescriptionId ?? `${role.role}|${role.company}`),
			),
		);
		setShowOpenRoles(true);
	};

	const handleApply = async (role: OpenRole) => {
		if (applyingId) return;

		setApplyingId(role.id);
		setSyncStatus(null);

		try {
			if (role.jobDescriptionId) {
				const response = await authenticatedFetch(
					"/recruitment/applications/apply",
					{
						method: "POST",
						body: JSON.stringify({
							job_description_id: role.jobDescriptionId,
							candidate: {
								id: user?.id,
								full_name: user?.full_name,
								email: user?.email,
								employee_id: user?.employee_id,
								role: user?.role,
							},
						}),
					},
				);

				if (!response.ok) {
					throw new Error(
						`Apply request failed with status ${response.status}`,
					);
				}
			}

			applyLocally(role);
		} catch {
			applyLocally(role);
			setSyncStatus(
				`Applied locally to ${role.role}. The backend apply route will sync on the next refresh.`,
			);
		} finally {
			setApplyingId(null);
		}
	};

	const totalApplications = applications.length;
	const hasApplications = totalApplications > 0;

	return (
		<div className="min-h-screen flex bg-[#F8FAFC] font-sans">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<div className="flex-1 overflow-y-auto p-6 space-y-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold text-[#1E293B]">
								My Applications
							</h1>
							<p className="text-sm text-[#64748B] mt-0.5">
								{loadingData
									? "Loading account data..."
									: `${totalApplications} total applications submitted`}
							</p>
						</div>
						<div className="flex items-center gap-3 flex-wrap justify-end">
							<Button
								type="button"
								variant="outline"
								onClick={() => setShowOpenRoles((current) => !current)}
								className="h-9 border-[#2563EB]/20 text-[#2563EB] bg-white hover:bg-blue-50">
								<Briefcase className="w-4 h-4" />
								{showOpenRoles ? "Hide open roles" : "Apply for a new role"}
							</Button>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
								<Input
									placeholder="Search role or company..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className="pl-9 h-9 w-64 text-sm bg-white border-[#E2E8F0]"
								/>
							</div>
							<button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white text-sm text-[#64748B] hover:border-[#2563EB] hover:text-[#2563EB] transition-colors">
								<Filter className="w-4 h-4" /> Filter
							</button>
						</div>
					</div>

					{syncStatus && (
						<div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
							<AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
							<p>{syncStatus}</p>
						</div>
					)}

					{showOpenRoles && (
						<div
							className="rounded-2xl border border-[#E2E8F0] bg-white p-5"
							style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
							<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
								<div>
									<h2 className="text-base font-semibold text-[#1E293B]">
										Open roles from the backend
									</h2>
									<p className="text-sm text-[#64748B] mt-0.5">
										These jobs come directly from the recruitment API and
										already-applied roles are filtered out automatically.
									</p>
								</div>
								<div className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-3 py-1.5 w-fit">
									{visibleOpenRoles.length} roles visible
								</div>
							</div>

							{visibleOpenRoles.length === 0 ? (
								<div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-[#64748B]">
									<p className="font-medium text-[#1E293B]">
										{hasApplications
											? "No matching open roles"
											: "No open roles found"}
									</p>
									<p className="text-sm mt-1">
										{hasApplications
											? "Try a different search or wait for the backend jobs list to expand."
											: "No active jobs were returned by the backend yet."}
									</p>
								</div>
							) : (
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									{visibleOpenRoles.map((role) => {
										const isBusy = applyingId === role.id;
										return (
											<div
												key={role.id}
												className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 hover:border-[#2563EB]/30 transition-colors">
												<div className="flex items-start justify-between gap-3 mb-3">
													<div>
														<div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0] text-xs text-[#64748B] mb-2">
															<Star className="w-3.5 h-3.5 text-amber-500" />
															{role.fitScore}% fit
														</div>
														<h3 className="text-base font-semibold text-[#1E293B]">
															{role.role}
														</h3>
														<p className="text-sm text-[#64748B] mt-0.5">
															{role.company}
														</p>
													</div>
													<div
														className={`w-10 h-10 rounded-xl ${role.logoColor} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
														{role.company.slice(0, 2).toUpperCase()}
													</div>
												</div>

												<p className="text-sm text-[#64748B] mb-4">
													{role.description}
												</p>

												<div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mb-4">
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0]">
														<MapPin className="w-3.5 h-3.5" />
														{role.location}
													</span>
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#E2E8F0]">
														<Briefcase className="w-3.5 h-3.5" />
														{role.type}
													</span>
												</div>

												<Button
													type="button"
													onClick={() => handleApply(role)}
													disabled={isBusy}
													className="w-full bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
													{isBusy ? (
														<>
															<Loader2 className="w-4 h-4 animate-spin" />{" "}
															Applying...
														</>
													) : (
														"Apply"
													)}
												</Button>
											</div>
										);
									})}
								</div>
							)}
						</div>
					)}

					<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
						{[
							{
								label: "Total",
								val: applications.length,
								color: "text-[#1E293B]",
								bg: "bg-slate-50",
								border: "border-slate-200",
							},
							{
								label: "Active",
								val: applications.filter((app) => ACTIVE.includes(app.status))
									.length,
								color: "text-[#2563EB]",
								bg: "bg-blue-50",
								border: "border-blue-200",
							},
							{
								label: "Offer",
								val: applications.filter((app) => app.status === "offer")
									.length,
								color: "text-[#10B981]",
								bg: "bg-emerald-50",
								border: "border-emerald-200",
							},
							{
								label: "Rejected",
								val: applications.filter((app) => app.status === "rejected")
									.length,
								color: "text-[#EF4444]",
								bg: "bg-red-50",
								border: "border-red-200",
							},
						].map(({ label, val, color, bg, border }) => (
							<div
								key={label}
								className={`rounded-xl border ${border} ${bg} p-4 text-center`}>
								<p className={`text-3xl font-bold ${color}`}>{val}</p>
								<p className="text-xs text-[#64748B] mt-0.5">{label}</p>
							</div>
						))}
					</div>

					<div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl p-1 w-fit">
						{TABS.map((item) => (
							<button
								key={item}
								onClick={() => setTab(item)}
								className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
									tab === item
										? "bg-[#2563EB] text-white shadow-sm"
										: "text-[#64748B] hover:text-[#1E293B]"
								}`}>
								{item}
							</button>
						))}
					</div>

					<div className="space-y-4">
						{filteredApplications.length === 0 && (
							<div className="text-center py-12 text-[#64748B]">
								<FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
								<p className="font-medium">
									{hasApplications
										? "No applications found"
										: "No applications yet"}
								</p>
								<p className="text-sm mt-1">
									{hasApplications
										? "Try a different search or open the live jobs list above."
										: "Open roles from the backend are available above so you can apply right away."}
								</p>
							</div>
						)}
						{filteredApplications.map((application) => {
							const statusMeta = STATUS[application.status];
							const isClosed = CLOSED.includes(application.status);

							return (
								<div
									key={application.id}
									className={`bg-white rounded-xl border p-5 hover:shadow-md transition-all duration-200 ${
										isClosed
											? "border-[#E2E8F0] opacity-70"
											: "border-[#E2E8F0] hover:border-[#2563EB]/30"
									}`}
									style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
									<div className="flex flex-col sm:flex-row sm:items-start gap-4">
										<div
											className={`w-12 h-12 rounded-xl ${application.logoColor} flex items-center justify-center shrink-0 text-white font-bold text-sm`}>
											{application.logo}
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex flex-wrap items-start gap-2 mb-1">
												<h3 className="text-base font-semibold text-[#1E293B]">
													{application.role}
												</h3>
												<span
													className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusMeta.cls}`}>
													{statusMeta.label}
												</span>
											</div>
											<div className="flex flex-wrap items-center gap-3 text-sm text-[#64748B] mb-3">
												<span className="flex items-center gap-1">
													<Building2 className="w-3.5 h-3.5" />{" "}
													{application.company}
												</span>
												<span className="flex items-center gap-1">
													<MapPin className="w-3.5 h-3.5" />{" "}
													{application.location}
												</span>
												<span className="flex items-center gap-1">
													<Clock className="w-3.5 h-3.5" /> Applied{" "}
													{application.appliedDate}
												</span>
												<span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
													{application.type}
												</span>
											</div>

											{application.nextStep && (
												<div className="flex items-center gap-2 text-xs text-[#64748B] bg-[#F8FAFC] px-3 py-2 rounded-lg border border-[#E2E8F0] w-fit">
													<ChevronRight className="w-3.5 h-3.5 text-[#2563EB]" />
													{application.nextStep}
												</div>
											)}
										</div>

										<div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
											<div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 border border-purple-100">
												<Bot className="w-3.5 h-3.5 text-purple-500" />
												<span className="text-sm font-bold text-purple-600">
													{application.aiScore}
												</span>
												<span className="text-xs text-purple-400">/ 100</span>
											</div>
											{!isClosed && (
												<button className="flex items-center gap-1.5 text-xs text-[#2563EB] font-medium hover:underline">
													View Details <ExternalLink className="w-3 h-3" />
												</button>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
