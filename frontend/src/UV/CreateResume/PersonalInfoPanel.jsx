"use client"

import { useState } from "react"
import { X, ArrowLeft } from "lucide-react"

export default function PersonalInfoPanel({ personalInfo, onUpdatePersonalInfo, onClose }) {
  const [formData, setFormData] = useState(personalInfo)

  const handleSubmit = () => {
    onUpdatePersonalInfo(formData)
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Personal Information</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <textarea
            value={formData.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Relevant Experience</label>
          <input
            type="text"
            value={formData.relevantExperience}
            onChange={(e) => handleChange("relevantExperience", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Experience</label>
          <input
            type="text"
            value={formData.totalExperience}
            onChange={(e) => handleChange("totalExperience", e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Social Links</h4>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              value={formData.socialLinks?.linkedin || ""}
              onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              value={formData.socialLinks?.github || ""}
              onChange={(e) => handleSocialLinkChange("github", e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button onClick={handleSubmit} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          DONE
        </button>
        <button onClick={onClose} className="flex-1 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50">
          CANCEL
        </button>
      </div>
    </div>
  )
}
