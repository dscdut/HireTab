"use client"

import { useState, useEffect } from "react"
import { X, ArrowLeft, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function PersonalInfoPanel({ personalInfo, onUpdatePersonalInfo, onClose }) {
  const [formData, setFormData] = useState(personalInfo)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    setFormData(personalInfo);
  }, [personalInfo]);

  const callGeminiAPI = async (data) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `
    Please format and improve the following personal information data to match this exact structure and enhance the content quality:

    Expected format:
    {
      "fullName": "Professional formatted full name (proper capitalization)",
      "title": "Professional job title (e.g., Senior Software Engineer, Marketing Manager)",
      "email": "Validated email format",
      "phone": "Formatted phone number (e.g., (555) 123-4567)",
      "location": "City, State/Province, Country format",
      "summary": "Professional summary (2-3 sentences highlighting key skills and experience)",
      "linkedinUrl": "Complete LinkedIn URL (https://linkedin.com/in/profile)",
      "githubUrl": "Complete GitHub URL (https://github.com/username)",
      "websiteUrl": "Complete website URL (https://example.com)"
    }

    Input data:
    ${JSON.stringify(data, null, 2)}

    Rules:
    1. Improve the professional summary to be compelling and concise
    2. Ensure proper name capitalization and formatting
    3. Format phone numbers consistently
    4. Standardize location format (City, State, Country)
    5. Validate and format URLs properly
    6. Make job titles professional and clear
    7. Keep existing information but enhance professionalism
    8. If summary is empty or poor, create a professional one based on the job title
    9. Return ONLY the JSON object, no additional text

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

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.fullName?.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.email?.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing personal information with AI...");

    try {
      const formattedData = await callGeminiAPI(formData);
      setFormData(formattedData);
      onUpdatePersonalInfo(formattedData);
      toast.success("Personal information updated and formatted!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Error formatting data:", error);
      toast.error("AI formatting failed, using your input as-is", { id: toastId });
      onUpdatePersonalInfo(formData);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  }

  const handleChange = (field, value) => {
    const newData = {
      ...formData,
      [field]: value,
    };
    setFormData(newData);
    // Real-time update to preview
    onUpdatePersonalInfo(newData);
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Personal Information</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded" disabled={isProcessing}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your full name"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Job Title</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Senior Software Engineer"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="(555) 123-4567"
            disabled={isProcessing}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="City, State, Country"
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: City, State/Province, Country
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Professional Summary</label>
          <textarea
            value={formData.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Write a compelling professional summary highlighting your key skills and experience..."
            disabled={isProcessing}
          />
          <p className="text-xs text-gray-500 mt-1">
            AI will help create a professional summary if left blank
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Professional Links</h4>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedinUrl || ""}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">GitHub</label>
            <input
              type="url"
              value={formData.githubUrl || ""}
              onChange={(e) => handleChange("githubUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/yourusername"
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website/Portfolio</label>
            <input
              type="url"
              value={formData.websiteUrl || ""}
              onChange={(e) => handleChange("websiteUrl", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://yourportfolio.com"
              disabled={isProcessing}
            />
          </div>
        </div>
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