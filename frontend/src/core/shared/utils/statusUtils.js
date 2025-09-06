import { CheckCircle, XCircle, UserCheck, Clock } from "lucide-react"
import { CANDIDATE_STATUSES, STATUS_TRANSITIONS } from "../../constants/candidateConstants"

/**
 * Get status configuration for UI styling
 * @param {string} status - Candidate status
 * @returns {Object} Status configuration object
 */
export const getStatusConfig = (status) => {
  const statusConfigs = {
    [CANDIDATE_STATUSES.HIRED]: {
      bg: "bg-green-100",
      text: "text-green-800",
      icon: CheckCircle,
      color: "#28a745",
    },
    [CANDIDATE_STATUSES.REJECTED]: {
      bg: "bg-red-100",
      text: "text-red-800",
      icon: XCircle,
      color: "#dc3545",
    },
    [CANDIDATE_STATUSES.INTERVIEW]: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      icon: UserCheck,
      color: "#ffc107",
    },
    [CANDIDATE_STATUSES.IN_REVIEW]: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      icon: Clock,
      color: "#007BFF",
    },
  }

  return statusConfigs[status] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    icon: Clock,
    color: "#6b7280",
  }
}

/**
 * Get button styling classes for status actions
 * @param {string} status - Candidate status
 * @returns {string} CSS classes for button styling
 */
export const getStatusButtonClass = (status) => {
  const buttonClasses = {
    [CANDIDATE_STATUSES.INTERVIEW]: "bg-yellow-500 hover:bg-yellow-600 shadow-sm hover:shadow-md",
    [CANDIDATE_STATUSES.HIRED]: "bg-green-500 hover:bg-green-600 shadow-sm hover:shadow-md",
    [CANDIDATE_STATUSES.REJECTED]: "bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md",
  }

  return buttonClasses[status] || "bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md"
}

/**
 * Get next status for a candidate based on current status
 * @param {string} currentStatus - Current candidate status
 * @returns {string|null} Next status or null if no transition available
 */
export const getNextStatus = (currentStatus) => {
  return STATUS_TRANSITIONS[currentStatus] || null
}

/**
 * Get available status transitions for selected candidates
 * @param {Set} selectedCandidates - Set of selected candidate IDs
 * @param {Array} candidates - Array of all candidates
 * @param {string} activeTab - Current active tab/filter
 * @returns {Array} Array of available status transitions
 */
export const getAvailableStatusTransitions = (selectedCandidates, candidates, activeTab) => {
  if (selectedCandidates.size === 0) return []

  const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
  const uniqueStatuses = [...new Set(selectedCandidatesList.map((c) => c.status))]

  if (activeTab === CANDIDATE_STATUSES.ALL) {
    const availableTransitions = new Set()
    
    uniqueStatuses.forEach((status) => {
      switch (status) {
        case CANDIDATE_STATUSES.IN_REVIEW:
          availableTransitions.add(CANDIDATE_STATUSES.INTERVIEW)
          break
        case CANDIDATE_STATUSES.INTERVIEW:
          availableTransitions.add(CANDIDATE_STATUSES.HIRED)
          availableTransitions.add(CANDIDATE_STATUSES.REJECTED)
          break
        case CANDIDATE_STATUSES.HIRED:
          availableTransitions.add(CANDIDATE_STATUSES.INTERVIEW)
          break
        default:
          break
      }
    })
    
    return Array.from(availableTransitions)
  }

  // Status transitions based on active tab
  const tabTransitions = {
    [CANDIDATE_STATUSES.IN_REVIEW]: [CANDIDATE_STATUSES.INTERVIEW],
    [CANDIDATE_STATUSES.INTERVIEW]: [CANDIDATE_STATUSES.HIRED, CANDIDATE_STATUSES.REJECTED],
    [CANDIDATE_STATUSES.HIRED]: [CANDIDATE_STATUSES.INTERVIEW],
    [CANDIDATE_STATUSES.REJECTED]: [],
  }

  return tabTransitions[activeTab] || []
}

/**
 * Check if status transition is valid
 * @param {string} fromStatus - Current status
 * @param {string} toStatus - Target status
 * @returns {boolean} Whether transition is valid
 */
export const isValidStatusTransition = (fromStatus, toStatus) => {
  const nextStatus = getNextStatus(fromStatus)
  return nextStatus === toStatus || fromStatus === CANDIDATE_STATUSES.HIRED
}
