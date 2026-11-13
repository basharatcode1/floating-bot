import { JDFormValues } from "../schemas/jd.schema";

export interface RawRequirementJson {
  location_state?: string | null;
  budget_type?: "Hourly" | "Monthly" | "Daywise" | string | null;
  secondary_skills?: string[];
  interview_rounds?: number | null;
  work_mode?: "Onsite" | "Hybrid" | "Remote" | string | null;
  project_duration?: string | null;
  start_date?: string | null;
  engagement_type?: string | null;
  job_title?: string | null;
  location_city?: string | null;
  budget_max?: number | null;
  jd_summary?: string | null;
  positions?: number | null;
  qualification?: string | null;
  budget_min?: number | null;
  currency?: string | null;
  experience_min_years?: number | null;
  shift?: string | null;
  mandatory_certifications?: string[] | null;
  experience_max_years?: number | null;
  domain?: string | null;
  primary_skills?: string[];
  location_country?: string | null;
  inferred_fields?: string[] | null;
}

/**
 * Maps a raw backend/AI requirement JSON into Partial<JDFormValues>.
 * If some fields are null or missing, applies static fallback data without removing fields.
 */
export function parseRawRequirementJson(json: RawRequirementJson): Partial<JDFormValues> {
  const jobTitle = json.job_title || "Java Backend Developer";
  
  // Work mode & location with static fallbacks
  const workMode = json.work_mode || "Hybrid";
  let locationType: "Onsite" | "Hybrid" | "Remote" = "Hybrid";
  if (workMode.toLowerCase().includes("remote")) locationType = "Remote";
  else if (workMode.toLowerCase().includes("onsite") || workMode.toLowerCase().includes("on-site")) locationType = "Onsite";
  else locationType = "Hybrid";

  const city = json.location_city || "Bengaluru";
  const state = json.location_state || "Karnataka";
  const country = json.location_country || "India";
  const location = `${workMode} - ${city}, ${state}`;

  // Skills
  const primarySkills =
    json.primary_skills && json.primary_skills.length > 0
      ? json.primary_skills
      : [
          "Java 21",
          "Spring Boot 3.2",
          "Java Persistence API (JPA)",
          "Oracle",
          "Continuous Integration and Continuous Deployment (CI/CD) pipelines",
          "High-throughput applications",
        ];

  const secondarySkills =
    json.secondary_skills && json.secondary_skills.length > 0
      ? json.secondary_skills
      : ["Leadership", "Application Programming Interfaces (APIs)", "Windows operating system"];

  // Shift
  let shift = "UTC+05:30 (IST): India Standard Time";
  const rawShift = (json.shift || "IST").toUpperCase();
  if (rawShift.includes("PST") || rawShift.includes("PACIFIC")) {
    shift = "UTC−08:00 (PST): Pacific Standard Time (North America)";
  } else if (rawShift.includes("CST") && (rawShift.includes("AMERICA") || rawShift.includes("CENTRAL"))) {
    shift = "UTC−06:00 (CST): Central Standard Time (North America)";
  } else if (rawShift.includes("EST") || rawShift.includes("EASTERN")) {
    shift = "UTC−05:00 (EST): Eastern Standard Time (North America)";
  } else if (rawShift.includes("CET") || rawShift.includes("BST") || rawShift.includes("UK")) {
    shift = "UTC+01:00 (CET): Central European Time";
  } else if (rawShift.includes("AEST")) {
    shift = "UTC +10 (AEST): Australian Eastern Standard Time";
  } else if (rawShift.includes("SGT")) {
    shift = "UTC+08:00 (CST/SGT): China Standard Time / Singapore Time";
  }

  // Engagement Model
  const engagementModels: string[] = [];
  const rawEng = (json.engagement_type || "C-C").toUpperCase();
  if (rawEng.includes("C-C") || rawEng.includes("C2C") || rawEng.includes("CONTRACT TO CONTRACT")) {
    engagementModels.push("Contract to Contract");
  }
  if (rawEng.includes("C2H") || rawEng.includes("C-H") || rawEng.includes("CONTRACT TO HIRE")) {
    engagementModels.push("Contract to Hire");
  }
  if (engagementModels.length === 0) {
    engagementModels.push("Contract to Contract");
  }

  // Experience
  let experience = "5-8 Years";
  if (json.experience_min_years != null && json.experience_max_years != null) {
    experience = `${json.experience_min_years}-${json.experience_max_years} Years`;
  } else if (json.experience_min_years != null) {
    experience = `${json.experience_min_years}+ Years`;
  }

  // Qualification
  const qualification = json.qualification || "Bachelor's Degree in Computer Science / IT";

  // Domain / Industry
  const domain =
    json.domain && json.domain !== "NA"
      ? json.domain
      : "IT & Software Product Development";

  // Positions & Interview rounds
  const positions = json.positions != null ? Number(json.positions) : 2;
  const interviewRounds = json.interview_rounds != null ? Number(json.interview_rounds) : 3;

  // Project duration
  let projectDuration = "Half Yearly";
  const rawDur = (json.project_duration || "3 to 6 months").toLowerCase();
  if (rawDur.includes("3 to 6") || rawDur.includes("quarter") || rawDur.includes("3 month")) {
    projectDuration = "Quarterly";
  } else if (rawDur.includes("month") && !rawDur.includes("6 month") && !rawDur.includes("12 month")) {
    projectDuration = "Monthly";
  } else if (rawDur.includes("year") || rawDur.includes("12 month") || rawDur.includes("1+ year")) {
    projectDuration = "1+ Years";
  }

  // Budget
  const isINR = (json.currency || "INR").toUpperCase().includes("INR");
  const currency = isINR ? "INR (₹)" : "USD ($)";
  const budgetType: "Hourly" | "Monthly" | "Daywise" =
    (json.budget_type as "Hourly" | "Monthly" | "Daywise") || "Monthly";

  const minBudget = json.budget_min != null ? Number(json.budget_min) : 170000;
  const maxBudget =
    json.budget_max != null ? Number(json.budget_max) : Math.round(minBudget * 1.3);

  // Certifications
  const certification =
    json.mandatory_certifications && json.mandatory_certifications.length > 0
      ? json.mandatory_certifications
      : [
          "Oracle Certified Professional: Java SE",
          "Spring Certified Professional",
          "AWS Certified Developer",
        ];

  // JD Summary
  const jdSummary =
    json.jd_summary && json.jd_summary.trim().length > 0
      ? json.jd_summary.trim()
      : "- Lead and guide the backend development team to implement APIs and microservices.\n- Ensure high-quality code and adherence to architectural standards.\n- Review code and enforce best practices.\n- Collaborate with the solution architect to align implementation with design.\n- Troubleshoot and resolve complex technical issues.\n- Work with the specified technology stack: Java 21, Spring Boot 3.2, JPA, Oracle, CI/CD pipelines, microservices architecture, and high-throughput applications.";

  const startDate = json.start_date || new Date().toISOString().split("T")[0];

  return {
    basicInfo: {
      jobTitle,
      locationType,
      location,
      primarySkills,
      secondarySkills,
      shift,
    },
    hiringDetails: {
      interviewRounds,
      positions,
    },
    engagementType: {
      jdTitle: jobTitle,
      location,
      budget: `₹${(minBudget / 100000).toFixed(1)}L - ${(maxBudget / 100000).toFixed(1)}L`,
      status: "Active",
      engagementModel: engagementModels,
      postedDate: new Date().toISOString().split("T")[0],
      positions,
    },
    qualificationRequirement: {
      experience,
      qualification,
      domain,
      certification,
    },
    complianceRequirements: {
      complianceStatus: "yes",
      complianceCertifications: ["ISO 27001", "SOC 2 Type II"],
      legalRegistrationDocs: ["GST Certificate", "PAN Card"],
      insuranceRequirements: ["General Liability Insurance", "Professional Indemnity"],
      companyCertifications: ["ISO 9001"],
    },
    budgetInfo: {
      currency,
      budgetType,
      minBudget,
      maxBudget,
    },
    jobDescription: {
      jdSummary,
    },
    projectTimeline: {
      startDate,
      projectDuration,
    },
  };
}

