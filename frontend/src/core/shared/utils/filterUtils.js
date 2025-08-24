import { parseDate, isDateInRange } from '../../shared/utils/dateUtils'

/**
 * Apply date filter to a candidate based on filter criteria
 * @param {Object} candidate - Candidate object
 * @param {Object} filter - Filter object with field, operator, and value
 * @returns {boolean} Whether candidate matches the date filter
 */
const applyDateFilter = (candidate, filter) => {
  const candidateDate = parseDate(candidate[filter.field])
  if (!candidateDate) return true
  
  const filterDate = parseDate(filter.value)
  if (!filterDate) return true
  
  switch (filter.operator) {
    case "after":
      return candidateDate > filterDate
    case "before":
      return candidateDate < filterDate
    case "on":
      return candidateDate.toDateString() === filterDate.toDateString()
    case "between":
      const [startDate, endDate] = filter.value.split(",")
      if (!startDate || !endDate) return true
      const start = parseDate(startDate)
      const end = parseDate(endDate)
      if (!start || !end) return true
      return isDateInRange(candidateDate, start, end)
    default:
      return true
  }
}

/**
 * Apply text filter to a candidate based on filter criteria
 * @param {Object} candidate - Candidate object
 * @param {Object} filter - Filter object with field, operator, and value
 * @returns {boolean} Whether candidate matches the text filter
 */
const applyTextFilter = (candidate, filter) => {
  const fieldValue = candidate[filter.field]?.toString().toLowerCase() || ""
  const filterValue = filter.value.toLowerCase()
  
  switch (filter.operator) {
    case "contains":
      return fieldValue.includes(filterValue)
    case "equals":
      return fieldValue === filterValue
    case "not_equals":
      return fieldValue !== filterValue
    default:
      return true
  }
}

/**
 * Apply number filter to a candidate based on filter criteria
 * @param {Object} candidate - Candidate object
 * @param {Object} filter - Filter object with field, operator, and value
 * @returns {boolean} Whether candidate matches the number filter
 */
const applyNumberFilter = (candidate, filter) => {
  const fieldValue = Number.parseFloat(candidate[filter.field])
  const filterValue = Number.parseFloat(filter.value)
  
  if (isNaN(fieldValue) || isNaN(filterValue)) return true
  
  switch (filter.operator) {
    case "greater_than":
      return fieldValue > filterValue
    case "greater_equal":
      return fieldValue >= filterValue
    case "less_than":
      return fieldValue < filterValue
    case "less_equal":
      return fieldValue <= filterValue
    case "equals":
      return fieldValue === filterValue
    default:
      return true
  }
}

/**
 * Apply a single filter to a candidate
 * @param {Object} candidate - Candidate object
 * @param {Object} filter - Filter object with field, operator, value, and type
 * @returns {boolean} Whether candidate matches the filter
 */
const applySingleFilter = (candidate, filter) => {
  if (!filter.field || !filter.operator || filter.value === undefined) {
    return true
  }
  
  // Determine filter type based on field or explicit type
  const filterType = filter.type || getFieldType(filter.field)
  
  switch (filterType) {
    case 'date':
      return applyDateFilter(candidate, filter)
    case 'number':
      return applyNumberFilter(candidate, filter)
    case 'text':
    default:
      return applyTextFilter(candidate, filter)
  }
}

/**
 * Get field type for filtering
 * @param {string} fieldName - Name of the field
 * @returns {string} Field type (text, number, date)
 */
const getFieldType = (fieldName) => {
  const dateFields = ['createdAt', 'updatedAt', 'appliedAt', 'interviewDate']
  const numberFields = ['score', 'age', 'experience', 'salary']
  
  if (dateFields.includes(fieldName)) return 'date'
  if (numberFields.includes(fieldName)) return 'number'
  return 'text'
}

/**
 * Apply multiple filters to a candidates list
 * @param {Array} candidatesList - Array of candidates
 * @param {Array} filters - Array of filter objects
 * @param {string} filterLogic - Logic operator ('all' for AND, 'any' for OR)
 * @returns {Array} Filtered candidates array
 */
export const applyFilters = (candidatesList, filters, filterLogic = 'all') => {
  if (!filters || filters.length === 0) return candidatesList
  
  return candidatesList.filter((candidate) => {
    const results = filters.map((filter) => applySingleFilter(candidate, filter))
    
    return filterLogic === 'all' 
      ? results.every((result) => result)
      : results.some((result) => result)
  })
}

/**
 * Sort candidates based on sort option
 * @param {Array} candidates - Array of candidates
 * @param {string} sortOption - Sort option (field-direction format)
 * @returns {Array} Sorted candidates array
 */
export const sortCandidates = (candidates, sortOption) => {
  if (!sortOption) return candidates
  
  const [field, direction] = sortOption.split('-')
  const isAscending = direction === 'asc'
  
  return [...candidates].sort((a, b) => {
    let valueA = a[field]
    let valueB = b[field]
    
    // Handle different data types
    if (field === 'createdAt' || field === 'updatedAt') {
      valueA = new Date(valueA)
      valueB = new Date(valueB)
    } else if (field === 'score') {
      valueA = Number(valueA) || 0
      valueB = Number(valueB) || 0
    } else if (typeof valueA === 'string') {
      valueA = valueA.toLowerCase()
      valueB = valueB?.toLowerCase() || ''
    }
    
    if (valueA < valueB) return isAscending ? -1 : 1
    if (valueA > valueB) return isAscending ? 1 : -1
    return 0
  })
}

/**
 * Search candidates by text query
 * @param {Array} candidates - Array of candidates
 * @param {string} query - Search query
 * @param {Array} searchFields - Fields to search in
 * @returns {Array} Filtered candidates array
 */
export const searchCandidates = (candidates, query, searchFields = ['name', 'email', 'jobPostingName']) => {
  if (!query || !query.trim()) return candidates
  
  const searchTerm = query.toLowerCase().trim()
  
  return candidates.filter((candidate) => {
    return searchFields.some((field) => {
      const fieldValue = candidate[field]?.toString().toLowerCase() || ''
      return fieldValue.includes(searchTerm)
    })
  })
}
