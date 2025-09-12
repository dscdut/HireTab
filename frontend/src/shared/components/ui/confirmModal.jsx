"use client"

import { Check } from "lucide-react"

export default function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  onCancel = onClose, 
  message, 
  isLoading = false, 
  confirmText = "Confirm", 
  cancelText = "Cancel" 
}) {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md p-8 mx-4 bg-white shadow-2xl rounded-2xl">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-blue-50">
          <Check className="w-8 h-8 text-blue-600" />
        </div>
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Confirm Action</h3>
          <p className="leading-relaxed text-gray-600">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 font-medium text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}