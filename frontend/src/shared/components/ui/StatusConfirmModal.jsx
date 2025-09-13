"use client"

import { Mail, User, X } from "lucide-react"

export default function StatusConfirmModal({ 
  open, 
  onClose, 
  onUpdateOnly,
  onUpdateWithEmail,
  message, 
  isLoading = false,
  candidateName = "",
  currentStatus = "",
  nextStatus = ""
}) {
  if (!open) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg p-8 mx-4 bg-white shadow-2xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-50">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-8 text-center">
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Update Candidate Status</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Candidate:</span> {candidateName}</p>
            <p>
              <span className="font-medium">Status Change:</span> 
              <span className="px-2 py-1 mx-1 text-xs bg-gray-100 rounded-full">{currentStatus}</span>
              →
              <span className="px-2 py-1 mx-1 text-xs text-blue-700 bg-blue-100 rounded-full">{nextStatus}</span>
            </p>
          </div>
          <p className="mt-4 leading-relaxed text-gray-600">
            How would you like to proceed?
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onUpdateOnly}
            disabled={isLoading}
            className="flex items-center w-full px-6 py-3 font-medium text-left text-gray-700 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100 disabled:opacity-50"
          >
            <User className="w-5 h-5 mr-3 text-gray-500" />
            <div>
              <div className="font-medium">Update Status Only</div>
              <div className="text-sm text-gray-500">Just change the status without notification</div>
            </div>
          </button>
          
          <button
            onClick={onUpdateWithEmail}
            disabled={isLoading}
            className="flex items-center w-full px-6 py-3 font-medium text-left text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50"
          >
            <Mail className="w-5 h-5 mr-3 text-white" />
            <div>
              <div className="font-medium">Update Status & Send Email</div>
              <div className="text-sm text-blue-100">Change status and compose notification email</div>
            </div>
          </button>
          
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full px-6 py-3 font-medium text-gray-500 transition-colors border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
