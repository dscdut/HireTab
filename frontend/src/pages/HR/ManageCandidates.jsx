"use client"

import { useState, useMemo } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { XCircle } from "lucide-react"
import { manageCandidateApi } from "./test-candidate-services/manageCandidateApi"
import { toast } from "react-toastify"

import { CANDIDATE_STATUSES } from "./job-dashboard/constants/candidateConstants"
import { applyFilters, getAvailableStatusTransitions, getNextStatus } from "./job-dashboard/utils/candidateUtils"

import DashboardHeader from "./job-dashboard/DashboardHeader"
import BulkActionsBar from "./job-dashboard/BulkActionsBar"
import CandidateTableWithJobName from "./job-dashboard/CandidateTableWithJobName"
import FilterModal from "./job-dashboard/FilterModal"
import EmailModal from "./job-dashboard/EmailModal"

export default function ManageCandidates() {
  const [activeTab, setActiveTab] = useState(CANDIDATE_STATUSES.ALL)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [selectedCandidates, setSelectedCandidates] = useState(new Set())
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [filters, setFilters] = useState([])
  const [filterLogic, setFilterLogic] = useState("all")

  // Email Modal States
  const [emailModalState, setEmailModalState] = useState("closed")
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  })
  const [showCcBcc, setShowCcBcc] = useState(false)
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
  const [showQuickReplyPrompt, setShowQuickReplyPrompt] = useState(false)
  const [quickReplyPrompt, setQuickReplyPrompt] = useState("")
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)

  const queryClient = useQueryClient()

  const {
    data: candidates = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allCandidates"],
    queryFn: async () => {
      try {
        const response = await manageCandidateApi.getAllCandidates()
        return response || []
      } catch (error) {
        console.error("Failed to fetch all candidates:", error)
        throw error
      }
    },
  })

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ candidateIds, status, currentStatuses }) =>
      manageCandidateApi.bulkUpdateStatus(candidateIds, { status, currentStatuses }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["allCandidates"])
      toast.success(`Updated ${variables.candidateIds.length} candidates to ${variables.status}`)
      setSelectedCandidates(new Set())
    },
    onError: (error) => {
      console.error("Error bulk updating status:", error)
      toast.error("Failed to update candidates")
    },
  })

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

  const filteredCandidates = useMemo(() => {
    let result = [...candidates]
    if (activeTab !== CANDIDATE_STATUSES.ALL) {
      result = result.filter((candidate) => candidate.status === activeTab)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(query) ||
          candidate.email.toLowerCase().includes(query) ||
          candidate.phone?.toLowerCase().includes(query) ||
          candidate.jobPostingName.toLowerCase().includes(query),
      )
    }
    result = applyFilters(result, filters, filterLogic)
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

  const availableTransitions = getAvailableStatusTransitions(selectedCandidates, candidates, activeTab)

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
        case CANDIDATE_STATUSES.INTERVIEW:
          return candidate.status === CANDIDATE_STATUSES.IN_REVIEW || candidate.status === CANDIDATE_STATUSES.HIRED
        case CANDIDATE_STATUSES.HIRED:
          return candidate.status === CANDIDATE_STATUSES.INTERVIEW
        case CANDIDATE_STATUSES.REJECTED:
          return candidate.status === CANDIDATE_STATUSES.INTERVIEW
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
      subject: `Regarding your job applications`,
      body: "",
    })
    setEmailModalState("normal")
  }

  const closeEmailModal = () => {
    setEmailModalState("closed")
    setShowCcBcc(false)
    setEmailData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setShowFormattingToolbar(false)
    setShowQuickReplyPrompt(false)
  }

  const minimizeEmailModal = () => {
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
                    text: `Write a professional email based on this prompt: "${quickReplyPrompt}". The email should be polite, professional, and suitable for business communication. Context: This is regarding job applications for multiple positions.`,
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
      const selectedText = window.getSelection().toString()
      const linkText = selectedText || url
      const newText = `[${linkText}](${url})`
      setEmailData({ ...emailData, body: emailData.body + newText })
    }
  }

  const handleInsertEmoji = () => {
    const emojis = ["😊", "👍", "🙏", "💼", "📧", "✅", "❤️", "🎉", "🔥", "💯"]
    const selectedEmoji = prompt(
      `Select emoji by number (1-${emojis.length}):\n${emojis.map((emoji, i) => `${i + 1}. ${emoji}`).join("\n")}`,
    )
    if (selectedEmoji && !isNaN(selectedEmoji) && selectedEmoji >= 1 && selectedEmoji <= emojis.length) {
      const emoji = emojis[selectedEmoji - 1]
      setEmailData({ ...emailData, body: emailData.body + emoji })
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

  const handleDeleteEmail = () => {
    setEmailData({ to: "", cc: "", bcc: "", subject: "", body: "" })
    setShowCcBcc(false)
    setShowFormattingToolbar(false)
    setShowQuickReplyPrompt(false)
    closeEmailModal()
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading all candidates...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 text-sm">Error loading candidates!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 font-['Inter',system-ui,sans-serif]">
      <div className="bg-gray-50 h-full">
        <DashboardHeader
          jobName="All Candidates Management"
          candidatesCount={candidates.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilterPanel={showFilterPanel}
          setShowFilterPanel={setShowFilterPanel}
          filtersCount={filters.length}
          sortConfig={sortConfig}
          setSortConfig={setSortConfig}
          selectedCandidatesCount={selectedCandidates.size}
          onSendEmail={handleSendEmail}
        />

        <div className="px-3 py-2">
          <BulkActionsBar
            selectedCount={selectedCandidates.size}
            availableTransitions={availableTransitions}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            onClearSelection={() => setSelectedCandidates(new Set())}
            isLoading={bulkUpdateStatusMutation.isLoading}
          />

          <CandidateTableWithJobName
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            candidates={candidates}
            sortedCandidates={sortedCandidates}
            selectedCandidates={selectedCandidates}
            toggleSelectAll={toggleSelectAll}
            toggleCandidateSelection={toggleCandidateSelection}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
            onStatusTransition={handleStatusTransition}
          />
        </div>
      </div>

      <FilterModal
        showFilterPanel={showFilterPanel}
        setShowFilterPanel={setShowFilterPanel}
        filters={filters}
        setFilters={setFilters}
        filterLogic={filterLogic}
        setFilterLogic={setFilterLogic}
      />

      <EmailModal
        emailModalState={emailModalState}
        setEmailModalState={setEmailModalState}
        emailData={emailData}
        setEmailData={setEmailData}
        showCcBcc={showCcBcc}
        setShowCcBcc={setShowCcBcc}
        showFormattingToolbar={showFormattingToolbar}
        setShowFormattingToolbar={setShowFormattingToolbar}
        textFormatting={textFormatting}
        setTextFormatting={setTextFormatting}
        showColorPicker={showColorPicker}
        setShowColorPicker={setShowColorPicker}
        showAlignmentMenu={showAlignmentMenu}
        setShowAlignmentMenu={setShowAlignmentMenu}
        showListMenu={showListMenu}
        setShowListMenu={setShowListMenu}
        undoStack={undoStack}
        setUndoStack={setUndoStack}
        redoStack={redoStack}
        setRedoStack={setRedoStack}
        showQuickReplyPrompt={showQuickReplyPrompt}
        setShowQuickReplyPrompt={setShowQuickReplyPrompt}
        quickReplyPrompt={quickReplyPrompt}
        setQuickReplyPrompt={setQuickReplyPrompt}
        isGeneratingContent={isGeneratingContent}
        onSendEmail={sendEmail}
        onCloseModal={closeEmailModal}
        onMinimizeModal={minimizeEmailModal}
        onMaximizeModal={maximizeEmailModal}
        onDeleteEmail={handleDeleteEmail}
        onGenerateContent={generateEmailContent}
        onAttachment={handleAttachment}
        onInsertLink={handleInsertLink}
        onInsertEmoji={handleInsertEmoji}
        onInsertImage={handleInsertImage}
      />
    </div>
  )
}