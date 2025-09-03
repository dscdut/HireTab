"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Loader2, GripVertical } from "lucide-react"
import toast from "react-hot-toast"

export default function ProjectsPanel({ projects = [], onUpdateProjects, onClose }) {
  const [projectList, setProjectList] = useState(projects)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  useEffect(() => {
    setProjectList(projects);
  }, [projects]);

  // Real-time update function
  const updateProjectListRealTime = (newList) => {
    setProjectList(newList);
    onUpdateProjects(newList);
  }

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `
    Please format the following projects data to match this exact structure and improve the content quality:

    Expected format:
    [
      {
        "id": number,
        "name": "Professional Project Name",
        "description": "Compelling 2-3 sentence description highlighting impact, technologies used, and your role",
        "technologies": ["Technology1", "Technology2", "Technology3"],
        "url": "Valid URL or empty string"
      }
    ]

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Make project names professional and descriptive
    2. Improve descriptions to highlight impact, technical challenges, and achievements
    3. Standardize technology names with proper capitalization
    4. Ensure URLs are valid or empty
    5. Focus on business value and technical complexity in descriptions
    6. Remove duplicates and empty entries
    7. Return ONLY the JSON array, no additional text

    Formatted data:
    `;

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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = result.candidates[0].content.parts[0].text;
    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);

    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    return JSON.parse(jsonMatch[0]);
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      technologies: [],
      url: "",
    }
    const newList = [...projectList, newProject];
    updateProjectListRealTime(newList);
  }

  const updateProject = (id, field, value) => {
    const newList = projectList.map((project) => (project.id === id ? { ...project, [field]: value } : project));
    updateProjectListRealTime(newList);
  }

  const updateTechnologies = (id, techString) => {
    const technologies = techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech !== "")
    updateProject(id, "technologies", technologies)
  }

  const removeProject = (id) => {
    const newList = projectList.filter((project) => project.id !== id);
    updateProjectListRealTime(newList);
  }

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItem === dropIndex) return;

    const newList = [...projectList];
    const draggedProject = newList[draggedItem];

    // Remove the dragged item
    newList.splice(draggedItem, 1);

    // Insert at new position
    newList.splice(dropIndex, 0, draggedProject);

    updateProjectListRealTime(newList);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleSave = async () => {
    // Filter out empty projects
    const validProjects = projectList.filter(project => project.name.trim() !== "");

    if (validProjects.length === 0) {
      updateProjectListRealTime([]);
      onClose();
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing projects with AI...");

    try {
      const formattedData = await callGeminiAPI(validProjects);
      updateProjectListRealTime(formattedData);
      toast.success("Projects updated and formatted!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      updateProjectListRealTime(validProjects);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Key Projects</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {projectList.map((project, index) => {
          const isDragOver = dragOverItem === index;

          return (
            <div
              key={project.id}
              className={`border border-gray-200 rounded-lg p-4 space-y-3 transition-all duration-200 ${isDragOver ? 'bg-blue-50 border-blue-400 shadow-lg' : ''
                }`}
              draggable={!isProcessing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    disabled={isProcessing}
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <h3 className="font-medium">Project {index + 1}</h3>
                </div>
                <button
                  onClick={() => removeProject(project.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => updateProject(project.id, "name", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., E-commerce Platform with Real-time Analytics"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the project's purpose, your role, key challenges solved, and impact achieved. Focus on technical complexity and business value."
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    AI will enhance this to highlight impact, technical challenges, and achievements
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technologies Used <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={project.technologies.join(", ")}
                    onChange={(e) => updateTechnologies(project.id, e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., React, Node.js, MongoDB, Docker, AWS (comma separated)"
                    disabled={isProcessing}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate technologies with commas. AI will standardize naming and formatting.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={project.url}
                    onChange={(e) => updateProject(project.id, "url", e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/username/project or https://project-demo.com"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          );
        })}

        <button
          onClick={addProject}
          className="w-full py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
          disabled={isProcessing}
        >
          <Plus className="w-5 h-5 text-gray-500" />
          <span className="text-gray-500">Add Project</span>
        </button>

      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing with AI...</span>
            </>
          ) : (
            <span>AI FORMAT</span>
          )}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50"
          disabled={isProcessing}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}