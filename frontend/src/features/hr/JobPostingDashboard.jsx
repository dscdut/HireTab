"use client"

import { useState, useMemo } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { XCircle } from "lucide-react"
import { useParams } from "react-router-dom"
import { candidateApi } from "@/core/services/candidate.service"
import { toast } from "react-toastify"

import { CANDIDATE_STATUSES } from "../../shared/constants/candidateConstants"
import { getEmailTemplate, getEmailTemplateForTransition, getEmailTemplateByCurrentStatus, shouldSendEmailForStatus } from '@/core/shared/utils/emailTemplates';
import DashboardHeader from "./CandidateManage/components/ManageCandidateHeader"
import BulkActionsBar from "../../shared/components/ui/BulkActionsBar"
import CandidateTable from "../../shared/components/ui/CandidateTable"
import FilterModal from "../../shared/components/ui/FilterModal"
import EmailModal from "./EmailModal/EmailModal"
import StatusConfirmModal from "../../shared/components/ui/StatusConfirmModal"
import { getAvailableStatusTransitions, getNextStatus } from "@/core/shared/utils/statusUtils"
import { applyFilters } from "@/core/shared/utils/filterUtils"

export default function JobPostingDashboard() {
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
  
  // Status Confirmation Modal
  const [statusConfirmModal, setStatusConfirmModal] = useState({
    isOpen: false,
    candidateId: null,
    candidateName: "",
    currentStatus: "",
    nextStatus: "",
  })

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
          candidate.phone?.toLowerCase().includes(query),
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

  const updateCandidateStatus = async (candidateId, newStatus) => {
    try {
      await candidateApi.updateStatus(candidateId, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      queryClient.invalidateQueries(["candidates", jobId])
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update candidate status")
    }
  }

  const handleStatusTransition = (candidateId, nextStatus) => {
    if (!nextStatus) return

    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return

    if (shouldSendEmailForStatus(nextStatus)) {
      setStatusConfirmModal({
        isOpen: true,
        candidateId,
        candidateName: candidate.name,
        currentStatus: candidate.status,
        nextStatus: nextStatus,
      })
    } else {
      updateCandidateStatus(candidateId, nextStatus)
    }
  }

  const handleStatusConfirm = async () => {
    const { candidateId, nextStatus } = statusConfirmModal
    await updateCandidateStatus(candidateId, nextStatus)
    setStatusConfirmModal({
      isOpen: false,
      candidateId: null,
      candidateName: "",
      currentStatus: "",
      nextStatus: "",
    })
  }

  const handleStatusConfirmWithEmail = () => {
    const { candidateId, nextStatus } = statusConfirmModal
    const candidate = candidates.find(c => c.id === candidateId)
    
    if (!candidate) return

    const emailTemplate = getEmailTemplateForTransition(
      candidate.status,
      nextStatus,
      candidate,
      { companyName: 'HireTab', jobPostingName: jobName }
    )

    setEmailData({
      to: candidate.email,
      cc: "",
      bcc: "",
      subject: emailTemplate?.subject || `Update on your application for ${jobName}`,
      body: emailTemplate?.body || "",
    })
    setEmailModalState("normal")
    
    setStatusConfirmModal({
      isOpen: false,
      candidateId: null,
      candidateName: "",
      currentStatus: "",
      nextStatus: "",
    })
  }

  const handleStatusCancel = () => {
    setStatusConfirmModal({
      isOpen: false,
      candidateId: null,
      candidateName: "",
      currentStatus: "",
      nextStatus: "",
    })
  }

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedCandidates.size === 0) return

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const validCandidates = selectedCandidatesList.filter((candidate) => {
      switch (newStatus) {
        case CANDIDATE_STATUSES.INTERVIEW:
          return candidate.status === CANDIDATE_STATUSES.IN_REVIEW
        case CANDIDATE_STATUSES.HIRED:
          return candidate.status === CANDIDATE_STATUSES.INTERVIEW
        case CANDIDATE_STATUSES.REJECTED:
          return candidate.status === CANDIDATE_STATUSES.INTERVIEW || candidate.status === CANDIDATE_STATUSES.IN_REVIEW
        default:
          return false
      }
    })

    if (validCandidates.length === 0) {
      toast.error(`No selected candidates can be moved to ${newStatus}`)
      return
    }

    try {
      await bulkUpdateStatusMutation.mutateAsync({
        candidateIds: validCandidates.map((c) => c.id),
        status: newStatus,
        currentStatuses: validCandidates.map((c) => c.status),
      })

      let emailsSent = 0
      if (shouldSendEmailForStatus(newStatus)) {
        for (const candidate of validCandidates) {
          const emailTemplate = getEmailTemplate(
            newStatus,
            candidate,
            { companyName: 'HireTab', jobPostingName: jobName }
          )

          if (emailTemplate) {
            try {
              const response = await fetch(import.meta.env.VITE_EMAIL_WEBHOOK_URL, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: candidate.email,
                  subject: emailTemplate.subject,
                  body: emailTemplate.body,
                  cc: "",
                  bcc: "",
                }),
              })

              if (response.ok) {
                emailsSent++
              }
            } catch (emailError) {
              console.error(`Error sending email to ${candidate.name}:`, emailError)
            }
          }
        }
      }

      if (emailsSent > 0) {
        toast.success(`${validCandidates.length} candidates updated to ${newStatus}. ${emailsSent} notification emails sent.`)
      } else {
        toast.success(`${validCandidates.length} candidates updated to ${newStatus} successfully.`)
      }
    } catch (error) {
      console.error("Error in bulk update:", error)
      toast.error("Failed to update candidate statuses")
    }
  }

  const handleSendEmail = (customStatus = null) => {
    if (selectedCandidates.size === 0) return
    if (emailModalState === "minimized") {
      setEmailModalState("normal")
      return
    }

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const emailAddresses = selectedCandidatesList.map((c) => c.email).join(", ")

    let emailTemplate = { subject: "", body: "" }

    if (customStatus) {
      const sampleCandidate = selectedCandidatesList[0]
      const template = getEmailTemplate(customStatus, sampleCandidate, { companyName: 'HireTab', jobPostingName: jobName })
      if (template) {
        emailTemplate = template
      }
    } else {
      const sampleCandidate = selectedCandidatesList[0]
      if (sampleCandidate) {
        const template = getEmailTemplateByCurrentStatus(
          sampleCandidate.status,
          sampleCandidate,
          { companyName: 'HireTab', jobPostingName: jobName }
        )
        if (template) {
          emailTemplate = template
        }
      }
    }

    if (!emailTemplate.subject) {
      emailTemplate.subject = `Regarding your application for ${jobName}`
    }

    setEmailData({
      to: emailAddresses,
      cc: "",
      bcc: "",
      subject: emailTemplate.subject,
      body: emailTemplate.body,
    })
    setEmailModalState("normal")
  }

  const handleSendStatusEmail = (status) => {
    handleSendEmail(status)
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
        // Update candidate status after sending email
        if (statusConfirmModal.candidateId && statusConfirmModal.nextStatus) {
          await updateCandidateStatus(statusConfirmModal.candidateId, statusConfirmModal.nextStatus)
        }
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="font-medium text-gray-600">Loading candidates...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="font-medium text-red-600">Error loading candidates!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',system-ui,sans-serif]">
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader
          jobName={jobName}
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

        <div className="px-6 py-6">
          {selectedCandidates.size > 0 && (
            <BulkActionsBar
              selectedCount={selectedCandidates.size}
              availableTransitions={availableTransitions}
              onBulkStatusUpdate={handleBulkStatusUpdate}
              onSendStatusEmail={handleSendStatusEmail}
              onClearSelection={() => setSelectedCandidates(new Set())}
              isLoading={bulkUpdateStatusMutation.isLoading}
            />
          )}

          <CandidateTable
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
            onClearSelection={() => setSelectedCandidates(new Set())}
            showJobName={false}
            refetch={() => queryClient.invalidateQueries(["candidates", jobId])}
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

      <StatusConfirmModal
        open={statusConfirmModal.isOpen}
        candidateName={statusConfirmModal.candidateName}
        currentStatus={statusConfirmModal.currentStatus}
        nextStatus={statusConfirmModal.nextStatus}
        isLoading={false}
        onClose={handleStatusCancel}
        onUpdateOnly={handleStatusConfirm}
        onUpdateWithEmail={handleStatusConfirmWithEmail}
      />
    </div>
  )
}