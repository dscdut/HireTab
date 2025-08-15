"use client"

import { useState } from "react"
import { X, Plus, Trash2 } from "lucide-react"

export default function ProjectsPanel({ projects = [], onUpdateProjects, onClose }) {
  const [projectList, setProjectList] = useState(projects)

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      technologies: [],
      url: "",
    }
    setProjectList([...projectList, newProject])
  }

  const updateProject = (id, field, value) => {
    setProjectList(projectList.map((project) => (project.id === id ? { ...project, [field]: value } : project)))
  }

  const updateTechnologies = (id, techString) => {
    const technologies = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "")
    updateProject(id, "technologies", technologies)
  }

  const removeProject = (id) => {
    setProjectList(projectList.filter((project) => project.id !== id))
  }

  const handleSave = () => {
    onUpdateProjects(projectList.filter((project) => project.name.trim() !== ""))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Key Projects</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {projectList.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">Project {projectList.indexOf(project) + 1}</h3>
              <button onClick={() => removeProject(project.id)} className="p-1 hover:bg-red-100 rounded text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, "name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., E-commerce Platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, "description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the project and your role"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies.join(", ")}
                  onChange={(e) => updateTechnologies(project.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => updateProject(project.id, "url", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500">Add Project</span>
        </button>
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          DONE
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}
