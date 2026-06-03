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