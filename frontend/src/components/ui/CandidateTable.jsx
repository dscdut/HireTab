"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Users, Calendar, FileText, Briefcase, ChevronLeft, ChevronRight } from "lucide-react"
import { CANDIDATE_STATUSES } from "../../pages/HR/job-dashboard/constants/candidateConstants"
import StatusBadge from "./StatusBadge"
import { getNextStatus, getStatusButtonClass, getStatusConfig } from "@/core/shared/utils/statusUtils"
import { formatDate } from "@/core/helpers/utils"

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
  showJobName = false, // New prop to control job name column visibility
  refetchCandidates,
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const tabs = [
    CANDIDATE_STATUSES.ALL,
    CANDIDATE_STATUSES.IN_REVIEW,
    CANDIDATE_STATUSES.INTERVIEW,
    CANDIDATE_STATUSES.HIRED,
    CANDIDATE_STATUSES.REJECTED,
  ]

  // Define columns dynamically based on showJobName prop
  const columns = useMemo(() => [
    { key: "name", label: "Candidate", icon: Users, width: "w-56" },
    ...(showJobName ? [{ key: "jobPostingName", label: "Position", icon: Briefcase, width: "w-40" }] : []),
    { key: "createdAt", label: "Applied", icon: Calendar, width: "w-28" },
    { key: "resumeFile", label: "Resume", icon: FileText, width: "w-24" },
    { key: "status", label: "Status", icon: null, width: "w-32" },
    { key: "score", label: "Score", icon: null, width: "w-28" },
    { key: null, label: "Actions", icon: null, width: "w-32" },
  ], [showJobName])

  // Pagination logic
  const totalPages = Math.ceil(sortedCandidates.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentCandidates = sortedCandidates.slice(startIndex, endIndex)

  // Reset to first page when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
    if (refetchCandidates) {
      refetchCandidates()
    }
  }

  // Pagination component
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, sortedCandidates.length)} of {sortedCandidates.length} candidates
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === "..."}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : page === "..."
                    ? "text-gray-400 cursor-default"
                    : "text-gray- gốc tác giả:600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => {
            const count =
              tab === CANDIDATE_STATUSES.ALL ? candidates.length : candidates.filter((c) => c.status === tab).length
            const statusConfig = getStatusConfig(tab)
            const StatusIcon = statusConfig.icon

            return (
              <button
                key={tab}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-blue-600 bg-white"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab !== CANDIDATE_STATUSES.ALL && <StatusIcon className="w-4 h-4" />}
                <span>{tab}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    activeTab === tab ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="border-b border-blue-100 bg-blue-50">
            <tr>
              <th className="w-12 px-4 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedCandidates.size === currentCandidates.length && currentCandidates.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key || column.label}
                  className={`px-4 py-4 text-left text-sm font-semibold text-gray-900 ${column.width}`}
                >
                  {column.key ? (
                    <button
                      className="flex items-center w-full space-x-2 transition-colors hover:text-blue-600"
                      onClick={() => {
                        const direction =
                          sortConfig.key === column.key && sortConfig.direction === "asc" ? "desc" : "asc"
                        setSortConfig({ key: column.key, direction })
                      }}
                    >
                      {column.icon && <column.icon className="flex-shrink-0 w-4 h-4" />}
                      <span className="truncate">{column.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform flex-shrink-0 ${
                          sortConfig.key === column.key && sortConfig.direction === "asc" ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {column.icon && <column.icon className="flex-shrink-0 w-4 h-4" />}
                      <span className="truncate">{column.label}</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentCandidates.length > 0 ? (
              currentCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className={`hover:bg-gray-50 transition-colors ${selectedCandidates.has(candidate.id) ? "bg-blue-50" : ""}`}
                >
                  <td className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  
                  {/* Candidate Column */}
                  <td className="w-56 px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full">
                        <span className="text-sm font-medium text-blue-600">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{candidate.name}</div>
                        <div className="text-xs text-gray-500 truncate">{candidate.email}</div>
                        <div className="text-xs text-gray-400">{candidate.phone || "—"}</div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Position Column (Conditional) */}
                  {showJobName && (
                    <td className="w-40 px-4 py-4">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="flex-shrink-0 w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {candidate.jobPostingName}
                        </span>
                      </div>
                    </td>
                  )}
                  
                  {/* Applied Date Column */}
                  <td className="px-4 py-4 w-28">
                    <div className="text-sm text-gray-600">{formatDate(candidate.createdAt)}</div>
                  </td>
                  
                  {/* Resume Column */}
                  <td className="w-24 px-4 py-4">
                    {candidate.resumeFile ? (
                      <a
                        href={candidate.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </td>
                  
                  {/* Status Column */}
                  <td className="w-32 px-4 py-4">
                    <StatusBadge status={candidate.status} />
                  </td>
                  
                  {/* Score Column */}
                  <td className="px-4 py-4 w-28">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{candidate.score}%</div>
                      <div className="w-12 h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 transition-all bg-blue-500 rounded-full"
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Actions Column */}
                  <td className="w-32 px-4 py-4">
                    {getNextStatus(candidate.status) ? (
                      <button
                        onClick={() => onStatusTransition(candidate.id, candidate.status)}
                        className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-200 ${getStatusButtonClass(getNextStatus(candidate.status))}`}
                      >
                        → {getNextStatus(candidate.status)}
                      </button>
                    ) : (
                      <span className="text-xs font-medium text-gray-400">Final</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-8 py-16 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">No candidates found</p>
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
    </div>
  )
}