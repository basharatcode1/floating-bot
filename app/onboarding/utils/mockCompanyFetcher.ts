export interface MockCompanyProfile {
  domain: string;
  headquarters: string;
  foundedYear: string;
  companySize: string;
  aboutCompany: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
}

export function fetchMockCompanyProfile(companyName: string, websiteUrl: string): Promise<MockCompanyProfile> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Inferred domain from common keywords or default
      let domain = "Technology / IT Services";
      const nameLower = companyName.toLowerCase();
      if (nameLower.includes("health") || nameLower.includes("med") || nameLower.includes("bio")) {
        domain = "Healthcare & Life Sciences";
      } else if (nameLower.includes("finance") || nameLower.includes("pay") || nameLower.includes("capital") || nameLower.includes("bank")) {
        domain = "Financial Services & Fintech";
      } else if (nameLower.includes("design") || nameLower.includes("media") || nameLower.includes("creative")) {
        domain = "Creative, Media & Entertainment";
      } else if (nameLower.includes("edu") || nameLower.includes("learn") || nameLower.includes("school")) {
        domain = "Education & Edtech";
      }

      // Generate a clean slug for URLs
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      resolve({
        domain,
        headquarters: "Bangalore, Karnataka, India",
        foundedYear: "2021",
        companySize: "51-200 employees",
        aboutCompany: `${companyName} is a premier enterprise solutions provider specializing in comprehensive services within the ${domain} sector. Founded with a commitment to technical excellence and customer success, our organization delivers scalable, secure, and modern digital platforms tailored to evolving business landscapes. With headquarters in Bangalore and distributed engineering teams across major hubs, we partner closely with startups, growth-stage ventures, and Fortune 500 enterprises to accelerate transformation. Our multidisciplinary team combines deep industry expertise, agile execution methodologies, and state-of-the-art technological capabilities to solve mission-critical challenges. We remain dedicated to building long-term collaborative partnerships grounded in transparency, continuous innovation, operational resilience, and measurable business value for global clients worldwide.`,
        linkedinUrl: `https://linkedin.com/company/${slug || "company"}`,
        twitterUrl: `https://twitter.com/${slug || "company"}`,
        instagramUrl: `https://instagram.com/${slug || "company"}`,
      });
    }, 5000); // 5 second simulated network latency
  });
}
