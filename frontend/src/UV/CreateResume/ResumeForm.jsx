"use client"

import { useState } from "react"
import PersonalInfoForm from "./forms/PersonalInfoForm"
import ExperienceForm from "./forms/ExperienceForm"
import EducationForm from "./forms/EducationForm"
import SkillsForm from "./forms/SkillsForm"

const tabs = [
  { id: "personal", label: "Thông tin cá nhân", icon: "👤" },
  { id: "experience", label: "Kinh nghiệm", icon: "💼" },
  { id: "education", label: "Học vấn", icon: "🎓" },
  { id: "skills", label: "Kỹ năng", icon: "⚡" },
]

export default function ResumeForm({ resumeData, updateResumeData }) {
  const [activeTab, setActiveTab] = useState("personal")

  const renderForm = () => {
    switch (activeTab) {
      case "personal":
        return (
          <PersonalInfoForm
            data={resumeData.personalInfo}
            onChange={(data) => updateResumeData("personalInfo", data)}
          />
        )
      case "experience":
        return <ExperienceForm data={resumeData.experience} onChange={(data) => updateResumeData("experience", data)} />
      case "education":
        return <EducationForm data={resumeData.education} onChange={(data) => updateResumeData("education", data)} />
      case "skills":
        return <SkillsForm data={resumeData.skills} onChange={(data) => updateResumeData("skills", data)} />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="border-b">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">{renderForm()}</div>
    </div>
  )
}
