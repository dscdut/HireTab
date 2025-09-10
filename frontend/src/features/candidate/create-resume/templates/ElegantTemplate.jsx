"use client"

import { Edit, MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react"

export default function ElegantTemplate({
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
    <div className={`${styles.fontFamily} max-w-5xl mx-auto bg-white flex`}>
      {/* LEFT MAIN CONTENT - 70% width */}
      <div className="flex-[7] p-8 pr-6">
        {/* Header Section */}
        <div className="flex items-start space-x-6 mb-8 relative group">
          <button
            onClick={onEditPersonalInfo}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden z-10"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          
          {/* Name and Contact */}
          <div className="flex-1">
            <h1 className="text-4xl font-light mb-2" style={{ color: styles.headerColor }}>
              {resumeData.personalInfo.fullName}
            </h1>
            {resumeData.personalInfo.title && (
              <h2 className="text-xl text-gray-600 mb-4 font-light">
                {resumeData.personalInfo.title}
              </h2>
            )}
            
            {/* Contact Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex flex-wrap gap-4">
                {resumeData.personalInfo.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{resumeData.personalInfo.location}</span>
                  </div>
                )}
              </div>
              
              {/* Links */}
              <div className="flex flex-wrap gap-3 text-xs">
                {resumeData.personalInfo.linkedinUrl && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="w-3 h-3 text-gray-500" />
                    <span className="break-all">{resumeData.personalInfo.linkedinUrl}</span>
                  </div>
                )}
                {resumeData.personalInfo.githubUrl && (
                  <div className="flex items-center space-x-1">
                    <Github className="w-3 h-3 text-gray-500" />
                    <span className="break-all">{resumeData.personalInfo.githubUrl}</span>
                  </div>
                )}
                {resumeData.personalInfo.websiteUrl && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-gray-500" />
                    <span className="break-all">{resumeData.personalInfo.websiteUrl}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {resumeData.personalInfo.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-light mb-4" style={{ color: styles.headerColor }}>
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">
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
          <h2 className="text-2xl font-light mb-6" style={{ color: styles.headerColor }}>
            Professional Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.length > 0 ? (
              resumeData.experience.map((exp, index) => (
                <div key={exp.id || index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-medium" style={{ color: styles.headerColor }}>
                        {exp.position}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-600 font-medium">
                      <p>{exp.startDate} — {exp.current ? "Present" : exp.endDate}</p>
                    </div>
                  </div>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
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
        <div className="relative group">
          <button
            onClick={onEditProjects}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-2xl font-light mb-6" style={{ color: styles.headerColor }}>
            Key Projects
          </h2>
          <div className="space-y-6">
            {resumeData.projects.length > 0 ? (
              resumeData.projects.map((project, index) => (
                <div key={project.id || index}>
                  <h3 className="text-lg font-medium mb-2" style={{ color: styles.headerColor }}>
                    {project.name}
                  </h3>
                  <p className="text-gray-700 mb-2 leading-relaxed">{project.description}</p>
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
      </div>

      {/* RIGHT SIDEBAR - 30% width */}
      <div className="flex-[3] bg-gray-50 p-6 border-l">
        {/* Education */}
        <div className="relative group mb-8">
          <button
            onClick={onEditEducation}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-xl font-light mb-4" style={{ color: styles.headerColor }}>
            Education
          </h2>
          <div className="space-y-4">
            {resumeData.education.length > 0 ? (
              resumeData.education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div>
                    <h3 className="text-sm font-medium leading-tight" style={{ color: styles.headerColor }}>
                      {edu.degree}
                    </h3>
                    <p className="text-gray-700 font-medium text-sm">{edu.institution}</p>
                    {edu.location && (
                      <p className="text-gray-600 text-xs">{edu.location}</p>
                    )}
                    <p className="text-gray-600 text-xs">
                      {edu.startDate && edu.endDate 
                        ? `${edu.startDate} — ${edu.endDate}` 
                        : edu.endDate || edu.startDate}
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>
                    )}
                    {edu.relevantCoursework && (
                      <p className="text-gray-600 text-xs">Coursework: {edu.relevantCoursework}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs">No education listed</p>
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
          <h2 className="text-xl font-light mb-4" style={{ color: styles.headerColor }}>
            Skills
          </h2>
          <div className="space-y-4">
            {resumeData.skills && Object.entries(resumeData.skills).map(([category, skillList]) => (
              skillList && skillList.length > 0 && (
                <div key={category}>
                  <h3 className="font-medium text-gray-800 mb-2 text-sm">
                    {category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                  </h3>
                  <div className="text-xs text-gray-700 leading-relaxed">
                    {skillList.join(" • ")}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="relative group">
          <button
            onClick={onEditCertifications}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
          >
            <Edit className="w-4 h-4 text-gray-500" />
          </button>
          <h2 className="text-xl font-light mb-4" style={{ color: styles.headerColor }}>
            Certifications
          </h2>
          <div className="space-y-3">
            {resumeData.certifications.length > 0 ? (
              resumeData.certifications.map((cert, index) => (
                <div key={cert.id || index}>
                  <h3 className="font-medium text-gray-800 text-xs leading-tight">{cert.name}</h3>
                  <p className="text-gray-600 text-xs">{cert.issuer}</p>
                  <p className="text-gray-500 text-xs">{cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-gray-500 text-xs">ID: {cert.credentialId}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-xs">No certifications listed</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 