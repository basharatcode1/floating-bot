import type { StepConfig, SelectableCardOption, SocialPlatformConfig } from "@/app/onboarding/schemas/types";

/* ═══════ Client Step Definitions ═══════ */
export const CLIENT_STEPS: StepConfig[] = [
  {
    id: "company-contact",
    title: "Company & Contact Info",
    description: "Enter company details and point of contact",
    icon: "Building2",
  },
  {
    id: "profile-social",
    title: "Company Profile & Socials",
    description: "Review auto-fetched profile details & submit",
    icon: "Briefcase",
  },
];

/* ═══════ Vendor Step Definitions ═══════ */
export const VENDOR_STEPS: StepConfig[] = [
  {
    id: "company-contact",
    title: "Company & Contact Info",
    description: "Enter company details and point of contact",
    icon: "Building2",
  },
  {
    id: "profile-compliance",
    title: "Vendor Profile & Compliance",
    description: "Vendor model, profile, socials, and compliance details",
    icon: "Briefcase",
  },
];

/* ═══════ Industries ═══════ */
export const INDUSTRIES = [
  "Information Technology",
  "Software Development",
  "Financial Services",
  "Healthcare & Life Sciences",
  "E-Commerce & Retail",
  "Manufacturing",
  "Telecommunications",
  "Education & EdTech",
  "Logistics & Supply Chain",
  "Real Estate & PropTech",
  "Energy & Utilities",
  "Media & Entertainment",
  "Consulting",
  "Automotive",
  "Aerospace & Defense",
  "Agriculture & AgriTech",
  "Government & Public Sector",
  "Insurance",
  "Legal & RegTech",
  "Non-Profit & NGO",
];

/* ═══════ Tech Stack Options ═══════ */
export const TECH_STACK_OPTIONS = [
  "React",
  "Next.js",
  "Node.js",
  "Java",
  "Python",
  "Angular",
  "Vue",
  "AWS",
  "Azure",
  "GCP",
  "DevOps",
  "AI/ML",
  "QA",
  "Mobile",
  "UI/UX",
  "Data Engineering",
  "TypeScript",
  "Go",
  "Rust",
  "Kubernetes",
  "Docker",
  "Terraform",
  ".NET",
  "Ruby on Rails",
  "PHP",
  "Salesforce",
  "SAP",
  "Blockchain",
  "IoT",
  "Cybersecurity",
];

/* ═══════ Company Size Options ═══════ */
export const COMPANY_SIZES: SelectableCardOption[] = [
  {
    id: "1-10",
    title: "1–10",
    description: "",
    icon: "Sprout",
  },
  {
    id: "11-50",
    title: "11–50",
    description: "",
    icon: "Users",
  },
  {
    id: "51-200",
    title: "51–200",
    description: "",
    icon: "Building",
  },
  {
    id: "201-500",
    title: "201–500",
    description: "",
    icon: "Building2",
  },
  {
    id: "501-1000",
    title: "501–1,000",
    description: "",
    icon: "Landmark",
  },
  {
    id: "1001-5000",
    title: "1001–5000",
    description: "",
    icon: "Globe",
  },
  {
    id: "5001-10000",
    title: "5001–10000",
    description: "",
    icon: "Globe",
  },
  {
    id: "10001+",
    title: "10001+",
    description: "",
    icon: "Globe",
  },
];

/* ═══════ Vendor Model Options ═══════ */
export const VENDOR_MODELS: SelectableCardOption[] = [
  {
    id: "c2c",
    title: "Contract to Contract",
    description: "Project-based engagements with defined timelines and deliverables",
    icon: "FileText",
  },
  {
    id: "c2h",
    title: "Contract to Hire",
    description: "Start with a contract period, convert to full-time based on performance",
    icon: "UserCheck",
  },
  {
    id: "both",
    title: "Both",
    description: "Both Contract to Contract and Contract to Hire engagement models",
    icon: "Layers",
  },
];

/* ═══════ Social Platform Configs ═══════ */
export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/company/your-company",
    icon: "Linkedin",
    baseUrl: "linkedin.com",
    color: "#0A66C2",
  },
  {
    id: "twitter",
    label: "X",
    placeholder: "https://x.com/your-company",
    icon: "Twitter",
    baseUrl: "x.com",
    color: "#1DA1F2",
  },
  {
    id: "instagram",
    label: "Instagram",
    placeholder: "https://instagram.com/your-company",
    icon: "Instagram",
    baseUrl: "instagram.com",
    color: "#E4405F",
  },
];

/* ═══════ Legal Registration Documents ═══════ */
export const LEGAL_REGISTRATION_DOCS = [
  { id: "certificate-of-incorporation", label: "Certificate of Incorporation" },
  { id: "duns", label: "D-U-N-S Number (if applicable)" },
  { id: "moa-aoa", label: "MOA/AOA" },
  { id: "msme", label: "MSME Certificate (if applicable)" },
  { id: "shop-act", label: "Shops & Establishment License (if applicable)" },
  { id: "epf", label: "EPF Registration (if applicable)" },
  { id: "esic", label: "ESIC Registration (if applicable)" },
];

/* ═══════ Compliance Certifications ═══════ */
export const COMPLIANCE_CERTIFICATIONS = [
  { id: "iso-27001", label: "ISO/IEC 27001" },
  { id: "soc2", label: "SOC 2 Type II" },
  { id: "iso-9001", label: "ISO 9001" },
  { id: "cmmi", label: "CMMI" },
  { id: "statutory-licenses", label: "Applicable statutory licenses" },
];

/* ═══════ Insurance Options ═══════ */
export const INSURANCE_OPTIONS = [
  { id: "professional-liability", label: "Professional Liability Insurance" },
  { id: "cyber-insurance", label: "Cyber Insurance" },
  { id: "workers-compensation", label: "Workers' Compensation (if applicable)" },
];

/* ═══════ Certification Options (Company Profile) ═══════ */
export const CERTIFICATION_OPTIONS = [
  "ISO 9001",
  "ISO 27001",
  "ISO 14001",
  "SOC2 Type II",
  "CMMI Level 3",
  "CMMI Level 5",
  "PCI DSS",
  "GDPR Compliant",
  "HIPAA Compliant",
  "Great Place to Work",
  "B Corp Certified",
];
