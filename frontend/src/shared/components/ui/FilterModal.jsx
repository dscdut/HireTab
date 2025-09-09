"use client"

import { Filter, X } from "lucide-react"
import { FILTER_FIELDS, FILTER_OPERATORS } from "../../../features/hr/job-dashboard/constants/candidateConstants"

export default function FilterModal({
  showFilterPanel,
  setShowFilterPanel,
  filters,
  setFilters,
  filterLogic,
  setFilterLogic,
}) {
  const addFilter = () => {
    setFilters([...filters, { field: "name", operator: "contains", value: "" }])
  }

  const updateFilter = (index, field, value) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [field]: value }
    setFilters(newFilters)
  }

  const removeFilter = (index) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const clearAllFilters = () => {
    setFilters([])
  }

  if (!showFilterPanel) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced Filters</h3>
          </div>
          <button
            onClick={() => setShowFilterPanel(false)}
            className="p-2 transition-colors rounded-lg hover:bg-gray-200"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-gray-700">Filter Logic</label>
            <select
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterLogic}
              onChange={(e) => setFilterLogic(e.target.value)}
            >
              <option value="all">Meet all conditions (AND)</option>
              <option value="any">Meet any condition (OR)</option>
            </select>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Filter Conditions</h4>
              <button
                onClick={addFilter}
                className="flex items-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                <span>+ Add Filter</span>
              </button>
            </div>

            {filters.length === 0 ? (
              <div className="py-12 text-center">
                <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="font-medium text-gray-500">No filters added yet</p>
                <p className="mt-1 text-sm text-gray-400">Click "Add Filter" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filters.map((filter, index) => {
                  const fieldConfig = FILTER_FIELDS.find((f) => f.value === filter.field)
                  const operators = FILTER_OPERATORS[fieldConfig?.type || "text"]

                  return (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="grid items-center grid-cols-12 gap-4">
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-700">
                            {index === 0 ? "Where" : filterLogic === "all" ? "And" : "Or"}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter.field}
                            onChange={(e) => updateFilter(index, "field", e.target.value)}
                          >
                            {FILTER_FIELDS.map((field) => (
                              <option key={field.value} value={field.value}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3">
                          <select
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={filter.operator}
                            onChange={(e) => updateFilter(index, "operator", e.target.value)}
                          >
                            {operators.map((op) => (
                              <option key={op.value} value={op.value}>
                                {op.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-4">
                          {filter.field === "createdAt" ? (
                            filter.operator === "between" ? (
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={filter.value?.split(",")[0] || ""}
                                  onChange={(e) => {
                                    const endDate = filter.value?.split(",")[1] || ""
                                    updateFilter(index, "value", `${e.target.value},${endDate}`)
                                  }}
                                />
                                <input
                                  type="date"
                                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={filter.value?.split(",")[1] || ""}
                                  onChange={(e) => {
                                    const startDate = filter.value?.split(",")[0] || ""
                                    updateFilter(index, "value", `${startDate},${e.target.value}`)
                                  }}
                                />
                              </div>
                            ) : (
                              <input
                                type="date"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={filter.value}
                                onChange={(e) => updateFilter(index, "value", e.target.value)}
                              />
                            )
                          ) : (
                            <input
                              type="text"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter value..."
                              value={filter.value}
                              onChange={(e) => updateFilter(index, "value", e.target.value)}
                            />
                          )}
                        </div>
                        <div className="flex justify-center col-span-1">
                          <button
                            onClick={() => removeFilter(index)}
                            className="p-2 text-red-500 transition-colors rounded-lg hover:text-red-700 hover:bg-red-50"
                            title="Remove filter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {filters.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 transition-colors border border-gray-300 rounded-lg hover:text-gray-800 hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            )}
            <span className="text-sm text-gray-500">
              {filters.length} filter{filters.length !== 1 ? "s" : ""} applied
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilterPanel(false)}
              className="px-6 py-2 font-medium text-gray-600 transition-colors border border-gray-300 rounded-lg hover:text-gray-800 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
