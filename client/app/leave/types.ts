export interface Leave {
	id: string;
	employee_id: string;
	employee_name: string;
	approved_by: string | null;
	leave_type: string;
	status: "PENDING" | "APPROVED" | "REJECTED";
	start_date: string;
	end_date: string;
	reason: string;
}

export const leaveTypes = [
	{ value: "SICK", label: "Sick Leave" },
	{ value: "CASUAL", label: "Casual Leave" },
	{ value: "ANNUAL", label: "Annual Leave" },
	{ value: "UNPAID", label: "Unpaid Leave" },
];