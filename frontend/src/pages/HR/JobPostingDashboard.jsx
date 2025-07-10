"use client"
import { useState, useMemo, useRef } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  ChevronDown,
  Search,
  Filter,
  Mail,
  X,
  Minus,
  Maximize2,
  Paperclip,
  Link,
  Smile,
  AlertTriangle,
  ImageIcon,
  MoreHorizontal,
  Trash2,
  RotateCcw,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Type,
  Users,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  UserCheck,
} from "lucide-react"
import Header from "./components/HRHeader"
import { useParams } from "react-router-dom"
import { candidateApi } from "@/core/services/candidate.service"
import { toast } from "react-toastify"

export default function JobPostingDashboard() {
  const [activeTab, setActiveTab] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [selectedCandidates, setSelectedCandidates] = useState(new Set())
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  })
  const [showCcBcc, setShowCcBcc] = useState(false)
  const [filters, setFilters] = useState([])
  const [filterLogic, setFilterLogic] = useState("all")
  const [emailModalState, setEmailModalState] = useState("closed")
  const [minimizedEmailData, setMinimizedEmailData] = useState(null)
  const [showFormattingToolbar, setShowFormattingToolbar] = useState(false)
  const [textFormatting, setTextFormatting] = useState({
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 16,
    bold: false,
    italic: false,
    underline: false,
    textColor: "#1f2937",
    textAlign: "left",
  })
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showAlignmentMenu, setShowAlignmentMenu] = useState(false)
  const [showListMenu, setShowListMenu] = useState(false)
  const [undoStack, setUndoStack] = useState([])
  const [redoStack, setRedoStack] = useState([])
  const textareaRef = useRef(null)
  const [showQuickReplyPrompt, setShowQuickReplyPrompt] = useState(false)
  const [quickReplyPrompt, setQuickReplyPrompt] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)

  const queryClient = useQueryClient()
  const { jobId } = useParams()

  const {
    data: candidates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["candidates", jobId],
    queryFn: async () => {
      if (!jobId) {
        console.error("Job ID is undefined")
        return []
      }
      try {
        const response = await candidateApi.listCandidate(jobId)
        if (!Array.isArray(response)) {
          return [response]
        }
        return response || []
      } catch (error) {
        console.error("Failed to fetch candidates:", error)
        throw error
      }
    },
    enabled: !!jobId,
  })

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ candidateIds, status, currentStatuses }) =>
      candidateApi.bulkUpdateStatus(candidateIds, { status, currentStatuses }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["candidates", jobId])
      toast.success(`Updated ${variables.candidateIds.length} candidates to ${variables.status}`)
      setSelectedCandidates(new Set())
    },
    onError: (error) => {
      console.error("Error bulk updating status:", error)
      toast.error("Failed to update candidates")
    },
  })

  const jobName = candidates.length > 0 ? candidates[0].jobPostingName : "Job Position"

  const toggleCandidateSelection = (candidateId) => {
    const newSelected = new Set(selectedCandidates)
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId)
    } else {
      newSelected.add(candidateId)
    }
    setSelectedCandidates(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedCandidates.size === filteredCandidates.length) {
      setSelectedCandidates(new Set())
    } else {
      setSelectedCandidates(new Set(filteredCandidates.map((c) => c.id)))
    }
  }

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

  const applyFilters = (candidatesList) => {
    if (filters.length === 0) return candidatesList

    return candidatesList.filter((candidate) => {
      const results = filters.map((filter) => {
        if (filter.field === "createdAt") {
          const candidateDate = new Date(candidate.createdAt)
          const filterDate = new Date(filter.value)
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
              const start = new Date(startDate)
              const end = new Date(endDate)
              return candidateDate >= start && candidateDate <= end
            default:
              return true
          }
        }

        const fieldValue = candidate[filter.field]?.toString().toLowerCase() || ""
        const filterValue = filter.value.toLowerCase()

        switch (filter.operator) {
          case "contains":
            return fieldValue.includes(filterValue)
          case "equals":
            return fieldValue === filterValue
          case "not_equals":
            return fieldValue !== filterValue
          case "greater_than":
            return Number.parseFloat(fieldValue) > Number.parseFloat(filterValue)
          case "greater_equal":
            return Number.parseFloat(fieldValue) >= Number.parseFloat(filterValue)
          case "less_than":
            return Number.parseFloat(fieldValue) < Number.parseFloat(filterValue)
          case "less_equal":
            return Number.parseFloat(fieldValue) <= Number.parseFloat(filterValue)
          default:
            return true
        }
      })

      return filterLogic === "all" ? results.every((r) => r) : results.some((r) => r)
    })
  }

  const filteredCandidates = useMemo(() => {
    let result = [...candidates]

    if (activeTab !== "All") {
      result = result.filter((candidate) => candidate.status === activeTab)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(query) ||
          candidate.email.toLowerCase().includes(query) ||
          candidate.phone?.toLowerCase().includes(query),
      )
    }

    result = applyFilters(result)
    return result
  }, [candidates, activeTab, searchQuery, filters, filterLogic])

  const sortedCandidates = useMemo(() => {
    const sortableItems = [...filteredCandidates]
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [filteredCandidates, sortConfig])

  const getAvailableStatusTransitions = () => {
    if (selectedCandidates.size === 0) return []

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const uniqueStatuses = [...new Set(selectedCandidatesList.map((c) => c.status))]

    if (activeTab === "All") {
      const availableTransitions = new Set()
      uniqueStatuses.forEach((status) => {
        switch (status) {
          case "In-Review":
            availableTransitions.add("Interview")
            break
          case "Interview":
            availableTransitions.add("Hired")
            availableTransitions.add("Rejected")
            break
          case "Hired":
            availableTransitions.add("Interview")
            break
        }
      })
      return Array.from(availableTransitions)
    }

    switch (activeTab) {
      case "In-Review":
        return ["Interview"]
      case "Interview":
        return ["Hired", "Rejected"]
      case "Hired":
        return ["Interview"]
      case "Rejected":
        return []
      default:
        return []
    }
  }

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      "In-Review": "Interview",
      Interview: "Hired",
      Hired: "Interview",
      Rejected: null,
    }
    return statusFlow[currentStatus]
  }

  const handleStatusTransition = (candidateId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (!nextStatus) return

    console.log(`Transitioning candidate ${candidateId} from ${currentStatus} to ${nextStatus}`)
  }

  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedCandidates.size === 0) return

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const validCandidates = selectedCandidatesList.filter((candidate) => {
      switch (newStatus) {
        case "Interview":
          return candidate.status === "In-Review" || candidate.status === "Hired"
        case "Hired":
          return candidate.status === "Interview"
        case "Rejected":
          return candidate.status === "Interview"
        default:
          return false
      }
    })

    if (validCandidates.length === 0) {
      toast.error(`No selected candidates can be moved to ${newStatus}`)
      return
    }

    const confirmed = window.confirm(
      `Update status to "${newStatus}" for ${validCandidates.length} selected candidates?`,
    )
    if (!confirmed) return

    bulkUpdateStatusMutation.mutate({
      candidateIds: validCandidates.map((c) => c.id),
      status: newStatus,
      currentStatuses: validCandidates.map((c) => c.status),
    })
  }

  const handleSendEmail = () => {
    if (selectedCandidates.size === 0) return

    if (emailModalState === "minimized") {
      setEmailModalState("normal")
      return
    }

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const emailAddresses = selectedCandidatesList.map((c) => c.email).join(", ")

    setEmailData({
      to: emailAddresses,
      cc: "",
      bcc: "",
      subject: `Regarding your application for ${jobName}`,
      body: "",
    })
    setEmailModalState("normal")
  }

  const closeEmailModal = () => {
    setEmailModalState("closed")
    setShowCcBcc(false)
    setEmailData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setMinimizedEmailData(null)
  }

  const minimizeEmailModal = () => {
    setMinimizedEmailData(emailData)
    setEmailModalState("minimized")
  }

  const maximizeEmailModal = () => {
    setEmailModalState(emailModalState === "maximized" ? "normal" : "maximized")
  }

  const sendEmail = async () => {
    if (!emailData.to.trim()) {
      toast.error("Please enter recipient email address")
      return
    }

    if (!emailData.subject.trim()) {
      toast.error("Please enter email subject")
      return
    }

    if (!emailData.body.trim()) {
      toast.error("Please enter email content")
      return
    }

    try {
      const sendButton = document.querySelector("[data-send-button]")
      if (sendButton) {
        sendButton.disabled = true
        sendButton.innerHTML =
          '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>Sending...'
      }

      const response = await fetch(import.meta.env.VITE_EMAIL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          cc: emailData.cc || "",
          bcc: emailData.bcc || "",
        }),
      })

      if (response.ok) {
        toast.success("Email sent successfully!")
        closeEmailModal()
        setSelectedCandidates(new Set())
      } else {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error(`Failed to send email: ${error.message}`)
    } finally {
      const sendButton = document.querySelector("[data-send-button]")
      if (sendButton) {
        sendButton.disabled = false
        sendButton.innerHTML =
          'Send <svg class="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>'
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Hired":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: CheckCircle,
          color: "#28a745",
        }
      case "Rejected":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: XCircle,
          color: "#dc3545",
        }
      case "Interview":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: UserCheck,
          color: "#ffc107",
        }
      case "In-Review":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: Clock,
          color: "#007BFF",
        }
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: Clock,
          color: "#6b7280",
        }
    }
  }

  const getStatusButtonClass = (status) => {
    switch (status) {
      case "Interview":
        return "bg-yellow-500 hover:bg-yellow-600 shadow-sm hover:shadow-md"
      case "Hired":
        return "bg-green-500 hover:bg-green-600 shadow-sm hover:shadow-md"
      case "Rejected":
        return "bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-md"
      default:
        return "bg-blue-500 hover:bg-blue-600 shadow-sm hover:shadow-md"
    }
  }

  // Additional helper functions for email functionality
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1]
      setRedoStack([...redoStack, emailData.body])
      setEmailData({ ...emailData, body: previousState })
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack([...undoStack, emailData.body])
      setEmailData({ ...emailData, body: nextState })
      setRedoStack(redoStack.slice(0, -1))
    }
  }

  const insertListItem = (type) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = emailData.body
    const selectedText = text.substring(start, end)

    let newText
    if (type === "bullet") {
      newText = selectedText ? `• ${selectedText}` : "• "
    } else {
      newText = selectedText ? `1. ${selectedText}` : "1. "
    }

    const newBody = text.substring(0, start) + newText + text.substring(end)
    setEmailData({ ...emailData, body: newBody })
  }

  const handleDeleteEmail = () => {
    setEmailData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setShowCcBcc(false)
    setShowFormattingToolbar(false)
    setShowQuickReplyPrompt(false)
    closeEmailModal()
  }

  const generateEmailContent = async () => {
    if (!quickReplyPrompt.trim()) return

    setIsGeneratingContent(true)
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Write a professional email based on this prompt: "${quickReplyPrompt}". The email should be polite, professional, and suitable for business communication. Context: This is regarding a job application for ${jobName}.`,
                  },
                ],
              },
            ],
          }),
        },
      )

      const data = await response.json()
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const generatedContent = data.candidates[0].content.parts[0].text
        setEmailData({ ...emailData, body: generatedContent })
        setShowQuickReplyPrompt(false)
        setQuickReplyPrompt("")
      } else {
        console.error("Unexpected API response:", data)
        alert("Failed to generate content. Please try again.")
      }
    } catch (error) {
      console.error("Error generating content:", error)
      alert("Failed to generate content. Please check your connection and try again.")
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const handleAttachment = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.multiple = true
    input.accept = ".pdf,.doc,.docx,.txt,.jpg,.png"
    input.onchange = (e) => {
      const files = Array.from(e.target.files)
      console.log("Selected files:", files)
      alert(`Selected ${files.length} file(s) for attachment`)
    }
    input.click()
  }

  const handleInsertLink = () => {
    const url = prompt("Enter URL:")
    if (url) {
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = emailData.body
        const selectedText = text.substring(start, end)
        const linkText = selectedText || url
        const newText = `[${linkText}](${url})`
        const newBody = text.substring(0, start) + newText + text.substring(end)
        setEmailData({ ...emailData, body: newBody })
      }
    }
  }

  const handleInsertEmoji = () => {
    const emojis = ["😊", "👍", "🙏", "💼", "📧", "✅", "❤️", "🎉", "🔥", "💯"]
    const selectedEmoji = prompt(
      `Select emoji by number (1-${emojis.length}):\n${emojis.map((emoji, i) => `${i + 1}. ${emoji}`).join("\n")}`,
    )
    if (selectedEmoji && !isNaN(selectedEmoji) && selectedEmoji >= 1 && selectedEmoji <= emojis.length) {
      const emoji = emojis[selectedEmoji - 1]
      const textarea = textareaRef.current
      if (textarea) {
        const start = textarea.selectionStart
        const text = emailData.body
        const newBody = text.substring(0, start) + emoji + text.substring(start)
        setEmailData({ ...emailData, body: newBody })
      }
    }
  }

  const handleInsertImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (file) {
        console.log("Selected image:", file)
        alert(`Selected image: ${file.name}`)
      }
    }
    input.click()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading candidates...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading candidates!</p>
        </div>
      </div>
    )
  }

  const availableTransitions = getAvailableStatusTransitions()

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif] pt-20">
      <Header />

      {/* Main Content */}
      <div className="bg-gray-50 min-h-screen">
        {/* Job info and controls section - positioned below header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Left side - Job info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900">{jobName}</h1>
                    <p className="text-sm text-gray-500">{candidates.length} total candidates</p>
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
                  {filters.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                      {filters.length}
                    </span>
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
                    <option value="createdAt-desc">Latest Applied</option>
                    <option value="createdAt-asc">Oldest Applied</option>
                    <option value="score-desc">Highest Score</option>
                    <option value="score-asc">Lowest Score</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </div>

                {/* Send Email Button */}
                <button
                  className={`px-4 py-2.5 rounded-lg flex items-center space-x-2 text-sm font-medium transition-all duration-200 ${selectedCandidates.size > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  onClick={handleSendEmail}
                  disabled={selectedCandidates.size === 0}
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email ({selectedCandidates.size})</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {/* Bulk Actions Bar - chỉ hiện khi có selection */}
          {selectedCandidates.size > 0 && (
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm border border-blue-200 px-4 py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      {selectedCandidates.size} candidate{selectedCandidates.size !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {availableTransitions.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleBulkStatusUpdate(status)}
                        disabled={bulkUpdateStatusMutation.isLoading}
                        className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${getStatusButtonClass(
                          status,
                        )}`}
                      >
                        {bulkUpdateStatusMutation.isLoading && (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}
                        <span>Move to {status}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedCandidates(new Set())}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto">
                {["All", "In-Review", "Interview", "Hired", "Rejected"].map((tab) => {
                  const count = tab === "All" ? candidates.length : candidates.filter((c) => c.status === tab).length
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
                      {tab !== "All" && <StatusIcon className="w-4 h-4" />}
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
                        checked={selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    {[
                      { key: "name", label: "Candidate", icon: Users },
                      { key: "email", label: "Email", icon: Mail },
                      { key: "phone", label: "Phone", icon: null },
                      { key: "createdAt", label: "Applied Date", icon: Calendar },
                      { key: "resumeFile", label: "Resume", icon: FileText },
                      { key: "status", label: "Status", icon: null },
                      { key: "score", label: "Score", icon: null },
                      { key: null, label: "Actions", icon: null },
                    ].map((column) => (
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
                    sortedCandidates.map((candidate, index) => {
                      const statusConfig = getStatusConfig(candidate.status)
                      const StatusIcon = statusConfig.icon

                      return (
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
                          <td className="px-6 py-4 text-sm text-gray-600">{candidate.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{candidate.phone || "—"}</td>
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
                            <span
                              className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              <span>{candidate.status}</span>
                            </span>
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
                                onClick={() => handleStatusTransition(candidate.id, candidate.status)}
                                className={`px-3 py-1.5 text-white text-xs font-medium rounded-lg transition-all duration-200 ${getStatusButtonClass(
                                  getNextStatus(candidate.status),
                                )}`}
                              >
                                → {getNextStatus(candidate.status)}
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs font-medium">Final Status</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-12 text-center">
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
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterPanel && (
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
                    {filters.map((filter, index) => (
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
                              <option value="name">Name</option>
                              <option value="email">Email</option>
                              <option value="phone">Phone</option>
                              <option value="score">Score</option>
                              <option value="status">Status</option>
                              <option value="createdAt">Application Date</option>
                            </select>
                          </div>
                          <div className="col-span-3">
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              value={filter.operator}
                              onChange={(e) => updateFilter(index, "operator", e.target.value)}
                            >
                              {filter.field === "score" ? (
                                <>
                                  <option value="greater_equal">≥ (Greater than or equal)</option>
                                  <option value="greater_than">&gt; (Greater than)</option>
                                  <option value="less_equal">≤ (Less than or equal)</option>
                                  <option value="less_than">&lt; (Less than)</option>
                                  <option value="equals">= (Equals)</option>
                                </>
                              ) : filter.field === "createdAt" ? (
                                <>
                                  <option value="after">After</option>
                                  <option value="before">Before</option>
                                  <option value="on">On</option>
                                  <option value="between">Between</option>
                                </>
                              ) : (
                                <>
                                  <option value="contains">Contains</option>
                                  <option value="equals">Equals</option>
                                  <option value="not_equals">Not equals</option>
                                </>
                              )}
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
                    ))}
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
      )}

      {/* Minimized Email Indicator */}
      {emailModalState === "minimized" && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => setEmailModalState("normal")}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-900">Compose Email</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  closeEmailModal()
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {(emailModalState === "normal" || emailModalState === "maximized") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white rounded-xl shadow-2xl mx-4 flex flex-col ${emailModalState === "maximized"
              ? "w-full h-full max-w-none max-h-none m-4"
              : "w-full max-w-4xl max-h-[90vh]"
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Compose Email</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={minimizeEmailModal}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={maximizeEmailModal}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title={emailModalState === "maximized" ? "Restore" : "Maximize"}
                >
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={closeEmailModal}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Email Form */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {/* To Field */}
                <div className="flex items-center space-x-4">
                  <label className="w-16 text-sm font-medium text-gray-700">To</label>
                  <input
                    type="text"
                    value={emailData.to}
                    onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                    className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                    placeholder="Enter recipient email addresses"
                  />
                  <button
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Cc/Bcc
                  </button>
                </div>

                {/* Cc/Bcc Fields */}
                {showCcBcc && (
                  <>
                    <div className="flex items-center space-x-4">
                      <label className="w-16 text-sm font-medium text-gray-700">Cc</label>
                      <input
                        type="text"
                        value={emailData.cc}
                        onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                        className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                        placeholder="Carbon copy recipients"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="w-16 text-sm font-medium text-gray-700">Bcc</label>
                      <input
                        type="text"
                        value={emailData.bcc}
                        onChange={(e) => setEmailData({ ...emailData, bcc: e.target.value })}
                        className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                        placeholder="Blind carbon copy recipients"
                      />
                    </div>
                  </>
                )}

                {/* Subject Field */}
                <div className="flex items-center space-x-4">
                  <label className="w-16 text-sm font-medium text-gray-700">Subject</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="flex-1 px-3 py-2 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                    placeholder="Email subject"
                  />
                </div>

                {/* Email Body */}
                <div className="mt-6">
                  <textarea
                    ref={textareaRef}
                    value={emailData.body}
                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                    className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                    placeholder="Compose your message..."
                    style={{
                      fontFamily: textFormatting.fontFamily,
                      fontSize: `${textFormatting.fontSize}px`,
                      fontWeight: textFormatting.bold ? "bold" : "normal",
                      fontStyle: textFormatting.italic ? "italic" : "normal",
                      textDecoration: textFormatting.underline ? "underline" : "none",
                      color: textFormatting.textColor,
                      textAlign: textFormatting.textAlign,
                    }}
                  />
                </div>

                {/* Formatting Toolbar */}
                {showFormattingToolbar && (
                  <div className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {/* Undo/Redo */}
                    <button
                      onClick={handleUndo}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Undo"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRedo}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Redo"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Font Family */}
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={textFormatting.fontFamily}
                      onChange={(e) => setTextFormatting({ ...textFormatting, fontFamily: e.target.value })}
                    >
                      <option value="Inter, system-ui, sans-serif">Inter</option>
                      <option value="Arial, sans-serif">Arial</option>
                      <option value="Times New Roman, serif">Times New Roman</option>
                      <option value="Courier New, monospace">Courier New</option>
                      <option value="Georgia, serif">Georgia</option>
                    </select>

                    {/* Font Size */}
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={textFormatting.fontSize}
                      onChange={(e) =>
                        setTextFormatting({ ...textFormatting, fontSize: Number.parseInt(e.target.value) })
                      }
                    >
                      <option value="12">12px</option>
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                    </select>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Bold, Italic, Underline */}
                    <button
                      onClick={() => setTextFormatting({ ...textFormatting, bold: !textFormatting.bold })}
                      className={`p-2 rounded-lg transition-colors ${textFormatting.bold ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
                        }`}
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      onClick={() => setTextFormatting({ ...textFormatting, italic: !textFormatting.italic })}
                      className={`p-2 rounded-lg transition-colors ${textFormatting.italic ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
                        }`}
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      onClick={() => setTextFormatting({ ...textFormatting, underline: !textFormatting.underline })}
                      className={`p-2 rounded-lg transition-colors ${textFormatting.underline ? "bg-blue-200 text-blue-800" : "hover:bg-gray-200"
                        }`}
                      title="Underline"
                    >
                      <u>U</u>
                    </button>

                    {/* Text Color */}
                    <div className="relative">
                      <button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
                        title="Text Color"
                      >
                        <span style={{ color: textFormatting.textColor }} className="font-bold">
                          A
                        </span>
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                      {showColorPicker && (
                        <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                          <div className="grid grid-cols-6 gap-2">
                            {[
                              "#1f2937",
                              "#dc2626",
                              "#059669",
                              "#2563eb",
                              "#7c3aed",
                              "#db2777",
                              "#ea580c",
                              "#ca8a04",
                              "#65a30d",
                              "#0891b2",
                              "#4338ca",
                              "#be185d",
                            ].map((color) => (
                              <button
                                key={color}
                                onClick={() => {
                                  setTextFormatting({ ...textFormatting, textColor: color })
                                  setShowColorPicker(false)
                                }}
                                className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Text Alignment */}
                    <div className="relative">
                      <button
                        onClick={() => setShowAlignmentMenu(!showAlignmentMenu)}
                        className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
                        title="Text Alignment"
                      >
                        <AlignLeft className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                      {showAlignmentMenu && (
                        <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-10">
                          <button
                            onClick={() => {
                              setTextFormatting({ ...textFormatting, textAlign: "left" })
                              setShowAlignmentMenu(false)
                            }}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <AlignLeft className="w-4 h-4 mr-2" />
                            Left
                          </button>
                          <button
                            onClick={() => {
                              setTextFormatting({ ...textFormatting, textAlign: "center" })
                              setShowAlignmentMenu(false)
                            }}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <AlignCenter className="w-4 h-4 mr-2" />
                            Center
                          </button>
                          <button
                            onClick={() => {
                              setTextFormatting({ ...textFormatting, textAlign: "right" })
                              setShowAlignmentMenu(false)
                            }}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <AlignRight className="w-4 h-4 mr-2" />
                            Right
                          </button>
                        </div>
                      )}
                    </div>

                    {/* List Options */}
                    <div className="relative">
                      <button
                        onClick={() => setShowListMenu(!showListMenu)}
                        className="p-2 hover:bg-gray-200 rounded-lg flex items-center transition-colors"
                        title="Lists"
                      >
                        <List className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </button>
                      {showListMenu && (
                        <div className="absolute top-10 left-0 bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-10">
                          <button
                            onClick={() => {
                              insertListItem("bullet")
                              setShowListMenu(false)
                            }}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <List className="w-4 h-4 mr-2" />
                            Bullet List
                          </button>
                          <button
                            onClick={() => {
                              insertListItem("numbered")
                              setShowListMenu(false)
                            }}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 w-full text-left"
                          >
                            <ListOrdered className="w-4 h-4 mr-2" />
                            Numbered List
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col border-t border-gray-200 bg-gray-50">
              {/* Quick Reply Prompt */}
              {showQuickReplyPrompt && (
                <div className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-sm font-medium text-blue-800">✨ AI Quick Reply</span>
                    <button
                      onClick={() => {
                        setShowQuickReplyPrompt(false)
                        setQuickReplyPrompt("")
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={quickReplyPrompt}
                      onChange={(e) => setQuickReplyPrompt(e.target.value)}
                      placeholder="Describe the email you want to generate..."
                      className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      onKeyPress={(e) => e.key === "Enter" && generateEmailContent()}
                    />
                    <button
                      onClick={generateEmailContent}
                      disabled={isGeneratingContent || !quickReplyPrompt.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
                    >
                      {isGeneratingContent ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <span>Generate</span>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    AI will generate professional email content based on your description
                  </p>
                </div>
              )}

              {/* Main Footer */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={sendEmail}
                    data-send-button
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transition-all"
                  >
                    <span>Send</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Formatting Toggle */}
                  <button
                    onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
                    className={`p-2.5 rounded-lg transition-colors ${showFormattingToolbar ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-600"
                      }`}
                    title={showFormattingToolbar ? "Hide Formatting" : "Show Formatting"}
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleAttachment}
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="Attach File"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleInsertLink}
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="Insert Link"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleInsertEmoji}
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="Insert Emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="Confidential Mode"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleInsertImage}
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                    title="More Options"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowQuickReplyPrompt(!showQuickReplyPrompt)}
                    className={`px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center space-x-2 font-medium transition-colors ${showQuickReplyPrompt ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    <span>✨ AI Assistant</span>
                  </button>
                  <button
                    onClick={handleDeleteEmail}
                    className="p-2.5 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-lg transition-colors"
                    title="Delete Draft and Close"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