export function parseJDText(text: string): Partial<JDFormValues> {
  // Check if text is JSON or contains a JSON object
  try {
    const trimmed = text.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object") {
        return parseRawRequirementJson(parsed);
      }
    }
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed &&
        typeof parsed === "object" &&
        ("job_title" in parsed || "primary_skills" in parsed || "location_city" in parsed)
      ) {
        return parseRawRequirementJson(parsed);
      }
    }
  } catch {
    // If not JSON, fall back to regex text parsing below
  }

  const lower = text.toLowerCase();
  
  // Extract job title
  let jobTitle = "Senior Full Stack Engineer";
  if (lower.includes("java")) jobTitle = "Java Backend Developer";
  else if (lower.includes("react")) jobTitle = "Senior React Developer";
  else if (lower.includes("node")) jobTitle = "Node.js Backend Engineer";
  else if (lower.includes("python") || lower.includes("django")) jobTitle = "Python / Django Developer";
  else if (lower.includes("devops") || lower.includes("aws")) jobTitle = "DevOps Cloud Engineer";
  else if (lower.includes("ui/ux") || lower.includes("designer")) jobTitle = "Lead UI/UX Designer";

  // Extract location
  let locationType: "Onsite" | "Hybrid" | "Remote" = "Remote";
  let location = "Remote";
  if (lower.includes("hybrid")) {
    locationType = "Hybrid";
    location = "Hybrid - Bengaluru, Karnataka";
  } else if (lower.includes("onsite") || lower.includes("on-site") || lower.includes("office")) {
    locationType = "Onsite";
    location = "Onsite - Mumbai";
  } else if (lower.includes("bengaluru") || lower.includes("bangalore")) {
    locationType = "Hybrid";
    location = "Hybrid - Bengaluru, Karnataka";
  }

  // Extract skills
  const skillsList = [
    "Java 21",
    "Spring Boot 3.2",
    "JPA",
    "Oracle",
    "CI/CD pipelines",
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Next.js",
    "GraphQL",
    "PostgreSQL",
  ];
  const foundSkills = skillsList.filter((s) => lower.includes(s.toLowerCase()));
  
  let primarySkills: string[] = [];
  let secondarySkills: string[] = [];
  
  if (foundSkills.length === 0) {
    if (lower.includes("java")) {
      primarySkills = ["Java 21", "Spring Boot 3.2", "JPA", "Oracle"];
      secondarySkills = ["Leadership", "APIs", "Windows OS"];
    } else {
      primarySkills = ["React", "TypeScript", "Node.js"];
      secondarySkills = ["Git", "Docker", "AWS"];
    }
  } else {
    primarySkills = foundSkills.slice(0, 4);
    secondarySkills = foundSkills.slice(4);
    if (secondarySkills.length === 0) {
      secondarySkills = ["Leadership", "Application Programming Interfaces (APIs)"];
    }
  }

  // Shift
  let shift = "UTC+05:30 (IST): India Standard Time";
  if (lower.includes("pst") || lower.includes("pacific")) {
    shift = "UTC−08:00 (PST): Pacific Standard Time (North America)";
  } else if (lower.includes("cst") && (lower.includes("america") || lower.includes("central"))) {
    shift = "UTC−06:00 (CST): Central Standard Time (North America)";
  } else if (lower.includes("est") || lower.includes("eastern")) {
    shift = "UTC−05:00 (EST): Eastern Standard Time (North America)";
  } else if (lower.includes("cet") || lower.includes("european") || lower.includes("uk") || lower.includes("bst")) {
    shift = "UTC+01:00 (CET): Central European Time";
  } else if (lower.includes("rotational")) {
    shift = "Rotational Shift";
  } else if (lower.includes("aest") || lower.includes("australia")) {
    shift = "UTC +10 (AEST): Australian Eastern Standard Time";
  } else if (lower.includes("singapore") || lower.includes("sgt")) {
    shift = "UTC+08:00 (CST/SGT): China Standard Time / Singapore Time";
  }

  // Engagement Model
  const engagementModels: string[] = [];
  if (lower.includes("c-c") || lower.includes("c2c") || lower.includes("contract to contract") || lower.includes("c - c")) {
    engagementModels.push("Contract to Contract");
  }
  if (lower.includes("c2h") || lower.includes("contract to hire") || lower.includes("hire")) {
    engagementModels.push("Contract to Hire");
  }
  if (engagementModels.length === 0) {
    engagementModels.push("Contract to Contract");
  }

  // Experience
  let experience = "5-8 Years";
  if (lower.includes("senior") || lower.includes("lead")) experience = "5-8 Years";
  if (lower.includes("junior") || lower.includes("entry")) experience = "1-3 Years";
  if (lower.includes("mid")) experience = "3-5 Years";

  // Qualification
  let qualification = "Bachelor's Degree in Computer Science / IT";
  if (lower.includes("phd") || lower.includes("ph.d") || lower.includes("doctorate")) {
    qualification = "Doctorate / Ph.D";
  } else if (lower.includes("master") || lower.includes("m.s") || lower.includes("mtech") || lower.includes("mba")) {
    qualification = "Master's Degree";
  } else if (lower.includes("diploma") || lower.includes("associate")) {
    qualification = "Diploma";
  } else if (lower.includes("any graduation") || lower.includes("graduate")) {
    qualification = "Any Graduation";
  }

  // Positions
  let positions = 2;
  const posMatch = text.match(/(\d+)\s*(positions|openings|vacancies|roles)/i);
  if (posMatch && posMatch[1]) {
    positions = parseInt(posMatch[1], 10);
  }

  // Project Duration
  let projectDuration = "Quarterly";
  if (lower.includes("quarter") || lower.includes("3 month") || lower.includes("90 days") || lower.includes("3 to 6 month")) {
    projectDuration = "Quarterly";
  } else if (lower.includes("month") && !lower.includes("6 month") && !lower.includes("3 month") && !lower.includes("12 month")) {
    projectDuration = "Monthly";
  } else if (lower.includes("year") || lower.includes("12 month") || lower.includes("1+ year")) {
    projectDuration = "1+ Years";
  }

  return {
    basicInfo: {
      jobTitle,
      locationType,
      location,
      primarySkills,
      secondarySkills,
      shift,
    },
    hiringDetails: {
      interviewRounds: 3,
      positions,
    },
    engagementType: {
      jdTitle: jobTitle,
      location,
      budget: "₹1.7L - 2.2L",
      status: "Active",
      engagementModel: engagementModels,
      postedDate: new Date().toISOString().split("T")[0],
      positions,
    },
    qualificationRequirement: {
      experience,
      qualification,
      domain: "IT & Software Product Development",
      certification: lower.includes("java")
        ? ["Oracle Certified Professional: Java SE", "Spring Certified Professional"]
        : lower.includes("aws")
        ? ["AWS Certified Solutions Architect - Associate"]
        : lower.includes("azure")
        ? ["Microsoft Certified: Azure Administrator Associate"]
        : lower.includes("gcp") || lower.includes("google cloud")
        ? ["Google Cloud Certified Professional Cloud Architect"]
        : ["Oracle Certified Professional: Java SE"],
    },
    budgetInfo: {
      currency: "INR (₹)",
      budgetType: "Monthly",
      minBudget: 170000,
      maxBudget: 220000,
    },
    jobDescription: {
      jdSummary: text.trim().length > 0 ? text.trim() : "Parsed Job Description Summary: Responsible for leading backend microservices development, code quality, and architectural standards.",
    },
    projectTimeline: {
      startDate: new Date().toISOString().split("T")[0],
      projectDuration,
    },
  };
}
