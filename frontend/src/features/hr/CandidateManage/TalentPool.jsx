"use client"

import { useState, useMemo } from "react"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { XCircle } from "lucide-react"
import { candidateApi } from "@/core/services/candidate.service";
import { toast } from "react-toastify"

import { CANDIDATE_STATUSES } from "../job-dashboard/constants/candidateConstants"
import TalentPoolHeader from "./components/TalentPoolHeader"
import BulkActionsBar from "../../../shared/components/ui/BulkActionsBar"
import CandidateTable from "../../../shared/components/ui/CandidateTable"
import FilterModal from "../../../shared/components/ui/FilterModal"
import { getEmailTemplate, getEmailTemplateForTransition, shouldSendEmailForStatus, getEmailTemplateByCurrentStatus } from '@/core/shared/utils/emailTemplates';
import EmailModal from "../EmailModal/EmailModal"
import ConfirmModal from "../../../shared/components/ui/confirmModal"
import { applyFilters } from "@/core/shared/utils/filterUtils";
import { getAvailableStatusTransitions, getNextStatus } from "@/core/shared/utils/statusUtils";

export default function TalentPool() {
  // Chỉ hiển thị tab Rejected
  const [activeTab, setActiveTab] = useState(CANDIDATE_STATUSES.REJECTED)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" })
  const [selectedCandidates, setSelectedCandidates] = useState(new Set())
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [filters, setFilters] = useState([])
  const [filterLogic, setFilterLogic] = useState("all")

  // Status Confirmation Modal
  const [statusConfirmModal, setStatusConfirmModal] = useState({
    isOpen: false,
    candidateId: null,
    candidateName: "",
    currentStatus: "",
    nextStatus: "",
  })

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
    data: allCandidates = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["allCandidates"],
    queryFn: async () => {
      try {
        const response = await candidateApi.getPaginationCandidate(1, 100)
        return response.data || []
      } catch (error) {
        console.error("Failed to fetch all candidates:", error)
        throw error
      }
    },
    refetchOnWindowFocus: false,
  })

  // Filter only rejected candidates
  const candidates = useMemo(() => {
    return allCandidates.filter(candidate => candidate.status === CANDIDATE_STATUSES.REJECTED)
  }, [allCandidates])

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: ({ candidateIds, status }) =>
      Promise.all(
        candidateIds.map((id) => candidateApi.updateStatus(id, status))
      ),
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
  }, [candidates, searchQuery, filters, filterLogic])

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

  const handleStatusTransition = async (candidateId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus)
    if (!nextStatus) return

    const candidate = candidates.find(c => c.id === candidateId)
    if (!candidate) return

    try {
      await candidateApi.updateCandidateStatus(candidateId, nextStatus)

      const emailTemplate = getEmailTemplateForTransition(
        currentStatus,
        nextStatus,
        candidate,
        { companyName: 'HireTab' }
      );

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
            toast.success(`Status updated to ${nextStatus} and notification email sent to ${candidate.name}`)
          } else {
            toast.warning(`Status updated to ${nextStatus} but failed to send email to ${candidate.name}`)
          }
        } catch (emailError) {
          console.error("Error sending email:", emailError)
          toast.warning(`Status updated to ${nextStatus} but failed to send email to ${candidate.name}`)
        }
      } else {
        toast.success(`Status updated to ${nextStatus} for ${candidate.name}`)
      }

      refetch()
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Failed to update candidate status")
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
      const template = getEmailTemplate(customStatus, sampleCandidate, { companyName: 'HireTab' });
      if (template) {
        emailTemplate = template;
      }
    } else {
      const sampleCandidate = selectedCandidatesList[0];
      if (sampleCandidate) {
        const template = getEmailTemplateByCurrentStatus(
          sampleCandidate.status,
          sampleCandidate,
          { companyName: 'HireTab' }
        );
        if (template) {
          emailTemplate = template;
        }
      }
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
    if (selectedCandidates.size === 0) return
    if (emailModalState === "minimized") {
      setEmailModalState("normal")
      return
    }

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    const emailAddresses = selectedCandidatesList.map((c) => c.email).join(", ")

    let emailTemplate = { subject: "", body: "" };
    if (shouldSendEmailForStatus(status)) {
      const sampleCandidate = selectedCandidatesList[0];
      const template = getEmailTemplate(status, sampleCandidate, { companyName: 'HireTab' });
      if (template) {
        emailTemplate = template;
      }
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

  const handleBulkStatusUpdate = (newStatus) => {
    if (selectedCandidates.size === 0) return

    const selectedCandidatesList = candidates.filter((c) => selectedCandidates.has(c.id))
    
    // Chỉ cho phép move rejected candidates đến In-Review hoặc Interview
    const validCandidates = selectedCandidatesList.filter((candidate) => {
      switch (newStatus) {
        case CANDIDATE_STATUSES.IN_REVIEW:
          return candidate.status === CANDIDATE_STATUSES.REJECTED
        case CANDIDATE_STATUSES.INTERVIEW:
          return candidate.status === CANDIDATE_STATUSES.REJECTED
        default:
          return false
      }
    })

    if (validCandidates.length === 0) {
      toast.error(`No selected candidates can be moved to ${newStatus}`)
      return
    }

    bulkUpdateStatusMutation.mutate({
      candidateIds: validCandidates.map((c) => c.id),
      status: newStatus,
    })
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
        sendButton.innerHTML = "Send Email"
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-6 h-6 mx-auto mb-2 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-600">Loading talent pool...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
          <p className="text-sm text-red-600">Error loading talent pool!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 font-['Inter',system-ui,sans-serif]">
      <div className="h-full bg-gray-50">
        <TalentPoolHeader
          jobName="Talent Pool"
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
            showJobName={true}
            refetchCandidates={refetch}
            tabs={[CANDIDATE_STATUSES.REJECTED]} // Chỉ hiển thị tab Rejected
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
      />
    </div>
  )
}