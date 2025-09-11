"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ResumeHeader from "./components/ResumeHeader";
import ResumePreview from "./components/ResumePreview";
import SkillsPanel from "./components/SkillsPanel";
import PersonalInfoPanel from "./components/PersonalInfoPanel";
import ExperiencePanel from "./components/ExperiencePanel";
import EducationPanel from "./components/EducationPanel";
import TemplateSelector from "./components/TemplateSelector";
import ColorSelector from "./components/ColorSelector";
import CertificationsPanel from "./components/CertificationsPanel";
import ProjectsPanel from "./components/ProjectsPanel";

export default function CreateResume() {
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
    const [showTemplateSelector, setShowTemplateSelector] = useState(false);
    const [showColorSelector, setShowColorSelector] = useState(false);

    // Real-time update functions
    const updatePersonalInfo = (newPersonalInfo) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, ...newPersonalInfo },
        }));
    };

    // Function to close panel (separate from update)
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
        const exportFileDefaultName = "resume-data.json";
        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
    };

    // Default resume structure for fallback
    const getDefaultResumeStructure = () => ({
        personalInfo: {
            fullName: "Your Full Name",
            title: "Your Professional Title",
            email: "your.email@example.com",
            phone: "Your Phone Number",
            location: "Your City, Country",
            summary: "Professional summary goes here",
            linkedinUrl: "",
            githubUrl: "",
            websiteUrl: "",
        },
        experience: [],
        education: [],
        skills: {
            TechnicalSkills: [],
            ProgrammingLanguages: [],
            ToolsAndTechnologies: [],
            SoftSkills: [],
        },
        certifications: [],
        projects: [],
    });

    // Smart fallback formatting without API
    const formatResumeDataLocally = (importedData) => {
        try {
            const defaultStructure = getDefaultResumeStructure();

            // Handle different possible input formats
            if (typeof importedData === 'string') {
                importedData = JSON.parse(importedData);
            }

            // If the data already matches our structure, use it
            if (importedData.personalInfo && importedData.experience) {
                return {
                    ...defaultStructure,
                    ...importedData,
                    // Ensure arrays have proper structure
                    experience: Array.isArray(importedData.experience)
                        ? importedData.experience.map((exp, index) => ({
                            id: exp.id || index + 1,
                            company: exp.company || "Company Name",
                            position: exp.position || exp.title || "Job Title",
                            startDate: exp.startDate || exp.start_date || "Start Date",
                            endDate: exp.endDate || exp.end_date || "End Date",
                            current: exp.current || false,
                            location: exp.location || "City, Country",
                            description: Array.isArray(exp.description)
                                ? exp.description
                                : (exp.description ? exp.description.split('\n') : ["Job description"]),
                        }))
                        : [],
                    education: Array.isArray(importedData.education)
                        ? importedData.education.map((edu, index) => ({
                            id: edu.id || index + 1,
                            institution: edu.institution || edu.school || "Institution Name",
                            degree: edu.degree || "Degree",
                            startDate: edu.startDate || edu.start_date || "Start Year",
                            endDate: edu.endDate || edu.end_date || "End Year",
                            location: edu.location || "City, Country",
                            gpa: edu.gpa || "",
                            relevantCoursework: edu.relevantCoursework || "",
                        }))
                        : [],
                };
            }

            // Try to extract data from common resume formats
            const formatted = { ...defaultStructure };

            // Extract personal info
            if (importedData.name) formatted.personalInfo.fullName = importedData.name;
            if (importedData.fullName) formatted.personalInfo.fullName = importedData.fullName;
            if (importedData.email) formatted.personalInfo.email = importedData.email;
            if (importedData.phone) formatted.personalInfo.phone = importedData.phone;
            if (importedData.location) formatted.personalInfo.location = importedData.location;
            if (importedData.summary) formatted.personalInfo.summary = importedData.summary;
            if (importedData.title) formatted.personalInfo.title = importedData.title;

            // Extract skills
            if (importedData.skills) {
                if (Array.isArray(importedData.skills)) {
                    formatted.skills.TechnicalSkills = importedData.skills;
                } else if (typeof importedData.skills === 'object') {
                    formatted.skills = { ...formatted.skills, ...importedData.skills };
                }
            }

            return formatted;
        } catch (error) {
            console.error("Error in local formatting:", error);
            return getDefaultResumeStructure();
        }
    };

    // Retry mechanism with exponential backoff
    const callGeminiWithRetry = async (prompt, maxRetries = 3) => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key not configured");
        }

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }]
                        })
                    }
                );

                if (!response.ok) {
                    if (response.status === 503 && attempt < maxRetries) {
                        // Exponential backoff: 2^attempt seconds
                        const delay = Math.pow(2, attempt) * 1000;
                        console.log(`Gemini API unavailable, retrying in ${delay / 1000}s... (attempt ${attempt}/${maxRetries})`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                const generatedText = result.candidates[0].content.parts[0].text;
                const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

                if (!jsonMatch) {
                    throw new Error("Could not parse JSON from Gemini response");
                }

                return JSON.parse(jsonMatch[0]);
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error.message);
                if (attempt === maxRetries) {
                    throw error;
                }
            }
        }
    };

    const formatResumeDataWithGemini = async (importedData) => {
        const prompt = `
        You are an AI assistant tasked with formatting resume data into a specific JSON structure. The input data is provided below, and you must return a JSON object that adheres to the following structure:

        {
          "personalInfo": {
            "fullName": "string",
            "title": "string",
            "email": "string",
            "phone": "string",
            "location": "string",
            "summary": "string",
            "linkedinUrl": "string",
            "githubUrl": "string",
            "websiteUrl": "string"
          },
          "experience": [
            {
              "id": number,
              "company": "string",
              "position": "string",
              "startDate": "string",
              "endDate": "string",
              "current": boolean,
              "location": "string",
              "description": ["string"]
            }
          ],
          "education": [
            {
              "id": number,
              "institution": "string",
              "degree": "string",
              "startDate": "string",
              "endDate": "string",
              "location": "string",
              "gpa": "string",
              "relevantCoursework": "string"
            }
          ],
          "skills": {
            "Technical Skills": ["string"],
            "Programming Languages": ["string"],
            "Tools And Technologies": ["string"],
            "Soft Skills": ["string"]
          },
          "certifications": [
            {
              "id": number,
              "name": "string",
              "issuer": "string",
              "date": "string",
              "credentialId": "string"
            }
          ],
          "projects": [
            {
              "id": number,
              "name": "string",
              "description": "string",
              "technologies": ["string"],
              "url": "string"
            }
          ]
        }

        If the input data is missing fields, fill them with appropriate default values (e.g., empty strings, empty arrays, or false for booleans). If the input data has additional fields or is malformed, restructure it to fit the required format. Ensure each array item has a unique "id" starting from 1.

        Input data:
        ${JSON.stringify(importedData, null, 2)}

        Please return the formatted JSON object.
        `;

        return await callGeminiWithRetry(prompt);
    };

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const toastId = toast.loading("Using AI to format your resume data...", {
            duration: 0
        });
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                let formattedData;
                let isProcessingComplete = false;

                try {
                    formattedData = await formatResumeDataWithGemini(importedData);
                    if (!isProcessingComplete) {
                        toast.dismiss(toastId); 
                        toast.success("Resume data processed with AI formatting!");
                        isProcessingComplete = true;
                    }
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
                onTemplateClick={() => setShowTemplateSelector(!showTemplateSelector)}
                onColorClick={() => setShowColorSelector(!showColorSelector)}
                onExport={handleExport}
                onImport={handleImport}
            />

            {showTemplateSelector && (
                <TemplateSelector
                    selectedTemplate={selectedTemplate}
                    onSelectTemplate={(template) => {
                        setSelectedTemplate(template);
                        setShowTemplateSelector(false);
                    }}
                    onClose={() => setShowTemplateSelector(false)}
                />
            )}

            {showColorSelector && (
                <ColorSelector
                    selectedColor={selectedColor}
                    onSelectColor={(color) => {
                        setSelectedColor(color);
                        setShowColorSelector(false);
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

                {/* Updated panel width from w-80 (320px) to w-[440px] (320px + 120px = 440px, but using 350px for better proportion) */}
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