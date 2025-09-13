"use client"

import { Check, Mail } from "lucide-react"
import { getStatusButtonClass } from "@/core/shared/utils/statusUtils"
import { shouldSendEmailForStatus } from "@/core/shared/utils/emailTemplates"

export default function BulkActionsBar({
  selectedCount,
  availableTransitions,
  onBulkStatusUpdate,
  onClearSelection,
  onSendStatusEmail,
  isLoading,
}) {
  if (selectedCount === 0) return null

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {selectedCount} candidate{selectedCount > 1 ? 's' : ''} selected
            </span>
          </div>

          {/* Status Update Actions */}
          <div className="flex items-center space-x-2">
            {availableTransitions.map((status) => (
              <div key={status} className="flex items-center space-x-1">
                <button
                  onClick={() => onBulkStatusUpdate(status)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 ${getStatusButtonClass(status)} disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md`}
                >
                  Move to {status}
                </button>
                {shouldSendEmailForStatus(status) && (
                  <button
                    onClick={() => onSendStatusEmail(status)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    title={`Preview ${status} email template`}
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClearSelection}
          className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Clear Selection
        </button>
      </div>
    </div>
  )
}