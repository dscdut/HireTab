"use client"

import { X } from "lucide-react"

export default function ColorSelector({ selectedColor, onSelectColor, onClose }) {
  const colors = [
    {
      id: "gray",
      name: "Gray",
      primary: "#374151",
      secondary: "#4B5563",
      description: "Professional gray tones",
    },
    {
      id: "blue",
      name: "Blue",
      primary: "#2563EB",
      secondary: "#3B82F6",
      description: "Trust and reliability",
    },
    {
      id: "black",
      name: "Black",
      primary: "#111827",
      secondary: "#374151",
      description: "Classic and timeless",
    },
    {
      id: "navy",
      name: "Navy",
      primary: "#1E3A8A",
      secondary: "#2563EB",
      description: "Corporate and authoritative",
    },
  ]

  return (
    <div className="absolute top-16 right-32 bg-white rounded-lg shadow-2xl border border-gray-200 p-6 z-50 w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Choose Color Scheme</h3>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        {colors.map((color) => (
          <div
            key={color.id}
            className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
              selectedColor === color.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            onClick={() => onSelectColor(color.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.primary }}
                  />
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color.secondary }}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{color.name}</p>
                  <p className="text-xs text-gray-600">{color.description}</p>
                </div>
              </div>
              {selectedColor === color.id && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>ATS-Safe Colors:</strong> All color schemes use professional tones that maintain readability in ATS
          systems.
        </p>
      </div>
    </div>
  )
}