// import { CANDIDATE_STATUSES, STATUS_TRANSITIONS } from "../constants/candidateConstants"
// import { CheckCircle, XCircle, UserCheck, Clock } from "lucide-react"

// export const getStatusConfig = (status) => {
//   switch (status) {
//     case CANDIDATE_STATUSES.HIRED:
//       return {
//         bg: "bg-green-100",
//         text: "text-green-800",
//         icon: CheckCircle,
//         color: "#28a745",
//       }
//     case CANDIDATE_STATUSES.REJECTED:
//       return {
//         bg: "bg-red-100",
//         text: "text-red-800",
//         icon: XCircle,
//         color: "#dc3545",
//       }
//     case CANDIDATE_STATUSES.INTERVIEW:
//       return {
//         bg: "bg-yellow-100",
//         text: "text-yellow-800",
//         icon: UserCheck,
//         color: "#ffc107",
//       }
//     case CANDIDATE_STATUSES.IN_REVIEW:
//       return {
//         bg: "bg-blue-100",
//         text: "text-blue-800",
//         icon: Clock,
//         color: "#007BFF",
//       }
//     default:
//       return {
//         bg: "bg-gray-100",
//         text: "text-gray-800",
//         icon: Clock,
//         color: "#6b7280",
//       }
//   }
// }

// export const getStatusButtonClass = (status) => {
//   switch (status) {
//     case CANDIDATE_STATUSES.INTERVIEW:
//       return "bg-yellow-500 hover:bg-yellow-600 shadow-sm hover:shadow-md"
//     case CANDIDATE_STATUSES.HIRED:
//       return "bg-green-500 hover:bg-green-600 shadow-sm hover:shadow-md"
//     case CANDIDATE_STATUSES.REJECTED:
//       return "bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md"
//     default:
//       return "bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md"
//   }
// }

// export const getNextStatus = (currentStatus) => {
//   return STATUS_TRANSITIONS[currentStatus]
// }

// export const formatDate = (dateString) => {
//   const date = new Date(dateString)
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
// }

// export const applyFilters = (candidatesList, filters, filterLogic) => {
//   if (filters.length === 0) return candidatesList

//   return candidatesList.filter((candidate) => {
//     const results = filters.map((filter) => {
//       if (filter.field === "createdAt") {
//         const candidateDate = new Date(candidate.createdAt)
//         const filterDate = new Date(filter.value)

//         switch (filter.operator) {
//           case "after":
//             return candidateDate > filterDate
//           case "before":
//             return candidateDate < filterDate
//           case "on":
//             return candidateDate.toDateString() === filterDate.toDateString()
//           case "between":
//             const [startDate, endDate] = filter.value.split(",")
//             if (!startDate || !endDate) return true
//             const start = new Date(startDate)
//             const end = new Date(endDate)
//             return candidateDate >= start && candidateDate <= end
//           default:
//             return true
//         }
//       }

//       const fieldValue = candidate[filter.field]?.toString().toLowerCase() || ""
//       const filterValue = filter.value.toLowerCase()

//       switch (filter.operator) {
//         case "contains":
//           return fieldValue.includes(filterValue)
//         case "equals":
//           return fieldValue === filterValue
//         case "not_equals":
//           return fieldValue !== filterValue
//         case "greater_than":
//           return Number.parseFloat(fieldValue) > Number.parseFloat(filterValue)
//         case "greater_equal":
//           return Number.parseFloat(fieldValue) >= Number.parseFloat(filterValue)
//         case "less_than":
//           return Number.parseFloat(fieldValue) < Number.parseFloat(filterValue)
//         case "less_equal":
//           return Number.parseFloat(fieldValue) <= Number.parseFloat(filterValue)
//         default:
//           return true
//       }
//     })

//     return filterLogic === "all" ? results.every((r) => r) : results.some((r) => r)
//   })
// }

// export const getAvailableStatusTransitions = (selectedCandidates, candidates, activeTab) => {
//   if (selectedCandidates.size === 0) return []

//   const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
//   const uniqueStatuses = [...new Set(selectedCandidatesList.map((c) => c.status))]

//   if (activeTab === CANDIDATE_STATUSES.ALL) {
//     const availableTransitions = new Set()
//     uniqueStatuses.forEach((status) => {
//       switch (status) {
//         case CANDIDATE_STATUSES.IN_REVIEW:
//           availableTransitions.add(CANDIDATE_STATUSES.INTERVIEW)
//           break
//         case CANDIDATE_STATUSES.INTERVIEW:
//           availableTransitions.add(CANDIDATE_STATUSES.HIRED)
//           availableTransitions.add(CANDIDATE_STATUSES.REJECTED)
//           break
//         case CANDIDATE_STATUSES.HIRED:
//           availableTransitions.add(CANDIDATE_STATUSES.INTERVIEW)
//           break
//       }
//     })
//     return Array.from(availableTransitions)
//   }

//   switch (activeTab) {
//     case CANDIDATE_STATUSES.IN_REVIEW:
//       return [CANDIDATE_STATUSES.INTERVIEW]
//     case CANDIDATE_STATUSES.INTERVIEW:
//       return [CANDIDATE_STATUSES.HIRED, CANDIDATE_STATUSES.REJECTED]
//     case CANDIDATE_STATUSES.HIRED:
//       return [CANDIDATE_STATUSES.INTERVIEW]
//     case CANDIDATE_STATUSES.REJECTED:
//       return []
//     default:
//       return []
//   }
// }