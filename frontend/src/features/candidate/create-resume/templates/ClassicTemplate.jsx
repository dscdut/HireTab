"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink } from "lucide-react"

export default function ClassicTemplate({
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
    <div className={`${styles.layoutClass} ${styles.fontFamily} max-w-4xl mx-auto p-8 bg-white`}>
      {/* Header Section */}
      <div className="text-center mb-6 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h1 className="text-2xl font-bold tracking-wider mb-2" style={{ color: styles.headerColor }}>
          {resumeData.personalInfo.fullName}
        </h1>
        {resumeData.personalInfo.title && (
          <h2 className="text-lg font-medium text-gray-700 mb-2">
            {resumeData.personalInfo.title}
          </h2>
        )}
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            {resumeData.personalInfo.location} | P: {resumeData.personalInfo.phone} | {resumeData.personalInfo.email}
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs">
            {resumeData.personalInfo.linkedinUrl && (
              <span>LinkedIn: {resumeData.personalInfo.linkedinUrl}</span>
            )}
            {resumeData.personalInfo.githubUrl && (
              <span>GitHub: {resumeData.personalInfo.githubUrl}</span>
            )}
            {resumeData.personalInfo.websiteUrl && (
              <span>Portfolio: {resumeData.personalInfo.websiteUrl}</span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3" style={{ color: styles.headerColor }}>
            Professional Summary
          </h3>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">{resumeData.personalInfo.summary}</p>
        </div>
      )}

      {/* Education Section */}
      <div className="relative group mb-6">
        <button
          onClick={onEditEducation}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3" style={{ color: styles.headerColor }}>
          Education
        </h3>
        <div className="space-y-4">
          {resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 uppercase">{edu.institution}</h4>
                    <p className="text-sm italic text-gray-800">{edu.degree}</p>
                  </div>
                  <div className="text-right">
                    {edu.location && <p className="text-sm italic text-gray-800">{edu.location}</p>}
                    <p className="text-sm italic text-gray-800">
                      {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate || edu.startDate}
                    </p>
                  </div>
                </div>
                {(edu.gpa || edu.relevantCoursework) && (
                  <div className="text-sm text-gray-700 ml-0">
                    {edu.gpa && <p>Cumulative GPA: {edu.gpa}</p>}
                    {edu.relevantCoursework && <p>Relevant Coursework: {edu.relevantCoursework}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No education listed</p>
          )}
        </div>
      </div>

      {/* Work Experience Section */}
      <div className="relative group mb-6">
        <button
          onClick={onEditExperience}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3" style={{ color: styles.headerColor }}>
          Work Experience
        </h3>
        <div className="space-y-4">
          {resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 uppercase">{exp.company}</h4>
                    <p className="text-sm italic text-gray-800">{exp.position}</p>
                  </div>
                  <div className="text-right">
                    {exp.location && <p className="text-sm italic text-gray-800">{exp.location}</p>}
                    <p className="text-sm italic text-gray-800">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                  {Array.isArray(exp.description)
                    ? exp.description.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)
                    : exp.description.split("\n").map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No experience listed</p>
          )}
        </div>
      </div>

      {/* Key Projects Section */}
      <div className="relative group mb-6">
        <button
          onClick={onEditProjects}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3" style={{ color: styles.headerColor }}>
          KEY PROJECTS
        </h3>
        <div className="space-y-4">
          {resumeData.projects.length > 0 ? (
            resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm text-gray-900 uppercase">{project.name}</h4>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                  <li className="leading-relaxed">{project.description}</li>
                  {project.technologies && project.technologies.length > 0 && (
                    <li className="leading-relaxed">Technologies: {project.technologies.join(", ")}</li>
                  )}
                  {project.url && (
                    <li className="leading-relaxed break-all">URL: {project.url}</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No projects listed</p>
          )}
        </div>
      </div>

      {/* Skills and Additional Section */}
      <div className="relative group">
        <button
          onClick={onEditSkills}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-sm font-bold uppercase tracking-wide border-b border-gray-300 pb-1 mb-3" style={{ color: styles.headerColor }}>
          Additional
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          {/* All Skills Categories */}
          {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
            skillList && skillList.length > 0 && (
              <p key={category}>
                <strong>{category}:</strong> {skillList.join("; ")}
              </p>
            )
          ))}
          
          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div className="mt-3">
              <p><strong>Certifications & Training:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                {resumeData.certifications.map((cert, index) => (
                  <li key={cert.id || index}>
                    <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
                    {cert.credentialId && <span className="text-xs text-gray-600"> | ID: {cert.credentialId}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}