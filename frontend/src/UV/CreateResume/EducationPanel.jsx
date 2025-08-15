"use client"

import { useState } from "react"
import { X, ArrowLeft, Plus, Trash2 } from "lucide-react"

export default function EducationPanel({ education, onUpdateEducation, onClose }) {
  const [educationList, setEducationList] = useState(education)

  const handleSubmit = () => {
    onUpdateEducation(educationList)
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      gpa: "",
    }
    setEducationList([...educationList, newEdu])
  }

  const updateEducation = (id, field, value) => {
    setEducationList((prev) => prev.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)))
  }

  const removeEducation = (id) => {
    setEducationList((prev) => prev.filter((edu) => edu.id !== id))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {educationList.map((edu, index) => (
          <div key={edu.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Education {index + 1}</h4>
              <button onClick={() => removeEducation(edu.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium mb-1">Start Year</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="2015"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Year</label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="2019"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">GPA (Optional)</label>
              <input
                type="text"
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="3.8/4.0"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
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
