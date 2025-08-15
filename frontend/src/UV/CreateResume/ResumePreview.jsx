"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink, Download } from "lucide-react"
import { useRef } from "react"

export default function ResumePreview({
  resumeData,
  template = "classic",
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
      // Dynamic import để giảm bundle size
      const html2canvas = (await import('html2canvas')).default
      const jsPDF = (await import('jspdf')).jsPDF

      const element = resumeRef.current
      if (!element) return

      // Tạo canvas từ element với cấu hình tối ưu
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: 0,
        width: element.offsetWidth,
        height: element.offsetHeight,
      })

      const imgData = canvas.toDataURL('image/png')

      // Tạo PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10

      // Tính toán kích thước ảnh để fit với trang A4
      const availableWidth = pageWidth - (margin * 2)
      const availableHeight = pageHeight - (margin * 2)

      // Tính tỷ lệ để ảnh vừa với trang
      const imgAspectRatio = canvas.width / canvas.height
      const pageAspectRatio = availableWidth / availableHeight

      let finalWidth, finalHeight

      if (imgAspectRatio > pageAspectRatio) {
        // Ảnh rộng hơn trang, scale theo width
        finalWidth = availableWidth
        finalHeight = availableWidth / imgAspectRatio
      } else {
        // Ảnh cao hơn trang, scale theo height
        finalHeight = availableHeight
        finalWidth = availableHeight * imgAspectRatio
      }

      // Center ảnh trên trang
      const x = (pageWidth - finalWidth) / 2
      const y = (pageHeight - finalHeight) / 2

      // Nếu ảnh vừa với một trang
      if (finalHeight <= availableHeight) {
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight)
      } else {
        // Nếu ảnh quá cao, chia thành nhiều trang
        const imgHeightPerPage = availableHeight
        const imgWidthPerPage = imgHeightPerPage * imgAspectRatio

        let currentY = 0
        let pageCount = 0

        while (currentY < canvas.height) {
          if (pageCount > 0) {
            pdf.addPage()
          }

          // Tạo canvas cho trang hiện tại
          const pageCanvas = document.createElement('canvas')
          pageCanvas.width = canvas.width
          pageCanvas.height = Math.min(canvas.height / finalHeight * imgHeightPerPage * 2, canvas.height - currentY)

          const ctx = pageCanvas.getContext('2d')
          ctx.drawImage(
            canvas,
            0, currentY,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          )

          const pageImgData = pageCanvas.toDataURL('image/png')
          const pageImgHeight = pageCanvas.height / canvas.height * finalHeight

          pdf.addImage(
            pageImgData,
            'PNG',
            margin,
            margin,
            imgWidthPerPage,
            pageImgHeight
          )

          currentY += pageCanvas.height
          pageCount++
        }
      }

      // Tải file
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error)
      // Fallback: sử dụng window.print()
      window.print()
    }
  }

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
          headerStyle: "text-2xl font-light tracking-wide",
          sectionStyle: "text-base font-medium border-l-4 pl-3",
          layoutClass: "space-y-5",
        }
      case "professional":
        return {
          ...baseStyles,
          headerStyle: "text-3xl font-bold uppercase",
          sectionStyle: "text-lg font-bold uppercase border-b-2 pb-2",
          layoutClass: "space-y-6",
        }
      case "technical":
        return {
          ...baseStyles,
          headerStyle: "text-2xl font-mono font-semibold",
          sectionStyle: "text-base font-mono font-semibold bg-gray-100 px-3 py-1",
          layoutClass: "space-y-4",
        }
      case "academic":
        return {
          ...baseStyles,
          headerStyle: "text-3xl font-serif font-normal",
          sectionStyle: "text-lg font-serif font-semibold border-b border-gray-400 pb-1",
          layoutClass: "space-y-7",
        }
      case "minimal":
        return {
          ...baseStyles,
          headerStyle: "text-2xl font-light",
          sectionStyle: "text-sm font-medium uppercase tracking-wider text-gray-500",
          layoutClass: "space-y-8",
        }
      default: // classic
        return {
          ...baseStyles,
          headerStyle: "text-3xl font-bold uppercase tracking-wide",
          sectionStyle: "text-lg font-bold uppercase border-b border-gray-300 pb-1",
          layoutClass: "space-y-6",
        }
    }
  }

  const styles = getTemplateStyles()

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
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>



      <div className="flex-1 p-8 overflow-y-auto">
        <div ref={resumeRef} className={`max-w-4xl mx-auto font-serif ${styles.layoutClass}`}>
          {/* Header Section */}
          <div className="text-center border-b-2 pb-4 relative group" style={{ borderColor: styles.headerColor }}>
            <button
              onClick={onEditPersonalInfo}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>

            <h1 className={styles.headerStyle} style={{ color: styles.headerColor }}>
              {resumeData.personalInfo.fullName}
            </h1>
            <h2 className="text-xl mb-3" style={{ color: styles.textColor }}>
              {resumeData.personalInfo.title}
            </h2>

            {/* Contact Information */}
            <div className="flex justify-center items-center flex-wrap gap-4 text-sm text-gray-700">
              <div className="flex items-center space-x-1">
                <Phone className="w-3 h-3" />
                <span>{resumeData.personalInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span>{resumeData.personalInfo.email}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{resumeData.personalInfo.location}</span>
              </div>
            </div>

            {/* Professional Links */}
            {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl) && (
              <div className="flex justify-center items-center flex-wrap gap-4 mt-2 text-sm text-gray-700">
                {resumeData.personalInfo.linkedinUrl && (
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>LinkedIn: {resumeData.personalInfo.linkedinUrl}</span>
                  </div>
                )}
                {resumeData.personalInfo.githubUrl && (
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>GitHub: {resumeData.personalInfo.githubUrl}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Professional Summary */}
          <div>
            <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
              Professional Summary
            </h3>
            <p className="text-gray-800 leading-relaxed text-justify mt-3">{resumeData.personalInfo.summary}</p>
          </div>

          {/* Core Competencies/Skills */}
          <div className="relative group">
            <button
              onClick={onEditSkills}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>

            <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
              Core Competencies
            </h3>
            <div className="space-y-3 mt-3">
              {Object.entries(resumeData.skills).map(([category, skillList]) => (
                <div key={category}>
                  <h4 className="font-semibold text-gray-800 mb-1">{category}:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {Array.isArray(skillList) ? skillList.join(" • ") : skillList}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Experience */}
          <div className="relative group">
            <button
              onClick={onEditExperience}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>

            <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
              Professional Experience
            </h3>
            <div className="space-y-5 mt-3">
              {resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{exp.position}</h4>
                      <h5 className="font-semibold text-gray-800">{exp.company}</h5>
                      {exp.location && <p className="text-gray-600 text-sm">{exp.location}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {Array.isArray(exp.description)
                      ? exp.description.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))
                      : exp.description.split("\n").map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="relative group">
              <button
                onClick={onEditEducation}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
              >
                <Edit className="w-4 h-4 text-gray-500" />
              </button>

              <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
                Education
              </h3>
              <div className="space-y-3 mt-3">
                {resumeData.education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <h5 className="font-semibold text-gray-800">{edu.institution}</h5>
                        {edu.location && <p className="text-gray-600 text-sm">{edu.location}</p>}
                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                        {edu.relevantCoursework && (
                          <p className="text-gray-600 text-sm">Relevant Coursework: {edu.relevantCoursework}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="relative group">
              <button
                onClick={onEditCertifications}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
              >
                <Edit className="w-4 h-4 text-gray-500" />
              </button>

              <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
                Certifications
              </h3>
              <div className="space-y-2 mt-3">
                {resumeData.certifications.map((cert, index) => (
                  <div key={cert.id || index} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-gray-700">{cert.issuer}</p>
                      {cert.credentialId && <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>}
                    </div>
                    <p className="font-semibold text-gray-800">{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="relative group">
              <button
                onClick={onEditProjects}
                className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
              >
                <Edit className="w-4 h-4 text-gray-500" />
              </button>

              <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
                Key Projects
              </h3>
              <div className="space-y-3 mt-3">
                {resumeData.projects.map((project, index) => (
                  <div key={project.id || index}>
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                    <p className="text-gray-700 mb-1">{project.description}</p>
                    <p className="text-gray-600 text-sm">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                    {project.url && (
                      <p className="text-gray-600 text-sm">
                        <strong>URL:</strong> {project.url}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}