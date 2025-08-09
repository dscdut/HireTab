"use client"

import { useState } from "react"
import { getStatusButtonClass } from "./utils/candidateUtils"
import { Check } from "lucide-react"
import ConfirmModal from "./ConfirmModal"

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
      <div className="bg-white rounded-lg shadow-sm border border-blue-200 px-4 py-3">
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
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>Move to {status}</span>
              </button>
            ))}
            <button
              onClick={onClearSelection}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
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
