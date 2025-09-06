// Candidate status constants
export const CANDIDATE_STATUSES = {
  ALL: "All",
  IN_REVIEW: "In-Review",
  INTERVIEW: "Interview",
  HIRED: "Hired",
  REJECTED: "Rejected",
}

// Status transition rules
export const STATUS_TRANSITIONS = {
  "In-Review": "Interview",
  Interview: "Hired",
  Hired: "Interview",
  Rejected: null,
}

// Sort options for candidate lists
export const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Latest Applied" },
  { value: "createdAt-asc", label: "Oldest Applied" },
  { value: "score-desc", label: "Highest Score" },
  { value: "score-asc", label: "Lowest Score" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
]

// Filter operators by type
export const FILTER_OPERATORS = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Not equals" },
  ],
  number: [
    { value: "greater_equal", label: "≥ (Greater than or equal)" },
    { value: "greater_than", label: "> (Greater than)" },
    { value: "less_equal", label: "≤ (Less than or equal)" },
    { value: "less_than", label: "< (Less than)" },
    { value: "equals", label: "= (Equals)" },
  ],
  date: [
    { value: "after", label: "After" },
    { value: "before", label: "Before" },
    { value: "on", label: "On" },
    { value: "between", label: "Between" },
  ],
}

// Available fields for filtering
export const FILTER_FIELDS = [
  { value: "name", label: "Name", type: "text" },
  { value: "email", label: "Email", type: "text" },
  { value: "phone", label: "Phone", type: "text" },
  { value: "jobPostingName", label: "Job Position", type: "text" },
  { value: "score", label: "Score", type: "number" },
  { value: "createdAt", label: "Applied Date", type: "date" },
]
