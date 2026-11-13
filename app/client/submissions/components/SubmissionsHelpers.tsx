"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import Highcharts from "../../dashboard/lib/highcharts-init";
import HighchartsReact from "highcharts-react-official";
import { getSharedChartOptions } from "../../../lib/highcharts-theme";
import { useDashboardTheme } from "../../dashboard/DashboardThemeContext";
// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
export type CandidateStatus =
  | "Selected for the next round"
  | "Pending review"
  | "Rejected";

export type Project = {
  projectTitle: string;
  startDate: string;
  endDate: string;
  role: string;
  domain: string;
  projectDetails?: string;
};

export type RatingSource = {
  rating: number;
  reviews: string | number;
};

export type VendorDetails = {
  name: string;
  rating: number;
  reviews: number;
  ambitionBox?: RatingSource;
  glassdoor?: RatingSource;
  hq: string;
  summary: string;
  companySize: string;
  foundedYear: string;
  industryDomain: string;
  compliance: string;
  legalDocs?: string[];
  insurance?: string[];
};

export type Candidate = {
  id: number;
  requirementId: number;
  name: string;
  initials: string;
  avatarColor: string;
  vendor: string;
  experience: string;
  experienceYears: number;
  experienceRange: string;
  certification: string;
  certifications?: string[];
  skills: string[];
  secondarySkills: string[];
  matchScore: number;
  status: CandidateStatus;
  strengths: string;
  weakness: string;
  improvements: string;
  summary?: string;
  quote: string;
  feedbacks: string[];
  technicalSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  currentLocation: string;
  availability: string;
  expectedRate: string;
  engagement: string;
  deploymentType?: string;
  jobTitle: string;
  company: string;
  role: string;
  duration: string;
  degree: string;
  institute: string;
  passingYear: string;
  cgpaOrPercentage?: string;
  gender: string;
  linkedIn?: string;
  github?: string;
  currency?: string;
  rateType?: string;
  rateMin?: string;
  rateMax?: string;
  workExperience?: any[];
  projects?: Project[];
  achievements?: string;
  personalProjects?: any[];
  vendorDetails?: VendorDetails;
};

export type Requirement = {
  id: number;
  title: string;
  location?: string;
  type?: string;
  date?: string;
  timezone?: string;
  skills?: string[];
  secondarySkills?: string[];
  experience?: string;
  certificates?: string[];
  certificate?: string;
  budget: string;
  budgetType?: string;
  positions?: number;
  candidates?: number;
  status?: string;
  education?: string;
  duration?: string;
  submissionsCount: number;
  industry?: string;
  startDate?: string;
  complianceRequirements?: {
    complianceStatus: string;
    complianceCertifications: string[];
    legalRegistrationDocs: string[];
    insuranceRequirements: string[];
    companyCertifications: string[];
  };
};

