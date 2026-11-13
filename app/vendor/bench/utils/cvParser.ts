import { CandidateFormValues } from "../schemas/candidate.schema";

/**
 * Mock CV Parser that simulates extracting data from a PDF/Text resume.
 * In a real application, this would call a backend AI service to extract structured data.
 */
export const parseCVText = (text: string): Partial<CandidateFormValues> => {
  const extracted: Partial<CandidateFormValues> = {
    achievements: [],
  };
  const lowerText = text.toLowerCase();

  // Basic Info
  extracted.basicInfo = {
    firstName: "",
    lastName: "",
    gender: "Male",
    designation: "",
    totalExperience: "",
  };

  // Mock extraction logic for demo purposes
  if (lowerText.includes("rahul") || lowerText.includes("verma")) {
    extracted.basicInfo.firstName = "Rahul";
    extracted.basicInfo.lastName = "Verma";
    extracted.basicInfo.gender = "Male";
    extracted.basicInfo.designation = "Senior Frontend Engineer";
    extracted.basicInfo.totalExperience = "5 yrs";
    
    extracted.skills = {
      primarySkills: ["React", "TypeScript", "Node.js"],
      secondarySkills: ["Next.js", "Redux", "Tailwind CSS"],
    };
    
    extracted.location = {
      location: "Mumbai, Maharashtra, India",
    };

    extracted.certifications = {
      certifications: ["AWS Cloud Practitioner", "Scrum Master"],
    };

    extracted.education = {
      degree: "B.Tech in Computer Science",
      institute: "IIT Bombay",
      passingYear: "2019",
      cgpaOrPercentage: "8.9 CGPA",
    };
    
    extracted.links = {
      linkedIn: "https://linkedin.com/in/rahulverma",
      github: "https://github.com/rahulverma",
    };
    
    extracted.workExperience = [
      {
        companyName: "TechCorp",
        role: "Senior Frontend Engineer",
        startDate: "2021-06-01",
        endDate: "2026-07-30",
        projects: [
          {
            projectTitle: "E-Commerce Replatforming",
            role: "Lead UI Developer",
            startDate: "2021-08-15",
            endDate: "2026-07-30",
            domain: "E-Commerce",
            projectDetails: "Led the migration from monolithic architecture to Next.js micro-frontends.",
          }
        ]
      },
      {
        companyName: "DevStudio",
        role: "Frontend Developer",
        startDate: "2019-03-01",
        endDate: "2021-05-31",
        projects: []
      }
    ];

    extracted.personalProjects = [
      {
        projectTitle: "AI Candidate Matcher",
        role: "Creator & Developer",
        domain: "Artificial Intelligence",
        technologies: ["React", "TypeScript", "Node.js"],
        projectUrl: "https://github.com/rahulverma/ai-matcher",
        startDate: "2023-01-01",
        endDate: "2023-06-30",
        projectDetails: "Open-source tool that analyzes developer skills and ranks candidate job fit.",
      }
    ];

    extracted.achievements = [
      "Led migration of legacy monolith to micro-frontend architecture, reducing page load time by 40%.",
      "AWS Cloud Practitioner certified — architected serverless pipelines for 3 internal tools.",
      "Speaker at ReactConf 2024 — presented talk on performance optimization in large-scale SPAs.",
    ];

  } else if (lowerText.includes("sneha") || lowerText.includes("iyer")) {
    extracted.basicInfo.firstName = "Sneha";
    extracted.basicInfo.lastName = "Iyer";
    extracted.basicInfo.gender = "Female";
    extracted.basicInfo.designation = "Backend Specialist";
    extracted.basicInfo.totalExperience = "7 yrs";
    
    extracted.skills = {
      primarySkills: ["Java", "Spring Boot", "AWS"],
      secondarySkills: ["Docker", "Kubernetes", "PostgreSQL"],
    };
  } else {
    // Generic fallback for any other CV
    extracted.basicInfo.firstName = "John";
    extracted.basicInfo.lastName = "Doe";
    extracted.basicInfo.gender = "Male";
    extracted.basicInfo.designation = "Software Engineer";
    extracted.basicInfo.totalExperience = "3 yrs";
    
    extracted.skills = {
      primarySkills: ["JavaScript", "React"],
      secondarySkills: ["HTML", "CSS"],
    };
    
    extracted.education = {
      degree: "Bachelor of Science",
      institute: "University",
      passingYear: "2021",
      cgpaOrPercentage: "85%",
    };
  }

  // Work Preferences (Default)
  extracted.workPreferences = {
    deploymentType: "Remote",
    availability: "Notice Period",
    engagementType: "C-C",
  };

  // Rate Details (Mocked based on experience somewhat)
  extracted.rateDetails = {
    currency: "INR (₹)",
    rateType: "Monthly",
    rateMin: extracted.basicInfo.totalExperience?.includes("5") ? 100000 : 50000,
    rateMax: extracted.basicInfo.totalExperience?.includes("5") ? 150000 : 80000,
  };

  return extracted;
};
