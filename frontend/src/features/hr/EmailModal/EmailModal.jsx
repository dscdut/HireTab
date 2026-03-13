"use client"

import { useRef } from "react"
import {
  Mail,
  X,
  Minus,
  Maximize2,
  ChevronDown,
  Paperclip,
  Link,
  Smile,
  AlertTriangle,
  ImageIcon,
  MoreHorizontal,
  Trash2,
  Type,
} from "lucide-react"
import EmailFormattingToolbar from "../CandidateManage/components/EmailFormattingToolbar"

export default function EmailModal({
  emailModalState,
  setEmailModalState,
  emailData,
  setEmailData,
  showCcBcc,
  setShowCcBcc,
  showFormattingToolbar,
  setShowFormattingToolbar,
  textFormatting,
  setTextFormatting,
  showColorPicker,
  setShowColorPicker,
  showAlignmentMenu,
  setShowAlignmentMenu,
  showListMenu,
  setShowListMenu,
  undoStack,
  setUndoStack,
  redoStack,
  setRedoStack,
  showQuickReplyPrompt,
  setShowQuickReplyPrompt,
  quickReplyPrompt,
  setQuickReplyPrompt,
  isGeneratingContent,
  onSendEmail,
  onCloseModal,
  onMinimizeModal,
  onMaximizeModal,
  onDeleteEmail,
  onGenerateContent,
  onAttachment,
  onInsertLink,
  onInsertEmoji,
  onInsertImage,
}) {
  const INTERVIEW_URL = import.meta.env.VITE_INTERVIEW_URL || "https://hiretab.gdsc.dev/interview/ghskjiwnfd"
  const textareaRef = useRef(null)
  const modalRef = useRef(null)

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

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onCloseModal()
    }
  }

  const handleInsertInterviewLink = () => {
    const interviewLine = `Virtual interview link: ${INTERVIEW_URL}`
    const hasInterviewLink = emailData.body.includes(INTERVIEW_URL)

    if (hasInterviewLink) return

    const nextBody = emailData.body?.trim()
      ? `${emailData.body.trim()}\n\n${interviewLine}`
      : interviewLine

    setEmailData({ ...emailData, body: nextBody })
  }

  if (emailModalState === "closed") return null

  // Minimized state
  if (emailModalState === "minimized") {
    return (
      <div className="fixed z-50 bottom-6 right-6">
        <div
          className="p-4 transition-shadow bg-white border border-gray-200 rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
          onClick={() => setEmailModalState("normal")}
        >
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Compose Email</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onCloseModal()
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`bg-white rounded-xl shadow-2xl mx-4 flex flex-col ${
          emailModalState === "maximized" ? "w-full h-full max-w-none max-h-none m-4" : "w-full max-w-4xl max-h-[90vh]"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Compose Email</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onMinimizeModal}
              className="p-2 transition-colors rounded-lg hover:bg-gray-200"
              title="Minimize"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={onMaximizeModal}
              className="p-2 transition-colors rounded-lg hover:bg-gray-200"
              title={emailModalState === "maximized" ? "Restore" : "Maximize"}
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
            <button onClick={onCloseModal} className="p-2 transition-colors rounded-lg hover:bg-gray-200" title="Close">
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
                className="flex-1 px-3 py-2 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Enter recipient email addresses"
              />
              <button
                onClick={() => setShowCcBcc(!showCcBcc)}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
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
                    className="flex-1 px-3 py-2 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                    placeholder="Carbon copy recipients"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="w-16 text-sm font-medium text-gray-700">Bcc</label>
                  <input
                    type="text"
                    value={emailData.bcc}
                    onChange={(e) => setEmailData({ ...emailData, bcc: e.target.value })}
                    className="flex-1 px-3 py-2 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
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
                className="flex-1 px-3 py-2 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                placeholder="Email subject"
              />
            </div>

            {/* Email Body */}
            <div className="mt-6">
              <textarea
                ref={textareaRef}
                value={emailData.body}
                onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                className="w-full p-4 border border-gray-300 rounded-lg resize-none h-80 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 mt-3 border border-blue-100 rounded-lg bg-blue-50">
                <div className="text-sm text-blue-900">
                  <span className="font-medium">Interview link:</span>{" "}
                  <a
                    href={INTERVIEW_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-700 underline hover:text-blue-900"
                  >
                    {INTERVIEW_URL}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleInsertInterviewLink}
                  className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Insert Interview Link
                </button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            {showFormattingToolbar && (
              <EmailFormattingToolbar
                textFormatting={textFormatting}
                setTextFormatting={setTextFormatting}
                showColorPicker={showColorPicker}
                setShowColorPicker={setShowColorPicker}
                showAlignmentMenu={showAlignmentMenu}
                setShowAlignmentMenu={setShowAlignmentMenu}
                showListMenu={showListMenu}
                setShowListMenu={setShowListMenu}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onInsertList={insertListItem}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col border-t border-gray-200 bg-gray-50">
          {/* Quick Reply Prompt */}
          {showQuickReplyPrompt && (
            <div className="p-4 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center mb-3 space-x-2">
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
                  className="flex-1 px-4 py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && onGenerateContent()}
                />
                <button
                  onClick={onGenerateContent}
                  disabled={isGeneratingContent || !quickReplyPrompt.trim()}
                  className="flex items-center px-4 py-2 space-x-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingContent ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-blue-600">
                AI will generate professional email content based on your description
              </p>
            </div>
          )}

          {/* Main Footer */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onSendEmail}
                data-send-button
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 font-medium shadow-sm hover:shadow-md transition-all"
              >
                <span>Send</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Formatting Toggle */}
              <button
                onClick={() => setShowFormattingToolbar(!showFormattingToolbar)}
                className={`p-2.5 rounded-lg transition-colors ${
                  showFormattingToolbar ? "bg-blue-100 text-blue-700" : "hover:bg-gray-200 text-gray-600"
                }`}
                title={showFormattingToolbar ? "Hide Formatting" : "Show Formatting"}
              >
                <Type className="w-4 h-4" />
              </button>

              <button
                onClick={onAttachment}
                className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                title="Attach File"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                onClick={onInsertLink}
                className="p-2.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
                title="Insert Link"
              >
                <Link className="w-4 h-4" />
              </button>

              <button
                onClick={onInsertEmoji}
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
                onClick={onInsertImage}
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
                className={`px-4 py-2 rounded-lg hover:bg-blue-200 flex items-center space-x-2 font-medium transition-colors ${
                  showQuickReplyPrompt ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700"
                }`}
              >
                <span>✨ AI Assistant</span>
              </button>

              <button
                onClick={onDeleteEmail}
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
  )
}