// ─────────────────────────────────────────────
// Circular Score Component (Solid Progress Circle)
// ─────────────────────────────────────────────
export function CircularScore({
  score,
  size = 140,
}: {
  score: number;
  size?: number;
}) {
  const { mode } = useDashboardTheme();
  const [fillHeight, setFillHeight] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // 1.2s count up
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = (time: number) => {
      const timeFraction = Math.min((time - startTime) / duration, 1);
      const progress = 1 - Math.pow(1 - timeFraction, 3); // easeOutCubic
      setFillHeight(progress * score);

      if (timeFraction < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 90) return mode === "light" ? "#3b82f6" : "#10B981"; // Blue in light theme, Emerald Green in dark theme
    if (s >= 75) return "#6366f1"; // Indigo
    return "#f59e0b"; // Amber
  };

  const color = getColor(score);

  const padding = 16;
  const radius = (size - padding) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fillHeight / 100) * circumference;

  // Progress starts at 12 o'clock (-90 degrees)
  const currentAngle = -90 + (fillHeight / 100) * 360;
  const rad = (currentAngle * Math.PI) / 180;
  const tipX = size / 2 + radius * Math.cos(rad);
  const tipY = size / 2 + radius * Math.sin(rad);

  return (
    <div
      className="relative inline-flex items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth={6}
        />

        {/* Solid Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />

        {/* Tip Dot */}
        {fillHeight > 0 && <circle cx={tipX} cy={tipY} r={3} fill="#FFFFFF" />}
      </svg>

      {/* Centered Percentage Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
        <span
          className="font-semibold tracking-tight"
          style={{
            color,
            fontSize: `${Math.round(size * 0.18)}px`,
            lineHeight: "1",
          }}
        >
          {Math.round(fillHeight)}%
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mini circular for candidate list
// ─────────────────────────────────────────────
export function MiniCircularScore({ score }: { score: number }) {
  const size = 48;
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 90 ? "#22c55e" : score >= 75 ? "#6366f1" : "#f59e0b";

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <svg
        className="block flex-shrink-0"
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", minWidth: size, minHeight: size }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--dash-progress-track)"
          strokeWidth="4"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-[11px] font-black" style={{ color }}>
          {score}%
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Score Progress Bar (Solid Color)
// ─────────────────────────────────────────────
export function ScoreBar({
  value,
  max = 40,
  color,
}: {
  value: number;
  max?: number;
  color: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full h-2 rounded-full bg-[var(--dash-progress-track)] overflow-hidden mt-1.5 relative border border-[var(--dash-card-border)]/40 p-[0.5px]">
      <div
        className="h-full rounded-full transition-all duration-700 relative"
        style={{
          width: `${pct}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// Status Badge
// ─────────────────────────────────────────────
export function StatusBadge({ status }: { status: CandidateStatus }) {
  if (status === "Selected for the next round") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/25 whitespace-nowrap">
        <CheckCircle2 className="w-2.5 h-2.5" />
        Selected for the next round
      </span>
    );
  }
  if (status === "Pending review") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/25 whitespace-nowrap">
        <Clock className="w-2.5 h-2.5" />
        Pending review
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-red-500/15 text-red-500 border border-red-500/25 whitespace-nowrap">
      Rejected
    </span>
  );
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────

export const requirementsData: Requirement[] = [
  {
    id: 1,
    title: "Senior React Developer",
    location: "Bangalore",
    type: "C-C",
    date: "15 March 2026",
    timezone: "IST",
    skills: ["React", "TypeScript", "Node.js"],
    secondarySkills: ["Next.js", "Redux", "Jest"],
    experience: "5-7 Years",
    certificates: [
      "AWS Certified Developer",
      "Google Cloud Professional Architect",
      "Certified Kubernetes Administrator (CKA)",
    ],
    budget: "₹15-18L",
    submissionsCount: 3,
    budgetType: "Monthly",
    positions: 3,
    candidates: 5,
    status: "Active",
    education: "Master's in CS / Data Science",
    duration: "6 Months",
    industry: "IT & Software",
    startDate: "1 April 2026",
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "SOC 2 Type II"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: [
        "General Liability Insurance",
        "Professional Indemnity",
      ],
      companyCertifications: ["ISO 9001"],
    },
  },
  {
    id: 2,
    title: "Node.js Backend Engineer",
    location: "Remote",
    type: "Full-time",
    date: "18 March 2026",
    timezone: "IST",
    skills: ["Node.js", "Express", "MongoDB"],
    secondarySkills: ["Docker", "AWS", "GraphQL"],
    experience: "3-5 Years",
    certificates: ["AWS Developer Associate"],
    budget: "₹12-16L",
    submissionsCount: 2,
    budgetType: "Monthly",
    positions: 2,
    candidates: 4,
    status: "Active",
    education: "Bachelor's in CS / IT",
    duration: "12 Months",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    location: "Hyderabad",
    type: "C-C",
    date: "20 March 2026",
    timezone: "IST",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    secondarySkills: ["Terraform", "Ansible", "Python"],
    experience: "5-8 Years",
    certificates: ["AWS Solutions Architect Professional", "CKA"],
    budget: "₹20-25L",
    submissionsCount: 1,
    budgetType: "Monthly",
    positions: 1,
    candidates: 3,
    status: "Active",
    education: "Bachelor's in CS",
    duration: "6 Months",
  },
  {
    id: 4,
    title: "UI/UX Product Designer",
    location: "Mumbai",
    type: "Full-time",
    date: "22 March 2026",
    timezone: "IST",
    skills: ["Figma", "UI Design", "UX Research"],
    secondarySkills: ["Adobe XD", "Wireframing", "Prototyping"],
    experience: "3-6 Years",
    certificates: ["Google UX Design Certificate"],
    budget: "₹18-22L",
    submissionsCount: 1,
    budgetType: "Monthly",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in Design / Fine Arts",
    duration: "Permanent",
  },
  {
    id: 5,
    title: "Product Manager",
    location: "Pune",
    type: "Full-time",
    date: "24 March 2026",
    timezone: "IST",
    skills: ["Product Roadmap", "SQL", "Agile"],
    secondarySkills: ["Scrum", "Jira", "Market Research"],
    experience: "5-10 Years",
    certificates: ["Certified Scrum Product Owner (CSPO)"],
    budget: "₹25-30L",
    submissionsCount: 1,
    budgetType: "Monthly",
    positions: 1,
    candidates: 2,
    status: "Active",
    education: "MBA / Business Graduate",
    duration: "Permanent",
  },
  {
    id: 6,
    title: "Data Engineer",
    location: "Kolkata",
    type: "C-C",
    date: "25 March 2026",
    timezone: "IST",
    skills: ["Python", "Spark", "SQL", "Airflow"],
    secondarySkills: ["AWS", "Snowflake", "ETL"],
    experience: "4-7 Years",
    certificates: ["Databricks Certified Associate Developer"],
    budget: "₹15-20L",
    submissionsCount: 1,
    budgetType: "Monthly",
    positions: 3,
    candidates: 3,
    status: "Active",
    education: "B.Tech in CSE / ECE",
    duration: "6 Months",
  },
  {
    id: 7,
    title: "Senior Full Stack Developer",
    location: "Gurugram",
    type: "Full-time",
    date: "28 March 2026",
    timezone: "IST",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    secondarySkills: ["Next.js", "Prisma", "Redis", "Docker"],
    experience: "5-8 Years",
    certificates: ["AWS Developer Associate", "MongoDB Developer"],
    budget: "₹20-26L",
    submissionsCount: 2,
    budgetType: "Annual",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in CS / IT",
    duration: "12 Months",
    industry: "IT & Software",
    startDate: "15 April 2026",
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "SOC 2 Type II"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: ["Professional Indemnity"],
      companyCertifications: ["ISO 9001"],
    },
  },
  {
    id: 8,
    title: "AI / Machine Learning Engineer",
    location: "Remote",
    type: "C-C",
    date: "30 March 2026",
    timezone: "IST",
    skills: ["Python", "Machine Learning", "PyTorch", "LLMs"],
    secondarySkills: ["LangChain", "RAG", "FastAPI", "AWS"],
    experience: "3-6 Years",
    certificates: ["AWS Machine Learning Engineer"],
    budget: "₹18-24L",
    submissionsCount: 3,
    budgetType: "Annual",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "B.Tech / M.Tech in CS, AI or Data Science",
    duration: "6 Months",
    industry: "AI & Technology",
    startDate: "20 April 2026",
  },
  {
    id: 9,
    title: "QA Automation Engineer",
    location: "Noida",
    type: "Full-time",
    date: "2 April 2026",
    timezone: "IST",
    skills: ["Playwright", "Selenium", "JavaScript", "API Testing"],
    secondarySkills: ["Cypress", "Jest", "Postman", "CI/CD"],
    experience: "3-5 Years",
    certificates: ["ISTQB Foundation Level"],
    budget: "₹10-15L",
    submissionsCount: 1,
    budgetType: "Annual",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in CS / IT",
    duration: "Permanent",
    industry: "IT & Software",
    startDate: "1 May 2026",
  },
  {
    id: 10,
    title: "Cloud Solutions Architect",
    location: "Bangalore",
    type: "C-C",
    date: "5 April 2026",
    timezone: "IST",
    skills: ["AWS", "Cloud Architecture", "Terraform", "Networking"],
    secondarySkills: ["Azure", "Kubernetes", "Docker", "Security"],
    experience: "8-12 Years",
    certificates: [
      "AWS Solutions Architect Professional",
      "Azure Solutions Architect Expert",
    ],
    budget: "₹30-38L",
    submissionsCount: 2,
    budgetType: "Annual",
    positions: 1,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in Engineering / Computer Science",
    duration: "12 Months",
    industry: "Cloud Computing",
    startDate: "15 May 2026",
  },
  {
    id: 11,
    title: "Next.js Frontend Developer",
    location: "Jaipur",
    type: "Full-time",
    date: "8 April 2026",
    timezone: "IST",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    secondarySkills: ["Redux Toolkit", "REST APIs", "Jest", "SEO"],
    experience: "2-4 Years",
    certificates: ["Meta Front-End Developer Certificate"],
    budget: "₹8-13L",
    submissionsCount: 0,
    budgetType: "Annual",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in CS / IT",
    duration: "Permanent",
    industry: "IT & Software",
    startDate: "20 May 2026",
  },
  {
    id: 12,
    title: "Data Analyst",
    location: "Mumbai",
    type: "Full-time",
    date: "10 April 2026",
    timezone: "IST",
    skills: ["SQL", "Power BI", "Excel", "Python"],
    secondarySkills: ["Tableau", "Statistics", "ETL", "Data Modeling"],
    experience: "2-5 Years",
    certificates: ["Microsoft Power BI Data Analyst"],
    budget: "₹8-14L",
    submissionsCount: 1,
    budgetType: "Annual",
    positions: 2,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in Statistics / CS / IT",
    duration: "6 Months",
    industry: "Analytics",
    startDate: "1 June 2026",
  },
  {
    id: 13,
    title: "Product Marketing Manager",
    location: "Pune",
    type: "Full-time",
    date: "12 April 2026",
    timezone: "IST",
    skills: ["Product Marketing", "Go-to-Market", "Market Research"],
    secondarySkills: ["SEO", "Analytics", "Content Strategy", "CRM"],
    experience: "4-7 Years",
    certificates: ["Google Analytics Certification"],
    budget: "₹16-22L",
    submissionsCount: 1,
    budgetType: "Annual",
    positions: 1,
    candidates: 2,
    status: "Active",
    education: "MBA / Bachelor's in Marketing",
    duration: "Permanent",
    industry: "Marketing & Technology",
    startDate: "1 June 2026",
  },
  {
    id: 14,
    title: "Cybersecurity Engineer",
    location: "Hyderabad",
    type: "C-C",
    date: "15 April 2026",
    timezone: "IST",
    skills: ["Network Security", "SIEM", "Incident Response", "Linux"],
    secondarySkills: [
      "Splunk",
      "AWS Security",
      "Python",
      "Vulnerability Assessment",
    ],
    experience: "4-7 Years",
    certificates: ["CompTIA Security+", "CEH"],
    budget: "₹18-25L",
    submissionsCount: 0,
    budgetType: "Annual",
    positions: 1,
    candidates: 2,
    status: "Active",
    education: "Bachelor's in CS / Cybersecurity",
    duration: "12 Months",
    industry: "Cybersecurity",
    startDate: "15 June 2026",
  },
];

export const initialCandidates: Candidate[] = [
  {
    id: 1,
    requirementId: 1,
    name: "Arjun Patel",
    initials: "AP",
    avatarColor: "#6366F1",
    vendor: "TechHire Solutions",
    experience: "5 Years",
    experienceYears: 5,
    experienceRange: "Jan 2020 – Present",
    certification: "AWS Certified",
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Redux Toolkit",
      "Zustand",
      "React Query",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "Responsive Web Design",
      "Sass / SCSS",
      "WebSockets",
      "Progressive Web Apps (PWA)",
      "Micro-Frontends",
      "Performance Optimization",
      "Web Accessibility (a11y)",
      "State Management",
    ],
    secondarySkills: [
      "Next.js",
      "Redux",
      "Jest",
      "Docker",
      "Kubernetes",
      "Git",
      "CI/CD",
      "AWS (S3 & CloudFront)",
      "Cypress",
      "Playwright",
      "React Testing Library",
      "Storybook",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Nginx",
      "GitHub Actions",
      "Figma",
      "Webpack / Babel",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
    ],
    matchScore: 98,
    status: "Selected for the next round",
    strengths:
      "8+ years of BI/data analytics experience with pharma domain exposure (Life Science - Pharma) including IMS Sales/Market Access analytics; Hands-on with Databricks, PySpark/SQL and Delta Lake in Lakehouse architecture; Strong SQL, data modeling, and data governance; cloud data warehousing with Azure Data Lake, Data Factory, Snowflake, Redshift; Power BI dashboards with complex DAX calculations; delivered projects ahead of schedule; Microsoft PL-300 certified",
    weakness:
      "No explicit Clinical Trial Operations analytics experience or CTMS data experience; No demonstrated work with external clinical data sources (Citeline, DQS, Site Selection datasets); Limited evidence of end-to-end production-scale clinical analytics pipelines; Educational background in Electrical Engineering; no Life Sciences degree",
    improvements:
      "Develop hands-on CTMS/clinical trial data experience and work with external clinical data sources (e.g., Citeline, DQS); Build end-to-end clinical analytics pipelines with measurable business impact and data mappings for regulatory/compliance metrics; Quantify impact in future projects (time savings, data quality improvements, adoption metrics) to strengthen impact narrative",
    summary:
      "WEAK FIT: Lacks direct Clinical Trial Operations analytics and CTMS data experience despite pharma domain exposure.; Key Strengths: 8+ years of pharma-domain BI/data analytics, solid cloud/Data Lake/Warehouse stack, Databricks/PySpark, strong SQL and BI reporting, PL-300 certification.; Critical Gaps: No explicit Clinical Trial Operations analytics experience, no CTMS data work, no demonstrated use of Citeline/DQS or other clinical data sources, limited quantified clinical impact in CV.; Hiring Risk: HIGH - significant gap in core clinical operations data experience; domain overlap exists but cannot be inferred for this role's specialized requirements.; Recommendation: REJECT - Consider only if candidate can rapidly upskill in CTMS/ Clinical Operations analytics or if role scope is broadened to general pharma analytics with willingness to upskill. Otherwise, pursue candidates with direct CTMS/clinical data experience.",
    quote:
      "WEAK FIT: Lacks direct Clinical Trial Operations analytics and CTMS data experience despite pharma domain exposure.\n\nKey Strengths: 8+ years of pharma-domain BI/data analytics, solid cloud/Data Lake/Warehouse stack, Databricks/PySpark, strong SQL and BI reporting, PL-300 certification.\n\nCritical Gaps: No explicit Clinical Trial Operations analytics experience, no CTMS data work, no demonstrated use of Citeline/DQS or other clinical data sources, limited quantified clinical impact in CV.\n\nHiring Risk: HIGH - significant gap in core clinical operations data experience; domain overlap exists but cannot be inferred for this role's specialized requirements.\n\nRecommendation: REJECT - Consider only if candidate can rapidly upskill in CTMS/ Clinical Operations analytics or if role scope is broadened to general pharma analytics with willingness to upskill. Otherwise, pursue candidates with direct CTMS/clinical data experience.",
    feedbacks: [],
    technicalSkillsScore: 32.5,
    experienceScore: 31.5,
    educationScore: 30.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "Immediate Joiner",
    expectedRate: "$60 – $80 / hour",
    rateMin: "60",
    rateMax: "80",
    engagement: "C-C",
    jobTitle: "Senior React Developer",
    company: "Tech Corp",
    role: "Senior Frontend Engineer",
    duration: "Jan 2020 – Present",
    degree: "B.Tech in Computer Science",
    institute: "IIT Bombay",
    passingYear: "2018",
    cgpaOrPercentage: "8.8 CGPA",
    gender: "Male",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/arjunpatel",
    github: "https://github.com/arjunpatel",
    certifications: [
      "AWS Certified Developer",
      "Google Cloud Professional",
      "CKA - Kubernetes Administrator",
      "Azure DevOps Engineer",
      "React Advanced Certification",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "E-Commerce Replatforming",
        startDate: "Jan 2023",
        endDate: "Present",
        role: "Lead Frontend Engineer",
        domain: "Retail / E-Commerce",
        projectDetails:
          "Led the migration of a legacy e-commerce application to Next.js and TailwindCSS, improving core web vitals by 40% and conversion rate by 15%.",
      },
      {
        projectTitle: "HR Dashboard System",
        startDate: "Mar 2021",
        endDate: "Dec 2022",
        role: "Senior React Developer",
        domain: "Enterprise Software",
        projectDetails:
          "Developed custom dashboard components and integrated real-time analytics with charts, optimizing performance for large-scale data sets.",
      },
    ],
    workExperience: [
      {
        role: "Senior Frontend Engineer",
        company: "Tech Corp",
        duration: "Jan 2020 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "E-Commerce Replatforming",
            startDate: "Jan 2023",
            endDate: "Present",
            role: "Lead Frontend Engineer",
            domain: "Retail / E-Commerce",
            projectDetails:
              "Led the migration of a legacy e-commerce application to Next.js and TailwindCSS, improving core web vitals by 40% and conversion rate by 15%.",
          },
          {
            projectTitle: "HR Dashboard System",
            startDate: "Mar 2021",
            endDate: "Dec 2022",
            role: "Senior React Developer",
            domain: "Enterprise Software",
            projectDetails:
              "Developed custom dashboard components and integrated real-time analytics with charts, optimizing performance for large-scale data sets.",
          },
        ],
      },
      {
        role: "Frontend Developer",
        company: "Innovate Solutions",
        duration: "Jun 2018 – Dec 2019",
        currentLocation: "Pune, India",
        projects: [
          {
            projectTitle: "Banking Portal Redesign",
            startDate: "Jun 2018",
            endDate: "Dec 2019",
            role: "Frontend Developer",
            domain: "Finance / Banking",
            projectDetails:
              "Redesigned the main banking portal using React and Redux, improving accessibility and user engagement.",
          },
        ],
      },
      {
        role: "Junior Web Developer",
        company: "StartUp Inc",
        duration: "Jan 2017 – May 2018",
        currentLocation: "Pune, India",
        projects: [
          {
            projectTitle: "Marketing Website",
            startDate: "Jan 2017",
            endDate: "May 2018",
            role: "Junior Web Developer",
            domain: "Marketing",
            projectDetails:
              "Built responsive landing pages and marketing websites using HTML, CSS, and JavaScript.",
          },
        ],
      },
    ],
    achievements:
      "Won 1st place in the TechHire internal hackathon (2022). Recognized as 'Best Innovator' for creating an open-source react component library.",
    personalProjects: [
      {
        projectTitle: "AI Resume Matcher",
        role: "Creator & Lead Developer",
        domain: "HR Tech",
        projectUrl: "https://github.com/arjunp/ai-resume-matcher",
        startDate: "2023-01",
        endDate: "2023-06",
        technologies: ["React", "Node.js", "OpenAI"],
        projectDetails:
          "An AI-powered tool to match resumes with job descriptions using vector embeddings.",
      },
    ],
    vendorDetails: {
      name: "TechHire Solutions",
      rating: 4.8,
      reviews: 124,
      ambitionBox: { rating: 4.6, reviews: "1.2k" },
      glassdoor: { rating: 4.5, reviews: "850" },
      hq: "Mumbai, Maharashtra, India",
      summary:
        "TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days.",
      companySize: "51-200",
      foundedYear: "2019",
      industryDomain: "IT Services / Staffing",
      compliance:
        "ISO 9001, MSME Registered, GDPR Compliant, SOC 2 Type II, ISO 27001, CMMI Level 3, HIPAA Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "General Liability Insurance",
        "Professional Indemnity (E&O)",
        "Workers Compensation",
      ],
    },
  },
  {
    id: 2,
    requirementId: 1,
    name: "Amit Verma",
    initials: "AV",
    avatarColor: "#8B5CF6",
    vendor: "Global Talent",
    experience: "6 Years",
    experienceYears: 6,
    experienceRange: "Mar 2018 – Present",
    certification: "Scrum Master",
    skills: ["React", "Node.js", "GraphQL"],
    secondarySkills: ["PostgreSQL", "Docker", "REST APIs"],
    matchScore: 91,
    status: "Selected for the next round",
    strengths: "Strong backend integration skills, experienced team player.",
    weakness: "UI design styling details could be improved.",
    improvements: "Focus on TailwindCSS or design systems implementation.",
    quote:
      "Solid developer with versatile full-stack experience who works well under pressure.",
    feedbacks: [],
    technicalSkillsScore: 31.0,
    experienceScore: 30.5,
    educationScore: 29.5,
    currentLocation: "Hyderabad, Telangana, India",
    availability: "2 Weeks Notice",
    expectedRate: "$55 – $70 / hour",
    rateMin: "55",
    rateMax: "70",
    engagement: "C-C",
    jobTitle: "Full Stack Developer",
    company: "Infosys Ltd",
    role: "Software Engineer II",
    duration: "Mar 2018 – Present",
    degree: "B.E. in IT",
    institute: "VIT Vellore",
    passingYear: "2017",
    cgpaOrPercentage: "85%",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/amitverma",
    github: "https://github.com/amitverma",
    certifications: ["Scrum Master", "MongoDB Certified Developer"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Real-time Messaging System",
        startDate: "Nov 2022",
        endDate: "Present",
        role: "Full Stack Engineer",
        domain: "Social Networking",
        projectDetails:
          "Built backend APIs using Node.js and GraphQL, and implemented real-time communication via WebSockets.",
      },
    ],
    vendorDetails: {
      name: "Global Talent",
      rating: 4.6,
      reviews: 89,
      ambitionBox: { rating: 4.4, reviews: "940" },
      glassdoor: { rating: 4.3, reviews: "520" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Global Talent provides top-tier software engineers with a focus on Full Stack development, Cloud infrastructure, and Machine Learning.",
      companySize: "201-500",
      foundedYear: "2015",
      industryDomain: "IT Consulting / Staffing",
      compliance: "ISO 27001, SOC 2 Type II",
      legalDocs: [
        "Certificate of Incorporation",
        "PAN Card",
        "Tax Residency Certificate",
      ],
      insurance: [
        "Cyber Liability Insurance",
        "Professional Indemnity",
        "Commercial General Liability",
      ],
    },
  },
  {
    id: 3,
    requirementId: 1,
    name: "Priya Sharma",
    initials: "PS",
    avatarColor: "#EC4899",
    vendor: "Staffing Solutions",
    experience: "4 Years",
    experienceYears: 4,
    experienceRange: "Jun 2020 – Present",
    certification: "React Certified",
    skills: ["React", "Redux", "JavaScript"],
    secondarySkills: ["HTML/CSS", "Figma", "Storybook"],
    matchScore: 87,
    status: "Pending review",
    strengths: "Great communication, solid React foundation.",
    weakness: "Less experience with TypeScript.",
    improvements: "Practice TypeScript types and advanced patterns.",
    quote:
      "Promising React developer with high enthusiasm and fast learning ability.",
    feedbacks: [],
    technicalSkillsScore: 30.0,
    experienceScore: 29.0,
    educationScore: 28.0,
    currentLocation: "Pune, Maharashtra, India",
    availability: "1 Month Notice",
    expectedRate: "$45 – $60 / hour",
    rateMin: "45",
    rateMax: "60",
    engagement: "C-H",
    jobTitle: "Frontend Developer",
    company: "Capgemini",
    role: "React Developer",
    duration: "Jun 2020 – Present",
    degree: "B.Sc. Computer Science",
    institute: "Pune University",
    passingYear: "2019",
    cgpaOrPercentage: "9.1 CGPA",
    gender: "Female",
    deploymentType: "Onsite",
    linkedIn: "https://linkedin.com/in/priyasharma",
    github: "",
    certifications: ["React Certified", "Google UX Design"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Customer Portal Redesign",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "React Developer",
        domain: "Fintech",
        projectDetails:
          "Worked on updating the design language of the portal using React and Storybook. Collaborated with UI designers to build reusable component libraries.",
      },
    ],
    vendorDetails: {
      name: "Staffing Solutions",
      rating: 4.2,
      reviews: 45,
      ambitionBox: { rating: 4.1, reviews: "320" },
      glassdoor: { rating: 4.0, reviews: "180" },
      hq: "Pune, Maharashtra, India",
      summary:
        "Specialized in frontend and UX design talent recruitment for fintech and enterprise software sectors.",
      companySize: "11-50",
      foundedYear: "2021",
      industryDomain: "Recruitment Services",
      compliance: "MSME Registered",
      legalDocs: [
        "Udyam Registration Certificate",
        "GST Certificate",
        "PAN Card",
        "Bank Account Verification",
      ],
      insurance: ["General Liability Insurance"],
    },
  },

  {
    id: 16,
    requirementId: 1,
    name: "Neha Kulkarni",
    initials: "NK",
    avatarColor: "#A855F7",
    vendor: "TechHire Solutions",
    experience: "7 Years",
    experienceYears: 7,
    experienceRange: "Mar 2018 – Present",
    certification: "Meta Frontend Developer",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "React Query",
      "Tailwind CSS",
      "GraphQL",
      "Apollo Client",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "Performance Optimization",
      "Micro-Frontends",
      "Module Federation",
      "State Management",
      "Design Systems",
    ],
    secondarySkills: [
      "Node.js",
      "Express",
      "Jest",
      "React Testing Library",
      "Cypress",
      "Storybook",
      "Docker",
      "Git",
      "CI/CD",
      "GitHub Actions",
      "Figma",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
      "AWS (S3 & CloudFront)",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "WebSockets",
      "Nginx",
    ],
    matchScore: 95,
    status: "Selected for the next round",
    strengths:
      "7+ years of frontend development with deep React/TypeScript expertise; Architected micro-frontend solutions using Module Federation for large-scale enterprise apps; Strong design systems experience, built component libraries adopted by 10+ teams; Proven performance optimization skills, improved Core Web Vitals by 45%; Experience with Next.js SSR/SSG and GraphQL/Apollo integration",
    weakness:
      "Limited backend/API development experience; No mobile (React Native) experience; Lacks cloud infrastructure certification",
    improvements:
      "Gain hands-on Node.js/GraphQL backend experience; Explore React Native for cross-platform mobile development; Consider AWS certification to strengthen cloud profile",
    summary:
      "STRONG FIT: Excellent senior React engineer with 7+ years of experience and deep expertise in micro-frontends and design systems.; Key Strengths: React, TypeScript, Next.js, GraphQL, micro-frontends, performance optimization, design systems, and testing.; Critical Gaps: Limited backend exposure and no mobile experience, but these are not core to the role.; Hiring Risk: LOW - strong technical match with minor gaps.; Recommendation: SELECT - Proceed to technical interview. Ideal candidate for senior frontend role.",
    quote:
      "STRONG FIT: Excellent senior React engineer with 7+ years of experience and deep expertise in micro-frontends and design systems.\n\nKey Strengths: React, TypeScript, Next.js, GraphQL, micro-frontends, performance optimization, design systems, and testing.\n\nCritical Gaps: Limited backend exposure and no mobile experience, but these are not core to the role.\n\nHiring Risk: LOW - strong technical match with minor gaps.\n\nRecommendation: SELECT - Proceed to technical interview. Ideal candidate for senior frontend role.",
    feedbacks: [],
    technicalSkillsScore: 33.5,
    experienceScore: 32.5,
    educationScore: 30.5,
    currentLocation: "Pune, Maharashtra, India",
    availability: "2 Weeks Notice",
    expectedRate: "$70 – $90 / hour",
    rateMin: "70",
    rateMax: "90",
    engagement: "C-C",
    jobTitle: "Senior Frontend Engineer",
    company: "Atlassian",
    role: "Senior Frontend Developer",
    duration: "Mar 2018 – Present",
    degree: "B.Tech in Computer Science",
    institute: "COEP Pune",
    passingYear: "2017",
    cgpaOrPercentage: "8.9 CGPA",
    gender: "Female",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/nehakulkarni",
    github: "https://github.com/nehakulkarni",
    certifications: ["Meta Frontend Developer", "React Advanced Certification"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Micro-Frontend Platform Migration",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Frontend Engineer",
        domain: "Enterprise SaaS",
        projectDetails:
          "Led migration of a monolithic frontend to a micro-frontend architecture using Module Federation, enabling independent deployments for 12 teams and reducing release cycle time by 60%.",
      },
      {
        projectTitle: "Design System & Component Library",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        role: "Senior Frontend Developer",
        domain: "Enterprise SaaS",
        projectDetails:
          "Built a comprehensive design system with 100+ components using React, TypeScript, and Storybook, adopted by 10+ product teams and reducing UI development time by 40%.",
      },
    ],
    workExperience: [
      {
        role: "Senior Frontend Developer",
        company: "Atlassian",
        duration: "Mar 2018 – Present",
        currentLocation: "Pune, India",
        projects: [
          {
            projectTitle: "Micro-Frontend Platform Migration",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Frontend Engineer",
            domain: "Enterprise SaaS",
            projectDetails:
              "Led migration of a monolithic frontend to a micro-frontend architecture using Module Federation, enabling independent deployments for 12 teams and reducing release cycle time by 60%.",
          },
          {
            projectTitle: "Design System & Component Library",
            startDate: "Jun 2020",
            endDate: "Dec 2021",
            role: "Senior Frontend Developer",
            domain: "Enterprise SaaS",
            projectDetails:
              "Built a comprehensive design system with 100+ components using React, TypeScript, and Storybook, adopted by 10+ product teams and reducing UI development time by 40%.",
          },
        ],
      },
      {
        role: "Frontend Developer",
        company: "Persistent Systems",
        duration: "Jul 2017 – Feb 2018",
        currentLocation: "Pune, India",
        projects: [
          {
            projectTitle: "Healthcare Portal Redesign",
            startDate: "Jul 2017",
            endDate: "Feb 2018",
            role: "Frontend Developer",
            domain: "Healthcare",
            projectDetails:
              "Redesigned a patient portal using React and Redux, improving accessibility compliance to WCAG 2.1 AA and user satisfaction by 25%.",
          },
        ],
      },
    ],
    achievements:
      "Speaker at React India 2023 on 'Micro-Frontends at Scale'. Won Atlassian 'Innovation Award' (2022) for design system contributions.",
    personalProjects: [
      {
        projectTitle: "react-micro-frontend-starter",
        role: "Creator & Maintainer",
        domain: "Open Source",
        projectUrl:
          "https://github.com/nehakulkarni/react-micro-frontend-starter",
        startDate: "2022-08",
        endDate: "Present",
        technologies: ["React", "TypeScript", "Webpack", "Module Federation"],
        projectDetails:
          "A starter kit for building micro-frontends with React and Module Federation, with 1.5k+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "TechHire Solutions",
      rating: 4.8,
      reviews: 124,
      ambitionBox: { rating: 4.6, reviews: "1.2k" },
      glassdoor: { rating: 4.5, reviews: "850" },
      hq: "Mumbai, Maharashtra, India",
      summary:
        "TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days.",
      companySize: "51-200",
      foundedYear: "2019",
      industryDomain: "IT Services / Staffing",
      compliance:
        "ISO 9001, MSME Registered, GDPR Compliant, SOC 2 Type II, ISO 27001, CMMI Level 3, HIPAA Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "General Liability Insurance",
        "Professional Indemnity (E&O)",
        "Workers Compensation",
      ],
    },
  },
  {
    id: 17,
    requirementId: 1,
    name: "Rahul Deshmukh",
    initials: "RD",
    avatarColor: "#F59E0B",
    vendor: "Global Talent",
    experience: "8 Years",
    experienceYears: 8,
    experienceRange: "Jul 2017 – Present",
    certification: "AWS Certified Developer",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux",
      "Redux Toolkit",
      "React Query",
      "Tailwind CSS",
      "Material UI",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "GraphQL",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "Performance Optimization",
      "Server-Side Rendering (SSR)",
      "Static Site Generation (SSG)",
      "Progressive Web Apps (PWA)",
    ],
    secondarySkills: [
      "Node.js",
      "Express",
      "Jest",
      "React Testing Library",
      "Cypress",
      "Playwright",
      "Storybook",
      "Docker",
      "Git",
      "CI/CD",
      "GitHub Actions",
      "AWS (S3, CloudFront, Lambda)",
      "Figma",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "WebSockets",
    ],
    matchScore: 92,
    status: "Selected for the next round",
    strengths:
      "8+ years of frontend development with expertise in React, TypeScript, and Next.js; Strong experience with SSR/SSG and PWA development; Proven track record of improving web performance and SEO; Experience with AWS services (S3, CloudFront, Lambda) for frontend deployments; Led frontend teams and mentored junior developers",
    weakness:
      "Limited experience with micro-frontends; No GraphQL federation experience; Lacks mobile development background",
    improvements:
      "Explore micro-frontend architectures and Module Federation; Gain GraphQL federation experience for large-scale APIs; Consider React Native for cross-platform mobile development",
    summary:
      "STRONG FIT: Highly experienced React engineer with 8+ years of experience and strong Next.js/AWS expertise.; Key Strengths: React, TypeScript, Next.js, SSR/SSG, PWA, performance optimization, AWS, and team leadership.; Critical Gaps: No micro-frontend or GraphQL federation experience, but these can be learned on the job.; Hiring Risk: LOW - excellent match for senior frontend role.; Recommendation: SELECT - Proceed to technical interview. Strong candidate for senior frontend position.",
    quote:
      "STRONG FIT: Highly experienced React engineer with 8+ years of experience and strong Next.js/AWS expertise.\n\nKey Strengths: React, TypeScript, Next.js, SSR/SSG, PWA, performance optimization, AWS, and team leadership.\n\nCritical Gaps: No micro-frontend or GraphQL federation experience, but these can be learned on the job.\n\nHiring Risk: LOW - excellent match for senior frontend role.\n\nRecommendation: SELECT - Proceed to technical interview. Strong candidate for senior frontend position.",
    feedbacks: [],
    technicalSkillsScore: 33.0,
    experienceScore: 33.0,
    educationScore: 31.0,
    currentLocation: "Mumbai, Maharashtra, India",
    availability: "1 Month Notice",
    expectedRate: "$75 – $95 / hour",
    rateMin: "75",
    rateMax: "95",
    engagement: "C-C",
    jobTitle: "Lead Frontend Engineer",
    company: "BookMyShow",
    role: "Lead Frontend Developer",
    duration: "Jul 2017 – Present",
    degree: "B.E. in Computer Engineering",
    institute: "VJTI Mumbai",
    passingYear: "2016",
    cgpaOrPercentage: "8.6 CGPA",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/rahuldeshmukh",
    github: "https://github.com/rahuldeshmukh",
    certifications: [
      "AWS Certified Developer",
      "Next.js Certified",
      "Google Analytics Certified",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Next.js Migration & Performance Overhaul",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Frontend Engineer",
        domain: "Entertainment / Ticketing",
        projectDetails:
          "Led migration from CRA to Next.js, improving Lighthouse performance score from 45 to 92 and organic traffic by 60% through SSR/SSG and SEO optimization.",
      },
      {
        projectTitle: "PWA for Mobile Web",
        startDate: "Mar 2020",
        endDate: "Dec 2021",
        role: "Senior Frontend Developer",
        domain: "Entertainment / Ticketing",
        projectDetails:
          "Built a Progressive Web App with offline support and push notifications, increasing mobile conversions by 35% and reducing bounce rate by 25%.",
      },
    ],
    workExperience: [
      {
        role: "Lead Frontend Developer",
        company: "BookMyShow",
        duration: "Jul 2017 – Present",
        currentLocation: "Mumbai, India",
        projects: [
          {
            projectTitle: "Next.js Migration & Performance Overhaul",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Frontend Engineer",
            domain: "Entertainment / Ticketing",
            projectDetails:
              "Led migration from CRA to Next.js, improving Lighthouse performance score from 45 to 92 and organic traffic by 60% through SSR/SSG and SEO optimization.",
          },
          {
            projectTitle: "PWA for Mobile Web",
            startDate: "Mar 2020",
            endDate: "Dec 2021",
            role: "Senior Frontend Developer",
            domain: "Entertainment / Ticketing",
            projectDetails:
              "Built a Progressive Web App with offline support and push notifications, increasing mobile conversions by 35% and reducing bounce rate by 25%.",
          },
        ],
      },
      {
        role: "Frontend Developer",
        company: "Directi",
        duration: "Jun 2016 – Jun 2017",
        currentLocation: "Mumbai, India",
        projects: [
          {
            projectTitle: "Domain Management Dashboard",
            startDate: "Jun 2016",
            endDate: "Jun 2017",
            role: "Frontend Developer",
            domain: "Web Services",
            projectDetails:
              "Developed a domain management dashboard using React and Redux, handling 1M+ domains with real-time updates.",
          },
        ],
      },
    ],
    achievements:
      "Won BookMyShow 'Hackathon 2022' for building an AI-powered movie recommendation widget. Speaker at Next.js Conf 2023 on 'Scaling Next.js for High-Traffic Applications'.",
    personalProjects: [
      {
        projectTitle: "nextjs-performance-checklist",
        role: "Creator",
        domain: "Open Source",
        projectUrl:
          "https://github.com/rahuldeshmukh/nextjs-performance-checklist",
        startDate: "2023-01",
        endDate: "Present",
        technologies: ["Next.js", "TypeScript", "Markdown"],
        projectDetails:
          "A comprehensive performance optimization checklist for Next.js applications, with 3k+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "Global Talent",
      rating: 4.6,
      reviews: 89,
      ambitionBox: { rating: 4.4, reviews: "940" },
      glassdoor: { rating: 4.3, reviews: "520" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Global Talent provides top-tier software engineers with a focus on Full Stack development, Cloud infrastructure, and Machine Learning.",
      companySize: "201-500",
      foundedYear: "2015",
      industryDomain: "IT Consulting / Staffing",
      compliance: "ISO 27001, SOC 2 Type II",
      legalDocs: [
        "Certificate of Incorporation",
        "PAN Card",
        "Tax Residency Certificate",
      ],
      insurance: [
        "Cyber Liability Insurance",
        "Professional Indemnity",
        "Commercial General Liability",
      ],
    },
  },
  {
    id: 18,
    requirementId: 1,
    name: "Pooja Bhatt",
    initials: "PB",
    avatarColor: "#EC4899",
    vendor: "Staffing Solutions",
    experience: "5 Years",
    experienceYears: 5,
    experienceRange: "Sep 2019 – Present",
    certification: "React Certified",
    skills: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "GraphQL",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "Performance Optimization",
      "State Management",
      "Component Design",
      "Design Systems",
      "Storybook",
      "Jest",
      "React Testing Library",
    ],
    secondarySkills: [
      "Next.js",
      "Node.js",
      "Express",
      "Cypress",
      "Playwright",
      "Docker",
      "Git",
      "CI/CD",
      "GitHub Actions",
      "Figma",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
      "MongoDB",
      "PostgreSQL",
      "Firebase",
      "WebSockets",
      "PWA",
    ],
    matchScore: 89,
    status: "Pending review",
    strengths:
      "5+ years of React development with strong TypeScript skills; Experience building design systems and reusable component libraries; Proficient in testing with Jest and React Testing Library; Strong collaboration skills with designers and backend engineers; Experience with modern tooling (Vite, Webpack, Storybook)",
    weakness:
      "Limited experience with Next.js SSR/SSG; No micro-frontend experience; Lacks cloud deployment experience (AWS/GCP)",
    improvements:
      "Gain hands-on Next.js SSR/SSG experience; Explore micro-frontend architectures; Learn AWS/GCP for frontend deployments and CI/CD",
    summary:
      "GOOD FIT: Solid React developer with 5+ years of experience and strong TypeScript/design system skills.; Key Strengths: React, TypeScript, Redux Toolkit, React Query, Tailwind CSS, design systems, testing, and modern tooling.; Critical Gaps: No Next.js SSR/SSG, micro-frontend, or cloud deployment experience, but these can be learned.; Hiring Risk: MEDIUM - strong technical foundation but gaps in advanced frontend patterns.; Recommendation: SELECT for interview - Proceed to technical interview to assess depth of React knowledge and ability to learn new patterns.",
    quote:
      "GOOD FIT: Solid React developer with 5+ years of experience and strong TypeScript/design system skills.\n\nKey Strengths: React, TypeScript, Redux Toolkit, React Query, Tailwind CSS, design systems, testing, and modern tooling.\n\nCritical Gaps: No Next.js SSR/SSG, micro-frontend, or cloud deployment experience, but these can be learned.\n\nHiring Risk: MEDIUM - strong technical foundation but gaps in advanced frontend patterns.\n\nRecommendation: SELECT for interview - Proceed to technical interview to assess depth of React knowledge and ability to learn new patterns.",
    feedbacks: [],
    technicalSkillsScore: 31.5,
    experienceScore: 30.0,
    educationScore: 29.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "Immediate Joiner",
    expectedRate: "$55 – $75 / hour",
    rateMin: "55",
    rateMax: "75",
    engagement: "C-C",
    jobTitle: "Frontend Developer",
    company: "Zerodha",
    role: "React Developer",
    duration: "Sep 2019 – Present",
    degree: "B.Tech in IT",
    institute: "IIIT Bangalore",
    passingYear: "2018",
    cgpaOrPercentage: "8.7 CGPA",
    gender: "Female",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/poojabhatt",
    github: "https://github.com/poojabhatt",
    certifications: ["React Certified", "JavaScript Algorithms Certified"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Trading Dashboard Redesign",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "React Developer",
        domain: "Fintech / Trading",
        projectDetails:
          "Redesigned the trading dashboard using React, TypeScript, and Tailwind CSS, improving user engagement by 30% and reducing page load time by 40%.",
      },
      {
        projectTitle: "Component Library for Internal Tools",
        startDate: "Mar 2021",
        endDate: "Dec 2021",
        role: "Frontend Developer",
        domain: "Fintech",
        projectDetails:
          "Built a reusable component library with 50+ components using React, TypeScript, and Storybook, adopted by 4 internal teams.",
      },
    ],
    workExperience: [
      {
        role: "React Developer",
        company: "Zerodha",
        duration: "Sep 2019 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Trading Dashboard Redesign",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "React Developer",
            domain: "Fintech / Trading",
            projectDetails:
              "Redesigned the trading dashboard using React, TypeScript, and Tailwind CSS, improving user engagement by 30% and reducing page load time by 40%.",
          },
          {
            projectTitle: "Component Library for Internal Tools",
            startDate: "Mar 2021",
            endDate: "Dec 2021",
            role: "Frontend Developer",
            domain: "Fintech",
            projectDetails:
              "Built a reusable component library with 50+ components using React, TypeScript, and Storybook, adopted by 4 internal teams.",
          },
        ],
      },
      {
        role: "Junior Frontend Developer",
        company: "Freshworks",
        duration: "Jul 2018 – Aug 2019",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "CRM UI Enhancements",
            startDate: "Jul 2018",
            endDate: "Aug 2019",
            role: "Junior Frontend Developer",
            domain: "SaaS / CRM",
            projectDetails:
              "Implemented UI enhancements for the CRM product using React and Redux, improving customer satisfaction scores by 15%.",
          },
        ],
      },
    ],
    achievements:
      "Won Zerodha 'Hackathon 2022' for building a real-time portfolio tracker. Recognized as 'Rising Star' in 2021.",
    personalProjects: [
      {
        projectTitle: "react-hooks-playground",
        role: "Creator",
        domain: "Open Source",
        projectUrl: "https://github.com/poojabhatt/react-hooks-playground",
        startDate: "2022-06",
        endDate: "2023-01",
        technologies: ["React", "TypeScript", "Vite"],
        projectDetails:
          "An interactive playground for learning React hooks with live examples, with 800+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "Staffing Solutions",
      rating: 4.2,
      reviews: 45,
      ambitionBox: { rating: 4.1, reviews: "320" },
      glassdoor: { rating: 4.0, reviews: "180" },
      hq: "Pune, Maharashtra, India",
      summary:
        "Specialized in frontend and UX design talent recruitment for fintech and enterprise software sectors.",
      companySize: "11-50",
      foundedYear: "2021",
      industryDomain: "Recruitment Services",
      compliance: "MSME Registered",
      legalDocs: [
        "Udyam Registration Certificate",
        "GST Certificate",
        "PAN Card",
        "Bank Account Verification",
      ],
      insurance: ["General Liability Insurance"],
    },
  },
  {
    id: 19,
    requirementId: 1,
    name: "Arun Nair",
    initials: "AN",
    avatarColor: "#06B6D4",
    vendor: "TechHire Solutions",
    experience: "6 Years",
    experienceYears: 6,
    experienceRange: "Feb 2018 – Present",
    certification: "Meta Frontend Developer",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "React Query",
      "Tailwind CSS",
      "GraphQL",
      "Apollo Client",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "Performance Optimization",
      "Server-Side Rendering (SSR)",
      "Static Site Generation (SSG)",
      "State Management",
      "Component Design",
    ],
    secondarySkills: [
      "Node.js",
      "Express",
      "Jest",
      "React Testing Library",
      "Cypress",
      "Storybook",
      "Docker",
      "Git",
      "CI/CD",
      "GitHub Actions",
      "AWS (S3 & CloudFront)",
      "Figma",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "WebSockets",
      "PWA",
    ],
    matchScore: 91,
    status: "Pending review",
    strengths:
      "6+ years of React development with strong TypeScript and Next.js skills; Experience with SSR/SSG and performance optimization; Proficient in GraphQL/Apollo and REST APIs; Strong testing culture with Jest, React Testing Library, and Cypress; Experience with AWS deployments (S3, CloudFront)",
    weakness:
      "No micro-frontend experience; Limited design system experience; Lacks team leadership experience",
    improvements:
      "Explore micro-frontend architectures and Module Federation; Gain design system experience with Storybook; Seek mentorship or leadership opportunities to develop team management skills",
    summary:
      "GOOD FIT: Solid React/Next.js developer with 6+ years of experience and strong TypeScript/GraphQL skills.; Key Strengths: React, TypeScript, Next.js, SSR/SSG, GraphQL, performance optimization, testing, and AWS deployments.; Critical Gaps: No micro-frontend or design system experience, limited leadership exposure.; Hiring Risk: MEDIUM - strong technical skills but lacks advanced frontend architecture and leadership experience.; Recommendation: SELECT for interview - Proceed to technical interview to assess depth of React/Next.js knowledge and potential for growth.",
    quote:
      "GOOD FIT: Solid React/Next.js developer with 6+ years of experience and strong TypeScript/GraphQL skills.\n\nKey Strengths: React, TypeScript, Next.js, SSR/SSG, GraphQL, performance optimization, testing, and AWS deployments.\n\nCritical Gaps: No micro-frontend or design system experience, limited leadership exposure.\n\nHiring Risk: MEDIUM - strong technical skills but lacks advanced frontend architecture and leadership experience.\n\nRecommendation: SELECT for interview - Proceed to technical interview to assess depth of React/Next.js knowledge and potential for growth.",
    feedbacks: [],
    technicalSkillsScore: 32.0,
    experienceScore: 31.0,
    educationScore: 30.0,
    currentLocation: "Chennai, Tamil Nadu, India",
    availability: "2 Weeks Notice",
    expectedRate: "$65 – $85 / hour",
    rateMin: "65",
    rateMax: "85",
    engagement: "C-C",
    jobTitle: "Senior Frontend Developer",
    company: "Zoho Corporation",
    role: "Senior React Developer",
    duration: "Feb 2018 – Present",
    degree: "B.Tech in Computer Science",
    institute: "IIT Madras",
    passingYear: "2017",
    cgpaOrPercentage: "8.8 CGPA",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/arunnair",
    github: "https://github.com/arunnair",
    certifications: [
      "Meta Frontend Developer",
      "GraphQL Certified",
      "AWS Cloud Practitioner",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Next.js Migration for Marketing Site",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Senior React Developer",
        domain: "SaaS / Marketing",
        projectDetails:
          "Led migration of the marketing site to Next.js, improving Lighthouse score from 52 to 95 and organic traffic by 45% through SSR/SSG and SEO best practices.",
      },
      {
        projectTitle: "GraphQL API Integration",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        role: "React Developer",
        domain: "SaaS / CRM",
        projectDetails:
          "Integrated GraphQL/Apollo into the CRM frontend, reducing API calls by 60% and improving page load time by 35%.",
      },
    ],
    workExperience: [
      {
        role: "Senior React Developer",
        company: "Zoho Corporation",
        duration: "Feb 2018 – Present",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "Next.js Migration for Marketing Site",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Senior React Developer",
            domain: "SaaS / Marketing",
            projectDetails:
              "Led migration of the marketing site to Next.js, improving Lighthouse score from 52 to 95 and organic traffic by 45% through SSR/SSG and SEO best practices.",
          },
          {
            projectTitle: "GraphQL API Integration",
            startDate: "Jun 2020",
            endDate: "Dec 2021",
            role: "React Developer",
            domain: "SaaS / CRM",
            projectDetails:
              "Integrated GraphQL/Apollo into the CRM frontend, reducing API calls by 60% and improving page load time by 35%.",
          },
        ],
      },
      {
        role: "Frontend Developer",
        company: "Freshworks",
        duration: "Jul 2017 – Jan 2018",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "Support Ticket UI",
            startDate: "Jul 2017",
            endDate: "Jan 2018",
            role: "Frontend Developer",
            domain: "SaaS / Customer Support",
            projectDetails:
              "Built a support ticket UI using React and Redux, improving agent productivity by 20%.",
          },
        ],
      },
    ],
    achievements:
      "Speaker at GraphQL Summit 2023 on 'Optimizing GraphQL for Frontend Performance'. Won Zoho 'Innovation Award' (2022).",
    personalProjects: [
      {
        projectTitle: "nextjs-graphql-starter",
        role: "Creator",
        domain: "Open Source",
        projectUrl: "https://github.com/arunnair/nextjs-graphql-starter",
        startDate: "2022-03",
        endDate: "Present",
        technologies: ["Next.js", "TypeScript", "GraphQL", "Apollo"],
        projectDetails:
          "A starter kit for Next.js + GraphQL applications, with 1.2k+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "TechHire Solutions",
      rating: 4.8,
      reviews: 124,
      ambitionBox: { rating: 4.6, reviews: "1.2k" },
      glassdoor: { rating: 4.5, reviews: "850" },
      hq: "Mumbai, Maharashtra, India",
      summary:
        "TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days.",
      companySize: "51-200",
      foundedYear: "2019",
      industryDomain: "IT Services / Staffing",
      compliance:
        "ISO 9001, MSME Registered, GDPR Compliant, SOC 2 Type II, ISO 27001, CMMI Level 3, HIPAA Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "General Liability Insurance",
        "Professional Indemnity (E&O)",
        "Workers Compensation",
      ],
    },
  },
  {
    id: 20,
    requirementId: 1,
    name: "Divya Menon",
    initials: "DM",
    avatarColor: "#14B8A6",
    vendor: "Global Talent",
    experience: "4 Years",
    experienceYears: 4,
    experienceRange: "Jun 2020 – Present",
    certification: "React Certified",
    skills: [
      "React",
      "TypeScript",
      "Redux Toolkit",
      "React Query",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "State Management",
      "Component Design",
      "Jest",
      "React Testing Library",
      "Storybook",
      "Git",
      "CI/CD",
      "Agile / Scrum",
    ],
    secondarySkills: [
      "Next.js",
      "GraphQL",
      "Node.js",
      "Express",
      "Cypress",
      "Docker",
      "GitHub Actions",
      "Figma",
      "Postman",
      "OAuth / JWT",
      "MongoDB",
      "PostgreSQL",
      "Firebase",
      "WebSockets",
    ],
    matchScore: 85,
    status: "Pending review",
    strengths:
      "4+ years of React development with strong TypeScript skills; Experience with Redux Toolkit and React Query for state management; Proficient in testing with Jest and React Testing Library; Strong collaboration skills and Agile experience; Experience with modern tooling (Vite, Webpack, Storybook)",
    weakness:
      "Limited experience with Next.js and SSR/SSG; No GraphQL production experience; Lacks micro-frontend and design system experience at scale",
    improvements:
      "Gain hands-on Next.js SSR/SSG experience; Build production GraphQL applications; Explore micro-frontend architectures and design systems",
    summary:
      "MODERATE FIT: Capable React developer with 4+ years of experience and strong TypeScript/state management skills.; Key Strengths: React, TypeScript, Redux Toolkit, React Query, Tailwind CSS, testing, and Agile collaboration.; Critical Gaps: No Next.js SSR/SSG, GraphQL production, or micro-frontend experience; limited design system exposure.; Hiring Risk: MEDIUM - solid foundation but lacks advanced frontend patterns required for senior role.; Recommendation: CONSIDER for mid-level role - Proceed to technical interview if senior role can be adjusted to mid-level or if candidate demonstrates rapid learning ability.",
    quote:
      "MODERATE FIT: Capable React developer with 4+ years of experience and strong TypeScript/state management skills.\n\nKey Strengths: React, TypeScript, Redux Toolkit, React Query, Tailwind CSS, testing, and Agile collaboration.\n\nCritical Gaps: No Next.js SSR/SSG, GraphQL production, or micro-frontend experience; limited design system exposure.\n\nHiring Risk: MEDIUM - solid foundation but lacks advanced frontend patterns required for senior role.\n\nRecommendation: CONSIDER for mid-level role - Proceed to technical interview if senior role can be adjusted to mid-level or if candidate demonstrates rapid learning ability.",
    feedbacks: [],
    technicalSkillsScore: 29.5,
    experienceScore: 28.0,
    educationScore: 28.5,
    currentLocation: "Kochi, Kerala, India",
    availability: "Immediate Joiner",
    expectedRate: "$45 – $60 / hour",
    rateMin: "45",
    rateMax: "60",
    engagement: "C-C",
    jobTitle: "Frontend Developer",
    company: "TCS",
    role: "React Developer",
    duration: "Jun 2020 – Present",
    degree: "B.Tech in Computer Science",
    institute: "NIT Calicut",
    passingYear: "2019",
    cgpaOrPercentage: "8.5 CGPA",
    gender: "Female",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/divyamenon",
    github: "https://github.com/divyamenon",
    certifications: ["React Certified", "JavaScript Algorithms Certified"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Customer Portal Modernization",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "React Developer",
        domain: "Telecom",
        projectDetails:
          "Modernized a legacy customer portal using React, TypeScript, and Redux Toolkit, improving page load time by 50% and user satisfaction by 25%.",
      },
      {
        projectTitle: "Internal Analytics Dashboard",
        startDate: "Mar 2021",
        endDate: "Dec 2021",
        role: "Frontend Developer",
        domain: "Telecom",
        projectDetails:
          "Built an internal analytics dashboard with React, TypeScript, and React Query, enabling real-time data visualization for 500+ users.",
      },
    ],
    workExperience: [
      {
        role: "React Developer",
        company: "TCS",
        duration: "Jun 2020 – Present",
        currentLocation: "Kochi, India",
        projects: [
          {
            projectTitle: "Customer Portal Modernization",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "React Developer",
            domain: "Telecom",
            projectDetails:
              "Modernized a legacy customer portal using React, TypeScript, and Redux Toolkit, improving page load time by 50% and user satisfaction by 25%.",
          },
          {
            projectTitle: "Internal Analytics Dashboard",
            startDate: "Mar 2021",
            endDate: "Dec 2021",
            role: "Frontend Developer",
            domain: "Telecom",
            projectDetails:
              "Built an internal analytics dashboard with React, TypeScript, and React Query, enabling real-time data visualization for 500+ users.",
          },
        ],
      },
      {
        role: "Junior Frontend Developer",
        company: "Infosys",
        duration: "Jul 2019 – May 2020",
        currentLocation: "Trivandrum, India",
        projects: [
          {
            projectTitle: "HR Management UI",
            startDate: "Jul 2019",
            endDate: "May 2020",
            role: "Junior Frontend Developer",
            domain: "Enterprise HR",
            projectDetails:
              "Developed HR management UI components using React and Redux, improving HR workflow efficiency by 20%.",
          },
        ],
      },
    ],
    achievements:
      "Won TCS 'Best Fresher Award' (2020). Recognized for 'Outstanding Contribution' to customer portal modernization (2023).",
    personalProjects: [
      {
        projectTitle: "react-ts-boilerplate",
        role: "Creator",
        domain: "Open Source",
        projectUrl: "https://github.com/divyamenon/react-ts-boilerplate",
        startDate: "2022-01",
        endDate: "2022-08",
        technologies: ["React", "TypeScript", "Vite", "Jest"],
        projectDetails:
          "A production-ready React + TypeScript boilerplate with testing and CI/CD setup, with 500+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "Global Talent",
      rating: 4.6,
      reviews: 89,
      ambitionBox: { rating: 4.4, reviews: "940" },
      glassdoor: { rating: 4.3, reviews: "520" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Global Talent provides top-tier software engineers with a focus on Full Stack development, Cloud infrastructure, and Machine Learning.",
      companySize: "201-500",
      foundedYear: "2015",
      industryDomain: "IT Consulting / Staffing",
      compliance: "ISO 27001, SOC 2 Type II",
      legalDocs: [
        "Certificate of Incorporation",
        "PAN Card",
        "Tax Residency Certificate",
      ],
      insurance: [
        "Cyber Liability Insurance",
        "Professional Indemnity",
        "Commercial General Liability",
      ],
    },
  },
  {
    id: 4,
    requirementId: 2,
    name: "Vikram Malhotra",
    initials: "VM",
    avatarColor: "#10B981",
    vendor: "TechHire Solutions",
    experience: "5 Years",
    experienceYears: 5,
    experienceRange: "Apr 2019 – Present",
    certification: "Node.js Certified",
    skills: ["Node.js", "Express", "MongoDB"],
    secondarySkills: ["Redis", "Docker", "AWS Lambda"],
    matchScore: 92,
    status: "Selected for the next round",
    strengths: "Deep backend knowledge, database indexing optimization.",
    weakness: "Frontend skills are very basic.",
    improvements: "Learn React or basic UI integrations.",
    quote:
      "Outstanding backend engineer with clean database design capabilities.",
    feedbacks: [],
    technicalSkillsScore: 31.5,
    experienceScore: 30.5,
    educationScore: 30.0,
    currentLocation: "Mumbai, Maharashtra, India",
    availability: "Immediate Joiner",
    expectedRate: "$55 – $75 / hour",
    rateMin: "55",
    rateMax: "75",
    engagement: "C-C",
    jobTitle: "Backend Engineer",
    company: "Wipro",
    role: "Senior Backend Developer",
    duration: "Apr 2019 – Present",
    degree: "B.Tech in IT",
    institute: "NIT Trichy",
    passingYear: "2018",
    cgpaOrPercentage: "82%",
    gender: "Male",
    deploymentType: "Onsite",
    linkedIn: "https://linkedin.com/in/vikrammalhotra",
    github: "https://github.com/vikrammalhotra",
    certifications: ["Node.js Certified", "AWS Solutions Architect"],
    currency: "USD",
    rateType: "Hourly",
  },
  {
    id: 5,
    requirementId: 2,
    name: "Rohan Gupta",
    initials: "RG",
    avatarColor: "#F59E0B",
    vendor: "Talent First",
    experience: "3 Years",
    experienceYears: 3,
    experienceRange: "Jan 2022 – Present",
    certification: "AWS Developer",
    skills: ["Node.js", "Express", "SQL"],
    secondarySkills: ["Git", "Linux", "REST APIs"],
    matchScore: 78,
    status: "Pending review",
    strengths: "Active coder, quick learner, cloud understanding.",
    weakness: "Needs mentoring on system design patterns.",
    improvements: "Study design patterns, architecture scalability.",
    quote: "Enthusiastic junior engineer who shows high potential for growth.",
    feedbacks: [],
    technicalSkillsScore: 27.5,
    experienceScore: 25.5,
    educationScore: 25.0,
    currentLocation: "Delhi, Delhi, India",
    availability: "2 Weeks Notice",
    expectedRate: "$40 – $55 / hour",
    rateMin: "40",
    rateMax: "55",
    engagement: "C-C",
    jobTitle: "Backend Developer",
    company: "TCS",
    role: "Junior Developer",
    duration: "Jan 2022 – Present",
    degree: "B.Tech in CSE",
    institute: "DTU Delhi",
    passingYear: "2021",
    cgpaOrPercentage: "8.9 CGPA",
    gender: "Male",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/rohangupta",
    github: "https://github.com/rohangupta",
    certifications: ["AWS Developer Associate"],
    currency: "USD",
    rateType: "Hourly",
  },
  {
    id: 6,
    requirementId: 3,
    name: "Sneha Rao",
    initials: "SR",
    avatarColor: "#06B6D4",
    vendor: "Cloud Builders",
    experience: "7 Years",
    experienceYears: 7,
    experienceRange: "Aug 2017 – Present",
    certification: "AWS Solutions Architect",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    secondarySkills: ["Terraform", "Ansible", "Python"],
    matchScore: 95,
    status: "Pending review",
    strengths: "Excellent cloud automation, infrastructure as code (IaC).",
    weakness: "Scripting in Python is basic (prefers Bash).",
    improvements: "Improve Python coding skills for automation.",
    quote:
      "Top-tier DevOps engineer with extensive real-world Kubernetes scaling experience.",
    feedbacks: [],
    technicalSkillsScore: 32.5,
    experienceScore: 32.0,
    educationScore: 30.5,
    currentLocation: "Chennai, Tamil Nadu, India",
    availability: "Immediate Joiner",
    expectedRate: "$70 – $90 / hour",
    rateMin: "70",
    rateMax: "90",
    engagement: "C-C",
    jobTitle: "DevOps Engineer",
    company: "Amazon",
    role: "Senior DevOps Engineer",
    duration: "Aug 2017 – Present",
    degree: "M.Tech in CS",
    institute: "IIT Madras",
    passingYear: "2016",
    cgpaOrPercentage: "8.4 CGPA",
    gender: "Female",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/sneharao",
    github: "https://github.com/sneharao",
    certifications: ["AWS Solutions Architect Professional", "CKA"],
    currency: "USD",
    rateType: "Hourly",
  },
  {
    id: 7,
    requirementId: 4,
    name: "Rohan Das",
    initials: "RD",
    avatarColor: "#10B981",
    vendor: "Creative Minds",
    experience: "4 Years",
    experienceYears: 4,
    experienceRange: "May 2022 – Present",
    certification: "Certified UX Designer",
    skills: ["Figma", "UI Design", "UX Research"],
    secondarySkills: ["Prototyping", "Adobe XD", "Wireframing"],
    matchScore: 92,
    status: "Pending review",
    strengths: "Great visual design skills, strong user empathy.",
    weakness: "Limited experience with raw coding.",
    improvements: "Learn basic HTML/CSS concepts.",
    quote:
      "Exceptional visual designer with a solid portfolio of interactive applications.",
    feedbacks: [],
    technicalSkillsScore: 33.0,
    experienceScore: 30.0,
    educationScore: 29.0,
    currentLocation: "Mumbai, Maharashtra, India",
    availability: "Immediate Joiner",
    expectedRate: "$50 – $65 / hour",
    rateMin: "50",
    rateMax: "65",
    engagement: "C-C",
    jobTitle: "UI/UX Designer",
    company: "Studio 9",
    role: "Product Designer",
    duration: "May 2022 – Present",
    degree: "B.Des in Visual Comm",
    institute: "IDC, IIT Bombay",
    passingYear: "2022",
    cgpaOrPercentage: "87%",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/rohandas",
    github: "",
    certifications: ["Certified UX Designer", "Adobe Certified Expert"],
    currency: "USD",
    rateType: "Hourly",
  },
  {
    id: 8,
    requirementId: 5,
    name: "Nikhil Mehta",
    initials: "NM",
    avatarColor: "#F59E0B",
    vendor: "Product Leaders",
    experience: "8 Years",
    experienceYears: 8,
    experienceRange: "Jan 2018 – Present",
    certification: "Agile Certified",
    skills: ["Product Roadmap", "SQL", "Agile"],
    secondarySkills: ["Scrum", "Jira", "Market Research"],
    matchScore: 89,
    status: "Pending review",
    strengths: "Data-driven decisions, strong stakeholder management.",
    weakness: "Non-technical background.",
    improvements: "Improve technical architectural comprehension.",
    quote:
      "A senior PM who communicates clearly and executes roadmaps efficiently.",
    feedbacks: [],
    technicalSkillsScore: 29.5,
    experienceScore: 31.0,
    educationScore: 28.5,
    currentLocation: "Pune, Maharashtra, India",
    availability: "1 Month Notice",
    expectedRate: "$80 – $100 / hour",
    rateMin: "80",
    rateMax: "100",
    engagement: "C-C",
    jobTitle: "Product Manager",
    company: "Uber",
    role: "Product Manager II",
    duration: "Jan 2018 – Present",
    degree: "MBA",
    institute: "IIM Ahmedabad",
    passingYear: "2018",
    cgpaOrPercentage: "8.6 CGPA",
    gender: "Male",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/nikhilmehta",
    github: "",
    certifications: ["Agile Certified", "Certified Scrum Product Owner"],
    currency: "USD",
    rateType: "Hourly",
  },
  {
    id: 9,
    requirementId: 6,
    name: "Vikram Sen",
    initials: "VS",
    avatarColor: "#EC4899",
    vendor: "Data Stream",
    experience: "5 Years",
    experienceYears: 5,
    experienceRange: "Jul 2021 – Present",
    certification: "Databricks Certified",
    skills: ["Python", "Spark", "SQL", "Airflow"],
    secondarySkills: ["AWS", "Snowflake", "ETL"],
    matchScore: 90,
    status: "Pending review",
    strengths: "Optimizing database queries, building robust ETL pipelines.",
    weakness: "Less focused on front-end visualization tools.",
    improvements: "Learn more BI tool integrations (Tableau/PowerBI).",
    quote:
      "Reliable data engineer who handles huge volumes of streaming data cleanly.",
    feedbacks: [],
    technicalSkillsScore: 31.0,
    experienceScore: 30.0,
    educationScore: 29.0,
    currentLocation: "Kolkata, West Bengal, India",
    availability: "Immediate Joiner",
    expectedRate: "$60 – $75 / hour",
    rateMin: "60",
    rateMax: "75",
    engagement: "C-C",
    jobTitle: "Data Engineer",
    company: "Cognizant",
    role: "Data Architect",
    duration: "Jul 2021 – Present",
    degree: "B.Tech in ECE",
    institute: "IIT Kharagpur",
    passingYear: "2021",
    cgpaOrPercentage: "9.0 CGPA",
    gender: "Male",
    deploymentType: "Onsite",
    linkedIn: "https://linkedin.com/in/vikramsen",
    github: "https://github.com/vikramsen",
    certifications: ["Databricks Certified", "AWS Data Analytics"],
    currency: "USD",
    rateType: "Hourly",
  },
  // === NEW CANDIDATES ADDED BELOW ===
  {
    id: 10,
    requirementId: 1,
    name: "Kavya Nair",
    initials: "KN",
    avatarColor: "#14B8A6",
    vendor: "TechHire Solutions",
    experience: "6 Years",
    experienceYears: 6,
    experienceRange: "Feb 2019 – Present",
    certification: "React Certified",
    skills: [
      "React",
      "TypeScript",
      "Next.js",
      "Redux Toolkit",
      "Tailwind CSS",
      "GraphQL",
      "Jest",
      "React Testing Library",
      "Storybook",
      "Webpack",
      "Vite",
      "RESTful APIs",
      "HTML5",
      "CSS3",
      "JavaScript (ES6+)",
      "Sass / SCSS",
      "Responsive Web Design",
      "Web Accessibility (a11y)",
      "Performance Optimization",
      "State Management",
      "React Query",
      "Zustand",
    ],
    secondarySkills: [
      "Node.js",
      "Express",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "Git",
      "CI/CD",
      "GitHub Actions",
      "Figma",
      "Cypress",
      "Playwright",
      "Postman",
      "OAuth / JWT",
      "Agile / Scrum",
      "AWS (S3 & CloudFront)",
      "Redis",
      "Nginx",
      "WebSockets",
    ],
    matchScore: 93,
    status: "Selected for the next round",
    strengths:
      "6+ years of frontend development with deep React/TypeScript expertise; Proven track record of building scalable component libraries and design systems; Strong testing culture with Jest, React Testing Library, and Cypress; Experience with Next.js SSR/SSG and performance optimization; Led frontend architecture decisions for multiple enterprise projects",
    weakness:
      "Limited backend/API development experience; No direct experience with micro-frontends at scale; Lacks cloud infrastructure certification",
    improvements:
      "Gain hands-on backend experience with Node.js/GraphQL; Explore micro-frontend architectures and module federation; Consider AWS certification to strengthen full-stack profile",
    summary:
      "STRONG FIT: Excellent React/TypeScript frontend engineer with 6+ years of experience and a strong testing/quality mindset.; Key Strengths: Deep React ecosystem knowledge, Next.js, design systems, performance optimization, accessibility, and modern tooling.; Critical Gaps: Limited backend exposure and no cloud certification, but these are not core to the role.; Hiring Risk: LOW - strong technical match with minor gaps that can be addressed on the job.; Recommendation: SELECT - Proceed to technical interview. Strong candidate for senior frontend role.",
    quote:
      "STRONG FIT: Excellent React/TypeScript frontend engineer with 6+ years of experience and a strong testing/quality mindset.\n\nKey Strengths: Deep React ecosystem knowledge, Next.js, design systems, performance optimization, accessibility, and modern tooling.\n\nCritical Gaps: Limited backend exposure and no cloud certification, but these are not core to the role.\n\nHiring Risk: LOW - strong technical match with minor gaps that can be addressed on the job.\n\nRecommendation: SELECT - Proceed to technical interview. Strong candidate for senior frontend role.",
    feedbacks: [],
    technicalSkillsScore: 33.0,
    experienceScore: 31.5,
    educationScore: 30.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "2 Weeks Notice",
    expectedRate: "$65 – $85 / hour",
    rateMin: "65",
    rateMax: "85",
    engagement: "C-C",
    jobTitle: "Senior Frontend Engineer",
    company: "Flipkart",
    role: "Senior Frontend Developer",
    duration: "Feb 2019 – Present",
    degree: "B.Tech in Computer Science",
    institute: "NIT Calicut",
    passingYear: "2018",
    cgpaOrPercentage: "8.5 CGPA",
    gender: "Female",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/kavyanair",
    github: "https://github.com/kavyanair",
    certifications: ["React Certified", "Google UX Design"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Design System Implementation",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Frontend Engineer",
        domain: "E-Commerce",
        projectDetails:
          "Built a comprehensive design system with 80+ reusable components using React, TypeScript, and Storybook, adopted by 5+ product teams.",
      },
      {
        projectTitle: "Checkout Flow Optimization",
        startDate: "Mar 2020",
        endDate: "Dec 2021",
        role: "Frontend Developer",
        domain: "E-Commerce",
        projectDetails:
          "Redesigned and optimized the checkout flow, reducing cart abandonment by 22% and improving page load time by 35%.",
      },
    ],
    workExperience: [
      {
        role: "Senior Frontend Developer",
        company: "Flipkart",
        duration: "Feb 2019 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Design System Implementation",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Frontend Engineer",
            domain: "E-Commerce",
            projectDetails:
              "Built a comprehensive design system with 80+ reusable components using React, TypeScript, and Storybook, adopted by 5+ product teams.",
          },
          {
            projectTitle: "Checkout Flow Optimization",
            startDate: "Mar 2020",
            endDate: "Dec 2021",
            role: "Frontend Developer",
            domain: "E-Commerce",
            projectDetails:
              "Redesigned and optimized the checkout flow, reducing cart abandonment by 22% and improving page load time by 35%.",
          },
        ],
      },
      {
        role: "Frontend Developer",
        company: "Zoho Corporation",
        duration: "Jun 2018 – Jan 2019",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "CRM Dashboard Revamp",
            startDate: "Jun 2018",
            endDate: "Jan 2019",
            role: "Frontend Developer",
            domain: "SaaS / CRM",
            projectDetails:
              "Modernized the CRM dashboard UI using React and Redux, improving user satisfaction scores by 18%.",
          },
        ],
      },
    ],
    achievements:
      "Speaker at React India 2023 on 'Building Accessible Design Systems'. Won 'Best UI' award at Flipkart internal hackathon 2022.",
    personalProjects: [
      {
        projectTitle: "React A11y Toolkit",
        role: "Creator & Maintainer",
        domain: "Open Source",
        projectUrl: "https://github.com/kavyanair/react-a11y-toolkit",
        startDate: "2023-03",
        endDate: "Present",
        technologies: ["React", "TypeScript", "Jest"],
        projectDetails:
          "An open-source accessibility testing toolkit for React applications with 500+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "TechHire Solutions",
      rating: 4.8,
      reviews: 124,
      ambitionBox: { rating: 4.6, reviews: "1.2k" },
      glassdoor: { rating: 4.5, reviews: "850" },
      hq: "Mumbai, Maharashtra, India",
      summary:
        "TechHire Solutions is a growing IT staffing firm specializing in placing mid to senior-level tech talent. Strong in React, Java, and DevOps placements. 92% success rate with an average response time of 2.3 days.",
      companySize: "51-200",
      foundedYear: "2019",
      industryDomain: "IT Services / Staffing",
      compliance:
        "ISO 9001, MSME Registered, GDPR Compliant, SOC 2 Type II, ISO 27001, CMMI Level 3, HIPAA Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "General Liability Insurance",
        "Professional Indemnity (E&O)",
        "Workers Compensation",
      ],
    },
  },
  {
    id: 11,
    requirementId: 2,
    name: "Siddharth Joshi",
    initials: "SJ",
    avatarColor: "#F97316",
    vendor: "Global Talent",
    experience: "7 Years",
    experienceYears: 7,
    experienceRange: "Sep 2017 – Present",
    certification: "AWS Solutions Architect",
    skills: [
      "Node.js",
      "Express",
      "GraphQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
      "AWS",
      "RESTful APIs",
      "Microservices",
      "System Design",
      "TypeScript",
      "Python",
      "SQL",
      "NoSQL",
      "Message Queues (RabbitMQ/Kafka)",
      "CI/CD",
      "Git",
      "Linux",
      "Nginx",
      "OAuth / JWT",
    ],
    secondarySkills: [
      "React",
      "Next.js",
      "Terraform",
      "Ansible",
      "Jenkins",
      "GitHub Actions",
      "Prometheus",
      "Grafana",
      "ELK Stack",
      "Agile / Scrum",
      "Jest",
      "Mocha",
      "Postman",
    ],
    matchScore: 95,
    status: "Selected for the next round",
    strengths:
      "7+ years of backend engineering with expertise in Node.js, microservices, and system design; Proven experience scaling APIs to handle millions of requests per day; Strong database skills across PostgreSQL, MongoDB, and Redis; Cloud-native development with AWS, Docker, and Kubernetes; Led migration from monolith to microservices architecture",
    weakness:
      "Limited frontend development experience; No mobile development background",
    improvements:
      "Gain exposure to frontend frameworks (React/Next.js) for full-stack versatility; Explore mobile backend patterns if relevant to future roles",
    summary:
      "STRONG FIT: Highly experienced backend engineer with deep Node.js and microservices expertise.; Key Strengths: System design, scalability, database optimization, cloud-native architecture, and leadership in large-scale migrations.; Critical Gaps: Minimal frontend skills, but role is backend-focused so this is acceptable.; Hiring Risk: LOW - excellent technical match with strong architectural capabilities.; Recommendation: SELECT - Proceed to technical interview. Ideal candidate for senior backend role.",
    quote:
      "STRONG FIT: Highly experienced backend engineer with deep Node.js and microservices expertise.\n\nKey Strengths: System design, scalability, database optimization, cloud-native architecture, and leadership in large-scale migrations.\n\nCritical Gaps: Minimal frontend skills, but role is backend-focused so this is acceptable.\n\nHiring Risk: LOW - excellent technical match with strong architectural capabilities.\n\nRecommendation: SELECT - Proceed to technical interview. Ideal candidate for senior backend role.",
    feedbacks: [],
    technicalSkillsScore: 33.5,
    experienceScore: 32.5,
    educationScore: 30.5,
    currentLocation: "Hyderabad, Telangana, India",
    availability: "1 Month Notice",
    expectedRate: "$70 – $90 / hour",
    rateMin: "70",
    rateMax: "90",
    engagement: "C-C",
    jobTitle: "Senior Backend Engineer",
    company: "PhonePe",
    role: "Lead Backend Engineer",
    duration: "Sep 2017 – Present",
    degree: "B.Tech in Computer Science",
    institute: "IIIT Hyderabad",
    passingYear: "2016",
    cgpaOrPercentage: "9.2 CGPA",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/siddharthjoshi",
    github: "https://github.com/siddharthjoshi",
    certifications: ["AWS Solutions Architect", "MongoDB Certified Developer"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Payment Gateway Microservices",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Backend Engineer",
        domain: "Fintech",
        projectDetails:
          "Architected and led the migration of a monolithic payment gateway to microservices, handling 5M+ transactions per day with 99.99% uptime.",
      },
      {
        projectTitle: "Real-time Fraud Detection API",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        role: "Senior Backend Engineer",
        domain: "Fintech",
        projectDetails:
          "Built a real-time fraud detection system using Node.js, Kafka, and Redis, reducing fraud incidents by 40%.",
      },
    ],
    workExperience: [
      {
        role: "Lead Backend Engineer",
        company: "PhonePe",
        duration: "Sep 2017 – Present",
        currentLocation: "Hyderabad, India",
        projects: [
          {
            projectTitle: "Payment Gateway Microservices",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Backend Engineer",
            domain: "Fintech",
            projectDetails:
              "Architected and led the migration of a monolithic payment gateway to microservices, handling 5M+ transactions per day with 99.99% uptime.",
          },
          {
            projectTitle: "Real-time Fraud Detection API",
            startDate: "Jun 2020",
            endDate: "Dec 2021",
            role: "Senior Backend Engineer",
            domain: "Fintech",
            projectDetails:
              "Built a real-time fraud detection system using Node.js, Kafka, and Redis, reducing fraud incidents by 40%.",
          },
        ],
      },
      {
        role: "Backend Developer",
        company: "Freshworks",
        duration: "Jul 2016 – Aug 2017",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "CRM API Platform",
            startDate: "Jul 2016",
            endDate: "Aug 2017",
            role: "Backend Developer",
            domain: "SaaS / CRM",
            projectDetails:
              "Developed RESTful APIs for a CRM platform, improving API response times by 30% through caching and query optimization.",
          },
        ],
      },
    ],
    achievements:
      "Patent holder for 'Real-time Fraud Detection Using Machine Learning'. Speaker at AWS re:Invent 2023 on microservices best practices.",
    personalProjects: [
      {
        projectTitle: "Node.js Performance Toolkit",
        role: "Creator",
        domain: "Open Source",
        projectUrl: "https://github.com/siddharthjoshi/node-perf-toolkit",
        startDate: "2022-08",
        endDate: "2023-02",
        technologies: ["Node.js", "TypeScript", "Docker"],
        projectDetails:
          "A performance profiling toolkit for Node.js applications with 1.2k GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "Global Talent",
      rating: 4.6,
      reviews: 89,
      ambitionBox: { rating: 4.4, reviews: "940" },
      glassdoor: { rating: 4.3, reviews: "520" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Global Talent provides top-tier software engineers with a focus on Full Stack development, Cloud infrastructure, and Machine Learning.",
      companySize: "201-500",
      foundedYear: "2015",
      industryDomain: "IT Consulting / Staffing",
      compliance: "ISO 27001, SOC 2 Type II",
      legalDocs: [
        "Certificate of Incorporation",
        "PAN Card",
        "Tax Residency Certificate",
      ],
      insurance: [
        "Cyber Liability Insurance",
        "Professional Indemnity",
        "Commercial General Liability",
      ],
    },
  },
  {
    id: 12,
    requirementId: 6,
    name: "Ananya Iyer",
    initials: "AI",
    avatarColor: "#8B5CF6",
    vendor: "Data Stream",
    experience: "6 Years",
    experienceYears: 6,
    experienceRange: "Apr 2019 – Present",
    certification: "Google Cloud Professional Data Engineer",
    skills: [
      "Python",
      "SQL",
      "Spark",
      "Airflow",
      "dbt",
      "Snowflake",
      "BigQuery",
      "Data Modeling",
      "ETL / ELT",
      "Data Warehousing",
      "Kafka",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "Tableau",
      "Power BI",
      "Data Governance",
      "Data Quality",
      "CI/CD",
      "Git",
      "Linux",
      "Bash",
    ],
    secondarySkills: [
      "Scala",
      "Java",
      "Terraform",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Prometheus",
      "Grafana",
      "Agile / Scrum",
      "Jira",
      "Confluence",
    ],
    matchScore: 94,
    status: "Pending review",
    strengths:
      "6+ years of data engineering with expertise in building petabyte-scale data pipelines; Strong proficiency in Python, Spark, SQL, and Airflow; Experience with modern data stack (dbt, Snowflake, BigQuery); Cloud-native data engineering on AWS and GCP; Proven track record of optimizing ETL pipelines for performance and cost",
    weakness:
      "Limited experience with real-time streaming (Kafka) in production; No machine learning engineering experience",
    improvements:
      "Deepen Kafka/streaming expertise with production use cases; Explore ML engineering and feature stores for ML pipelines",
    summary:
      "STRONG FIT: Highly skilled data engineer with modern data stack expertise and cloud-native pipeline experience.; Key Strengths: Python, Spark, SQL, Airflow, dbt, Snowflake, BigQuery, data modeling, and pipeline optimization.; Critical Gaps: Limited production Kafka/streaming experience, no ML engineering background.; Hiring Risk: LOW - excellent match for data engineering role with minor gaps.; Recommendation: SELECT - Proceed to technical interview. Strong candidate for senior data engineering position.",
    quote:
      "STRONG FIT: Highly skilled data engineer with modern data stack expertise and cloud-native pipeline experience.\n\nKey Strengths: Python, Spark, SQL, Airflow, dbt, Snowflake, BigQuery, data modeling, and pipeline optimization.\n\nCritical Gaps: Limited production Kafka/streaming experience, no ML engineering background.\n\nHiring Risk: LOW - excellent match for data engineering role with minor gaps.\n\nRecommendation: SELECT - Proceed to technical interview. Strong candidate for senior data engineering position.",
    feedbacks: [],
    technicalSkillsScore: 33.0,
    experienceScore: 32.0,
    educationScore: 31.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "Immediate Joiner",
    expectedRate: "$65 – $85 / hour",
    rateMin: "65",
    rateMax: "85",
    engagement: "C-C",
    jobTitle: "Senior Data Engineer",
    company: "Swiggy",
    role: "Senior Data Engineer",
    duration: "Apr 2019 – Present",
    degree: "M.Tech in Data Science",
    institute: "IISc Bangalore",
    passingYear: "2018",
    cgpaOrPercentage: "8.7 CGPA",
    gender: "Female",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/ananyaiyer",
    github: "https://github.com/ananyaiyer",
    certifications: [
      "Google Cloud Professional Data Engineer",
      "Databricks Certified",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Petabyte-Scale Data Lake Migration",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Data Engineer",
        domain: "Food Tech / Logistics",
        projectDetails:
          "Led migration of on-premise data warehouse to a cloud data lake on GCP, processing 5PB+ of data and reducing query costs by 45%.",
      },
      {
        projectTitle: "Real-time Order Analytics Pipeline",
        startDate: "Jun 2020",
        endDate: "Dec 2021",
        role: "Data Engineer",
        domain: "Food Tech / Logistics",
        projectDetails:
          "Built a near real-time analytics pipeline using Kafka, Spark Streaming, and BigQuery, enabling live order tracking dashboards.",
      },
    ],
    workExperience: [
      {
        role: "Senior Data Engineer",
        company: "Swiggy",
        duration: "Apr 2019 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Petabyte-Scale Data Lake Migration",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Data Engineer",
            domain: "Food Tech / Logistics",
            projectDetails:
              "Led migration of on-premise data warehouse to a cloud data lake on GCP, processing 5PB+ of data and reducing query costs by 45%.",
          },
          {
            projectTitle: "Real-time Order Analytics Pipeline",
            startDate: "Jun 2020",
            endDate: "Dec 2021",
            role: "Data Engineer",
            domain: "Food Tech / Logistics",
            projectDetails:
              "Built a near real-time analytics pipeline using Kafka, Spark Streaming, and BigQuery, enabling live order tracking dashboards.",
          },
        ],
      },
      {
        role: "Data Engineer",
        company: "Mu Sigma",
        duration: "Jul 2018 – Mar 2019",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Retail Demand Forecasting Pipeline",
            startDate: "Jul 2018",
            endDate: "Mar 2019",
            role: "Data Engineer",
            domain: "Retail",
            projectDetails:
              "Built ETL pipelines for retail demand forecasting, processing 100M+ records daily using Python and SQL.",
          },
        ],
      },
    ],
    achievements:
      "Google Cloud Certified Data Engineer. Speaker at Data Engineering Summit 2023 on 'Modern Data Stack at Scale'.",
    personalProjects: [
      {
        projectTitle: "dbt-utils-extended",
        role: "Contributor",
        domain: "Open Source",
        projectUrl: "https://github.com/ananyaiyer/dbt-utils-extended",
        startDate: "2022-01",
        endDate: "2022-12",
        technologies: ["dbt", "SQL", "Python"],
        projectDetails:
          "Extended dbt utility macros for advanced data quality testing, contributed to by 20+ engineers.",
      },
    ],
    vendorDetails: {
      name: "Data Stream",
      rating: 4.7,
      reviews: 78,
      ambitionBox: { rating: 4.5, reviews: "670" },
      glassdoor: { rating: 4.4, reviews: "410" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Data Stream specializes in data engineering, analytics, and AI/ML talent placement for high-growth tech companies.",
      companySize: "51-200",
      foundedYear: "2018",
      industryDomain: "Data & Analytics Staffing",
      compliance: "ISO 27001, SOC 2 Type II, GDPR Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "Professional Indemnity",
        "Cyber Liability Insurance",
        "Commercial General Liability",
      ],
    },
  },
  {
    id: 13,
    requirementId: 4,
    name: "Meera Krishnan",
    initials: "MK",
    avatarColor: "#F43F5E",
    vendor: "Creative Minds",
    experience: "5 Years",
    experienceYears: 5,
    experienceRange: "Aug 2020 – Present",
    certification: "Certified UX Designer",
    skills: [
      "Figma",
      "Sketch",
      "Adobe XD",
      "UI Design",
      "UX Research",
      "Prototyping",
      "Wireframing",
      "User Testing",
      "Design Systems",
      "Interaction Design",
      "Information Architecture",
      "Accessibility (WCAG)",
      "HTML/CSS",
      "Responsive Design",
      "Motion Design",
      "Usability Testing",
      "A/B Testing",
      "Persona Development",
      "Journey Mapping",
      "Heuristic Evaluation",
    ],
    secondarySkills: [
      "JavaScript",
      "React",
      "Storybook",
      "Framer",
      "Principle",
      "InVision",
      "Miro",
      "Notion",
      "Jira",
      "Agile / Scrum",
      "Google Analytics",
      "Hotjar",
    ],
    matchScore: 93,
    status: "Selected for the next round",
    strengths:
      "5+ years of UX/UI design with a strong portfolio of shipped products; Expertise in user research, usability testing, and data-driven design; Proficient in Figma, Sketch, and Adobe XD; Experience building and maintaining design systems; Strong collaboration skills with cross-functional teams",
    weakness:
      "Limited coding experience beyond HTML/CSS; No experience with 3D or AR/VR design",
    improvements:
      "Deepen frontend coding skills (React) to better collaborate with engineers; Explore emerging design technologies (AR/VR) for future-proofing",
    summary:
      "STRONG FIT: Talented UX/UI designer with a strong portfolio and user-centered design approach.; Key Strengths: User research, usability testing, design systems, Figma expertise, and cross-functional collaboration.; Critical Gaps: Limited coding skills beyond HTML/CSS, no AR/VR experience.; Hiring Risk: LOW - excellent match for product design role.; Recommendation: SELECT - Proceed to portfolio review and design challenge. Strong candidate for senior product designer.",
    quote:
      "STRONG FIT: Talented UX/UI designer with a strong portfolio and user-centered design approach.\n\nKey Strengths: User research, usability testing, design systems, Figma expertise, and cross-functional collaboration.\n\nCritical Gaps: Limited coding skills beyond HTML/CSS, no AR/VR experience.\n\nHiring Risk: LOW - excellent match for product design role.\n\nRecommendation: SELECT - Proceed to portfolio review and design challenge. Strong candidate for senior product designer.",
    feedbacks: [],
    technicalSkillsScore: 32.5,
    experienceScore: 31.0,
    educationScore: 30.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "2 Weeks Notice",
    expectedRate: "$55 – $75 / hour",
    rateMin: "55",
    rateMax: "75",
    engagement: "C-C",
    jobTitle: "Senior Product Designer",
    company: "Razorpay",
    role: "Senior UX Designer",
    duration: "Aug 2020 – Present",
    degree: "B.Des in Interaction Design",
    institute: "NID Ahmedabad",
    passingYear: "2019",
    cgpaOrPercentage: "8.9 CGPA",
    gender: "Female",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/meerakrishnan",
    github: "",
    certifications: ["Certified UX Designer", "Google UX Design"],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Razorpay Dashboard Redesign",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead Product Designer",
        domain: "Fintech",
        projectDetails:
          "Led end-to-end redesign of the merchant dashboard, improving task completion rate by 35% and user satisfaction (NPS) by 20 points.",
      },
      {
        projectTitle: "Payment Checkout UX Optimization",
        startDate: "Mar 2021",
        endDate: "Dec 2021",
        role: "UX Designer",
        domain: "Fintech",
        projectDetails:
          "Redesigned the payment checkout experience, reducing drop-offs by 28% through user research and iterative prototyping.",
      },
    ],
    workExperience: [
      {
        role: "Senior UX Designer",
        company: "Razorpay",
        duration: "Aug 2020 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Razorpay Dashboard Redesign",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead Product Designer",
            domain: "Fintech",
            projectDetails:
              "Led end-to-end redesign of the merchant dashboard, improving task completion rate by 35% and user satisfaction (NPS) by 20 points.",
          },
          {
            projectTitle: "Payment Checkout UX Optimization",
            startDate: "Mar 2021",
            endDate: "Dec 2021",
            role: "UX Designer",
            domain: "Fintech",
            projectDetails:
              "Redesigned the payment checkout experience, reducing drop-offs by 28% through user research and iterative prototyping.",
          },
        ],
      },
      {
        role: "UI/UX Designer",
        company: "Zeta",
        duration: "Jul 2019 – Jul 2020",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Banking App Design",
            startDate: "Jul 2019",
            endDate: "Jul 2020",
            role: "UI/UX Designer",
            domain: "Banking / Fintech",
            projectDetails:
              "Designed a mobile banking app from scratch, achieving 4.7-star rating and 100K+ downloads within 6 months.",
          },
        ],
      },
    ],
    achievements:
      "Winner of 'Best Design Portfolio' at NID Ahmedabad (2019). Speaker at UX India Conference 2023 on 'Designing for Trust in Fintech'.",
    personalProjects: [
      {
        projectTitle: "Fintech Design Patterns",
        role: "Author",
        domain: "Design Education",
        projectUrl: "https://fintechdesignpatterns.com",
        startDate: "2023-01",
        endDate: "Present",
        technologies: ["Figma", "Notion"],
        projectDetails:
          "A curated library of design patterns for fintech products, used by 5,000+ designers.",
      },
    ],
    vendorDetails: {
      name: "Creative Minds",
      rating: 4.5,
      reviews: 62,
      ambitionBox: { rating: 4.3, reviews: "480" },
      glassdoor: { rating: 4.2, reviews: "290" },
      hq: "Mumbai, Maharashtra, India",
      summary:
        "Creative Minds specializes in recruiting top design and creative talent for tech companies across India.",
      companySize: "11-50",
      foundedYear: "2017",
      industryDomain: "Design & Creative Staffing",
      compliance: "MSME Registered, GST Compliant",
      legalDocs: [
        "Udyam Registration Certificate",
        "GST Certificate",
        "PAN Card",
        "Bank Account Verification",
      ],
      insurance: ["General Liability Insurance", "Professional Indemnity"],
    },
  },
  {
    id: 14,
    requirementId: 5,
    name: "Rajesh Kumar",
    initials: "RK",
    avatarColor: "#0EA5E9",
    vendor: "Product Leaders",
    experience: "10 Years",
    experienceYears: 10,
    experienceRange: "Jun 2014 – Present",
    certification: "Certified Scrum Product Owner",
    skills: [
      "Product Strategy",
      "Product Roadmap",
      "SQL",
      "Agile",
      "Scrum",
      "Kanban",
      "Jira",
      "Market Research",
      "Competitive Analysis",
      "User Interviews",
      "A/B Testing",
      "Data Analysis",
      "Stakeholder Management",
      "OKRs",
      "Product Analytics",
      "Go-to-Market Strategy",
      "Pricing Strategy",
      "Customer Journey Mapping",
      "Wireframing",
      "API Design",
    ],
    secondarySkills: [
      "Python",
      "Tableau",
      "Power BI",
      "Google Analytics",
      "Mixpanel",
      "Amplitude",
      "Figma",
      "Notion",
      "Confluence",
      "Salesforce",
      "HubSpot",
      "Zendesk",
    ],
    matchScore: 91,
    status: "Selected for the next round",
    strengths:
      "10+ years of product management with a track record of launching successful products; Strong data-driven decision-making with SQL and analytics tools; Experience managing cross-functional teams and stakeholders; Deep understanding of Agile/Scrum methodologies; Led product strategy for B2B SaaS products with $10M+ ARR",
    weakness:
      "No hands-on coding experience; Limited experience with mobile-first products",
    improvements:
      "Gain exposure to mobile product management and app store optimization; Learn basic coding to better understand technical trade-offs",
    summary:
      "STRONG FIT: Seasoned product manager with 10+ years of experience and a strong track record in B2B SaaS.; Key Strengths: Product strategy, roadmapping, data-driven decision-making, stakeholder management, and Agile expertise.; Critical Gaps: No coding experience, limited mobile product exposure.; Hiring Risk: LOW - excellent match for senior product management role.; Recommendation: SELECT - Proceed to interview. Strong candidate for senior product manager.",
    quote:
      "STRONG FIT: Seasoned product manager with 10+ years of experience and a strong track record in B2B SaaS.\n\nKey Strengths: Product strategy, roadmapping, data-driven decision-making, stakeholder management, and Agile expertise.\n\nCritical Gaps: No coding experience, limited mobile product exposure.\n\nHiring Risk: LOW - excellent match for senior product management role.\n\nRecommendation: SELECT - Proceed to interview. Strong candidate for senior product manager.",
    feedbacks: [],
    technicalSkillsScore: 30.5,
    experienceScore: 33.0,
    educationScore: 31.0,
    currentLocation: "Bangalore, Karnataka, India",
    availability: "1 Month Notice",
    expectedRate: "$90 – $120 / hour",
    rateMin: "90",
    rateMax: "120",
    engagement: "C-C",
    jobTitle: "Senior Product Manager",
    company: "Freshworks",
    role: "Director of Product",
    duration: "Jun 2014 – Present",
    degree: "MBA",
    institute: "ISB Hyderabad",
    passingYear: "2014",
    cgpaOrPercentage: "3.8 GPA",
    gender: "Male",
    deploymentType: "Hybrid",
    linkedIn: "https://linkedin.com/in/rajeshkumar",
    github: "",
    certifications: [
      "Certified Scrum Product Owner",
      "Pragmatic Marketing Certified",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Freshworks CRM Product Launch",
        startDate: "Jan 2020",
        endDate: "Present",
        role: "Director of Product",
        domain: "SaaS / CRM",
        projectDetails:
          "Led product strategy and launch of a new CRM product, achieving $10M+ ARR within 18 months and 5,000+ customers.",
      },
      {
        projectTitle: "AI-Powered Support Automation",
        startDate: "Mar 2018",
        endDate: "Dec 2019",
        role: "Senior Product Manager",
        domain: "SaaS / Customer Support",
        projectDetails:
          "Drove the development of AI-powered support automation features, reducing customer support tickets by 35%.",
      },
    ],
    workExperience: [
      {
        role: "Director of Product",
        company: "Freshworks",
        duration: "Jun 2014 – Present",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "Freshworks CRM Product Launch",
            startDate: "Jan 2020",
            endDate: "Present",
            role: "Director of Product",
            domain: "SaaS / CRM",
            projectDetails:
              "Led product strategy and launch of a new CRM product, achieving $10M+ ARR within 18 months and 5,000+ customers.",
          },
          {
            projectTitle: "AI-Powered Support Automation",
            startDate: "Mar 2018",
            endDate: "Dec 2019",
            role: "Senior Product Manager",
            domain: "SaaS / Customer Support",
            projectDetails:
              "Drove the development of AI-powered support automation features, reducing customer support tickets by 35%.",
          },
        ],
      },
      {
        role: "Product Manager",
        company: "Zoho Corporation",
        duration: "Jul 2012 – May 2014",
        currentLocation: "Chennai, India",
        projects: [
          {
            projectTitle: "Zoho Desk Launch",
            startDate: "Jul 2012",
            endDate: "May 2014",
            role: "Product Manager",
            domain: "SaaS / Customer Support",
            projectDetails:
              "Managed the launch of Zoho Desk, growing to 10,000+ customers in the first year.",
          },
        ],
      },
    ],
    achievements:
      "Forbes 30 Under 30 (2018) in Enterprise Technology. Speaker at SaaStr Annual 2022 on 'Scaling B2B SaaS Products'.",
    personalProjects: [
      {
        projectTitle: "Product Management 101",
        role: "Author & Instructor",
        domain: "Education",
        projectUrl: "https://productmanagement101.com",
        startDate: "2021-01",
        endDate: "Present",
        technologies: ["Notion", "YouTube"],
        projectDetails:
          "A popular online course on product management with 50,000+ students.",
      },
    ],
    vendorDetails: {
      name: "Product Leaders",
      rating: 4.9,
      reviews: 56,
      ambitionBox: { rating: 4.7, reviews: "380" },
      glassdoor: { rating: 4.6, reviews: "220" },
      hq: "Bangalore, Karnataka, India",
      summary:
        "Product Leaders is a boutique staffing firm specializing in placing senior product management and leadership talent.",
      companySize: "11-50",
      foundedYear: "2016",
      industryDomain: "Product Management Staffing",
      compliance: "ISO 9001, MSME Registered",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: ["Professional Indemnity", "Commercial General Liability"],
    },
  },
  {
    id: 15,
    requirementId: 3,
    name: "Deepak Reddy",
    initials: "DR",
    avatarColor: "#22C55E",
    vendor: "Cloud Builders",
    experience: "8 Years",
    experienceYears: 8,
    experienceRange: "Jan 2016 – Present",
    certification: "AWS Solutions Architect Professional",
    skills: [
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Ansible",
      "CI/CD",
      "Jenkins",
      "GitHub Actions",
      "Python",
      "Bash",
      "Linux",
      "Networking",
      "Security",
      "Monitoring (Prometheus/Grafana)",
      "Logging (ELK Stack)",
      "Infrastructure as Code",
      "Microservices",
      "Serverless",
      "Cloud Migration",
      "Cost Optimization",
    ],
    secondarySkills: [
      "Go",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Kafka",
      "Nginx",
      "HAProxy",
      "Git",
      "Agile / Scrum",
      "Jira",
      "Confluence",
    ],
    matchScore: 96,
    status: "Selected for the next round",
    strengths:
      "8+ years of DevOps and cloud engineering with multi-cloud expertise (AWS, Azure, GCP); Deep knowledge of Kubernetes, Terraform, and CI/CD pipelines; Proven track record of cloud migrations and cost optimization; Strong automation and scripting skills in Python and Bash; Experience leading DevOps teams and establishing best practices",
    weakness:
      "Limited frontend development experience; No formal security certification (CISSP, etc.)",
    improvements:
      "Consider security certification to strengthen DevSecOps profile; Gain exposure to frontend deployment pipelines if relevant",
    summary:
      "STRONG FIT: Highly experienced DevOps engineer with multi-cloud expertise and a strong automation background.; Key Strengths: AWS/Azure/GCP, Kubernetes, Terraform, CI/CD, Python/Bash, cloud migration, and cost optimization.; Critical Gaps: No security certification, limited frontend exposure, but not core to role.; Hiring Risk: LOW - excellent match for senior DevOps role.; Recommendation: SELECT - Proceed to technical interview. Ideal candidate for lead DevOps position.",
    quote:
      "STRONG FIT: Highly experienced DevOps engineer with multi-cloud expertise and a strong automation background.\n\nKey Strengths: AWS/Azure/GCP, Kubernetes, Terraform, CI/CD, Python/Bash, cloud migration, and cost optimization.\n\nCritical Gaps: No security certification, limited frontend exposure, but not core to role.\n\nHiring Risk: LOW - excellent match for senior DevOps role.\n\nRecommendation: SELECT - Proceed to technical interview. Ideal candidate for lead DevOps position.",
    feedbacks: [],
    technicalSkillsScore: 34.0,
    experienceScore: 33.0,
    educationScore: 31.0,
    currentLocation: "Hyderabad, Telangana, India",
    availability: "Immediate Joiner",
    expectedRate: "$80 – $100 / hour",
    rateMin: "80",
    rateMax: "100",
    engagement: "C-C",
    jobTitle: "Lead DevOps Engineer",
    company: "Microsoft",
    role: "Senior DevOps Engineer",
    duration: "Jan 2016 – Present",
    degree: "B.Tech in Computer Science",
    institute: "IIT Delhi",
    passingYear: "2015",
    cgpaOrPercentage: "9.0 CGPA",
    gender: "Male",
    deploymentType: "Remote",
    linkedIn: "https://linkedin.com/in/deepakreddy",
    github: "https://github.com/deepakreddy",
    certifications: [
      "AWS Solutions Architect Professional",
      "Azure Solutions Architect Expert",
      "Google Cloud Professional Cloud Architect",
      "CKA",
      "CKS",
    ],
    currency: "USD",
    rateType: "Hourly",
    projects: [
      {
        projectTitle: "Multi-Cloud Kubernetes Platform",
        startDate: "Jan 2022",
        endDate: "Present",
        role: "Lead DevOps Engineer",
        domain: "Cloud Infrastructure",
        projectDetails:
          "Designed and built a multi-cloud Kubernetes platform serving 200+ microservices, achieving 99.99% uptime and 40% cost reduction.",
      },
      {
        projectTitle: "Cloud Migration for Enterprise Client",
        startDate: "Jun 2019",
        endDate: "Dec 2021",
        role: "Senior DevOps Engineer",
        domain: "Enterprise IT",
        projectDetails:
          "Led migration of 150+ on-premise workloads to AWS, reducing infrastructure costs by 35% and improving deployment frequency by 10x.",
      },
    ],
    workExperience: [
      {
        role: "Senior DevOps Engineer",
        company: "Microsoft",
        duration: "Jan 2016 – Present",
        currentLocation: "Hyderabad, India",
        projects: [
          {
            projectTitle: "Multi-Cloud Kubernetes Platform",
            startDate: "Jan 2022",
            endDate: "Present",
            role: "Lead DevOps Engineer",
            domain: "Cloud Infrastructure",
            projectDetails:
              "Designed and built a multi-cloud Kubernetes platform serving 200+ microservices, achieving 99.99% uptime and 40% cost reduction.",
          },
          {
            projectTitle: "Cloud Migration for Enterprise Client",
            startDate: "Jun 2019",
            endDate: "Dec 2021",
            role: "Senior DevOps Engineer",
            domain: "Enterprise IT",
            projectDetails:
              "Led migration of 150+ on-premise workloads to AWS, reducing infrastructure costs by 35% and improving deployment frequency by 10x.",
          },
        ],
      },
      {
        role: "DevOps Engineer",
        company: "Amazon",
        duration: "Jul 2015 – Dec 2015",
        currentLocation: "Bangalore, India",
        projects: [
          {
            projectTitle: "CI/CD Pipeline Automation",
            startDate: "Jul 2015",
            endDate: "Dec 2015",
            role: "DevOps Engineer",
            domain: "E-Commerce",
            projectDetails:
              "Automated CI/CD pipelines for 50+ microservices using Jenkins and Docker, reducing deployment time by 70%.",
          },
        ],
      },
    ],
    achievements:
      "Microsoft 'Gold Star' award for cloud migration excellence (2021). Speaker at KubeCon India 2023 on multi-cloud Kubernetes best practices.",
    personalProjects: [
      {
        projectTitle: "k8s-cost-optimizer",
        role: "Creator",
        domain: "Open Source",
        projectUrl: "https://github.com/deepakreddy/k8s-cost-optimizer",
        startDate: "2022-05",
        endDate: "Present",
        technologies: ["Go", "Kubernetes", "Prometheus"],
        projectDetails:
          "An open-source tool for optimizing Kubernetes cluster costs, with 2k+ GitHub stars.",
      },
    ],
    vendorDetails: {
      name: "Cloud Builders",
      rating: 4.8,
      reviews: 95,
      ambitionBox: { rating: 4.6, reviews: "720" },
      glassdoor: { rating: 4.5, reviews: "480" },
      hq: "Hyderabad, Telangana, India",
      summary:
        "Cloud Builders is a specialized staffing firm for cloud, DevOps, and infrastructure talent.",
      companySize: "51-200",
      foundedYear: "2017",
      industryDomain: "Cloud & DevOps Staffing",
      compliance: "ISO 27001, SOC 2 Type II, GDPR Compliant",
      legalDocs: [
        "Certificate of Incorporation",
        "GST Registration",
        "PAN Card",
        "NDA Executed",
      ],
      insurance: [
        "Professional Indemnity",
        "Cyber Liability Insurance",
        "Commercial General Liability",
      ],
    },
  },
];
