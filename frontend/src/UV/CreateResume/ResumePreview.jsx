"use client"

import { useRef } from "react"
import { Download } from "lucide-react"
import ModernTemplate from "./templates/ModernTemplate"
import MinimalistTemplate from "./templates/MinimalistTemplate"
import ClassicTemplate from "./templates/ClassicTemplate"

export default function ResumePreview({
  resumeData,
  template = "modern",
  colorScheme = "gray",
  onEditPersonalInfo,
  onEditExperience,
  onEditEducation,
  onEditSkills,
  onEditCertifications,
  onEditProjects,
}) {
  const resumeRef = useRef(null)

  const downloadPDF = async () => {
    try {
        const jsPDF = (await import("jspdf")).jsPDF;
        const html2canvas = (await import("html2canvas")).default;

        const resumeElement = resumeRef.current;

        // Temporarily disable animations and transitions
        const style = document.createElement("style");
        style.innerHTML = `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
        `;
        document.head.appendChild(style);

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20; // 20px margin
        const contentWidth = pageWidth - margin * 2;

        // Render the resume as a canvas
        const canvas = await html2canvas(resumeElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let currentHeight = 0;

        while (currentHeight < imgHeight) {
            if (currentHeight > 0) {
                pdf.addPage();
            }

            const remainingHeight = imgHeight - currentHeight;
            const pageContentHeight = Math.min(remainingHeight, pageHeight - margin * 2);

            // Crop the canvas for the current page
            const pageCanvas = document.createElement("canvas");
            pageCanvas.width = canvas.width;
            pageCanvas.height = (pageContentHeight * canvas.width) / imgWidth;

            const pageCtx = pageCanvas.getContext("2d");
            pageCtx.drawImage(
                canvas,
                0,
                (currentHeight * canvas.width) / imgWidth,
                canvas.width,
                pageCanvas.height,
                0,
                0,
                canvas.width,
                pageCanvas.height
            );

            const pageImgData = pageCanvas.toDataURL("image/png");
            pdf.addImage(pageImgData, "PNG", margin, margin, imgWidth, pageContentHeight);

            currentHeight += pageContentHeight;
        }

        // Cleanup
        document.head.removeChild(style);

        const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
        pdf.save(fileName);
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF. Please try again.");
    }
  };



  const getTemplateStyles = () => {
    const colorSchemes = {
      gray: { primary: "#374151", secondary: "#4B5563", accent: "#111827" },
      blue: { primary: "#2563EB", secondary: "#3B82F6", accent: "#111827" },
      black: { primary: "#111827", secondary: "#374151", accent: "#4B5563" },
      navy: { primary: "#1E3A8A", secondary: "#2563EB", accent: "#111827" },
    }

    const colors = colorSchemes[colorScheme] || colorSchemes.gray

    const baseStyles = {
      headerColor: colors.primary,
      textColor: colors.secondary,
      accentColor: colors.accent,
    }

    switch (template) {
      case "modern":
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-2xl font-bold uppercase tracking-wide",
          sectionStyle: "text-xl font-bold uppercase tracking-wide border-b-2 pb-2",
          layoutClass: "grid grid-cols-3 gap-0",
          sidebarClass: "col-span-1 p-6",
          mainClass: "col-span-2",
        }
      case "minimalist":
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-3xl font-bold",
          sectionStyle: "text-sm font-medium uppercase tracking-wider text-gray-500",
          layoutClass: "space-y-0",
          sidebarClass: "bg-gray-100",
          mainClass: "bg-white",
        }
      case "classic":
        return {
          ...baseStyles,
          fontFamily: "font-serif",
          headerStyle: "text-4xl font-bold text-center",
          sectionStyle: "text-lg font-bold capitalize border-b border-gray-300 pb-1",
          layoutClass: "space-y-8",
          sidebarClass: "",
          mainClass: "",
        }
      default:
        return {
          ...baseStyles,
          fontFamily: "font-sans",
          headerStyle: "text-2xl font-bold uppercase tracking-wide",
          sectionStyle: "text-xl font-bold uppercase tracking-wide border-b-2 pb-2",
          layoutClass: "grid grid-cols-3 gap-0",
          sidebarClass: "col-span-1 p-6",
          mainClass: "col-span-2",
        }
    }
  }

  const styles = getTemplateStyles()

  const renderTemplate = () => {
    const templateProps = {
      resumeData,
      styles,
      onEditPersonalInfo,
      onEditExperience,
      onEditEducation,
      onEditSkills,
      onEditCertifications,
      onEditProjects,
    }

    switch (template) {
      case "modern":
        return <ModernTemplate {...templateProps} />
      case "minimalist":
        return <MinimalistTemplate {...templateProps} />
      case "classic":
        return <ClassicTemplate {...templateProps} />
      default:
        return <ModernTemplate {...templateProps} />
    }
  }

  return (
    <div className="bg-white h-full flex flex-col shadow-md">
      <div className="flex items-center justify-between py-2 px-4 border-b bg-gray-50">
        <h1 className="text-xl font-medium text-gray-800">ATS-Optimized Resume</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Template: {template.charAt(0).toUpperCase() + template.slice(1)}
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            disabled={false}
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        <div ref={resumeRef} className="max-w-4xl mx-auto">
          {/* Add CSS classes for better PDF page breaks */}
          <div className="resume-content">
            {renderTemplate()}
          </div>
        </div>
      </div>
      {/* Remove print-specific styles - handled in downloadPDF function */}
    </div>
  )
}