import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { formatRateRange } from "@/app/lib/rate-format";
import { SectionHeading } from "@/app/components/ui/section-heading";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";

const requirements = [
  {
    id: 1,
    jdId: "REQ-0001",
    title: "Senior React Developer",
    age: "7d ago",
    positions: "3 positions",
    posted: "Mar 15",
    budget: "₹15-18L",
    progress: 66,
    ratio: "2/3",
    status: "active" as const,
  },
  {
    id: 2,
    jdId: "REQ-0002",
    title: "Node.js Backend",
    age: "5d ago",
    positions: "2 positions",
    posted: "Mar 12",
    budget: "₹12-16L",
    progress: 50,
    ratio: "1/2",
    status: "active" as const,
  },
  {
    id: 3,
    jdId: "REQ-0003",
    title: "UI/UX Designer",
    age: "10d ago",
    positions: "1 position",
    posted: "Mar 10",
    budget: "₹10-14L",
    progress: 0,
    ratio: "0/1",
    status: "active" as const,
  },
  {
    id: 4,
    jdId: "REQ-0004",
    title: "DevOps Engineer",
    age: "20d ago",
    positions: "2 positions",
    posted: "Mar 5",
    budget: "₹20-25L",
    progress: 50,
    ratio: "1/2",
    status: "active" as const,
  },
  {
    id: 5,
    jdId: "REQ-0005",
    title: "Data Scientist",
    age: "3d ago",
    positions: "1 position",
    posted: "Mar 3",
    budget: "₹22-28L",
    progress: 100,
    ratio: "1/1",
    status: "active" as const,
  },
];

const statusMap = {
  active: { className: "dash-status-active", label: "Active" },
  hold: { className: "dash-status-hold", label: "On Hold" },
  closed: { className: "dash-status-closed", label: "Closed" },
};

export default function TopRequirements() {
  const activeRequirements = requirements.filter((r) => r.status === "active");

  return (
    <div className="dash-card">
      <SectionHeading
        title="Top Requirements"
        icon={<ClipboardList />}
        action={
          <Link href="/client/requirements" className="dash-view-all">
            View All →
          </Link>
        }
      />

      <div className="dash-table-container">
        <Table className="dash-table">
          <TableHeader>
            <TableRow className="border-[var(--dash-divider)] hover:bg-transparent">
              <TableHead className="h-auto">Job ID</TableHead>
              <TableHead className="h-auto">Job Title</TableHead>
              <TableHead className="h-auto">Posted</TableHead>
              <TableHead className="h-auto">Budget</TableHead>
              <TableHead className="h-auto text-center !text-center">Open Position</TableHead>
              <TableHead className="h-auto text-center !text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeRequirements.map((r) => (
              <TableRow
                key={r.id}
                className="border-[var(--dash-divider)] hover:bg-[var(--dash-table-row-hover)]"
              >
                <TableCell className="font-mono">
                  <Link
                    href={`/client/requirements?openJDId=${r.id}`}
                    className="text-[var(--dash-accent-text)] hover:underline font-medium"
                  >
                    {r.jdId}
                  </Link>
                </TableCell>
                <TableCell>{r.title}</TableCell>
                <TableCell>{r.posted}</TableCell>
                <TableCell className="dash-table-budget">
                  {formatRateRange({ amount: r.budget })}
                </TableCell>
                <TableCell className="text-center !text-center">
                  <span className="font-semibold text-[var(--dash-text-primary)]">
                    {r.ratio}
                  </span>
                </TableCell>
                <TableCell className="text-center !text-center">
                  <span
                    className={`dash-status ${statusMap[r.status].className}`}
                  >
                    {statusMap[r.status].label}
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
