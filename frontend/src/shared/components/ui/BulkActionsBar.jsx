"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import ConfirmModal from "./confirmModal"
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
  // Thêm state cho modal
  const [modal, setModal] = useState({ open: false, status: null })

  const handleMoveClick = (status) => {
    setModal({ open: true, status })
  }

  const handleConfirm = async () => {
    if (modal.status) {
      await onBulkStatusUpdate(modal.status)
      setModal({ open: false, status: null })
    }
  }

  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">{selectedCount}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">selected</span>
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          {/* Status Update Actions */}
          <div className="flex items-center space-x-2">
            {availableTransitions.map((status) => (
              <div key={status} className="flex items-center space-x-1">
                <button
                  onClick={() => onBulkStatusUpdate(status)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Move to {status}
                  {shouldSendEmailForStatus(status) && <span className="ml-1">📧</span>}
                </button>
                {/* Only show manual email button for statuses that support emails */}
                {shouldSendEmailForStatus(status) && (
                  <button
                    onClick={() => onSendStatusEmail(status)}
                    className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    title={`Preview ${status} email template`}
                  >
                    👁️
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="h-6 w-px bg-gray-300"></div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClearSelection}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Modal xác nhận */}
      <ConfirmModal
        open={modal.open}
        message={`Are you sure you want to move ${selectedCount} candidate(s) to '${modal.status}'?`}
        isLoading={isLoading}
        onClose={() => setModal({ open: false, status: null })}
        onConfirm={handleConfirm}
      />
    </div>
  )
}
