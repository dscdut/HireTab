"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink, Linkedin, Github, Globe } from "lucide-react"

export default function ModernTemplate({
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
    <div className="flex min-h-screen bg-white font-sans">
      {/* LEFT SIDEBAR - 1/3 width */}
      <div className="w-1/3 p-8 bg-gray-50 border-r-2" style={{ borderColor: styles.headerColor }}>
        {/* Personal Info Section */}
        <div className="relative group mb-8">
          <button
            onClick={onEditPersonalInfo}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Name and Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-wide mb-2" style={{ color: styles.headerColor }}>
              {resumeData.personalInfo.fullName}
            </h1>
            {resumeData.personalInfo.title && (
              <h2 className="text-lg font-medium" style={{ color: styles.textColor }}>
                {resumeData.personalInfo.title}
              </h2>
            )}
          </div>

          {/* Contact Details with Icons */}
          <div className="space-y-3 text-sm mb-6">
            <h3 className="font-bold uppercase tracking-wide text-xs mb-4" style={{ color: styles.headerColor }}>
              CONTACT DETAILS
            </h3>
            {resumeData.personalInfo.email && (
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800 break-all">{resumeData.personalInfo.email}</span>
              </div>
            )}
            {resumeData.personalInfo.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800">{resumeData.personalInfo.phone}</span>
              </div>
            )}
            {resumeData.personalInfo.location && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800">{resumeData.personalInfo.location}</span>
              </div>
            )}
            {resumeData.personalInfo.linkedinUrl && (
              <div className="flex items-center space-x-3">
                <Linkedin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800 text-xs break-all">{resumeData.personalInfo.linkedinUrl}</span>
              </div>
            )}
            {resumeData.personalInfo.githubUrl && (
              <div className="flex items-center space-x-3">
                <Github className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800 text-xs break-all">{resumeData.personalInfo.githubUrl}</span>
              </div>
            )}
            {resumeData.personalInfo.websiteUrl && (
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-800 text-xs break-all">{resumeData.personalInfo.websiteUrl}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="relative group mb-8">
          <button
            onClick={onEditSkills}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h3 className="font-bold uppercase tracking-wide text-xs mb-4" style={{ color: styles.headerColor }}>
            SKILLS
          </h3>
          <div className="space-y-4">
            {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
              skillList && skillList.length > 0 && (
                <div key={category}>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                  </h4>
                  <ul className="space-y-1">
                    {skillList.map((skill, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: styles.headerColor }}></span>
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Certifications in Sidebar */}
        <div className="relative group">
          <button
            onClick={onEditCertifications}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h3 className="font-bold uppercase tracking-wide text-xs mb-4" style={{ color: styles.headerColor }}>
            CERTIFICATIONS
          </h3>
          <div className="space-y-3">
            {resumeData.certifications.length > 0 ? (
              resumeData.certifications.map((cert, index) => (
                <div key={cert.id || index} className="text-sm">
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-gray-700 text-xs">{cert.issuer}</p>
                  <p className="text-gray-600 text-xs">{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-gray-600 text-xs">ID: {cert.credentialId}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs">No certifications listed</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CONTENT - 2/3 width */}
      <div className="flex-1 bg-white p-8">
        {/* Professional Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-xl font-bold uppercase tracking-wide mb-4 pb-2 border-b-2" 
                style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-800 leading-relaxed text-justify">{resumeData.personalInfo.summary}</p>
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
          <h3 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            PROFESSIONAL EXPERIENCE
          </h3>
          <div className="space-y-6">
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={exp.id || index} className="border-l-4 pl-4" style={{ borderColor: styles.headerColor }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                      <h5 className="text-base font-semibold" style={{ color: styles.textColor }}>
                        {exp.company}{exp.location && ` • ${exp.location}`}
                      </h5>
                    </div>
                    <p className="text-sm font-medium italic text-gray-500 text-right">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    {Array.isArray(exp.description)
                      ? exp.description.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)
                      : exp.description.split("\n").map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No experience listed</p>
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
          <h3 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            EDUCATION
          </h3>
          <div className="space-y-4">
            {resumeData.education.length > 0 ? (
              resumeData.education.map((edu, index) => (
                <div key={edu.id || index} className="border-l-4 pl-4" style={{ borderColor: styles.headerColor }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                      <h5 className="text-base font-semibold" style={{ color: styles.textColor }}>
                        {edu.institution}{edu.location && ` • ${edu.location}`}
                      </h5>
                      {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                      {edu.relevantCoursework && (
                        <p className="text-gray-600 text-sm">Relevant Coursework: {edu.relevantCoursework}</p>
                      )}
                    </div>
                    <p className="text-sm font-medium italic text-gray-500">
                      {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate || edu.startDate}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No education listed</p>
            )}
          </div>
        </div>

        {/* Key Projects */}
        <div className="relative group">
          <button
            onClick={onEditProjects}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h3 className="text-xl font-bold uppercase tracking-wide mb-6 pb-2 border-b-2" 
              style={{ color: styles.headerColor, borderColor: styles.headerColor }}>
            KEY PROJECTS
          </h3>
          <div className="space-y-4">
            {resumeData.projects.length > 0 ? (
              resumeData.projects.map((project, index) => (
                <div key={project.id || index} className="border-l-4 pl-4" style={{ borderColor: styles.headerColor }}>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{project.name}</h4>
                  <p className="text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                  {project.technologies && project.technologies.length > 0 && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                  )}
                  {project.url && (
                    <p className="text-sm text-gray-600">
                      <strong>URL:</strong> <span className="break-all">{project.url}</span>
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600">No projects listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}