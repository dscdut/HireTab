"use client"

import { useState } from "react"
import { ChevronDown, Users, Calendar, FileText, Mail, ChevronLeft, ChevronRight, X, Check } from "lucide-react"
import { CANDIDATE_STATUSES } from "./constants/candidateConstants"
import { getStatusConfig, getNextStatus, getStatusButtonClass, formatDate } from "./utils/candidateUtils"
import StatusBadge from "./StatusBadge"
import { candidateApi } from "@/core/services/candidate.service"

// Enhanced ConfirmModal with modern design
function ConfirmModal({ open, onClose, onConfirm, message, isLoading = false }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-50 rounded-full">
          <Check className="w-8 h-8 text-blue-600" />
        </div>
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Action</h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced NotificationModal
function NotificationModal({ open, onClose, message, type = "success" }) {
  if (!open) return null

  const isSuccess = type === "success"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <div
          className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full ${isSuccess ? "bg-green-50" : "bg-red-50"
            }`}
        >
          {isSuccess ? <Check className="w-8 h-8 text-green-600" /> : <X className="w-8 h-8 text-red-600" />}
        </div>
        <div className="text-center mb-8">
          <h3 className={`text-xl font-semibold mb-2 ${isSuccess ? "text-green-900" : "text-red-900"}`}>
            {isSuccess ? "Success!" : "Error"}
          </h3>
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={() => {
            onClose()
            window.location.reload()
          }}
          className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] ${isSuccess
            ? "bg-green-600 hover:bg-green-700 text-white hover:shadow-lg"
            : "bg-red-600 hover:bg-red-700 text-white hover:shadow-lg"
            }`}
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default function CandidateTable({
  activeTab,
  setActiveTab,
  candidates,
  sortedCandidates,
  selectedCandidates,
  toggleSelectAll,
  toggleCandidateSelection,
  sortConfig,
  setSortConfig,
  onStatusTransition,
  refetchCandidates
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10
  const [confirmModal, setConfirmModal] = useState({ open: false, candidateId: null, nextStatus: null })
  const [notifyModal, setNotifyModal] = useState({ open: false, message: "", type: "success" })
  const [isLoading, setIsLoading] = useState(false)

  const tabs = [
    CANDIDATE_STATUSES.ALL,
    CANDIDATE_STATUSES.IN_REVIEW,
    CANDIDATE_STATUSES.INTERVIEW,
    CANDIDATE_STATUSES.HIRED,
    CANDIDATE_STATUSES.REJECTED,
  ]

  const columns = [
    { key: "name", label: "Candidate", icon: Users },
    { key: "createdAt", label: "Applied Date", icon: Calendar },
    { key: "resumeFile", label: "Resume", icon: FileText },
    { key: "status", label: "Status", icon: null },
    { key: "score", label: "Score", icon: null },
    { key: null, label: "Actions", icon: null },
    { key: "email", label: "Email", icon: Mail },
    { key: "phone", label: "Phone", icon: null },
  ]

  // Pagination logic
  const totalPages = Math.ceil(sortedCandidates.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentCandidates = sortedCandidates.slice(startIndex, endIndex)

  // Reset to first page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }
  // Enhanced Pagination component
  const PaginationComponent = () => {
    if (sortedCandidates.length <= rowsPerPage) return null

    const getPageNumbers = () => {
      const pages = []
      const maxVisiblePages = 5

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        let startPage = Math.max(2, currentPage - 1)
        let endPage = Math.min(totalPages - 1, currentPage + 1)

        if (currentPage <= 3) {
          endPage = Math.min(4, totalPages - 1)
        }
        if (currentPage >= totalPages - 2) {
          startPage = Math.max(2, totalPages - 3)
        }

        if (startPage > 2) {
          pages.push("...")
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }

        if (endPage < totalPages - 1) {
          pages.push("...")
        }

        if (totalPages > 1) {
          pages.push(totalPages)
        }
      }
      return pages
    }

    return (

      <div className="flex items-center justify-between px-8 py-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center text-sm font-medium text-gray-600">
          <span>
            Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-gray-900">{Math.min(endIndex, sortedCandidates.length)}</span> of{" "}
            <span className="font-semibold text-gray-900">{sortedCandidates.length}</span> candidates
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md border border-gray-200"
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${page === currentPage
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md border border-gray-200"
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md border border-gray-200"
              }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (

    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Enhanced Tabs */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const count =
              tab === CANDIDATE_STATUSES.ALL ? candidates.length : candidates.filter((c) => c.status === tab).length
            const statusConfig = getStatusConfig(tab)
            const StatusIcon = statusConfig.icon

            return (
              <button
                key={tab}
                className={`px-8 py-6 text-sm font-semibold whitespace-nowrap border-b-3 transition-all duration-300 flex items-center gap-3 hover:bg-white/80 ${activeTab === tab
                  ? "text-blue-700 border-blue-600 bg-white shadow-sm"
                  : "text-gray-600 border-transparent hover:text-gray-900"
                  }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab !== CANDIDATE_STATUSES.ALL && <StatusIcon className="w-5 h-5" />}
                <span className="text-base">{tab}</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${activeTab === tab ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Enhanced Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <tr>
              <th className="px-8 py-5 text-left">
                <input
                  type="checkbox"
                  checked={selectedCandidates.size === currentCandidates.length && currentCandidates.length > 0}
                  onChange={toggleSelectAll}

                  className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key || column.label}
                  className={`px-8 py-5 text-left text-sm font-bold text-gray-800 ${column.key === "createdAt" ? "whitespace-nowrap" : ""
                    }`}
                >
                  {column.key ? (
                    <button
                      className="flex items-center gap-3 hover:text-blue-700 transition-all duration-200 group"
                      onClick={() => {
                        const direction =
                          sortConfig.key === column.key && sortConfig.direction === "asc" ? "desc" : "asc"
                        setSortConfig({ key: column.key, direction })
                      }}
                    >
                      {column.icon && (
                        <column.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      )}
                      <span className="text-base">{column.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-200 ${sortConfig.key === column.key && sortConfig.direction === "asc" ? "rotate-180" : ""
                          } group-hover:scale-110`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center gap-3">
                      {column.icon && <column.icon className="w-5 h-5" />}
                      <span className="text-base">{column.label}</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentCandidates.length > 0 ? (
              currentCandidates.map((candidate, index) => (
                <tr
                  key={candidate.id}
                  className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group ${selectedCandidates.has(candidate.id) ? "bg-blue-50 shadow-sm" : ""
                    }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-8 py-6">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                    />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <span className="text-lg font-bold text-white">{candidate.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <div
                          className="text-base font-semibold text-gray-900 truncate max-w-[200px] cursor-pointer hover:text-blue-700 transition-colors duration-200"
                          title={candidate.name}
                        >
                          {candidate.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-600">{formatDate(candidate.createdAt)}</td>
                  <td className="px-8 py-6">
                    {candidate.resumeFile ? (
                      <a
                        href={candidate.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:bg-blue-50 px-3 py-2 rounded-lg transition-all duration-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Resume</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm font-medium">No file</span>
                    )}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap">
                    <StatusBadge status={candidate.status} />
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="text-base font-bold text-gray-900">{candidate.score}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {getNextStatus(candidate.status) ? (
                      <button
                        onClick={() =>
                          setConfirmModal({
                            open: true,
                            candidateId: candidate.id,
                            nextStatus: getNextStatus(candidate.status),
                          })
                        }
                        className={`px-4 py-2 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg ${getStatusButtonClass(getNextStatus(candidate.status))}`}
                      >
                        → {getNextStatus(candidate.status)}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm font-medium bg-gray-100 px-4 py-2 rounded-xl">
                        Final Status
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-600">{candidate.email}</td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-600">{candidate.phone || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
             <p className="text-sm font-medium text-gray-900">No candidates found</p>
                <td colSpan={9} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">No candidates found</p>
                      <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <PaginationComponent />

      {/* Enhanced Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        message={`Are you sure you want to change the status to '${confirmModal.nextStatus}'?`}
        isLoading={isLoading}
        onClose={() => setConfirmModal({ open: false, candidateId: null, nextStatus: null })}
        onConfirm={async () => {
          setIsLoading(true)
          try {
            await candidateApi.updateStatus(confirmModal.candidateId, confirmModal.nextStatus)
            setConfirmModal({ open: false, candidateId: null, nextStatus: null })
            onStatusTransition(confirmModal.candidateId, confirmModal.nextStatus)
            setNotifyModal({ open: true, message: "Status updated successfully!", type: "success" })
            if (refetchCandidates) refetchCandidates()
          } catch (e) {
            setConfirmModal({ open: false, candidateId: null, nextStatus: null })
            setNotifyModal({ open: true, message: "Failed to update status. Please try again.", type: "error" })
          } finally {
            setIsLoading(false)
          }
        }}
      />

      {/* Enhanced Notification Modal */}
      <NotificationModal
        open={notifyModal.open}
        message={notifyModal.message}
        type={notifyModal.type}
        onClose={() => setNotifyModal({ open: false, message: "", type: "success" })}
      />
    </div>
  )
}