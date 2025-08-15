"use client"

import { useState } from "react"

export default function SkillsForm({ data, onChange }) {
  const [newSkill, setNewSkill] = useState("")

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove) => {
    onChange(data.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Kỹ năng</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập kỹ năng (VD: JavaScript, React, Node.js...)"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Chưa có kỹ năng nào. Nhập kỹ năng và nhấn "Thêm".</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Đã thêm {data.length} kỹ năng. Nhấn vào kỹ năng để xóa.</p>
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <span
                key={index}
                onClick={() => removeSkill(skill)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 cursor-pointer hover:bg-red-100 hover:text-red-800 transition-colors"
              >
                {skill}
                <span className="ml-2 text-xs">×</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
