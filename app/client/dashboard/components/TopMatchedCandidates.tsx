"use client";

import Link from "next/link";
import { UserCheck } from "lucide-react";
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

const candidates = [
  {
    rank: 4,
    initials: "AP",
    name: "Arjun Patel",
    id: 1,
    jdId: "REQ-0001",
    role: "React Developer",
    budget: "₹18L",
    exp: "5 yrs",
    match: 96,
    color: "#005A9C",
  },
  {
    rank: 5,
    initials: "SK",
    name: "Sara Khan",
    id: 2,
    jdId: "REQ-0002",
    role: "Full Stack Engineer",
    budget: "₹22L",
    exp: "7 yrs",
    match: 91,
    color: "#06B6D4",
  },
  {
    rank: 3,
    initials: "MC",
    name: "Mike Chen",
    id: 4,
    jdId: "REQ-0004",
    role: "DevOps Lead",
    budget: "₹25L",
    exp: "8 yrs",
    match: 88,
    color: "#10B981",
  },
  {
    rank: 2,
    initials: "LW",
    name: "Lisa Wang",
    id: 5,
    jdId: "REQ-0005",
    role: "Data Engineer",
    budget: "₹20L",
    exp: "6 yrs",
    match: 85,
    color: "#8B5CF6",
  },
  {
    rank: 1,
    initials: "KS",
    name: "Karan Singh",
    id: 1,
    jdId: "REQ-0001",
    role: "Cloud Architect",
    budget: "₹28L",
    exp: "9 yrs",
    match: 82,
    color: "#F59E0B",
  },
];

export default function TopMatchedCandidates() {
  return (
    <div className="dash-card">
      <SectionHeading
        title="Top Matched Candidates"
        icon={<UserCheck />}
        action={
          <Link href="/client/submissions" className="dash-view-all">
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
              <TableHead className="h-auto">Candidate Name</TableHead>
              <TableHead className="h-auto">Budget</TableHead>
              <TableHead className="h-auto">Experience</TableHead>
              <TableHead className="h-auto">AI Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((c) => (
              <TableRow
                key={c.name}
                className="border-[var(--dash-divider)] hover:bg-[var(--dash-table-row-hover)]"
              >
                <TableCell className="font-mono">
                  <Link
                    href={`/client/submissions?requirementId=${c.id}`}
                    className="text-[var(--dash-accent-text)] hover:underline font-medium"
                  >
                    {c.jdId}
                  </Link>
                </TableCell>
                <TableCell>{c.role}</TableCell>
                <TableCell>
                  <div className="dash-table-candidate">
                    <span className="dash-table-name">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="dash-table-budget">
                  {formatRateRange({ amount: c.budget })}
                </TableCell>
                <TableCell>{c.exp}</TableCell>
                <TableCell className="dash-table-score">
                  {c.match}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
