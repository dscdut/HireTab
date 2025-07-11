"use client"

import { ChevronDown, Users, Calendar, FileText, Mail, Briefcase } from "lucide-react"
import { CANDIDATE_STATUSES } from "./constants/candidateConstants"
import { getStatusConfig, getNextStatus, getStatusButtonClass, formatDate } from "./utils/candidateUtils"
import StatusBadge from "./StatusBadge"

export default function CandidateTableWithJobName({
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
}) {
  const tabs = [
    CANDIDATE_STATUSES.ALL,
    CANDIDATE_STATUSES.IN_REVIEW,
    CANDIDATE_STATUSES.INTERVIEW,
    CANDIDATE_STATUSES.HIRED,
    CANDIDATE_STATUSES.REJECTED,
  ]

  const columns = [
    { key: "name", label: "Candidate", icon: Users },
    { key: "jobPostingName", label: "Job Position", icon: Briefcase },
    { key: "createdAt", label: "Applied Date", icon: Calendar },
    { key: "resumeFile", label: "Resume", icon: FileText },
    { key: "status", label: "Status", icon: null },
    { key: "score", label: "Score", icon: null },
    { key: null, label: "Actions", icon: null },
    { key: "email", label: "Email", icon: Mail },
    { key: "phone", label: "Phone", icon: null },
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
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
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 flex items-center space-x-2 ${activeTab === tab
                  ? "text-blue-600 border-blue-600 bg-white"
                  : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-100"
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab !== CANDIDATE_STATUSES.ALL && <StatusIcon className="w-4 h-4" />}
                <span>{tab}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${activeTab === tab ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedCandidates.size === sortedCandidates.length && sortedCandidates.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={column.key || column.label}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {column.key ? (
                    <button
                      className="flex items-center space-x-2 hover:text-blue-600 transition-colors"
                      onClick={() => {
                        const direction =
                          sortConfig.key === column.key && sortConfig.direction === "asc" ? "desc" : "asc"
                        setSortConfig({ key: column.key, direction })
                      }}
                    >
                      {column.icon && <column.icon className="w-4 h-4" />}
                      <span>{column.label}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${sortConfig.key === column.key && sortConfig.direction === "asc" ? "rotate-180" : ""
                          }`}
                      />
                    </button>
                  ) : (
                    <div className="flex items-center space-x-2">
                      {column.icon && <column.icon className="w-4 h-4" />}
                      <span>{column.label}</span>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCandidates.length > 0 ? (
              sortedCandidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className={`hover:bg-gray-50 transition-colors ${selectedCandidates.has(candidate.id) ? "bg-blue-50" : ""
                    }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.has(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {candidate.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{candidate.jobPostingName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(candidate.createdAt)}</td>
                  <td className="px-6 py-4">
                    {candidate.resumeFile ? (
                      <a
                        href={candidate.resumeFile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm">No file</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={candidate.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium text-gray-900">{candidate.score}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getNextStatus(candidate.status) ? (
                      <button
                        onClick={() => onStatusTransition(candidate.id, candidate.status)}
                        className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-200 ${getStatusButtonClass(getNextStatus(candidate.status))}`}
                      >
                        → {getNextStatus(candidate.status)}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium">Final Status</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{candidate.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{candidate.phone || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Users className="w-12 h-12 text-gray-300" />
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
    </div>
  )
}
