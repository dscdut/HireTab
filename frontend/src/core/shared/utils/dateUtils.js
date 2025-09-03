/**
 * Format date string to YYYY-MM-DD format
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return ''
  }
  
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

/**
 * Format date for display purposes
 * @param {string|Date} dateString - Date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDisplayDate = (dateString, options = {}) => {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return 'Invalid Date'
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    ...options
  }
  
  return date.toLocaleDateString('en-US', defaultOptions)
}

/**
 * Get relative time string (e.g., "2 days ago")
 * @param {string|Date} dateString - Date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

/**
 * Check if date is within range
 * @param {Date} date - Date to check
 * @param {Date} startDate - Range start date
 * @param {Date} endDate - Range end date
 * @returns {boolean} Whether date is in range
 */
export const isDateInRange = (date, startDate, endDate) => {
  return date >= startDate && date <= endDate
}

/**
 * Parse date string and handle various formats
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null
  
  const date = new Date(dateString)
  return isNaN(date.getTime()) ? null : date
}
