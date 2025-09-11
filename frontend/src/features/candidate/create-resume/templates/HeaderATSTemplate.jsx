"use client"

import { Edit } from "lucide-react"

export default function HeaderATSTemplate({
  resumeData,
  styles,
  onEditPersonalInfo,
  onEditExperience,
  onEditEducation,
  onEditSkills,
  onEditCertifications,
  onEditProjects,
}) {
  return (
    <div className={`${styles.fontFamily} max-w-4xl mx-auto bg-white`}>
      {/* Header Section with Colored Background */}
      <div className="relative group mb-8">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white hover:bg-opacity-20 rounded print:hidden z-10"
        >
          <Edit className="w-4 h-4 text-white" />
        </button>
        <div 
          className="rounded-lg p-8 text-white"
          style={{ backgroundColor: styles.headerColor }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Left - Name and Title */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-light mb-2 leading-tight">
                {resumeData.personalInfo.fullName}
              </h1>
              {resumeData.personalInfo.title && (
                <h2 className="text-xl font-normal text-white text-opacity-90 mb-4">
                  {resumeData.personalInfo.title}
                </h2>
              )}
              {/* Professional Summary on Header */}
              {resumeData.personalInfo.summary && (
                <p className="text-sm text-white text-opacity-90 leading-relaxed">
                  {resumeData.personalInfo.summary}
                </p>
              )}
            </div>
            
            {/* Right - Contact Info */}
            <div className="text-sm space-y-2">
              {resumeData.personalInfo.email && (
                <div>{resumeData.personalInfo.email}</div>
              )}
              {resumeData.personalInfo.phone && (
                <div>{resumeData.personalInfo.phone}</div>
              )}
              {resumeData.personalInfo.location && (
                <div>{resumeData.personalInfo.location}</div>
              )}
              
              {/* Links */}
              {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl || resumeData.personalInfo.websiteUrl) && (
                <div className="mt-3 text-xs space-y-1 text-white text-opacity-80">
                  {resumeData.personalInfo.linkedinUrl && (
                    <div className="break-all">{resumeData.personalInfo.linkedinUrl}</div>
                  )}
                  {resumeData.personalInfo.githubUrl && (
                    <div className="break-all">{resumeData.personalInfo.githubUrl}</div>
                  )}
                  {resumeData.personalInfo.websiteUrl && (
                    <div className="break-all">{resumeData.personalInfo.websiteUrl}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8">
        {/* Professional Experience */}
        <div className="relative group mb-8">
          <button
            onClick={onEditExperience}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            Professional Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <h4 className="text-base font-medium" style={{ color: styles.headerColor }}>
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </h4>
                    </div>
                    <div className="text-gray-600 font-medium text-sm">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </div>
                  </div>
                  <ul className="list-disc ml-6 space-y-2 text-gray-700">
                    {Array.isArray(exp.description)
                      ? exp.description.map((item, i) => (
                          <li key={i} className="leading-relaxed">{item}</li>
                        ))
                      : exp.description.split("\n").map((item, i) => (
                          <li key={i} className="leading-relaxed">{item}</li>
                        ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No experience listed</p>
            )}
          </div>
        </div>

        {/* Key Projects */}
        <div className="relative group mb-8">
          <button
            onClick={onEditProjects}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            Key Projects
          </h2>
          <div className="space-y-6">
            {resumeData.projects.length > 0 ? (
              resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-700 mb-3 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                  )}
                  {project.url && (
                    <p className="text-sm text-gray-600 break-all">
                      <strong>URL:</strong> {project.url}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No projects listed</p>
            )}
          </div>
        </div>

        {/* Education */}
        <div className="relative group mb-8">
          <button
            onClick={onEditEducation}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.length > 0 ? (
              resumeData.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.degree}
                      </h3>
                      <h4 className="font-medium" style={{ color: styles.headerColor }}>
                        {edu.institution}{edu.location && `, ${edu.location}`}
                      </h4>
                      {edu.gpa && (
                        <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                      )}
                      {edu.relevantCoursework && (
                        <p className="text-gray-600 text-sm">Relevant Coursework: {edu.relevantCoursework}</p>
                      )}
                    </div>
                    <div className="text-gray-600 font-medium text-sm">
                      {edu.startDate && edu.endDate ? `${edu.startDate} — ${edu.endDate}` : edu.endDate || edu.startDate}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No education listed</p>
            )}
          </div>
        </div>

        {/* Skills & Competencies */}
        <div className="relative group mb-8">
          <button
            onClick={onEditSkills}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            Skills & Competencies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
              skillList && skillList.length > 0 && (
                <div key={category}>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {skillList.join(" • ")}
                  </p>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Certifications & Training */}
        <div className="relative group">
          <button
            onClick={onEditCertifications}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-medium mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            Certifications & Training
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resumeData.certifications.length > 0 ? (
              resumeData.certifications.map((cert, index) => (
                <div key={cert.id || index} className="border-l-4 pl-4" style={{ borderColor: styles.headerColor }}>
                  <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                  <p className="text-gray-700 text-sm">{cert.issuer}</p>
                  <p className="text-gray-600 text-xs">{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-gray-600 text-xs">ID: {cert.credentialId}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No certifications listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}