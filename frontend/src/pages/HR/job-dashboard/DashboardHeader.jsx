"use client"

import { Search, Filter, Users, Mail } from "lucide-react"
import { SORT_OPTIONS } from "./constants/candidateConstants"

export default function DashboardHeader({
  jobName,
  candidatesCount,
  searchQuery,
  setSearchQuery,
  showFilterPanel,
  setShowFilterPanel,
  filtersCount,
  sortConfig,
  setSortConfig,
  selectedCandidatesCount,
  onSendEmail,
}) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 top-0 z-50 backdrop-blur-sm">
      <div className="px-6 py-4 min-h-[80px]">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Left side - Job info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{jobName}</h1>
                <p className="text-sm text-gray-500">{candidatesCount} total candidates</p>
              </div>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="flex items-center space-x-3 flex-wrap">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2.5 w-64 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Button */}
            <button
              className={`px-4 py-2.5 border rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200 ${showFilterPanel
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {filtersCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">{filtersCount}</span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Sort:</span>
              <select
                className="px-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={`${sortConfig.key}-${sortConfig.direction}`}
                onChange={(e) => {
                  const [key, direction] = e.target.value.split("-")
                  setSortConfig({ key, direction })
                }}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Send Email Button */}
            <button
              className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200 ${selectedCandidatesCount > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              onClick={onSendEmail}
              disabled={selectedCandidatesCount === 0}
            >
              <Mail className="w-4 h-4" />
              <span>Send Email ({selectedCandidatesCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}