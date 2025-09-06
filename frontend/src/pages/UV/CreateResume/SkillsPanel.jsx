"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, X, Plus, Trash2, Loader2, Edit2, GripVertical } from "lucide-react"
import toast from "react-hot-toast"

export default function SkillsPanel({ skills, onUpdateSkills, onClose }) {
  const [localSkills, setLocalSkills] = useState(skills)
  const [isProcessing, setIsProcessing] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [draggedCategory, setDraggedCategory] = useState(null)
  const [dragOverCategory, setDragOverCategory] = useState(null)
  const [draggedSkill, setDraggedSkill] = useState(null)
  const [dragOverSkill, setDragOverSkill] = useState(null)

  useEffect(() => {
    setLocalSkills(skills);
  }, [skills]);

  // Real-time update function để preview ngay lập tức
  const updateSkillsRealTime = (newSkills) => {
    setLocalSkills(newSkills);
    onUpdateSkills(newSkills);
  };

  // Default categories với thông tin mẫu
  const defaultCategoryInfo = {
    TechnicalSkills: {
      title: "Technical Skills",
      placeholder: "e.g., Web Development, Database Design, System Architecture",
      examples: "Web Development, API Design, Database Management, Cloud Computing"
    },
    ProgrammingLanguages: {
      title: "Programming Languages",
      placeholder: "e.g., JavaScript, Python, Java, C++",
      examples: "JavaScript, Python, Java, TypeScript, Go, C#"
    },
    ToolsAndTechnologies: {
      title: "Tools & Technologies",
      placeholder: "e.g., React, Docker, AWS, Git",
      examples: "React, Node.js, Docker, AWS, Git, MongoDB, PostgreSQL"
    },
    SoftSkills: {
      title: "Soft Skills",
      placeholder: "e.g., Leadership, Communication, Problem Solving",
      examples: "Leadership, Team Management, Problem Solving, Communication"
    }
  };

  // Function để tạo category info cho custom categories
  const getCategoryInfo = (categoryKey) => {
    if (defaultCategoryInfo[categoryKey]) {
      return defaultCategoryInfo[categoryKey];
    }

    // Tạo info mặc định cho custom categories
    return {
      title: categoryKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim(),
      placeholder: "Enter skills for this category...",
      examples: "Add relevant skills for this category"
    };
  };

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    // Tạo prompt động dựa trên categories hiện có
    const categoryList = Object.keys(data).map(key => `"${key}"`).join(', ');

    const prompt = `
    Please format the following skills data to match this exact structure and improve the categorization:

    Expected format:
    {
      ${Object.keys(data).map(key => `"${key}": ["skill1", "skill2", "skill3"]`).join(',\n      ')}
    }

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Properly categorize skills into the existing categories: ${categoryList}
    2. Remove duplicates and empty entries
    3. Use professional terminology and proper capitalization
    4. Maintain the existing category structure
    5. Only use the categories provided, do not add new ones
    6. Return ONLY the JSON object, no additional text

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
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Could not parse JSON from Gemini response");
    }

    return JSON.parse(jsonMatch[0]);
  };

  const handleDone = async () => {
    // Filter out empty skills
    const cleanedSkills = {};
    Object.keys(localSkills).forEach(category => {
      cleanedSkills[category] = localSkills[category].filter(skill => skill.trim() !== "");
    });

    setIsProcessing(true);
    const toastId = toast.loading("Processing skills with AI...");

    try {
      const formattedData = await callGeminiAPI(cleanedSkills);
      updateSkillsRealTime(formattedData);
      toast.success("Skills updated and categorized!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      updateSkillsRealTime(cleanedSkills);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    setLocalSkills(skills);
    onClose();
  };

  const addSkill = (category) => {
    const newSkills = {
      ...localSkills,
      [category]: [...(localSkills[category] || []), ""]
    };
    updateSkillsRealTime(newSkills);
  };

  const updateSkill = (category, index, value) => {
    const newSkills = {
      ...localSkills,
      [category]: localSkills[category].map((skill, i) => i === index ? value : skill)
    };
    updateSkillsRealTime(newSkills);
  };

  const removeSkill = (category, index) => {
    const newSkills = {
      ...localSkills,
      [category]: localSkills[category].filter((_, i) => i !== index)
    };
    updateSkillsRealTime(newSkills);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    // Tạo camelCase key từ tên category
    const categoryKey = newCategoryName
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');

    if (localSkills[categoryKey]) {
      toast.error("Category already exists");
      return;
    }

    const newSkills = {
      ...localSkills,
      [categoryKey]: []
    };
    updateSkillsRealTime(newSkills);
    setNewCategoryName("");
    setShowAddCategory(false);
  };

  const removeCategory = (categoryKey) => {
    if (Object.keys(localSkills).length <= 1) {
      toast.error("Must have at least one category");
      return;
    }

    const { [categoryKey]: _, ...rest } = localSkills;
    updateSkillsRealTime(rest);
  };

  const updateCategoryName = (oldKey, newName) => {
    if (!newName.trim()) return;

    const newKey = newName
      .split(' ')
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join('');

    if (newKey !== oldKey && localSkills[newKey]) {
      toast.error("Category name already exists");
      return;
    }

    const { [oldKey]: skills, ...rest } = localSkills;
    const newSkills = {
      ...rest,
      [newKey]: skills
    };
    updateSkillsRealTime(newSkills);
    setEditingCategory(null);
  };

  const handleCategoryDragStart = (e, categoryKey) => {
    setDraggedCategory(categoryKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e, categoryKey) => {
    e.preventDefault();
    setDragOverCategory(categoryKey);
  };

  const handleCategoryDragLeave = () => {
    setDragOverCategory(null);
  };

  const handleCategoryDrop = (e, dropCategoryKey) => {
    e.preventDefault();
    if (draggedCategory === dropCategoryKey) return;

    const newSkills = {};
    const categories = Object.keys(localSkills).filter(key => key !== draggedCategory);
    const dropIndex = categories.indexOf(dropCategoryKey);

    if (dropIndex === -1) {
      categories.push(draggedCategory);
    } else {
      categories.splice(dropIndex, 0, draggedCategory);
    }

    categories.forEach(key => {
      newSkills[key] = localSkills[key];
    });

    updateSkillsRealTime(newSkills);
    setDraggedCategory(null);
    setDragOverCategory(null);
  };

  const handleSkillDragStart = (e, categoryKey, skillIndex) => {
    setDraggedSkill({ categoryKey, skillIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleSkillDragOver = (e, categoryKey, skillIndex) => {
    e.preventDefault();
    setDragOverSkill({ categoryKey, skillIndex });
  };

  const handleSkillDragLeave = () => {
    setDragOverSkill(null);
  };

  const handleSkillDrop = (e, dropCategoryKey, dropSkillIndex) => {
    e.preventDefault();
    if (!draggedSkill) return;

    const { categoryKey: dragCategoryKey, skillIndex: dragSkillIndex } = draggedSkill;

    if (dragCategoryKey === dropCategoryKey && dragSkillIndex === dropSkillIndex) return;

    const newSkills = { ...localSkills };

    // Get the dragged skill
    const dragged = newSkills[dragCategoryKey][dragSkillIndex];

    // Remove from original position
    newSkills[dragCategoryKey].splice(dragSkillIndex, 1);

    // Insert into new position
    if (dragCategoryKey === dropCategoryKey) {
      // Same category
      newSkills[dropCategoryKey].splice(dropSkillIndex, 0, dragged);
    } else {
      // Different category
      newSkills[dropCategoryKey].splice(dropSkillIndex, 0, dragged);
    }

    updateSkillsRealTime(newSkills);
    setDraggedSkill(null);
    setDragOverSkill(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.keys(localSkills).map((categoryKey) => {
          const categoryInfo = getCategoryInfo(categoryKey);
          const isCategoryDragOver = dragOverCategory === categoryKey;

          return (
            <div
              key={categoryKey}
              className={`border border-gray-200 rounded-lg p-4 space-y-3 transition-all duration-200 ${isCategoryDragOver ? 'bg-blue-50 border-blue-400' : ''
                }`}
              draggable={!isProcessing}
              onDragStart={(e) => handleCategoryDragStart(e, categoryKey)}
              onDragOver={(e) => handleCategoryDragOver(e, categoryKey)}
              onDragLeave={handleCategoryDragLeave}
              onDrop={(e) => handleCategoryDrop(e, categoryKey)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                    disabled={isProcessing}
                  >
                    <GripVertical className="w-4 h-4" />
                  </button>
                  {editingCategory === categoryKey ? (
                    <input
                      type="text"
                      defaultValue={categoryInfo.title}
                      onBlur={(e) => updateCategoryName(categoryKey, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateCategoryName(categoryKey, e.target.value);
                        }
                        if (e.key === 'Escape') {
                          setEditingCategory(null);
                        }
                      }}
                      className="font-medium text-gray-800 px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      disabled={isProcessing}
                    />
                  ) : (
                    <h4 className="font-medium text-gray-700">{categoryInfo.title}</h4>
                  )}
                  <button
                    onClick={() => setEditingCategory(categoryKey)}
                    className="text-gray-400 hover:text-gray-600"
                    disabled={isProcessing}
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => addSkill(categoryKey)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    disabled={isProcessing}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeCategory(categoryKey)}
                    className="text-red-500 hover:text-red-700 text-sm"
                    disabled={isProcessing || Object.keys(localSkills).length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-2">
                Examples: {categoryInfo.examples}
              </div>

              <div className="space-y-2">
                {localSkills[categoryKey]?.map((skill, index) => {
                  const isSkillDragOver = dragOverSkill?.categoryKey === categoryKey && dragOverSkill?.skillIndex === index;

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-1 rounded transition-all duration-200 ${isSkillDragOver ? 'bg-blue-100 border-l-4 border-blue-400' : ''
                        }`}
                      draggable={!isProcessing && skill.trim() !== ''}
                      onDragStart={(e) => handleSkillDragStart(e, categoryKey, index)}
                      onDragOver={(e) => handleSkillDragOver(e, categoryKey, index)}
                      onDragLeave={handleSkillDragLeave}
                      onDrop={(e) => handleSkillDrop(e, categoryKey, index)}
                    >
                      <button
                        className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
                        disabled={isProcessing || skill.trim() === ''}
                      >
                        <GripVertical className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateSkill(categoryKey, index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={categoryInfo.placeholder}
                        disabled={isProcessing}
                      />
                      <button
                        onClick={() => removeSkill(categoryKey, index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                        disabled={isProcessing}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                }) || []}

                {(!localSkills[categoryKey] || localSkills[categoryKey].length === 0) && (
                  <div className="text-xs text-gray-400 italic py-2">
                    No {categoryInfo.title.toLowerCase()} added yet. Click "Add" to get started.
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Add Category Section */}
        <div className="border-t pt-4">
          {showAddCategory ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCategory();
                    }
                    if (e.key === 'Escape') {
                      setShowAddCategory(false);
                      setNewCategoryName("");
                    }
                  }}
                  autoFocus
                  disabled={isProcessing}
                />
                <button
                  onClick={addCategory}
                  className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
                  disabled={isProcessing}
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAddCategory(true)}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-gray-500 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center space-x-2 transition-colors"
              disabled={isProcessing}
            >
              <Plus className="w-5 h-5" />
              <span>Add New Category</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex space-x-2">
        <button
          onClick={handleDone}
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
          onClick={handleCancel}
          className="flex-1 border border-gray-300 py-3 px-4 rounded-md hover:bg-gray-50 disabled:opacity-50"
          disabled={isProcessing}
        >
          CANCEL
        </button>
      </div>
    </div>
  )
}