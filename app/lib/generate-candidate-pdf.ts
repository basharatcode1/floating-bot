import { jsPDF } from "jspdf";
import { type Candidate, type Requirement } from "@/app/client/submissions/components/SubmissionsHelpers";

/**
 * Sanitizes text for standard WinAnsiEncoding in jsPDF (removes non-Latin1 symbols)
 */
function sanitizePdfText(str?: string | number | null): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/₹/g, "INR ")
    .replace(/[–—]/g, "-")
    .replace(/’/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, "|")
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, " ")
    .trim();
}

/**
 * Helper to parse text into bullet points
 */
const getBullets = (text?: string) => {
  if (!text) return [];
  return text
    .split(/;|\n+|[,.]\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => {
      let s = item.charAt(0).toUpperCase() + item.slice(1);
      if (s.endsWith(".") || s.endsWith(";")) {
        s = s.slice(0, -1);
      }
      return s;
    });
};

/**
 * Generates and downloads a comprehensive PDF report combining Candidate Details and AI Match Report
 */
export function downloadCandidateReportPDF(candidate: Candidate, requirement?: Requirement | null): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 20;

  let currentY = margin;

  // Page numbering and header check
  const checkAddPage = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = margin + 4;
      // Top stripe
      doc.setFillColor(99, 102, 241); // #6366F1
      doc.rect(0, 0, pageWidth, 3, "F");

      // Running header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `Candidate Match Report: ${sanitizePdfText(candidate.name)} | ${sanitizePdfText(candidate.jobTitle)}`,
        margin,
        currentY
      );
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);
      currentY += 9;
    }
  };

  // 1. Top primary brand stripe
  doc.setFillColor(99, 102, 241); // #6366F1
  doc.rect(0, 0, pageWidth, 4, "F");

  // 2. Header Branding
  currentY = 15;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.text("STAFFSYNC", margin, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(99, 102, 241);
  doc.text("AI MATCH & CANDIDATE DOSSIER", pageWidth - margin, currentY, { align: "right" });

  currentY += 3;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // 3. Candidate Summary Header Box
  const headerBoxHeight = 36;
  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, headerBoxHeight, 3, 3, "FD");

  // Candidate Name & Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(sanitizePdfText(candidate.name), margin + 6, currentY + 10);

  doc.setFont("helvetica", "medium");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(sanitizePdfText(candidate.jobTitle), margin + 6, currentY + 17);

  const reqIdStr = requirement ? `REQ-${String(requirement.id).padStart(4, "0")}: ${sanitizePdfText(requirement.title)}` : `REQ-${String(candidate.requirementId).padStart(4, "0")}`;
  doc.setFontSize(8.5);
  doc.setTextColor(99, 102, 241);
  doc.text(reqIdStr, margin + 6, currentY + 23);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Vendor: ${sanitizePdfText(candidate.vendor)}  |  Exp: ${sanitizePdfText(candidate.experience)}  |  Loc: ${sanitizePdfText(candidate.currentLocation)}`,
    margin + 6,
    currentY + 29
  );

  // Score Badge in Header Box
  const scoreBoxX = pageWidth - margin - 38;
  const scoreBoxY = currentY + 5;
  doc.setFillColor(238, 242, 255); // #EEF2FF
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(scoreBoxX, scoreBoxY, 32, 26, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(79, 70, 229);
  doc.text(`${candidate.matchScore}%`, scoreBoxX + 16, scoreBoxY + 12, { align: "center" });

  doc.setFontSize(7.5);
  doc.setTextColor(99, 102, 241);
  doc.text("AI MATCH SCORE", scoreBoxX + 16, scoreBoxY + 19, { align: "center" });

  currentY += headerBoxHeight + 8;

  // 4. Section: AI Match Analysis
  checkAddPage(50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("1. AI Match Analysis & Evaluation", margin, currentY);
  currentY += 6;

  // Score Breakdown Sub-cards
  const breakdownWidth = (contentWidth - 6) / 3;
  const breakdownHeight = 16;
  const scores = [
    { label: "Technical Skills", val: `${candidate.technicalSkillsScore || 32.5} / 40` },
    { label: "Experience Match", val: `${candidate.experienceScore || 31.5} / 40` },
    { label: "Education & Certs", val: `${candidate.educationScore || 30} / 40` },
  ];

  scores.forEach((s, i) => {
    const x = margin + i * (breakdownWidth + 3);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, breakdownWidth, breakdownHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(s.label, x + 4, currentY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(s.val, x + 4, currentY + 12);
  });

  currentY += breakdownHeight + 8;

  // Key Strengths
  const strengths = getBullets(candidate.strengths);
  if (strengths.length > 0) {
    checkAddPage(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(16, 185, 129); // Emerald
    doc.text("Key Strengths:", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    strengths.forEach((st) => {
      const splitText = doc.splitTextToSize(`- ${sanitizePdfText(st)}`, contentWidth - 6);
      checkAddPage(splitText.length * 4.5);
      doc.text(splitText, margin + 2, currentY);
      currentY += splitText.length * 4.5;
    });
    currentY += 3;
  }

  // Improvements / Weaknesses
  const weaknesses = getBullets(candidate.improvements || candidate.weakness);
  if (weaknesses.length > 0) {
    checkAddPage(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(245, 158, 11); // Amber
    doc.text("Areas for Consideration / Gap Analysis:", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    weaknesses.forEach((wk) => {
      const splitText = doc.splitTextToSize(`- ${sanitizePdfText(wk)}`, contentWidth - 6);
      checkAddPage(splitText.length * 4.5);
      doc.text(splitText, margin + 2, currentY);
      currentY += splitText.length * 4.5;
    });
    currentY += 3;
  }

  // Summary / Executive Quote
  if (candidate.summary || candidate.quote) {
    checkAddPage(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(79, 70, 229);
    doc.text("Executive Summary & Match Verdict:", margin, currentY);
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const summaryText = sanitizePdfText(candidate.summary || candidate.quote);
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth - 4);
    checkAddPage(splitSummary.length * 4.5 + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY - 2, contentWidth, splitSummary.length * 4.5 + 4, 2, 2, "FD");

    doc.text(splitSummary, margin + 3, currentY + 3);
    currentY += splitSummary.length * 4.5 + 8;
  }

  // 5. Candidate Profile Details
  checkAddPage(40);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("2. Candidate Overview & Contract Details", margin, currentY);
  currentY += 6;

  const detailsGrid = [
    [
      { label: "Experience:", val: candidate.experience },
      { label: "Location:", val: candidate.currentLocation },
    ],
    [
      { label: "Deployment:", val: candidate.deploymentType || "Remote / Onsite" },
      { label: "Rate Details:", val: candidate.expectedRate || "As per Budget" },
    ],
    [
      { label: "Availability:", val: candidate.availability || "Immediate" },
      { label: "Engagement:", val: candidate.engagement || "C-C" },
    ],
  ];

  const colW = contentWidth / 2;
  detailsGrid.forEach((row) => {
    checkAddPage(7);
    row.forEach((col, idx) => {
      const x = margin + idx * colW;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(col.label, x, currentY);

      doc.setFont("helvetica", "semibold");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizePdfText(col.val), x + 28, currentY);
    });
    currentY += 6;
  });

  currentY += 2;

  // Skills
  if (candidate.skills && candidate.skills.length > 0) {
    checkAddPage(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Primary Skills:", margin, currentY);

    doc.setFont("helvetica", "medium");
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(candidate.skills.map(s => sanitizePdfText(s)).join(", "), margin + 28, currentY);
    currentY += 6;
  }

  if (candidate.secondarySkills && candidate.secondarySkills.length > 0) {
    checkAddPage(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Secondary Skills:", margin, currentY);

    doc.setFont("helvetica", "medium");
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(candidate.secondarySkills.map(s => sanitizePdfText(s)).join(", "), margin + 28, currentY);
    currentY += 8;
  }

  // 6. Work Experience & Projects
  const workList = candidate.workExperience || [
    {
      role: candidate.role || candidate.jobTitle,
      company: candidate.company,
      duration: candidate.duration,
      currentLocation: candidate.currentLocation,
      projects: candidate.projects,
    },
  ];

  if (workList.length > 0) {
    checkAddPage(30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("3. Work Experience & Project History", margin, currentY);
    currentY += 6;

    workList.forEach((exp: any) => {
      checkAddPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sanitizePdfText(exp.role || candidate.jobTitle), margin, currentY);

      doc.setFont("helvetica", "medium");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`${sanitizePdfText(exp.company)} | ${sanitizePdfText(exp.duration)}`, pageWidth - margin, currentY, { align: "right" });
      currentY += 5;

      if (exp.projects && exp.projects.length > 0) {
        exp.projects.forEach((proj: any) => {
          checkAddPage(20);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(99, 102, 241);
          doc.text(`Project: ${sanitizePdfText(proj.projectTitle)}`, margin + 3, currentY);

          if (proj.startDate || proj.endDate) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text(`${sanitizePdfText(proj.startDate)} - ${sanitizePdfText(proj.endDate)}`, pageWidth - margin, currentY, { align: "right" });
          }
          currentY += 4.5;

          doc.setFont("helvetica", "medium");
          doc.setFontSize(8);
          doc.setTextColor(71, 85, 105);
          doc.text(`Role: ${sanitizePdfText(proj.role)}  |  Domain: ${sanitizePdfText(proj.domain)}`, margin + 3, currentY);
          currentY += 4.5;

          if (proj.projectDetails) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            const splitProjDetails = doc.splitTextToSize(sanitizePdfText(proj.projectDetails), contentWidth - 8);
            checkAddPage(splitProjDetails.length * 4);
            doc.text(splitProjDetails, margin + 3, currentY);
            currentY += splitProjDetails.length * 4 + 2;
          }
        });
      }
      currentY += 4;
    });
  }

  // 7. Education & Certifications
  checkAddPage(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("4. Education, Certifications & Achievements", margin, currentY);
  currentY += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Degree:", margin, currentY);
  doc.setFont("helvetica", "semibold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(sanitizePdfText(candidate.degree || "B.Tech in Computer Science"), margin + 28, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text("Institute:", margin + 100, currentY);
  doc.setFont("helvetica", "semibold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${sanitizePdfText(candidate.institute || "IIT")} (${candidate.passingYear || "2018"})`, margin + 120, currentY);
  currentY += 6;

  const certs = candidate.certifications || (candidate.certification ? [candidate.certification] : []);
  if (certs.length > 0) {
    checkAddPage(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Certifications:", margin, currentY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(certs.map(c => sanitizePdfText(c)).join(", "), margin + 28, currentY);
    currentY += 6;
  }

  if (candidate.achievements) {
    checkAddPage(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Achievements:", margin, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitAch = doc.splitTextToSize(sanitizePdfText(candidate.achievements), contentWidth - 28);
    doc.text(splitAch, margin + 28, currentY);
    currentY += splitAch.length * 4 + 4;
  }

  // 8. Vendor Details & Verification
  if (candidate.vendorDetails || candidate.vendor) {
    checkAddPage(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text("5. Vendor Profile & Compliance Verification", margin, currentY);
    currentY += 6;

    const vName = candidate.vendorDetails?.name || candidate.vendor;
    const vHq = candidate.vendorDetails?.hq || "Mumbai, India";
    const vSize = candidate.vendorDetails?.companySize || "51-200";

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Vendor Partner:", margin, currentY);
    doc.setFont("helvetica", "semibold");
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(`${sanitizePdfText(vName)}  (HQ: ${sanitizePdfText(vHq)}, Size: ${sanitizePdfText(vSize)})`, margin + 28, currentY);
    currentY += 6;

    if (candidate.vendorDetails?.ambitionBox || candidate.vendorDetails?.glassdoor) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text("Ratings:", margin, currentY);
      doc.setFont("helvetica", "medium");
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      const ratingsStr = `AmbitionBox: ${candidate.vendorDetails.ambitionBox?.rating || 4.6} / 5  |  Glassdoor: ${candidate.vendorDetails.glassdoor?.rating || 4.5} / 5`;
      doc.text(ratingsStr, margin + 28, currentY);
      currentY += 6;
    }
  }

  // Footer on final page
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated automatically via StaffSync Platform on ${dateStr} | Confidential Document`, margin, pageHeight - 10);

  // Trigger Download
  const cleanName = sanitizePdfText(candidate.name).replace(/\s+/g, "_");
  const fileName = `StaffSync_Candidate_Report_${cleanName}_REQ-${candidate.requirementId}.pdf`;
  doc.save(fileName);
}
