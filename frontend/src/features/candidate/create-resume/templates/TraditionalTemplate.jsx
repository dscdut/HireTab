"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink } from "lucide-react"

export default function TraditionalTemplate({
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
    <div className={`${styles.layoutClass} ${styles.fontFamily} max-w-4xl mx-auto p-8 bg-white font-serif`}>
      {/* Header Section */}
      <div className="text-center mb-8 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        
        <h1 className="text-4xl font-bold mb-2" style={{ color: styles.headerColor }}>
          {resumeData.personalInfo.fullName}
        </h1>
        
        {resumeData.personalInfo.title && (
          <h2 className="text-xl italic mb-4 text-gray-700">
            {resumeData.personalInfo.title}
          </h2>
        )}
        
        {/* Contact Information in horizontal line */}
        <div className="text-sm text-gray-700 mb-2">
          <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-1">
            {resumeData.personalInfo.location && (
              <span>{resumeData.personalInfo.location}</span>
            )}
            {resumeData.personalInfo.phone && (
              <span>Phone: {resumeData.personalInfo.phone}</span>
            )}
            {resumeData.personalInfo.email && (
              <span>{resumeData.personalInfo.email}</span>
            )}
          </div>
          
          {/* Links on separate line */}
          {(resumeData.personalInfo.linkedinUrl || resumeData.personalInfo.githubUrl || resumeData.personalInfo.websiteUrl) && (
            <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-1 mt-2 text-xs">
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
          )}
        </div>
        
        {/* Decorative line */}
        <div className="w-full h-px bg-black mt-4"></div>
      </div>

      {/* Profile Section */}
      {resumeData.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="text-lg font-bold text-center mb-3 uppercase" style={{ color: styles.headerColor }}>
            Profile
          </h3>
          <p className="text-sm text-gray-800 leading-relaxed text-justify italic">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Employment History Section */}
      <div className="relative group mb-6">
        <button
          onClick={onEditExperience}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold text-center mb-4 uppercase" style={{ color: styles.headerColor }}>
          Employment History
        </h3>
        <div className="space-y-4">
          {resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-base" style={{ color: styles.headerColor }}>
                      {exp.position}, {exp.company}
                    </h4>
                    {exp.location && (
                      <p className="text-sm italic text-gray-700">{exp.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 text-right">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-800 ml-0">
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
      <div className="relative group mb-6">
        <button
          onClick={onEditEducation}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold text-center mb-4 uppercase" style={{ color: styles.headerColor }}>
          Education
        </h3>
        <div className="space-y-4">
          {resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4 className="font-bold text-base" style={{ color: styles.headerColor }}>
                      {edu.degree}
                    </h4>
                    <p className="text-sm italic text-gray-700">
                      {edu.institution}{edu.location && `, ${edu.location}`}
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 text-right">
                    {edu.startDate && edu.endDate ? `${edu.startDate} — ${edu.endDate}` : edu.endDate || edu.startDate}
                  </p>
                </div>
                {(edu.gpa || edu.relevantCoursework) && (
                  <div className="text-sm text-gray-700 ml-0">
                    {edu.gpa && <p>GPA: {edu.gpa}</p>}
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

      {/* Skills Section */}
      <div className="relative group mb-6">
        <button
          onClick={onEditSkills}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold text-center mb-4 uppercase" style={{ color: styles.headerColor }}>
          Skills
        </h3>
        <div className="text-sm text-gray-700 space-y-2">
          {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
            skillList && skillList.length > 0 && (
              <div key={category} className="flex">
                <span className="font-semibold min-w-[140px]" style={{ color: styles.headerColor }}>
                  {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}:
                </span>
                <span className="flex-1">{skillList.join(", ")}</span>
              </div>
            )
          ))}
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
        <h3 className="text-lg font-bold text-center mb-4 uppercase" style={{ color: styles.headerColor }}>
          Key Projects
        </h3>
        <div className="space-y-4">
          {resumeData.projects.length > 0 ? (
            resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h4 className="font-bold text-base mb-1" style={{ color: styles.headerColor }}>
                  {project.name}
                </h4>
                <p className="text-sm text-gray-800 mb-2 leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Technologies:</span> {project.technologies.join(", ")}
                  </p>
                )}
                {project.url && (
                  <p className="text-sm text-gray-700 break-all">
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

      {/* Internships & Certifications Section */}
      <div className="relative group">
        <button
          onClick={onEditCertifications}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className="text-lg font-bold text-center mb-4 uppercase" style={{ color: styles.headerColor }}>
          Certifications
        </h3>
        <div className="space-y-3">
          {resumeData.certifications.length > 0 ? (
            resumeData.certifications.map((cert, index) => (
              <div key={cert.id || index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-base" style={{ color: styles.headerColor }}>
                      {cert.name}
                    </h4>
                    <p className="text-sm italic text-gray-700">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-sm text-gray-600">Credential ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{cert.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No certifications listed</p>
          )}
        </div>
      </div>

      {/* References Section Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <h3 className="text-lg font-bold text-center uppercase" style={{ color: styles.headerColor }}>
          References
        </h3>
        <p className="text-sm text-gray-700 text-center mt-2 italic">
          Available upon request
        </p>
      </div>
    </div>
  )
}