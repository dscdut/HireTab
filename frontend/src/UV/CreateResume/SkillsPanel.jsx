"use client"

import { useState } from "react"
import { Button } from '@/components/ui/button'
import { ChevronLeft, Eye, X } from "lucide-react"

export default function SkillsPanel({ skills, onUpdateSkills, onClose }) {
  const [localSkills, setLocalSkills] = useState(skills)
  const [newSkill, setNewSkill] = useState("")

  const updateSkillLevel = (skillName, level) => {
    setLocalSkills((prev) => ({
      ...prev,
      [skillName]: level,
    }))
  }

  const removeSkill = (skillName) => {
    const updated = { ...localSkills }
    delete updated[skillName]
    setLocalSkills(updated)
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      setLocalSkills((prev) => ({
        ...prev,
        [newSkill.trim()]: 50,
      }))
      setNewSkill("")
    }
  }

  const handleDone = () => {
    onUpdateSkills(localSkills)
  }

  const handleCancel = () => {
    setLocalSkills(skills)
    onClose()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Skills and expertise</h2>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700">Languages</h3>
          <Eye className="w-4 h-4 text-gray-500" />
        </div>

        <div className="space-y-4">
          {Object.entries(localSkills).map(([skill, level]) => (
            <div key={skill} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span className="text-sm font-medium">{skill}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{level}</span>
                  <button onClick={() => removeSkill(skill)} className="p-1 hover:bg-gray-100 rounded">
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="px-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={level}
                    onChange={(e) => updateSkillLevel(skill, Number.parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #374151 0%, #374151 ${level}%, #e5e7eb ${level}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-slate-700 rounded-full border-2 border-white shadow cursor-pointer pointer-events-none"
                    style={{ left: `calc(${level}% - 8px)` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Skill +"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">JavaScript</span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex space-x-3">
        <Button onClick={handleDone} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white">
          DONE
        </Button>
        <Button onClick={handleCancel} variant="outline" className="flex-1 bg-transparent">
          CANCEL
        </Button>
      </div>
    </div>
  )
}
