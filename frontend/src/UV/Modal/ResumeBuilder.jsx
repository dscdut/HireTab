"use client"

import { useState } from "react"
import { X, Download, Eye, User, Briefcase, GraduationCap, Award, Phone, Mail, MapPin, Globe } from "lucide-react"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const ResumeBuilder = ({ isOpen, onClose, onSaveResume, jobDescription, jobDesRate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [currentStep, setCurrentStep] = useState("template") // template, form, preview
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      summary: "",
    },
    experience: [
      {
        id: 1,
        jobTitle: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: [
      {
        id: 1,
        degree: "",
        school: "",
        location: "",
        graduationDate: "",
        gpa: "",
      },
    ],
    skills: [],
    newSkill: "",
  })

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean and contemporary design perfect for tech roles",
      preview: "bg-gradient-to-br from-blue-50 to-indigo-100",
    },
    {
      id: "classic",
      name: "Classic Executive",
      description: "Traditional layout ideal for corporate positions",
      preview: "bg-gradient-to-br from-gray-50 to-gray-100",
    },
    {
      id: "creative",
      name: "Creative Designer",
      description: "Bold and artistic layout for creative professionals",
      preview: "bg-gradient-to-br from-purple-50 to-pink-100",
    },
  ]

  const handleInputChange = (section, field, value, index = null) => {
    setResumeData((prev) => {
      if (index !== null) {
        return {
          ...prev,
          [section]: prev[section].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        }
      }
    })
  }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: Date.now(),
          jobTitle: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  const removeExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: Date.now(),
          degree: "",
          school: "",
          location: "",
          graduationDate: "",
          gpa: "",
        },
      ],
    }))
  }

  const removeEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    if (resumeData.newSkill.trim()) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: "",
      }))
    }
  }

  const removeSkill = (index) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })
    const margin = 15
    let y = margin
    const pageWidth = doc.internal.pageSize.getWidth()
    const maxLineWidth = pageWidth - margin * 2

    // Helper function to add section title
    const addSectionTitle = (title) => {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(0, 51, 102) // Dark blue
      doc.text(title, margin, y)
      y += 3
      doc.setLineWidth(0.5)
      doc.setDrawColor(0, 51, 102)
      doc.line(margin, y, margin + 50, y)
      y += 7
    }

    // Add Personal Information
    doc.setFontSize(18)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0)
    doc.text(resumeData.personalInfo.fullName || "Your Name", margin, y)
    y += 8

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const contactInfo = []
    if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email)
    if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone)
    if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location)
    if (resumeData.personalInfo.website) contactInfo.push(resumeData.personalInfo.website)
    
    const contactText = contactInfo.join(" | ")
    const contactLines = doc.splitTextToSize(contactText, maxLineWidth)
    doc.text(contactLines, margin, y)
    y += contactLines.length * 5 + 8

    // Add Summary
    if (resumeData.personalInfo.summary) {
      addSectionTitle("Professional Summary")
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)
      const summaryLines = doc.splitTextToSize(resumeData.personalInfo.summary, maxLineWidth)
      doc.text(summaryLines, margin, y)
      y += summaryLines.length * 5 + 10
    }

    // Add Experience
    if (resumeData.experience.some((exp) => exp.jobTitle || exp.company)) {
      addSectionTitle("Work Experience")
      resumeData.experience.forEach((exp, index) => {
        if (exp.jobTitle || exp.company) {
          // Check if we need a new page
          if (y > 260) {
            doc.addPage()
            y = margin
          }

          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(0, 0, 0)
          const jobTitle = `${exp.jobTitle}${exp.company ? ` at ${exp.company}` : ""}`
          const jobTitleLines = doc.splitTextToSize(jobTitle, maxLineWidth)
          doc.text(jobTitleLines, margin, y)
          y += jobTitleLines.length * 5

          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(100, 100, 100)
          const period = `${exp.startDate} - ${exp.current ? "Present" : exp.endDate}${exp.location ? ` | ${exp.location}` : ""}`
          doc.text(period, margin, y)
          y += 5

          if (exp.description) {
            doc.setFontSize(10)
            doc.setFont("helvetica", "normal")
            doc.setTextColor(0, 0, 0)
            const descLines = doc.splitTextToSize(exp.description, maxLineWidth - 5)
            doc.text(descLines, margin + 5, y)
            y += descLines.length * 5 + 5
          }
          y += 3
        }
      })
      y += 5
    }

    // Add Education
    if (resumeData.education.some((edu) => edu.degree || edu.school)) {
      if (y > 260) {
        doc.addPage()
        y = margin
      }
      addSectionTitle("Education")
      resumeData.education.forEach((edu) => {
        if (edu.degree || edu.school) {
          doc.setFontSize(11)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(0, 0, 0)
          const educationTitle = `${edu.degree}${edu.school ? ` - ${edu.school}` : ""}`
          const educationTitleLines = doc.splitTextToSize(educationTitle, maxLineWidth)
          doc.text(educationTitleLines, margin, y)
          y += educationTitleLines.length * 5

          doc.setFontSize(9)
          doc.setFont("helvetica", "italic")
          doc.setTextColor(100, 100, 100)
          const eduDetails = `${edu.graduationDate}${edu.location ? ` | ${edu.location}` : ""}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`
          doc.text(eduDetails, margin, y)
          y += 5
          y += 3
        }
      })
      y += 5
    }

    // Add Skills
    if (resumeData.skills.length > 0) {
      if (y > 260) {
        doc.addPage()
        y = margin
      }
      addSectionTitle("Skills")
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(0, 0, 0)
      const skillsText = resumeData.skills.join(", ")
      const skillsLines = doc.splitTextToSize(skillsText, maxLineWidth)
      doc.text(skillsLines, margin, y)
      y += skillsLines.length * 5 + 5
    }

    // Generate PDF file
    const pdfOutput = doc.output("blob")
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "Resume"}.pdf`
    const file = new File([pdfOutput], fileName, { type: "application/pdf" })

    // Pass the file to ModalFormCandidate
    onSaveResume(file)
    onClose()
  }

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Template</h3>
        <p className="text-sm text-gray-600">Select a professional template that matches your industry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className={`w-full h-32 rounded-lg mb-3 ${template.preview}`}></div>
            <h4 className="font-medium text-gray-900">{template.name}</h4>
            <p className="text-xs text-gray-600 mt-1">{template.description}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentStep("form")}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Continue with {templates.find((t) => t.id === selectedTemplate)?.name}
      </button>
    </div>
  )

  const renderForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Build Your Resume</h3>
        <button
          onClick={() => setCurrentStep("preview")}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm">Preview</span>
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Personal Information</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={resumeData.personalInfo.fullName}
              onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={resumeData.personalInfo.email}
              onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Location"
              value={resumeData.personalInfo.location}
              onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="url"
            placeholder="Website/Portfolio (optional)"
            value={resumeData.personalInfo.website}
            onChange={(e) => handleInputChange("personalInfo", "website", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Professional Summary"
            value={resumeData.personalInfo.summary}
            onChange={(e) => handleInputChange("personalInfo", "summary", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Experience */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Work Experience</h4>
            </div>
            <button onClick={addExperience} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Experience
            </button>
          </div>

          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => handleInputChange("experience", "jobTitle", e.target.value, index)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleInputChange("experience", "company", e.target.value, index)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {resumeData.experience.length > 1 && (
                  <button onClick={() => removeExperience(index)} className="ml-2 text-red-600 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleInputChange("experience", "location", e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => handleInputChange("experience", "startDate", e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) => handleInputChange("experience", "endDate", e.target.value, index)}
                  disabled={exp.current}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${index}`}
                  checked={exp.current}
                  onChange={(e) => handleInputChange("experience", "current", e.target.checked, index)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`current-${index}`} className="text-sm text-gray-600">
                  I currently work here
                </label>
              </div>

              <textarea
                placeholder="Job description and achievements"
                value={exp.description}
                onChange={(e) => handleInputChange("experience", "description", e.target.value, index)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-gray-600" />
              <h4 className="font-medium text-gray-900">Education</h4>
            </div>
            <button onClick={addEducation} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              + Add Education
            </button>
          </div>

          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleInputChange("education", "degree", e.target.value, index)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="School/University"
                    value={edu.school}
                    onChange={(e) => handleInputChange("education", "school", e.target.value, index)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {resumeData.education.length > 1 && (
                  <button onClick={() => removeEducation(index)} className="ml-2 text-red-600 hover:text-red-700">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Location"
                  value={edu.location}
                  onChange={(e) => handleInputChange("education", "location", e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="month"
                  placeholder="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(e) => handleInputChange("education", "graduationDate", e.target.value, index)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="GPA (optional)"
                value={edu.gpa}
                onChange={(e) => handleInputChange("education", "gpa", e.target.value, index)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Skills</h4>
          </div>

          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a skill"
              value={resumeData.newSkill}
              onChange={(e) => setResumeData((prev) => ({ ...prev, newSkill: e.target.value }))}
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addSkill}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button onClick={() => removeSkill(index)} className="text-blue-600 hover:text-blue-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep("template")}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Templates
        </button>
        <button
          onClick={() => setCurrentStep("preview")}
          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Preview Resume
        </button>
      </div>
    </div>
  )

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
        <button
          onClick={() => setCurrentStep("form")}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          ← Edit Resume
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-white max-h-96 overflow-y-auto">
        {/* Resume Preview Content */}
        <div className="space-y-4">
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-900">{resumeData.personalInfo.fullName || "Your Name"}</h1>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-600 mt-2">
              {resumeData.personalInfo.email && (
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{resumeData.personalInfo.email}</span>
                </div>
              )}
              {resumeData.personalInfo.phone && (
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{resumeData.personalInfo.phone}</span>
                </div>
              )}
              {resumeData.personalInfo.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{resumeData.personalInfo.location}</span>
                </div>
              )}
            </div>
            {resumeData.personalInfo.website && (
              <div className="flex justify-center items-center space-x-1 text-sm text-blue-600 mt-1">
                <Globe className="w-4 h-4" />
                <span>{resumeData.personalInfo.website}</span>
              </div>
            )}
          </div>

          {resumeData.personalInfo.summary && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
              <p className="text-gray-700 text-sm">{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {resumeData.experience.some((exp) => exp.jobTitle || exp.company) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Work Experience</h2>
              <div className="space-y-3">
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                    <p className="text-blue-600 text-sm">{exp.company}</p>
                    <p className="text-gray-600 text-xs">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate} • {exp.location}
                    </p>
                    {exp.description && <p className="text-gray-700 text-sm mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.education.some((edu) => edu.degree || edu.school) && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
              <div className="space-y-2">
                {resumeData.education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-blue-600 text-sm">{edu.school}</p>
                    <p className="text-gray-600 text-xs">
                      {edu.graduationDate} • {edu.location}
                    </p>
                    {edu.gpa && <p className="text-gray-600 text-xs">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setCurrentStep("form")}
          className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Edit Resume
        </button>
        <button
          onClick={generatePDF}
          className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Save & Use Resume</span>
        </button>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Resume Builder</h2>
            <p className="text-sm text-gray-600">Create a professional resume in minutes</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${currentStep === "template" ? "text-blue-600" : currentStep === "form" || currentStep === "preview" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === "template" ? "bg-blue-100" : currentStep === "form" || currentStep === "preview" ? "bg-green-100" : "bg-gray-100"}`}
              >
                1
              </div>
              <span className="text-sm font-medium">Template</span>
            </div>
            <div
              className={`w-8 h-0.5 ${currentStep === "form" || currentStep === "preview" ? "bg-green-200" : "bg-gray-200"}`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "form" ? "text-blue-600" : currentStep === "preview" ? "text-green-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === "form" ? "bg-blue-100" : currentStep === "preview" ? "bg-green-100" : "bg-gray-100"}`}
              >
                2
              </div>
              <span className="text-sm font-medium">Information</span>
            </div>
            <div className={`w-8 h-0.5 ${currentStep === "preview" ? "bg-green-200" : "bg-gray-200"}`}></div>
            <div
              className={`flex items-center space-x-2 ${currentStep === "preview" ? "text-blue-600" : "text-gray-400"}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${currentStep === "preview" ? "bg-blue-100" : "bg-gray-100"}`}
              >
                3
              </div>
              <span className="text-sm font-medium">Preview</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStep === "template" && renderTemplateSelection()}
          {currentStep === "form" && renderForm()}
          {currentStep === "preview" && renderPreview()}
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder