"use client"

import { useState, useEffect } from "react"
import { X, ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react"
import toast from "react-hot-toast"

export default function ExperiencePanel({ experience, onUpdateExperience, onClose }) {
  const [experienceList, setExperienceList] = useState(experience)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  useEffect(() => {
    setExperienceList(experience);
  }, [experience]);

  // Real-time update function
  const updateExperienceListRealTime = (newList) => {
    setExperienceList(newList);
    onUpdateExperience(newList);
  }

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `
    Please format the following work experience data to match this exact structure and improve the content quality:

    Expected format:
    [
      {
        "id": number,
        "company": "Company Name",
        "position": "Job Title", 
        "startDate": "Month Year format (e.g., Jan 2020)",
        "endDate": "Month Year or Present",
        "current": boolean,
        "location": "City, Country",
        "description": [
          "Action-oriented bullet point with quantified achievements",
          "Another bullet highlighting key responsibilities and results", 
          "Third bullet showing impact and skills used"
        ]
      }
    ]

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Keep existing data but improve formatting and professionalism
    2. Convert description text to bullet points if needed
    3. Make bullet points action-oriented with strong verbs (Led, Developed, Implemented, etc.)
    4. Add quantified results where possible based on role
    5. Ensure proper date formatting (Month Year)
    6. Set current = true if endDate contains "Present" or "Current"
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

  const handleSubmit = async () => {
    // Filter out empty experiences
    const validExperiences = experienceList.filter(exp =>
      exp.company.trim() && exp.position.trim()
    );

    if (validExperiences.length === 0) {
      toast.error("Please add at least one work experience");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing work experience with AI...");

    try {
      const formattedData = await callGeminiAPI(validExperiences);
      updateExperienceListRealTime(formattedData);
      toast.success("Work experience updated and formatted!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      updateExperienceListRealTime(validExperiences);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      location: "",
      description: ""
    }
    const newList = [...experienceList, newExp];
    updateExperienceListRealTime(newList);
  }

  const updateExperience = (id, field, value) => {
    const newList = experienceList.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp));
    updateExperienceListRealTime(newList);
  }

  const removeExperience = (id) => {
    const newList = experienceList.filter((exp) => exp.id !== id);
    updateExperienceListRealTime(newList);
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

    const newList = [...experienceList];
    const draggedExp = newList[draggedItem];

    // Remove the dragged item
    newList.splice(draggedItem, 1);

    // Insert at new position
    newList.splice(dropIndex, 0, draggedExp);

    updateExperienceListRealTime(newList);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Work Experience</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {experienceList.map((exp, index) => {
          const isDragOver = dragOverItem === index;

          return (
            <div
              key={exp.id}
              className={`border border-gray-200 rounded-lg p-4 space-y-4 transition-all duration-200 ${isDragOver ? 'bg-blue-50 border-blue-400 shadow-lg' : ''
                }`}
              draggable={!isProcessing}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    disabled={isProcessing}
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  <h4 className="font-medium text-gray-700">Experience {index + 1}</h4>
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Tech Innovations Inc."
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ho Chi Minh City, Vietnam"
                  disabled={isProcessing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Jan 2020"
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Present or Dec 2023"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      updateExperience(exp.id, "current", e.target.checked)
                      if (e.target.checked) {
                        updateExperience(exp.id, "endDate", "Present")
                      }
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    disabled={isProcessing}
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your key responsibilities and achievements. AI will format this into professional bullet points with quantified results."
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  AI will convert this into action-oriented bullet points with quantified achievements
                </p>
              </div>
            </div>
          );
        })}

        <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2 transition-colors"
          disabled={isProcessing}
        >
          <Plus className="w-5 h-5" />
          <span>Add Work Experience</span>
        </button>
      </div>

      <div className="p-4 border-t flex space-x-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          className="flex-1 border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
          disabled={isProcessing}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}