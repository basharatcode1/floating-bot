"use client";

import { useState, useCallback } from "react";
import type { CompanyVerificationResult } from "@/app/onboarding/schemas/types";

/* Simulated company database */
const MOCK_COMPANIES: Record<string, {
  companyName: string;
  headquarters: string;
  foundedYear: string;
  aboutCompany: string;
}> = {
  "22AAAAA0000A1Z5": {
    companyName: "TechVista Solutions Pvt. Ltd.",
    headquarters: "Bangalore, Karnataka",
    foundedYear: "2018",
    aboutCompany:
      "TechVista Solutions is a premier technology consulting firm specializing in cloud infrastructure, modern artificial intelligence, machine learning systems, and enterprise digital transformation. Founded with a mission to deliver resilient engineering and strategic value, we partner with high-growth organizations and global enterprises to craft scalable software architectures. Our team of seasoned software engineers, data architects, and solutions consultants work across agile sprint cycles to modernize legacy applications, optimize distributed cloud spending, and automate mission-critical workflows. Dedicated to transparency, high performance, and continuous product excellence, TechVista empowers corporate clients to accelerate delivery cycles while maintaining rigorous security standards.",
  },
  "27BBBBB1111B2Z6": {
    companyName: "InnovateTech Systems Ltd.",
    headquarters: "Mumbai, Maharashtra",
    foundedYear: "2015",
    aboutCompany:
      "InnovateTech Systems is an established enterprise software engineering company focused on designing next-generation ERP, automated supply chain management, and intelligent CRM platforms. Founded in Mumbai, our multidisciplinary engineering organization delivers robust, secure, and mission-critical cloud applications for global manufacturing and distribution enterprises. We combine advanced systems engineering, cloud-native backend architecture, and user-centric frontend experiences to help industrial clients digitize daily workflows and automate complex reporting pipelines. By maintaining rigorous development standards, automated continuous integration, and strategic technical support, InnovateTech helps modern enterprises reduce operational overhead, maintain regulatory compliance, and unlock sustained commercial growth across diverse competitive international markets.",
  },
};

export function useCompanyVerification() {
  const [verification, setVerification] = useState<CompanyVerificationResult>({
    status: "idle",
  });

  const verify = useCallback(async (identifier: string, type: "gst" | "cin"): Promise<CompanyVerificationResult> => {
    if (!identifier || identifier.length < 5) {
      return { status: "idle" };
    }

    setVerification({ status: "loading" });

    /* Simulate API delay */
    await new Promise((resolve) => setTimeout(resolve, 1800 + Math.random() * 1200));

    const upperIdentifier = identifier.toUpperCase();
    const mockData = MOCK_COMPANIES[upperIdentifier];

    if (mockData) {
      const result: CompanyVerificationResult = {
        status: "success",
        data: mockData,
      };
      setVerification(result);
      return result;
    }

    /* ~40% chance of generic success for unknown identifiers */
    if (Math.random() > 0.6) {
      const result: CompanyVerificationResult = {
        status: "success",
        data: {
          companyName: "Sample Corp Pvt. Ltd.",
          headquarters: "Hyderabad, Telangana",
          foundedYear: "2020",
          aboutCompany:
            "Sample Corp is a forward-thinking technology company committed to engineering innovative, high-impact software solutions across diverse business domains. Headquartered in Hyderabad with modern development facilities, our team designs scalable cloud platforms, responsive enterprise interfaces, and automated data processing tools that solve real-world industry problems. We collaborate closely with forward-looking organizations to accelerate their technological roadmaps, implement modern security practices, and maximize overall operational efficiency. Our engineers and product designers bring disciplined technical expertise, agile project methodologies, and a passion for engineering craft to every client engagement, ensuring dependable long-term outcomes and meaningful value for partners globally.",
        },
      };
      setVerification(result);
      return result;
    }

    const result: CompanyVerificationResult = { status: "error" };
    setVerification(result);
    return result;
  }, []);

  const reset = useCallback(() => {
    setVerification({ status: "idle" });
  }, []);

  return { verification, verify, reset };
}
