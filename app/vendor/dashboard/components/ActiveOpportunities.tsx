import { Card } from "@/app/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/app/components/ui/table";
import { formatRateRange } from "@/app/lib/rate-format";

const opportunities = [
  {
    title: "Senior React Developer",
    client: "TechCorp",
    positions: "3 positions",
    deadline: "Mar 30",
    budget: "₹15-18L",
    daysLeft: 5,
    status: "open" as const,
  },
  {
    title: "Node.js Backend",
    client: "Innovate Inc",
    positions: "2 positions",
    deadline: "Mar 28",
    budget: "₹12-16L",
    daysLeft: 3,
    status: "closing" as const,
  },
  {
    title: "UI/UX Designer",
    client: "GlobalTech",
    positions: "1 position",
    deadline: "Apr 5",
    budget: "₹15-14L",
    daysLeft: 11,
    status: "new" as const,
  },
  {
    title: "DevOps Engineer",
    client: "DataSys",
    positions: "2 positions",
    deadline: "Mar 26",
    budget: "₹20-25L",
    daysLeft: 1,
    status: "closing" as const,
  },
  {
    title: "Data Scientist",
    client: "CloudNative",
    positions: "1 position",
    deadline: "Apr 2",
    budget: "₹22-28L",
    daysLeft: 8,
    status: "open" as const,
  },
];

const statusMap = {
  open: { className: "dash-status-active", label: "Open" },
  closing: { className: "dash-status-closed", label: "Closing Soon" },
  new: { className: "dash-status-hold", label: "New" },
};

export default function ActiveOpportunities() {
  return (
    <Card className="dash-card dash-requirements-table border-0 bg-transparent shadow-none p-0">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <span className="dash-card-title-icon" />
          Active Opportunities
        </div>
        <span className="dash-view-all">View All →</span>
      </div>

      <Table className="dash-table">
        <TableHeader>
          <TableRow>
            <TableHead>Opportunity</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((r) => (
            <TableRow key={r.title}>
              <TableCell>
                <div className="dash-jd-info">
                  <span className="dash-jd-title">{r.title}</span>
                  <span className="dash-jd-meta">
                    {r.positions} · {r.daysLeft} days left
                  </span>
                </div>
              </TableCell>
              <TableCell>{r.client}</TableCell>
              <TableCell className="dash-table-budget">
                {formatRateRange({ amount: r.budget })}
              </TableCell>
              <TableCell>{r.deadline}</TableCell>
              <TableCell>
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
    </Card>
  );
}
