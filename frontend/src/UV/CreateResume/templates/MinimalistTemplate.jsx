"use client"

import { Edit, Phone, Mail, MapPin, ExternalLink, Linkedin, Github, Globe } from "lucide-react"

export default function MinimalistTemplate({
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
    <div className={`${styles.fontFamily} min-h-screen bg-white`}>
      {/* HEADER SECTION */}
      <div className="bg-gray-100 py-6 px-8 mb-6 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <div className="flex items-start space-x-6">
          {/* Profile Image Placeholder */}
          <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0"></div>
          
          {/* Name and Contact */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {resumeData.personalInfo.fullName}
            </h1>
            <h2 className="text-xl font-medium text-gray-700 mb-3">
              {resumeData.personalInfo.title}
            </h2>
            
            {/* Contact Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {resumeData.personalInfo.email}
              </span>
              <span className="flex items-center">
                <Phone className="w-3 h-3 mr-1" />
                {resumeData.personalInfo.phone}
              </span>
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {resumeData.personalInfo.location}
              </span>
            </div>
            
            {/* Links */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">
              {resumeData.personalInfo.linkedinUrl && (
                <span className="flex items-center">
                  <Linkedin className="w-3 h-3 mr-1" />
                  {resumeData.personalInfo.linkedinUrl}
                </span>
              )}
              {resumeData.personalInfo.githubUrl && (
                <span className="flex items-center">
                  <Github className="w-3 h-3 mr-1" />
                  {resumeData.personalInfo.githubUrl}
                </span>
              )}
              {resumeData.personalInfo.websiteUrl && (
                <span className="flex items-center">
                  <Globe className="w-3 h-3 mr-1" />
                  {resumeData.personalInfo.websiteUrl}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - 2 COLUMNS */}
      <div className="px-8 grid grid-cols-3 gap-8">
        {/* LEFT SIDEBAR - 1/3 */}
        <div className="col-span-1 space-y-8">
          {/* Professional Summary */}
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
              PROFESSIONAL SUMMARY
            </h3>
            <p className="text-gray-800 leading-relaxed text-sm text-justify">
              {resumeData.personalInfo.summary}
            </p>
          </div>

          {/* Skills */}
          <div className="relative group">
            <button
              onClick={onEditSkills}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
              SKILLS
            </h3>
            <div className="space-y-4">
              {Object.entries(resumeData.skills).map(([category, skillList]) => (
                <div key={category}>
                  <h4 className="font-medium text-sm text-gray-800 mb-2">{category}</h4>
                  <ul className="space-y-1">
                    {skillList.map((skill, index) => (
                      <li key={index} className="text-sm text-gray-700">• {skill}</li>
                    ))}
                  </ul>
                </div>
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
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
              CERTIFICATIONS
            </h3>
            <div className="space-y-3">
              {resumeData.certifications.length > 0 ? (
                resumeData.certifications.map((cert, index) => (
                  <div key={cert.id || index}>
                    <h4 className="font-medium text-sm text-gray-900">{cert.name}</h4>
                    <p className="text-gray-700 text-xs">{cert.issuer}</p>
                    <p className="text-gray-500 text-xs italic">{cert.date}</p>
                    {cert.credentialId && (
                      <p className="text-gray-500 text-xs">ID: {cert.credentialId}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-xs">No certifications listed</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT MAIN CONTENT - 2/3 */}
        <div className="col-span-2 space-y-8">
          {/* Professional Experience */}
          <div className="relative group">
            <button
              onClick={onEditExperience}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
              PROFESSIONAL EXPERIENCE
            </h3>
            <div className="space-y-6">
              {resumeData.experience.length > 0 ? (
                resumeData.experience.map((exp, index) => (
                  <div key={exp.id || index}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">{exp.position}</h4>
                        <h5 className="font-medium italic text-gray-600">{exp.company}, {exp.location}</h5>
                      </div>
                      <p className="text-sm italic text-gray-500 text-right">
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                      {Array.isArray(exp.description)
                        ? exp.description.map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)
                        : exp.description.split("\n").map((item, i) => <li key={i} className="leading-relaxed">{item}</li>)}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No experience listed</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="relative group">
            <button
              onClick={onEditEducation}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
              EDUCATION
            </h3>
            <div className="space-y-4">
              {resumeData.education.length > 0 ? (
                resumeData.education.map((edu, index) => (
                  <div key={edu.id || index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <h5 className="font-medium italic text-gray-600">{edu.institution}, {edu.location}</h5>
                        {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                        {edu.relevantCoursework && (
                          <p className="text-gray-600 text-sm">Relevant Coursework: {edu.relevantCoursework}</p>
                        )}
                      </div>
                      <p className="text-sm italic text-gray-500">
                        {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No education listed</p>
              )}
            </div>
          </div>

          {/* Projects */}
          <div className="relative group">
            <button
              onClick={onEditProjects}
              className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-6">
              KEY PROJECTS
            </h3>
            <div className="space-y-4">
              {resumeData.projects.length > 0 ? (
                resumeData.projects.map((project, index) => (
                  <div key={project.id || index}>
                    <h4 className="font-bold text-gray-900 mb-1">{project.name}</h4>
                    <p className="text-gray-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      <strong>Technologies:</strong> {project.technologies.join(", ")}
                    </p>
                    {project.url && (
                      <p className="text-xs text-gray-600 break-all">
                        <strong>URL:</strong> {project.url}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No projects listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}