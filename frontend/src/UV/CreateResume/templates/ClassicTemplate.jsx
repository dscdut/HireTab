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
    <div className={`${styles.layoutClass} ${styles.fontFamily}`}>
      <div className="text-center mb-6 relative group">
        <button
          onClick={onEditPersonalInfo}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h1 className={styles.headerStyle} style={{ color: styles.headerColor }}>
          {resumeData.personalInfo.fullName}
        </h1>
        <h2 className="text-xl italic" style={{ color: styles.textColor }}>
          {resumeData.personalInfo.title}
        </h2>
        <div className="text-sm text-gray-700 mt-2">
          {resumeData.personalInfo.phone} • {resumeData.personalInfo.email} • {resumeData.personalInfo.location}
          {resumeData.personalInfo.linkedinUrl && ` • ${resumeData.personalInfo.linkedinUrl}`}
          {resumeData.personalInfo.githubUrl && ` • ${resumeData.personalInfo.githubUrl}`}
          {resumeData.personalInfo.websiteUrl && ` • ${resumeData.personalInfo.websiteUrl}`}
        </div>
      </div>
      <div className="mb-6">
        <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
          Professional Summary
        </h3>
        <p className="text-gray-800 leading-relaxed text-justify mt-3">{resumeData.personalInfo.summary}</p>
      </div>
      <div className="relative group mb-6">
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
          {resumeData.experience.length > 0 ? (
            resumeData.experience.map((exp, index) => (
              <div key={exp.id || index}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{exp.position}</h4>
                    <h5 className="font-semibold italic text-gray-800">{exp.company}, {exp.location}</h5>
                  </div>
                  <p className="font-semibold italic text-gray-500">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                </div>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
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
      <div className="relative group mb-6">
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
          {resumeData.experience.length > 0 ? (
            resumeData.education.map((edu, index) => (
              <div key={edu.id || index}>
                <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                <h5 className="font-semibold italic text-gray-800">{edu.institution}, {edu.location}</h5>
                <p className="font-semibold italic text-gray-500">{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>}
                {edu.relevantCoursework && (
                  <p className="text-gray-600 text-sm">Relevant Coursework: {edu.relevantCoursework}</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No education listed</p>
          )}
        </div>
      </div>
      <div className="relative group mb-6">
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
          {resumeData.certifications.length > 0 ? (
            resumeData.certifications.map((cert, index) => (
              <div key={cert.id || index}>
                <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                <p className="text-gray-700">{cert.issuer}</p>
                <p className="text-gray-600 text-sm">Date: {cert.date}</p>
                {cert.credentialId && <p className="text-gray-600 text-sm">Credential ID: {cert.credentialId}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-sm">No certifications listed</p>
          )}
        </div>
      </div>
      <div className="relative group mb-6">
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
          {resumeData.projects.length > 0 ? (
            resumeData.projects.map((project, index) => (
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
            ))
          ) : (
            <p className="text-gray-600 text-sm">No projects listed</p>
          )}
        </div>
      </div>
      <div className="relative group">
        <button
          onClick={onEditSkills}
          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded print:hidden"
        >
          <Edit className="w-4 h-4 text-gray-500" />
        </button>
        <h3 className={styles.sectionStyle} style={{ color: styles.headerColor }}>
          Skills
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mt-3">
          {Object.entries(resumeData.skills).map(([category, skillList]) => (
            <div key={category}>
              <h4 className="font-semibold text-gray-800">{category}</h4>
              <ul className="list-disc list-inside space-y-1">
                {skillList.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}