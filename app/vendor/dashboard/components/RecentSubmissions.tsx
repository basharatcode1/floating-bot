import Link from "next/link";
import { FileCheck } from "lucide-react";
import { SectionHeading } from "@/app/components/ui/section-heading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";

const submissions = [
  { candidate: "Arjun Patel", requirement: "Senior React Developer", client: "TechCorp", submitted: "2 days ago", status: "Shortlisted", color: "#005A9C", initials: "AP" },
  { candidate: "Sara Khan", requirement: "Full Stack Engineer", client: "GlobalTech", submitted: "3 days ago", status: "In Review", color: "#06B6D4", initials: "SK" },
  { candidate: "Mike Chen", requirement: "DevOps Lead", client: "Innovate Inc", submitted: "1 day ago", status: "Submitted", color: "#10B981", initials: "MC" },
  { candidate: "Lisa Wang", requirement: "Data Engineer", client: "DataSys", submitted: "5 days ago", status: "Rejected", color: "#EF4444", initials: "LW" },
  { candidate: "Karan Singh", requirement: "Cloud Architect", client: "CloudNative", submitted: "1 week ago", status: "Selected", color: "#F59E0B", initials: "KS" },
];

const statusStyles: Record<string, string> = {
  "Shortlisted": "var(--dash-badge-bg)",
  "In Review": "var(--dash-info-bg)",
  "Submitted": "var(--dash-success-bg)",
  "Rejected": "var(--dash-danger-bg)",
  "Selected": "var(--dash-warning-bg)",
};

const statusTextStyles: Record<string, string> = {
  "Shortlisted": "var(--dash-badge-text)",
  "In Review": "var(--dash-info-text)",
  "Submitted": "var(--dash-success-text)",
  "Rejected": "var(--dash-danger-text)",
  "Selected": "var(--dash-warning-text)",
};

export default function RecentSubmissions() {
  return (
    <div className="dash-card h-full">
      <SectionHeading
        title="Recent Submissions"
        icon={<FileCheck />}
        action={
          <Link href="/vendor/submissions" className="dash-view-all">
            View All →
          </Link>
        }
      />

      <div className="dash-table-container">
        <Table className="dash-table">
          <TableHeader>
            <TableRow className="border-[var(--dash-divider)] hover:bg-transparent">
              <TableHead className="h-auto">Candidate</TableHead>
              <TableHead className="h-auto">Requirement</TableHead>
              <TableHead className="h-auto">Client</TableHead>
              <TableHead className="h-auto">Submitted</TableHead>
              <TableHead className="h-auto text-center !text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s) => (
              <TableRow
                key={s.candidate}
                className="border-[var(--dash-divider)] hover:bg-[var(--dash-table-row-hover)]"
              >
                <TableCell>
                  <div className="dash-table-candidate">
                    <span className="dash-table-name">{s.candidate}</span>
                  </div>
                </TableCell>
                <TableCell>{s.requirement}</TableCell>
                <TableCell className="dash-table-budget">{s.client}</TableCell>
                <TableCell>{s.submitted}</TableCell>
                <TableCell className="text-center !text-center">
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "3px 10px",
                      borderRadius: "20px",
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      background: statusStyles[s.status],
                      color: statusTextStyles[s.status],
                    }}
                  >
                    {s.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
