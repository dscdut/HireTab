"use client"

import { X, FileText, Minimize, Briefcase } from "lucide-react"

// Component Preview Button with background patterns
function PreviewButton({ template, isSelected, onClick }) {
  const getPreviewStyle = (templateId) => {
    const baseStyle = "w-full h-32 rounded mb-2 border flex flex-col justify-between p-3 text-white text-xs"
    
    switch (templateId) {
      case "modern":
        return {
          className: baseStyle,
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            border: "1px solid #e2e8f0"
          }
        }
      case "minimalist":
        return {
          className: baseStyle,
          style: {
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            border: "1px solid #e2e8f0",
            color: "#333"
          }
        }
      case "classic":
        return {
          className: baseStyle + " font-serif",
          style: {
            background: "linear-gradient(135deg, #e2e8f0 0%, #f7fafc 100%)",
            border: "1px solid #e2e8f0",
            color: "#333"
          }
        }
      default:
        return {
          className: baseStyle,
          style: {
            background: "#f7fafc",
            border: "1px solid #e2e8f0",
            color: "#4a5568"
          }
        }
    }
  }

  const getIcon = (templateId) => {
    switch (templateId) {
      case "modern":
        return <Briefcase className="w-4 h-4" />
      case "minimalist":
        return <Minimize className="w-4 h-4" />
      case "classic":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const previewStyle = getPreviewStyle(template.id)

  return (
    <div
      className={previewStyle.className}
      style={previewStyle.style}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {getIcon(template.id)}
        <div className="text-right opacity-75">
          CV
        </div>
      </div>
      
      <div className="space-y-1 opacity-80">
        <div className="h-1 bg-white bg-opacity-50 rounded w-3/4"></div>
        <div className="h-1 bg-white bg-opacity-50 rounded w-1/2"></div>
        <div className="h-1 bg-white bg-opacity-50 rounded w-5/6"></div>
      </div>
      
      <div className="flex justify-between items-end">
        <div className="text-xs opacity-75">{template.name}</div>
        <div className="w-2 h-2 bg-white bg-opacity-50 rounded-full"></div>
      </div>
    </div>
  )
}

export default function TemplateSelector({ selectedTemplate, onSelectTemplate, onClose }) {
  const templates = [
    {
      id: "modern",
      name: "Modern",
      description: "Modern two-column layout with sidebar for contact and skills, ideal for corporate roles",
    },
    {
      id: "minimalist",
      name: "Minimalist",
      description: "Clean two-column design with photo and minimal styling, perfect for analytical roles",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional one-column layout with serif fonts, suitable for formal industries",
    },
  ]

  return (
    <div className="absolute top-16 right-44 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50 w-[600px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Choose ATS Template</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`cursor-pointer border-2 rounded-lg p-3 transition-all duration-200 ${
              selectedTemplate === template.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <PreviewButton
              template={template}
              isSelected={selectedTemplate === template.id}
              onClick={() => onSelectTemplate(template.id)}
            />
            <h4 className="font-medium text-sm text-gray-900">{template.name}</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{template.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>ATS-Optimized:</strong> All templates are designed to pass Applicant Tracking Systems with clean
          formatting and standard fonts.
        </p>
      </div>
    </div>
  )
}