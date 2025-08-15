"use client"

import { useState } from "react"
import ResumeHeader from "./CreateResume/ResumeHeader"
import ResumePreview from "./CreateResume/ResumePreview"
import SkillsPanel from "./CreateResume/SkillsPanel"
import PersonalInfoPanel from "./CreateResume/PersonalInfoPanel"
import ExperiencePanel from "./CreateResume/ExperiencePanel"
import EducationPanel from "./CreateResume/EducationPanel"
import TemplateSelector from "./CreateResume/TemplateSelector"
import ColorSelector from "./CreateResume/ColorSelector"
import CertificationsPanel from "./CreateResume/CertificationsPanel"
import ProjectsPanel from "./CreateResume/ProjectsPanel"

export default function CreateResume() {
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: "[Your Full Name]",
            title: "[Your Professional Title]",
            email: "[your.email@example.com]",
            phone: "[Your Phone Number]",
            location: "[Your City, Country]",
            summary:
                "[Write a compelling professional summary highlighting your key skills, experience, and career objectives. Keep it concise and tailored to your target role.]",
            linkedinUrl: "[Your LinkedIn Profile URL]",
            githubUrl: "[Your GitHub Profile URL]",
            websiteUrl: "[Your Portfolio Website URL]",
        },
        experience: [
            {
                id: 1,
                company: "[Company Name]",
                position: "[Job Title]",
                startDate: "[Start Date]",
                endDate: "[End Date or Present]",
                current: false,
                location: "[City, Country]",
                description: [
                    "[Describe your key responsibilities and achievements]",
                    "[Use action verbs and quantify results where possible]",
                    "[Highlight skills relevant to your target role]",
                    "[Include any leadership or collaboration experiences]",
                ],
            },
            {
                id: 2,
                company: "[Previous Company Name]",
                position: "[Previous Job Title]",
                startDate: "[Start Date]",
                endDate: "[End Date]",
                location: "[City, Country]",
                description: [
                    "[Describe your responsibilities and achievements]",
                    "[Focus on transferable skills and measurable results]",
                    "[Include relevant projects or initiatives you led]",
                ],
            },
        ],
        education: [
            {
                id: 1,
                institution: "[University/College Name]",
                degree: "[Degree Type and Major]",
                startDate: "[Start Year]",
                endDate: "[Graduation Year]",
                location: "[City, Country]",
                gpa: "[GPA if 3.5 or higher]",
                relevantCoursework: "[List relevant courses separated by commas]",
            },
        ],
        skills: {
            "Technical Skills": ["[Skill 1]", "[Skill 2]", "[Skill 3]", "[Add more skills]"],
            "Programming Languages": ["[Language 1]", "[Language 2]", "[Language 3]"],
            "Tools & Technologies": ["[Tool 1]", "[Tool 2]", "[Tool 3]", "[Add more tools]"],
            "Soft Skills": ["[Soft Skill 1]", "[Soft Skill 2]", "[Soft Skill 3]"],
        },
        certifications: [
            {
                id: 1,
                name: "[Certification Name]",
                issuer: "[Issuing Organization]",
                date: "[Year Obtained]",
                credentialId: "[Credential ID if applicable]",
            },
        ],
        projects: [
            {
                id: 1,
                name: "[Project Name]",
                description: "[Brief description of the project and your role]",
                technologies: ["[Technology 1]", "[Technology 2]", "[Technology 3]"],
                url: "[Project URL or GitHub link]",
            },
        ],
    })

    const [activePanel, setActivePanel] = useState(null)
    const [selectedTemplate, setSelectedTemplate] = useState("classic")
    const [selectedColor, setSelectedColor] = useState("gray")
    const [showTemplateSelector, setShowTemplateSelector] = useState(false)
    const [showColorSelector, setShowColorSelector] = useState(false)

    const updatePersonalInfo = (newPersonalInfo) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...newPersonalInfo },
        }))
        setActivePanel(null)
    }

    const updateExperience = (newExperience) => {
        setResumeData((prev) => ({
            ...prev,
            experience: newExperience,
        }))
        setActivePanel(null)
    }

    const updateEducation = (newEducation) => {
        setResumeData((prev) => ({
            ...prev,
            education: newEducation,
        }))
        setActivePanel(null)
    }

    const updateSkills = (newSkills) => {
        setResumeData((prev) => ({
            ...prev,
            skills: newSkills,
        }))
        setActivePanel(null)
    }

    const updateCertifications = (newCertifications) => {
        setResumeData((prev) => ({
            ...prev,
            certifications: newCertifications,
        }))
        setActivePanel(null)
    }

    const updateProjects = (newProjects) => {
        setResumeData((prev) => ({
            ...prev,
            projects: newProjects,
        }))
        setActivePanel(null)
    }

    const handleExport = () => {
        const dataStr = JSON.stringify(resumeData, null, 2)
        const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
        const exportFileDefaultName = "resume-data.json"
        const linkElement = document.createElement("a")
        linkElement.setAttribute("href", dataUri)
        linkElement.setAttribute("download", exportFileDefaultName)
        linkElement.click()
    }

    const handleImport = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result)
                    setResumeData(importedData)
                } catch (error) {
                    alert("Invalid file format")
                }
            }
            reader.readAsText(file)
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <ResumeHeader
                    onTemplateClick={() => setShowTemplateSelector(!showTemplateSelector)}
                    onColorClick={() => setShowColorSelector(!showColorSelector)}
                    onExport={handleExport}
                    onImport={handleImport}
                />

                {showTemplateSelector && (
                    <TemplateSelector
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={(template) => {
                            setSelectedTemplate(template)
                            setShowTemplateSelector(false)
                        }}
                        onClose={() => setShowTemplateSelector(false)}
                    />
                )}

                {showColorSelector && (
                    <ColorSelector
                        selectedColor={selectedColor}
                        onSelectColor={(color) => {
                            setSelectedColor(color)
                            setShowColorSelector(false)
                        }}
                        onClose={() => setShowColorSelector(false)}
                    />
                )}

                <div className="flex h-[calc(100vh-64px)]">
                    <div className="flex-1 p-6">
                        <ResumePreview
                            resumeData={resumeData}
                            template={selectedTemplate}
                            colorScheme={selectedColor}
                            onEditPersonalInfo={() => setActivePanel("personalInfo")}
                            onEditExperience={() => setActivePanel("experience")}
                            onEditEducation={() => setActivePanel("education")}
                            onEditSkills={() => setActivePanel("skills")}
                            onEditCertifications={() => setActivePanel("certifications")}
                            onEditProjects={() => setActivePanel("projects")}
                        />
                    </div>

                    {activePanel === "personalInfo" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <PersonalInfoPanel
                                personalInfo={resumeData.personalInfo}
                                onUpdatePersonalInfo={updatePersonalInfo}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}

                    {activePanel === "experience" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <ExperiencePanel
                                experience={resumeData.experience}
                                onUpdateExperience={updateExperience}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}

                    {activePanel === "education" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <EducationPanel
                                education={resumeData.education}
                                onUpdateEducation={updateEducation}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}

                    {activePanel === "skills" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <SkillsPanel
                                skills={resumeData.skills}
                                onUpdateSkills={updateSkills}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}

                    {activePanel === "certifications" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <CertificationsPanel
                                certifications={resumeData.certifications}
                                onUpdateCertifications={updateCertifications}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}

                    {activePanel === "projects" && (
                        <div className="w-80 bg-white border-l border-gray-200">
                            <ProjectsPanel
                                projects={resumeData.projects}
                                onUpdateProjects={updateProjects}
                                onClose={() => setActivePanel(null)}
                            />
                        </div>
                    )}
                </div>

                {/* Hidden file input for import */}
                <input type="file" id="import-file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
            </div>
        </>
    )
}