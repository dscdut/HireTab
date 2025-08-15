"use client"

import { useState } from "react"
import { X, ArrowLeft, Plus, Trash2 } from "lucide-react"

export default function ExperiencePanel({ experience, onUpdateExperience, onClose }) {
  const [experienceList, setExperienceList] = useState(experience)

  const handleSubmit = () => {
    onUpdateExperience(experienceList)
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperienceList([...experienceList, newExp])
  }

  const updateExperience = (id, field, value) => {
    setExperienceList((prev) => prev.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)))
  }

  const removeExperience = (id) => {
    setExperienceList((prev) => prev.filter((exp) => exp.id !== id))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Work Experience</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {experienceList.map((exp, index) => (
          <div key={exp.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <button onClick={() => removeExperience(exp.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Jan 2020"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="Present"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                />
                <span className="text-sm">Currently working here</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                rows={3}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
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
