"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Menu, ArrowLeft, Calendar } from "lucide-react";

import Sidebar from "@/components/ui/sidebar";
import { leaveTypes } from "@/app/types";
import useAuth from "@/hooks/useAuth";
import { initials } from "@/app/dashboard/page";

export default function LeaveApplicationPage() {
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [userProfile] = useState({ name: "John Doe", role: "HR Recruiter" });
	const { user } = useAuth();

	const [formData, setFormData] = useState({
		leave_type: "CASUAL",
		start_date: "",
		end_date: "",
		reason: "",
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const today = new Date().toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		if (
			!formData.leave_type ||
			!formData.start_date ||
			!formData.end_date ||
			!formData.reason
		) {
			setError("All fields are required");
			return;
		}

		const startDate = new Date(formData.start_date);
		const endDate = new Date(formData.end_date);

		if (endDate < startDate) {
			setError("End date must be after start date");
			return;
		}

		if (!user?.employee_id) {
			setError("Employee information is missing. Please log in again.");
			return;
		}

		setLoading(true);

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
			await axios.post(`${apiUrl}/leave`, {
				employee_id: user.employee_id,
				leave_type: formData.leave_type,
				start_date: formData.start_date,
				end_date: formData.end_date,
				reason: formData.reason,
			});

			setSuccess("Leave request submitted successfully!");
			setFormData({
				leave_type: "CASUAL",
				start_date: "",
				end_date: "",
				reason: "",
			});

			setTimeout(() => {
				router.push("/leave");
			}, 2000);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const detail = err.response?.data?.detail;
				setError(
					Array.isArray(detail)
						? detail.map((item) => item.msg).join(", ")
						: detail || err.message,
				);
			} else {
				setError(err instanceof Error ? err.message : "An error occurred");
			}
		} finally {
			setLoading(false);
		}
	};

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
							Apply for Leave
						</h1>
						<p className="text-xs text-[#64748B] hidden sm:block">{today}</p>
					</div>

					<div className="ml-auto flex items-center gap-3">
						<button className="relative w-9 h-9 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#1E293B] hover:border-[#2563EB] transition-colors">
							<Bell className="w-4 h-4" />
						</button>

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
					<div className="max-w-2xl mx-auto">
						<div
							className="bg-white rounded-xl border border-[#E2E8F0] p-6"
							style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
							<form onSubmit={handleSubmit} className="space-y-5">
								{/* Leave Type */}
								<div>
									<label className="block text-sm font-semibold text-[#1E293B] mb-2">
										Leave Type
									</label>
									<select
										name="leave_type"
										value={formData.leave_type}
										onChange={handleChange}
										className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] focus:border-[#2563EB]">
										{leaveTypes.map(({ value, label }) => (
											<option key={value} value={value}>
												{label}
											</option>
										))}
									</select>
								</div>

								{/* Date Range */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-semibold text-[#1E293B] mb-2">
											Start Date
										</label>
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
										<label className="block text-sm font-semibold text-[#1E293B] mb-2">
											End Date
										</label>
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
									<label className="block text-sm font-semibold text-[#1E293B] mb-2">
										Reason
									</label>
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
									className="w-full bg-[#2563EB] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
