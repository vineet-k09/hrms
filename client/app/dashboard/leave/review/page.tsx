"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leave } from "../../../types";

import {
	Bell,
	Menu,
	ArrowLeft,
	CheckCircle,
	XCircle,
	AlertCircle,
	Calendar,
} from "lucide-react";
import Sidebar from "@/components/ui/sidebar";

function StatusBadge({ status }: { status: string }) {
	const map: Record<string, { label: string; cls: string }> = {
		PENDING: {
			label: "Pending",
			cls: "bg-amber-50 text-amber-600 border-amber-200",
		},
		APPROVED: {
			label: "Approved",
			cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
		},
		REJECTED: {
			label: "Rejected",
			cls: "bg-red-50 text-red-600 border-red-200",
		},
	};
	const { label, cls } = map[status] ?? { label: status, cls: "" };
	return (
		<span
			className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${cls}`}>
			{label}
		</span>
	);
}

function initials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

export default function LeaveReviewPage() {
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [leaves, setLeaves] = useState<Leave[]>([]);
	const [loading, setLoading] = useState(true);
	const [userProfile] = useState({ name: "John Doe", role: "HR Recruiter" });
	const [actionInProgress, setActionInProgress] = useState<string | null>(null);

	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	useEffect(() => {
		const fetchLeaves = async () => {
			try {
				const apiUrl =
					process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
				const res = await fetch(`${apiUrl}/leave/pending`);
				if (res.ok) {
					const data = await res.json();
					// TODO: Filter by manager's juniors once auth context is available
					setLeaves(data);
				}
			} catch (error) {
				console.error("Failed to fetch leaves:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchLeaves();
	}, []);

	const handleApprove = async (leaveId: string) => {
		setActionInProgress(leaveId);
		try {
			const apiUrl =
				process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
			// TODO: Get actual approver_id from auth context
			const res = await fetch(`${apiUrl}/leave/${leaveId}/approve`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					approved_by: "00000000-0000-0000-0000-000000000000",
				}),
			});

			if (res.ok) {
				setLeaves(
					leaves.map((l) =>
						l.id === leaveId ? { ...l, status: "APPROVED" } : l,
					),
				);
			}
		} catch (error) {
			console.error("Failed to approve leave:", error);
		} finally {
			setActionInProgress(null);
		}
	};

	const handleReject = async (leaveId: string) => {
		setActionInProgress(leaveId);
		try {
			const apiUrl =
				process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
			// TODO: Get actual approver_id from auth context
			const res = await fetch(`${apiUrl}/leave/${leaveId}/reject`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					approved_by: "00000000-0000-0000-0000-000000000000",
				}),
			});

			if (res.ok) {
				setLeaves(
					leaves.map((l) =>
						l.id === leaveId ? { ...l, status: "REJECTED" } : l,
					),
				);
			}
		} catch (error) {
			console.error("Failed to reject leave:", error);
		} finally {
			setActionInProgress(null);
		}
	};

	const pendingLeaves = leaves.filter((l) => l.status === "PENDING");

	return (
		<div className="min-h-screen flex bg-[#F8FAFC] font-sans">
			{/* ── SIDEBAR ── */}
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			{/* ── MAIN CONTENT ── */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				{/* TOP NAVBAR */}
				<header className="sticky top-0 z-20 h-18 bg-white border-b border-[#E2E8F0] flex items-center px-6 gap-4 shrink-0">
					<button
						className="lg:hidden text-[#64748B] hover:text-[#1E293B] transition-colors mr-1"
						onClick={() => setSidebarOpen(true)}>
						<Menu className="w-5 h-5" />
					</button>

					<button
						onClick={() => router.back()}
						className="flex items-center gap-2 text-[#64748B] hover:text-[#1E293B] transition-colors">
						<ArrowLeft className="w-4 h-4" />
						<span className="hidden sm:inline text-sm font-medium">Back</span>
					</button>

					<div>
						<h1 className="text-base font-semibold text-[#1E293B]">
							Leave Approvals
						</h1>
						<p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
					</div>

					<div className="ml-auto flex items-center gap-3">
						<div className="relative">
							<button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
								<Bell className="w-4 h-4" />
								{pendingLeaves.length > 0 && (
									<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
								)}
							</button>
							{pendingLeaves.length > 0 && (
								<span className="absolute -top-2 -right-2 bg-[#EF4444] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
									{pendingLeaves.length}
								</span>
							)}
						</div>

						<div className="flex items-center gap-2.5 pl-2 border-l border-[#E2E8F0]">
							<div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
								<span className="text-white text-xs font-bold">
									{initials(userProfile.name)}
								</span>
							</div>
							<div className="hidden sm:block">
								<p className="text-sm font-medium text-[#1E293B] leading-none">
									{userProfile.name}
								</p>
								<span className="inline-flex items-center mt-1 px-2 py-0.5 text-xs font-medium bg-blue-50 text-[#2563EB] rounded-full border border-blue-100">
									{userProfile.role}
								</span>
							</div>
						</div>
					</div>
				</header>

				{/* PAGE BODY */}
				<main className="flex-1 overflow-y-auto p-6">
					<div className="max-w-4xl mx-auto">
						{/* STATS */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
							<div
								className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
								style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-3xl font-bold text-[#1E293B]">
											{pendingLeaves.length}
										</p>
										<p className="text-sm text-[#64748B] mt-0.5">
											Pending Approvals
										</p>
									</div>
									<AlertCircle className="w-10 h-10 text-amber-500/20" />
								</div>
							</div>

							<div
								className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow duration-200"
								style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
								<div className="flex items-center justify-between">
									<div>
										<p className="text-3xl font-bold text-[#1E293B]">
											{leaves.length}
										</p>
										<p className="text-sm text-[#64748B] mt-0.5">
											Total Requests
										</p>
									</div>
									<Calendar className="w-10 h-10 text-blue-500/20" />
								</div>
							</div>
						</div>

						{/* LEAVES LIST */}
						<div
							className="bg-white rounded-xl border border-[#E2E8F0] p-5"
							style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
							<div className="flex items-center justify-between mb-5">
								<div>
									<h3 className="text-base font-semibold text-[#1E293B]">
										Leave Requests
									</h3>
									<p className="text-xs text-[#64748B] mt-0.5">
										Manage leaves from your team members
									</p>
								</div>
							</div>

							{loading ? (
								<div className="text-center py-8 text-[#64748B]">
									Loading requests...
								</div>
							) : pendingLeaves.length === 0 ? (
								<div className="text-center py-12">
									<CheckCircle className="w-12 h-12 text-emerald-500/40 mx-auto mb-2" />
									<p className="text-[#64748B]">No pending leave requests</p>
								</div>
							) : (
								<div className="space-y-3">
									{pendingLeaves.map(
										({
											id,
											employee_name,
											leave_type,
											start_date,
											end_date,
											status,
											reason,
										}) => {
											const startDate = new Date(start_date);
											const endDate = new Date(end_date);
											const days =
												Math.ceil(
													(endDate.getTime() - startDate.getTime()) /
														(1000 * 60 * 60 * 24),
												) + 1;
											const isProcessing = actionInProgress === id;

											return (
												<div
													key={id}
													className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#2563EB]/30 transition-colors">
													<div className="flex items-start justify-between gap-4 mb-3">
														<div>
															<p className="text-sm font-semibold text-[#1E293B]">
																{" "}
																{employee_name} - {leave_type}
															</p>
															<p className="text-xs text-[#64748B] mt-0.5">
																{startDate.toLocaleDateString()} to{" "}
																{endDate.toLocaleDateString()} · {days} days
															</p>
														</div>
														<StatusBadge status={status} />
													</div>

													<p className="text-sm text-[#64748B] mb-4 p-3 bg-white rounded-lg border border-[#E2E8F0]">
														{reason}
													</p>

													<div className="flex gap-2">
														<button
															onClick={() => handleApprove(id)}
															disabled={isProcessing}
															className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50">
															<CheckCircle className="w-4 h-4" />
															{isProcessing ? "Approving..." : "Approve"}
														</button>
														<button
															onClick={() => handleReject(id)}
															disabled={isProcessing}
															className="flex-1 flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50">
															<XCircle className="w-4 h-4" />
															{isProcessing ? "Rejecting..." : "Reject"}
														</button>
													</div>
												</div>
											);
										},
									)}
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
