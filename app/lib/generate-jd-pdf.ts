import { jsPDF } from "jspdf";
import { formatRateRange } from "./rate-format";

export interface JDRequirementData {
  id: number | string;
  title: string;
  location?: string;
  type?: string;
  date?: string;
  timezone?: string;
  skills: string[];
  secondarySkills?: string[];
  experience?: string;
  certificates?: string[];
  certificate?: string;
  jdLink?: string;
  budget?: string;
  budgetType?: "Hourly" | "Monthly" | "Daywise" | string;
  positions?: number;
  candidates?: number;
  status?: "Active" | "On Hold" | "Closed" | string;
  interviewRounds?: number;
  education?: string;
  duration?: string;
  industry?: string;
  startDate?: string;
  description?: string;
  jd_summary?: string;
  complianceRequirements?: {
    complianceStatus?: string;
    complianceCertifications?: string[];
    legalRegistrationDocs?: string[];
    insuranceRequirements?: string[];
    companyCertifications?: string[];
  };
}

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
 * Generates and triggers download of a polished, enterprise-grade JD PDF document
 */
export function downloadJDPDF(req: JDRequirementData): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const bottomMargin = 22;

  let currentY = margin;

  // Helper for adding a new page with top accent
  const checkAddPage = (neededHeight: number) => {
    if (currentY + neededHeight > pageHeight - bottomMargin) {
      doc.addPage();
      currentY = margin + 4;
      // Minimal page 2+ running header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, pageWidth, 3, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(
        `StaffSync Requisition - REQ-${String(req.id).padStart(4, "0")} | ${sanitizePdfText(req.title)}`,
        margin,
        currentY,
      );
      currentY += 8;
    }
  };

  // 1. Top primary brand stripe
  doc.setFillColor(37, 99, 235); // #2563EB Brand Blue
  doc.rect(0, 0, pageWidth, 3.5, "F");

  // 2. Header Branding
  currentY = 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // #0F172A
  doc.text("STAFFSYNC", margin, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139); // #64748B
  doc.text("ENTERPRISE TALENT ACQUISITION PLATFORM", margin, currentY + 4.5);

  // Right side badges: REQ ID & Status
  const reqCode = `REQ-${String(req.id).padStart(4, "0")}`;
  const reqBadgeW = 24;
  const reqBadgeH = 6.5;
  const reqBadgeX = pageWidth - margin - reqBadgeW;
  const reqBadgeY = 10.5;

  doc.setFillColor(239, 246, 255); // #EFF6FF
  doc.setDrawColor(191, 219, 254); // #BFDBFE
  doc.setLineWidth(0.3);
  doc.roundedRect(reqBadgeX, reqBadgeY, reqBadgeW, reqBadgeH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(29, 78, 216); // #1D4ED8
  doc.text(reqCode, reqBadgeX + reqBadgeW / 2, reqBadgeY + 4.5, {
    align: "center",
  });

  // Status Badge
  const statusStr = sanitizePdfText(req.status || "Active").toUpperCase();
  const statusW = 20;
  const statusH = 6.5;
  const statusX = reqBadgeX - statusW - 3;
  const statusY = reqBadgeY;

  let statusBg = [220, 252, 231]; // Green
  let statusBorder = [134, 239, 172];
  let statusTextCol = [21, 128, 61];

  if (statusStr.includes("HOLD")) {
    statusBg = [254, 243, 199];
    statusBorder = [253, 230, 138];
    statusTextCol = [180, 83, 9];
  } else if (statusStr.includes("CLOSE")) {
    statusBg = [254, 226, 226];
    statusBorder = [252, 165, 165];
    statusTextCol = [185, 28, 28];
  }

  doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
  doc.setDrawColor(statusBorder[0], statusBorder[1], statusBorder[2]);
  doc.roundedRect(statusX, statusY, statusW, statusH, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(statusTextCol[0], statusTextCol[1], statusTextCol[2]);
  doc.text(statusStr, statusX + statusW / 2, statusY + 4.5, {
    align: "center",
  });

  // Date / Generated indicator
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  const dateStr = `Exported: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  doc.text(dateStr, pageWidth - margin, reqBadgeY + 11.5, { align: "right" });

  // Divider line
  currentY = 25;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);

  // 3. Job Title & Meta
  currentY += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(37, 99, 235);
  doc.text("JOB SPECIFICATION & REQUIREMENT", margin, currentY);

  currentY += 6;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(sanitizePdfText(req.title), margin, currentY);

  currentY += 5.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const metaParts: string[] = [];
  if (req.location) metaParts.push(`Location: ${sanitizePdfText(req.location)}`);
  if (req.type) metaParts.push(`Type: ${sanitizePdfText(req.type)}`);
  if (req.timezone) metaParts.push(`Timezone: ${sanitizePdfText(req.timezone)}`);
  if (req.date) metaParts.push(`Posted: ${sanitizePdfText(req.date)}`);
  if (req.candidates !== undefined)
    metaParts.push(`${req.candidates} Candidates`);

  doc.text(metaParts.join("   |   "), margin, currentY);

  // 4. Quick Highlights Grid Card
  currentY += 6;
  const gridY = currentY;
  const gridHeight = 33;

  doc.setFillColor(248, 250, 252); // #F8FAFC
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, gridY, contentWidth, gridHeight, 2, 2, "FD");

  // Format budget
  let formattedBudget = "Not Specified";
  if (req.budget) {
    try {
      formattedBudget = sanitizePdfText(
        formatRateRange({
          amount: req.budget,
          period: req.budgetType,
        }),
      );
    } catch {
      formattedBudget = sanitizePdfText(req.budget);
    }
  }

  const gridItems = [
    {
      label: "EXPERIENCE",
      val: sanitizePdfText(req.experience || "Not Specified"),
    },
    { label: "BUDGET / RATE", val: formattedBudget },
    {
      label: "OPEN POSITIONS",
      val: `${req.positions || 1} ${req.positions === 1 ? "Opening" : "Openings"}`,
    },
    {
      label: "INTERVIEW PROCESS",
      val: `${req.interviewRounds || 3} Rounds`,
    },
    {
      label: "EDUCATION",
      val: sanitizePdfText(req.education || "Bachelor's in CS / IT"),
    },
    {
      label: "PROJECT TIMELINE",
      val: sanitizePdfText(req.duration || "12 Months"),
    },
    {
      label: "EXPECTED START",
      val: sanitizePdfText(req.startDate || "Immediate / 1 April 2026"),
    },
    {
      label: "INDUSTRY",
      val: sanitizePdfText(req.industry || "IT & Software"),
    },
  ];

  const colW = contentWidth / 4;
  gridItems.forEach((item, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const itemX = margin + col * colW + 4;
    const itemY = gridY + 6.5 + row * 14;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(item.label, itemX, itemY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    // Truncate if too long for column
    const valLines = doc.splitTextToSize(item.val, colW - 6);
    doc.text(valLines[0] || "", itemX, itemY + 4.5);
  });

  currentY = gridY + gridHeight + 7;

  // 5. About the Role
  checkAddPage(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("About the Role", margin, currentY);

  currentY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  const roleText =
    req.description || req.jd_summary
      ? sanitizePdfText(req.description || req.jd_summary)
      : `We are looking for a highly skilled ${sanitizePdfText(req.title)} to join our dynamic team. ` +
        `The ideal candidate will possess deep domain expertise, solid architectural principles, and a strong track record ` +
        `of delivering robust, scalable, and high-performance solutions. You will collaborate with cross-functional product and engineering teams ` +
        `to design, implement, and maintain mission-critical software systems while adhering to enterprise code quality and security standards.`;

  const aboutLines = doc.splitTextToSize(roleText, contentWidth);
  doc.text(aboutLines, margin, currentY);
  currentY += aboutLines.length * 4.2 + 6;

  // Helper to render skill pills
  const renderSkillPills = (
    title: string,
    skills: string[],
    theme: "primary" | "secondary",
  ) => {
    if (!skills || skills.length === 0) return;
    checkAddPage(20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin, currentY);
    currentY += 4.5;

    let pillX = margin;
    let pillY = currentY;
    const pillH = 5.8;
    const paddingX = 3.5;

    skills.forEach((skill) => {
      const sanitized = sanitizePdfText(skill);
      if (!sanitized) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const textW = doc.getTextWidth(sanitized);
      const pillW = textW + paddingX * 2;

      // Wrap to next line if overflowing
      if (pillX + pillW > pageWidth - margin) {
        pillX = margin;
        pillY += pillH + 2;
        if (pillY + pillH > pageHeight - bottomMargin) {
          doc.addPage();
          pillY = margin + 8;
          currentY = pillY;
        }
      }

      if (theme === "primary") {
        doc.setFillColor(239, 246, 255); // #EFF6FF
        doc.setDrawColor(191, 219, 254); // #BFDBFE
        doc.setLineWidth(0.2);
        doc.roundedRect(pillX, pillY, pillW, pillH, 1.2, 1.2, "FD");

        doc.setTextColor(29, 78, 216); // #1D4ED8
      } else {
        doc.setFillColor(241, 245, 249); // #F1F5F9
        doc.setDrawColor(203, 213, 225); // #CBD5E1
        doc.setLineWidth(0.2);
        doc.roundedRect(pillX, pillY, pillW, pillH, 1.2, 1.2, "FD");

        doc.setTextColor(51, 65, 85); // #334155
      }

      doc.text(sanitized, pillX + paddingX, pillY + 4);
      pillX += pillW + 2.5;
    });

    currentY = pillY + pillH + 6;
  };

  // 6. Primary & Secondary Skills
  renderSkillPills("Primary Skills & Competencies", req.skills, "primary");

  if (req.secondarySkills && req.secondarySkills.length > 0) {
    renderSkillPills(
      "Secondary / Desirable Skills",
      req.secondarySkills,
      "secondary",
    );
  }

  // 7. Certifications
  const certs =
    req.certificates && req.certificates.length > 0
      ? req.certificates
      : req.certificate
        ? [req.certificate]
        : [];

  if (certs.length > 0 && certs[0] !== "None") {
    checkAddPage(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Required Certifications", margin, currentY);
    currentY += 4.5;

    let certX = margin;
    let certY = currentY;
    const certH = 5.8;

    certs.forEach((cert) => {
      const sanitized = sanitizePdfText(cert);
      if (!sanitized) return;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      const textW = doc.getTextWidth(sanitized);
      const certW = textW + 7;

      if (certX + certW > pageWidth - margin) {
        certX = margin;
        certY += certH + 2;
      }

      doc.setFillColor(236, 253, 245); // #ECFDF5 emerald-50
      doc.setDrawColor(167, 243, 208); // #A7F3D0 emerald-200
      doc.setLineWidth(0.2);
      doc.roundedRect(certX, certY, certW, certH, 1.2, 1.2, "FD");

      doc.setTextColor(6, 95, 70); // #065F46 emerald-800
      doc.text(sanitized, certX + 3.5, certY + 4);
      certX += certW + 2.5;
    });

    currentY = certY + certH + 6;
  }

  // 8. Compliance & Insurance Section
  if (req.complianceRequirements) {
    const { legalRegistrationDocs, insuranceRequirements, companyCertifications } =
      req.complianceRequirements;

    const hasCompliance =
      (legalRegistrationDocs && legalRegistrationDocs.length > 0) ||
      (insuranceRequirements && insuranceRequirements.length > 0) ||
      (companyCertifications && companyCertifications.length > 0);

    if (hasCompliance) {
      checkAddPage(38);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text("Compliance & Insurance Verification", margin, currentY);
      currentY += 4.5;

      const compBoxY = currentY;
      const compBoxH = 26;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, compBoxY, contentWidth, compBoxH, 2, 2, "FD");

      const compColW = contentWidth / 3;

      const sections = [
        {
          title: "LEGAL & TAX DOCUMENTS",
          items: legalRegistrationDocs || [],
        },
        {
          title: "INSURANCE REQUIREMENTS",
          items: insuranceRequirements || [],
        },
        {
          title: "COMPANY CERTIFICATIONS",
          items: companyCertifications || [],
        },
      ];

      sections.forEach((sec, sIdx) => {
        const secX = margin + sIdx * compColW + 4;
        let secY = compBoxY + 5;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(100, 116, 139);
        doc.text(sec.title, secX, secY);

        secY += 4.5;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7.5);
        doc.setTextColor(15, 23, 42);

        sec.items.forEach((itemText) => {
          const itemSan = sanitizePdfText(itemText);
          if (itemSan) {
            doc.text(`- ${itemSan}`, secX, secY);
            secY += 3.8;
          }
        });
      });

      currentY = compBoxY + compBoxH + 6;
    }
  }

  // 9. Requisition Terms / Disclaimer Notice
  checkAddPage(18);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 14, 1.5, 1.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text("CONFIDENTIALITY & SUBMISSION NOTICE", margin + 3.5, currentY + 4.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  const noticeLines = doc.splitTextToSize(
    "This job requisition contains confidential and proprietary information of the client and StaffSync. Candidate profiles must be submitted exclusively through the StaffSync platform adhering to standard compliance guidelines.",
    contentWidth - 7,
  );
  doc.text(noticeLines, margin + 3.5, currentY + 8.5);

  // 10. Stamp Footer onto every page
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    const footY = pageHeight - 12;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footY - 3, pageWidth - margin, footY - 3);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184); // #94A3B8
    doc.text(
      "StaffSync Enterprise Platform  |  Official Requisition Document  |  Strictly Confidential",
      margin,
      footY,
    );

    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - margin,
      footY,
      { align: "right" },
    );
  }

  // 11. Trigger Download
  const cleanTitle = sanitizePdfText(req.title)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-");
  const fileName = `StaffSync-JD-REQ-${String(req.id).padStart(4, "0")}-${cleanTitle || "Requirement"}.pdf`;

  doc.save(fileName);
}
