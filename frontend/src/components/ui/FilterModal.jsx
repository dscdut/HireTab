"use client"

import { Filter, X } from "lucide-react"
import { FILTER_FIELDS, FILTER_OPERATORS } from "../../pages/HR/job-dashboard/constants/candidateConstants"

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced Filters</h3>
          </div>
          <button
            onClick={() => setShowFilterPanel(false)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Filter Logic</label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>+ Add Filter</span>
              </button>
            </div>

            {filters.length === 0 ? (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No filters added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click "Add Filter" to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filters.map((filter, index) => {
                  const fieldConfig = FILTER_FIELDS.find((f) => f.value === filter.field)
                  const operators = FILTER_OPERATORS[fieldConfig?.type || "text"]

                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1">
                          <span className="text-sm font-medium text-gray-700">
                            {index === 0 ? "Where" : filterLogic === "all" ? "And" : "Or"}
                          </span>
                        </div>
                        <div className="col-span-3">
                          <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                  value={filter.value?.split(",")[0] || ""}
                                  onChange={(e) => {
                                    const endDate = filter.value?.split(",")[1] || ""
                                    updateFilter(index, "value", `${e.target.value},${endDate}`)
                                  }}
                                />
                                <input
                                  type="date"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                value={filter.value}
                                onChange={(e) => updateFilter(index, "value", e.target.value)}
                              />
                            )
                          ) : (
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="Enter value..."
                              value={filter.value}
                              onChange={(e) => updateFilter(index, "value", e.target.value)}
                            />
                          )}
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            onClick={() => removeFilter(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
              className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
