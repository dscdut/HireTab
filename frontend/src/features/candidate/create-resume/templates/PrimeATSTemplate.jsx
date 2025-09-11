"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink } from "lucide-react"

export default function PrimeATSTemplate({
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
      <div className="mb-8 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden z-10"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        
        <div>
          <h1 className="text-4xl font-bold mb-2 uppercase" style={{ color: styles.headerColor }}>
            {resumeData.personalInfo.fullName}
          </h1>
          
          {resumeData.personalInfo.title && (
            <h2 className="text-xl font-semibold mb-4 uppercase text-gray-800">
              {resumeData.personalInfo.title}
            </h2>
          )}
          
          {/* Contact Information */}
          <div className="text-sm text-gray-700">
            <div className="flex items-center gap-4 flex-wrap">
              {resumeData.personalInfo.location && (
                <span>{resumeData.personalInfo.location}</span>
              )}
              {resumeData.personalInfo.phone && (
                <span>{resumeData.personalInfo.phone}</span>
              )}
              {resumeData.personalInfo.email && (
                <span>{resumeData.personalInfo.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal line separator */}
      <div className="w-full h-0.5 mb-8" style={{ backgroundColor: styles.headerColor }}></div>

      {/* Summary Section */}
      {resumeData.personalInfo.summary && (
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
            Summary
          </h3>
          <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
          <p className="text-sm text-gray-800 leading-relaxed text-justify">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Professional Experience Section */}
      <div className="relative group mb-8">
        <button
          onClick={onEditExperience}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
          Professional Experience
        </h3>
        <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
        <div className="space-y-6">
          {resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">
                      {exp.position}, {exp.company}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700 text-right">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
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

      {/* Education Section */}
      <div className="relative group mb-8">
        <button
          onClick={onEditEducation}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
          Education
        </h3>
        <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
        <div className="space-y-4">
          {resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-base text-gray-900">{edu.degree}</h4>
                    <p className="text-sm text-gray-700">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">• {edu.gpa}</p>}
                    {edu.relevantCoursework && <p className="text-sm text-gray-600">• {edu.relevantCoursework}</p>}
                  </div>
                  <p className="text-sm text-gray-700 text-right">
                    {edu.startDate && edu.endDate ? `${edu.startDate} — ${edu.endDate}` : edu.endDate || edu.startDate}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No education listed</p>
          )}
        </div>
      </div>

      {/* Technical Skills Section */}
      <div className="relative group mb-8">
        <button
          onClick={onEditSkills}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
          Technical Skills
        </h3>
        <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
        
        {/* Skills in 4 columns grid */}
        <div className="grid grid-cols-4 gap-x-8 gap-y-2 text-sm text-gray-700">
          {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
            skillList && skillList.length > 0 && skillList.map((skill, index) => (
              <div key={`${category}-${index}`} className="text-sm">
                {skill}
              </div>
            ))
          )).flat()}
        </div>
      </div>

      {/* Key Projects Section */}
      <div className="relative group mb-8">
        <button
          onClick={onEditProjects}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
          Key Projects
        </h3>
        <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
        <div className="space-y-4">
          {resumeData.projects.length > 0 ? (
            resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h4 className="font-bold text-base text-gray-900 mb-1">{project.name}</h4>
                <p className="text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                  </p>
                )}
                {project.url && (
                  <p className="text-sm text-gray-600 break-all">
                    <span className="font-semibold">URL:</span> {project.url}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No projects listed</p>
          )}
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="relative group">
        <button
          onClick={onEditCertifications}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold mb-4 uppercase" style={{ color: styles.headerColor }}>
          Additional Information
        </h3>
        <div className="w-full h-0.5 mb-4" style={{ backgroundColor: styles.headerColor }}></div>
        
        <div className="text-sm text-gray-700 space-y-3">
          {/* Languages */}
          <div>
            <span className="font-bold">Languages: </span>
            <span>English, French</span>
          </div>
          
          {/* Certifications */}
          {resumeData.certifications.length > 0 && (
            <div>
              <span className="font-bold">Certificates: </span>
              <span>
                {resumeData.certifications.map((cert, index) => (
                  <span key={cert.id || index}>
                    {cert.name}
                    {index < resumeData.certifications.length - 1 ? ", " : ""}
                  </span>
                ))}
              </span>
            </div>
          )}
          
          {/* Awards/Activities */}
          <div>
            <span className="font-bold">Awards/Activities: </span>
            <span>Most Innovative Employer of the Year (2011), Overall Best Employee Division Two (2009)</span>
          </div>
          
          {/* Professional Links */}
          {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl || resumeData.personalInfo.websiteUrl) && (
            <div>
              <span className="font-bold">Professional Links: </span>
              <div className="flex flex-wrap gap-4 mt-1 text-xs">
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
          )}
        </div>
      </div>
    </div>
  )
}