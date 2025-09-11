"use client"

import { Edit } from "lucide-react"

export default function PureATSTemplate({
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
    <div className={`${styles.fontFamily} max-w-4xl mx-auto p-8 bg-white text-black`}>
      {/* Header Section */}
      <div className="text-center mb-8 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        
        <h1 className="text-3xl font-bold mb-2 text-black">
          {resumeData.personalInfo.fullName}
        </h1>
        
        {resumeData.personalInfo.title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {resumeData.personalInfo.title}
          </h2>
        )}
        
        {/* Contact Information */}
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            {resumeData.personalInfo.location} | {resumeData.personalInfo.phone} | {resumeData.personalInfo.email}
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs">
            {resumeData.personalInfo.linkedinUrl && (
              <span>{resumeData.personalInfo.linkedinUrl}</span>
            )}
            {resumeData.personalInfo.githubUrl && (
              <span>{resumeData.personalInfo.githubUrl}</span>
            )}
            {resumeData.personalInfo.websiteUrl && (
              <span>{resumeData.personalInfo.websiteUrl}</span>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {resumeData.personalInfo.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-3 text-black border-b border-black pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-black leading-relaxed text-justify">
            {resumeData.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      <div className="relative group mb-8">
        <button
          onClick={onEditExperience}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
          Professional Experience
        </h2>
        <div className="space-y-6">
          {resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-black">{exp.company}, {exp.position}</h3>
                    {exp.location && (
                      <p className="text-sm text-black">{exp.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-black font-medium">
                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-black ml-4">
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
            <p className="text-gray-600 text-sm">No experience listed</p>
          )}
        </div>
      </div>

      {/* Consultancy Section (if applicable) */}
      {resumeData.consultancy && resumeData.consultancy.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
            Consultancy
          </h2>
          <div className="space-y-4">
            {resumeData.consultancy.map((cons, index) => (
              <div key={cons.id || index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-black">{cons.company}, {cons.position}</h3>
                    {cons.location && (
                      <p className="text-sm text-black">{cons.location}</p>
                    )}
                  </div>
                  <p className="text-sm text-black font-medium">
                    {cons.startDate} — {cons.current ? "Present" : cons.endDate}
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-sm text-black ml-4">
                  {Array.isArray(cons.description)
                    ? cons.description.map((item, i) => (
                        <li key={i} className="leading-relaxed">{item}</li>
                      ))
                    : cons.description.split("\n").map((item, i) => (
                        <li key={i} className="leading-relaxed">{item}</li>
                      ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="relative group mb-8">
        <button
          onClick={onEditEducation}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
          Education
        </h2>
        <div className="space-y-4">
          {resumeData.education.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-black">{edu.degree}, {edu.institution}</h3>
                    {edu.location && (
                      <p className="text-sm text-black">{edu.location}</p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-black">GPA: {edu.gpa}</p>
                    )}
                    {edu.relevantCoursework && (
                      <p className="text-sm text-black">Relevant Coursework: {edu.relevantCoursework}</p>
                    )}
                  </div>
                  <p className="text-sm text-black font-medium">
                    {edu.startDate && edu.endDate 
                      ? `${edu.startDate} - ${edu.endDate}` 
                      : edu.endDate || edu.startDate}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No education listed</p>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="relative group mb-8">
        <button
          onClick={onEditProjects}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
          Key Projects
        </h2>
        <div className="space-y-4">
          {resumeData.projects.length > 0 ? (
            resumeData.projects.map((project, index) => (
              <div key={project.id || index}>
                <h3 className="font-bold text-black mb-1">{project.name}</h3>
                <p className="text-sm text-black mb-2 leading-relaxed">{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-sm text-black mb-1">
                    <strong>Technologies:</strong> {project.technologies.join(", ")}
                  </p>
                )}
                {project.url && (
                  <p className="text-sm text-black break-all">
                    <strong>URL:</strong> {project.url}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No projects listed</p>
          )}
        </div>
      </div>

      {/* Expert-Level Skills */}
      <div className="relative group mb-8">
        <button
          onClick={onEditSkills}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
          Expert-Level Skills
        </h2>
        <div className="space-y-3">
          {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
            skillList && skillList.length > 0 && (
              <div key={category}>
                <p className="text-sm text-black">
                  <strong>
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}:
                  </strong>{" "}
                  {skillList.join(", ")}
                </p>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="relative group">
        <button
          onClick={onEditCertifications}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h2 className="text-lg font-bold mb-4 text-black border-b border-black pb-1">
          Certifications & Training
        </h2>
        <div className="space-y-2">
          {resumeData.certifications.length > 0 ? (
            resumeData.certifications.map((cert, index) => (
              <div key={cert.id || index} className="text-sm text-black">
                <p>
                  <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
                  {cert.credentialId && (
                    <span className="text-gray-600"> | ID: {cert.credentialId}</span>
                  )}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No certifications listed</p>
          )}
        </div>
      </div>
    </div>
  )
}