"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import ResumeHeader from "./ResumeHeader";
import ResumePreview from "./ResumePreview";
import SkillsPanel from "./panel/SkillsPanel";
import PersonalInfoPanel from "./panel/PersonalInfoPanel";
import ExperiencePanel from "./panel/ExperiencePanel";
import EducationPanel from "./panel/EducationPanel";
import CertificationsPanel from "./panel/CertificationsPanel";
import ProjectsPanel from "./panel/ProjectsPanel";
import { useLocation } from "react-router-dom";
import { path } from "@/core/constants/path";

export default function CreateResume() {
    const location = useLocation();
    const [resumeData, setResumeData] = useState({
        personalInfo: {
            fullName: "Your Full Name",
            title: "Your Professional Title",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your City, Country",
            summary:
                "Write a compelling professional summary highlighting your key skills, experience, and career objectives. Keep it concise and tailored to your target role.",
            linkedinUrl: "Your LinkedIn Profile URL",
            githubUrl: "Your GitHub Profile URL",
            websiteUrl: "Your Portfolio Website URL",
        },
        experience: [
            {
                id: 1,
                company: "Company Name",
                position: "Job Title",
                startDate: "Start Date",
                endDate: "End Date or Present",
                current: false,
                location: "City, Country",
                description: [
                    "Describe your key responsibilities and achievements",
                    "Use action verbs and quantify results where possible",
                    "Highlight skills relevant to your target role",
                    "Include any leadership or collaboration experiences",
                ],
            },
            {
                id: 2,
                company: "Previous Company Name",
                position: "Previous Job Title",
                startDate: "Start Date",
                endDate: "End Date",
                location: "City, Country",
                description: [
                    "Describe your responsibilities and achievements",
                    "Focus on transferable skills and measurable results",
                    "Include relevant projects or initiatives you led",
                ],
            },
        ],
        education: [
            {
                id: 1,
                institution: "University/College Name",
                degree: "Degree Type and Major",
                startDate: "Start Year",
                endDate: "Graduation Year",
                location: "City, Country",
                gpa: "GPA if 3.5 or higher",
                relevantCoursework: "List relevant courses separated by commas",
            },
        ],
        skills: {
            TechnicalSkills: ["Skill 1", "Skill 2", "Skill 3", "Add more skills"],
            ProgrammingLanguages: ["Language 1", "Language 2", "Language 3"],
            ToolsAndTechnologies: ["Tool 1", "Tool 2", "Tool 3", "Add more tools"],
            SoftSkills: ["Soft Skill 1", "Soft Skill 2", "Soft Skill 3"],
        },
        certifications: [
            {
                id: 1,
                name: "Certification Name",
                issuer: "Issuing Organization",
                date: "Year Obtained",
                credentialId: "Credential ID if applicable",
            },
        ],
        projects: [
            {
                id: 1,
                name: "Project Name",
                description: "Brief description of the project and your role",
                technologies: ["Technology 1", "Technology 2", "Technology 3"],
                url: "Project URL or GitHub link",
            },
        ],
    });

    const [activePanel, setActivePanel] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState("classic");
    const [selectedColor, setSelectedColor] = useState("gray");

    // Read template from URL query parameter on mount
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const templateFromUrl = params.get('template');
        if (templateFromUrl) {
            console.log("Template from URL:", templateFromUrl);
            setSelectedTemplate(templateFromUrl);
        }
    }, [location]);

    // Real-time update functions
    const updatePersonalInfo = (newPersonalInfo) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...newPersonalInfo },
        }));
    };

    const closePersonalInfoPanel = () => {
        setActivePanel(null);
    };

    const updateExperience = (newExperience) => {
        setResumeData((prev) => ({
            ...prev,
            experience: newExperience,
        }));
    };

    const closeExperiencePanel = () => {
        setActivePanel(null);
    };

    const updateEducation = (newEducation) => {
        setResumeData((prev) => ({
            ...prev,
            education: newEducation,
        }));
    };

    const closeEducationPanel = () => {
        setActivePanel(null);
    };

    const updateSkills = (newSkills) => {
        setResumeData((prev) => ({
            ...prev,
            skills: newSkills,
        }));
    };

    const closeSkillsPanel = () => {
        setActivePanel(null);
    };

    const updateCertifications = (newCertifications) => {
        setResumeData((prev) => ({
            ...prev,
            certifications: newCertifications,
        }));
    };

    const closeCertificationsPanel = () => {
        setActivePanel(null);
    };

    const updateProjects = (newProjects) => {
        setResumeData((prev) => ({
            ...prev,
            projects: newProjects,
        }));
    };

    const closeProjectsPanel = () => {
        setActivePanel(null);
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(resumeData, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        const exportFileDefaultName = 'resume-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Importing resume data...");
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                let formattedData = importedData;
                let isProcessingComplete = false;

                try {
                    // Placeholder for Gemini API call (if implemented)
                    // const geminiFormatted = await formatWithGemini(importedData);
                    // formattedData = geminiFormatted;
                    // toast.dismiss(toastId);
                    // toast.success("Resume data imported and formatted with AI!");
                    // isProcessingComplete = true;
                } catch (geminiError) {
                    console.warn("Gemini API failed, using local formatting:", geminiError.message);
                    formattedData = formatResumeDataLocally(importedData);
                    if (!isProcessingComplete) {
                        toast.dismiss(toastId);
                        toast.success("Resume data imported with local formatting!");
                        isProcessingComplete = true;
                    }
                }

                setResumeData(formattedData);
            } catch (error) {
                console.error("Error processing imported file:", error);
                toast.dismiss(toastId);
                toast.error("Failed to import resume data. Please check the file format.");
            }
        };

        reader.onerror = () => {
            toast.dismiss(toastId);
            toast.error("Failed to read the file.");
        };

        reader.readAsText(file);
        event.target.value = "";
    };

    // Placeholder for local formatting function
    const formatResumeDataLocally = (data) => {
        // Implement basic formatting logic if needed
        return data;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#4ade80',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <ResumeHeader
                onExport={handleExport}
                onImport={handleImport}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
            />

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
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <PersonalInfoPanel
                            personalInfo={resumeData.personalInfo}
                            onUpdatePersonalInfo={updatePersonalInfo}
                            onClose={closePersonalInfoPanel}
                        />
                    </div>
                )}

                {activePanel === "experience" && (
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <ExperiencePanel
                            experience={resumeData.experience}
                            onUpdateExperience={updateExperience}
                            onClose={closeExperiencePanel}
                        />
                    </div>
                )}

                {activePanel === "education" && (
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <EducationPanel
                            education={resumeData.education}
                            onUpdateEducation={updateEducation}
                            onClose={closeEducationPanel}
                        />
                    </div>
                )}

                {activePanel === "skills" && (
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <SkillsPanel
                            skills={resumeData.skills}
                            onUpdateSkills={updateSkills}
                            onClose={closeSkillsPanel}
                        />
                    </div>
                )}

                {activePanel === "certifications" && (
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <CertificationsPanel
                            certifications={resumeData.certifications}
                            onUpdateCertifications={updateCertifications}
                            onClose={closeCertificationsPanel}
                        />
                    </div>
                )}

                {activePanel === "projects" && (
                    <div className="w-[420px] bg-white border-l border-gray-200">
                        <ProjectsPanel
                            projects={resumeData.projects}
                            onUpdateProjects={updateProjects}
                            onClose={closeProjectsPanel}
                        />
                    </div>
                )}
            </div>

            <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
            />
        </div>
    );
}