"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import ConfirmModal from "./confirmModal"
import { getStatusButtonClass } from "@/core/shared/utils/statusUtils"

export default function BulkActionsBar({
  selectedCount,
  availableTransitions,
  onBulkStatusUpdate,
  onClearSelection,
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
    <div className="mb-6">
      <div className="px-4 py-3 bg-white border border-blue-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-900">
              {selectedCount} candidate{selectedCount !== 1 ? "s" : ""} selected
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {availableTransitions.map((status) => (
              <button
                key={status}

                onClick={() => handleMoveClick(status)}
                disabled={isLoading}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${getStatusButtonClass(status)}`}
              >
                {isLoading && (
                  <div className="w-3 h-3 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                )}
                <span>Move to {status}</span>
              </button>
            ))}
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
