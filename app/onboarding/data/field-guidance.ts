export interface FieldGuidance {
  title: string;
  tip: string;
  example?: string;
}

const SHARED_GUIDANCE: Record<string, FieldGuidance> = {
  companyName: {
    title: "Company Name",
    tip: "Enter your registered legal entity name exactly as it appears on official documents.",
    example: "Acme Technologies Pvt. Ltd.",
  },
  cin: {
    title: "CIN Number (Optional)",
    tip: "Enter your 21-character Corporate Identification Number issued by the MCA.",
    example: "U12345MH2020PTC123456",
  },
  gstNumber: {
    title: "GST Number",
    tip: "Provide your 15-character GSTIN used for billing and tax verification.",
    example: "22AAAAA0000A1Z5",
  },
  companyEmail: {
    title: "Company Official Email",
    tip: "Use your general corporate contact inbox (must be different from your personal POC email).",
    example: "contact@company.com",
  },
  companyPhone: {
    title: "Company Contact Number",
    tip: "Pick the country code and enter your primary company landline or reception number.",
    example: "+91 98765 43210",
  },
  alternativePhone: {
    title: "Alternative Number (Optional)",
    tip: "Add a secondary phone number so our team can reach you if the main line is busy.",
  },
  websiteUrl: {
    title: "Company Website",
    tip: "Include https:// so we can verify your organization's official domain.",
    example: "https://company.com",
  },
  contactName: {
    title: "Point of Contact Name",
    tip: "Enter the full name of the authorized representative managing this account.",
  },
  designation: {
    title: "Designation",
    tip: "Share your current role or title within the company.",
    example: "Director, HR Lead",
  },
  contactEmail: {
    title: "POC Official Email",
    tip: "Use your direct work email for account alerts and contracts (different from Company Email).",
    example: "alex@company.com",
  },
  mobileNumber: {
    title: "Official Mobile & OTP",
    tip: "Enter your active work mobile number and complete the quick SMS OTP verification.",
  },
  headquarters: {
    title: "Headquarters Location",
    tip: "Type your city name and pick a matching location from the dropdown suggestions.",
    example: "Bengaluru, Karnataka",
  },
  domain: {
    title: "Industry / Domain",
    tip: "Search and select your primary industry, or type a custom one and press Enter.",
  },
  companySize: {
    title: "Company Size",
    tip: "Select the headcount range that best reflects your organization today.",
  },
  foundedYear: {
    title: "Founded Year",
    tip: "Enter the 4-digit year your organization was established.",
    example: "2018",
  },
  vendorModels: {
    title: "Engagement Models",
    tip: "Select whether you work with C2C (Contract-to-Contract), C2H (Contract-to-Hire), or both.",
  },
  certifications: {
    title: "Company Certifications (Optional)",
    tip: "Type a certification and press Enter, or click any quick-add badge below.",
    example: "ISO 27001, SOC 2",
  },
  categories: {
    title: "Tech Stack & Skills",
    tip: "Add the primary technologies and talent skills your organization specializes in.",
    example: "React, Next.js, AWS",
  },
  complianceStatus: {
    title: "Compliance & Insurance",
    tip: "Choose 'Yes' to select your legal docs and policies, or 'No' if you need compliance assistance.",
  },
  legalDocs: {
    title: "Legal Registration Documents",
    tip: "Check all active corporate registration and tax documents your company maintains.",
  },
  insuranceOptions: {
    title: "Insurance Coverage",
    tip: "Select any active general, cyber, or professional liability policies you carry.",
  },
  linkedinUrl: {
    title: "LinkedIn Profile (Required)",
    tip: "Paste your company's official LinkedIn page URL for profile verification.",
    example: "https://linkedin.com/company/acme",
  },
  twitterUrl: {
    title: "X / Twitter (Optional)",
    tip: "Link your official X profile if your company shares updates there.",
  },
  instagramUrl: {
    title: "Instagram (Optional)",
    tip: "Add your company's Instagram page URL to highlight team culture.",
  },
  declarationAccepted: {
    title: "Confirm Declaration",
    tip: "Review the accuracy statement and check the box when you're ready to submit.",
  },
};

export function getFieldGuidance(
  fieldName: string,
  role: "client" | "vendor",
): FieldGuidance | null {
  if (fieldName === "aboutCompany") {
    return role === "client"
      ? {
          title: "Company Summary",
          tip: "Describe your company's mission, products, and culture in 100–150 words.",
        }
      : {
          title: "Company Summary",
          tip: "Highlight your core strengths, delivery track record, and the talent you provide (up to 1000 chars).",
        };
  }

  return SHARED_GUIDANCE[fieldName] ?? null;
}

