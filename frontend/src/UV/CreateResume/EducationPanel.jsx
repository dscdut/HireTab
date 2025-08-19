"use client"

import { useState, useEffect } from "react"
import { X, ArrowLeft, Plus, Trash2, Loader2, GripVertical } from "lucide-react"
import toast from "react-hot-toast"

export default function EducationPanel({ education, onUpdateEducation, onClose }) {
  const [educationList, setEducationList] = useState(education)
  const [isProcessing, setIsProcessing] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverItem, setDragOverItem] = useState(null)

  useEffect(() => {
    setEducationList(education);
  }, [education]);

  // Real-time update function
  const updateEducationListRealTime = (newList) => {
    setEducationList(newList);
    onUpdateEducation(newList);
  }

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `
    Please format the following education data to match this exact structure and improve the content quality:

    Expected format:
    [
      {
        "id": number,
        "institution": "University/College Name",
        "degree": "Degree Type and Major (e.g., Bachelor of Science in Computer Science)",
        "startDate": "Year (e.g., 2015)",
        "endDate": "Year (e.g., 2019)",
        "location": "City, Country",
        "gpa": "GPA if 3.5 or higher (e.g., 3.8/4.0)",
        "relevantCoursework": "List relevant courses separated by commas"
      }
    ]

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Keep existing data but improve formatting and professionalism
    2. Ensure proper degree naming conventions
    3. Format GPA as X.X/4.0 or equivalent scale
    4. Include only relevant coursework that adds value
    5. Ensure proper location formatting (City, Country)
    6. Return ONLY the JSON array, no additional text

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
    // Filter out empty education entries
    const validEducation = educationList.filter(edu =>
      edu.institution.trim() && edu.degree.trim()
    );

    if (validEducation.length === 0) {
      toast.error("Please add at least one education entry");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing education with AI...");

    try {
      const formattedData = await callGeminiAPI(validEducation);
      updateEducationListRealTime(formattedData);
      toast.success("Education updated and formatted!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      updateEducationListRealTime(validEducation);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      institution: "",
      degree: "",
      startDate: "",
      endDate: "",
      location: "",
      gpa: "",
      relevantCoursework: "",
    }
    const newList = [...educationList, newEdu];
    updateEducationListRealTime(newList);
  }

  const updateEducation = (id, field, value) => {
    const newList = educationList.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu));
    updateEducationListRealTime(newList);
  }

  const removeEducation = (id) => {
    const newList = educationList.filter((edu) => edu.id !== id);
    updateEducationListRealTime(newList);
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

    const newList = [...educationList];
    const draggedEdu = newList[draggedItem];

    // Remove the dragged item
    newList.splice(draggedItem, 1);

    // Insert at new position
    newList.splice(dropIndex, 0, draggedEdu);

    updateEducationListRealTime(newList);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Education</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {educationList.map((edu, index) => {
          const isDragOver = dragOverItem === index;

          return (
            <div
              key={edu.id}
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
                  <h4 className="font-medium text-gray-700">Education {index + 1}</h4>
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Institution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., University of California, Berkeley"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Degree & Major <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Berkeley, CA, USA"
                  disabled={isProcessing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Start Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="2015"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="2019"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  GPA (Optional)
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="3.8/4.0 (only include if 3.5+)"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only include GPA if 3.5 or higher
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Relevant Coursework (Optional)
                </label>
                <textarea
                  value={edu.relevantCoursework}
                  onChange={(e) => updateEducation(edu.id, "relevantCoursework", e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Data Structures, Algorithms, Database Systems, Software Engineering"
                  disabled={isProcessing}
                />
                <p className="text-xs text-gray-500 mt-1">
                  List courses relevant to your target job, separated by commas
                </p>
              </div>
            </div>
          );
        })}

        <button
          onClick={addEducation}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2 transition-colors"
          disabled={isProcessing}
        >
          <Plus className="w-5 h-5" />
          <span>Add Education</span>
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