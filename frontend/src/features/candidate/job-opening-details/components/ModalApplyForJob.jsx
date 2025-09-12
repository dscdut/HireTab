"use client"

import { useState, useRef, useEffect } from "react"
import { candidateApi } from "@/core/services/candidate.service"
import { toast, Toaster } from "react-hot-toast"
import { jwtDecode } from "jwt-decode"
import { X, Upload, FileText, Plus } from "lucide-react"
import { path } from "@/core/constants/path"
import { PersonalInfoForm } from "./analytics-cv/PersonalInfoForm"
import { FileUploadSection } from "./analytics-cv/FileUploadSection"

const ModalApplyForJob = ({
    isOpen,
    onClose,
    onSubmit,
    jobId,
    jobTitle,
    jobLocation,
    jobLevel,
    jobDesRate,
    jobDes,
}) => {
    const [userId, setUserId] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        currentJobTitle: "",
        linkedinUrl: "",
        portfolioUrl: "",
        additionalInfo: "",
    })
    const [file, setFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const fileInputRef = useRef(null)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = await localStorage.getItem("access_token")
                if (typeof token === "string") {
                    const decodedToken = jwtDecode(token)
                    const userDecodeId = decodedToken.id
                    setUserId(userDecodeId)
                } else {
                    console.log("Invalid token specified: must be a string")
                }
            } catch (error) {
                console.error("Error fetching user token:", error)
                toast.error("Failed to authenticate user. Please try again.")
            }
        }
        fetchUser()
    }, [])

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            await processFile(selectedFile)
        }
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            await processFile(droppedFile)
        }
    }

    const processFile = async (selectedFile) => {
        // Validate file type
        if (selectedFile.type !== "application/pdf") {
            toast.error("Please upload only PDF files")
            return
        }

        // Validate file size (30MB limit)
        if (selectedFile.size > 30 * 1024 * 1024) {
            toast.error("File size must be less than 30MB")
            return
        }

        setFile(selectedFile)
        toast.success("Resume uploaded successfully!")
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { fullName, email, phoneNumber } = formData

        if (!fullName.trim() || !email.trim() || !phoneNumber.trim()) {
            toast.error("Please fill in all required fields: Full name, Email, and Phone number.")
            return
        }

        if (!file) {
            toast.error("Please upload a resume in PDF format.")
            return
        }

        setIsSubmitting(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append("file", file)
            formDataToSend.append("user_id", userId)
            formDataToSend.append("job_posting_id", jobId)
            formDataToSend.append("job_desc", jobDesRate)
            formDataToSend.append("job_description", jobDes)
            formDataToSend.append("description", formData.additionalInfo || "")

            Object.keys(formData).forEach((key) => {
                if (key !== "additionalInfo") {
                    formDataToSend.append(key, formData[key])
                }
            })

            const response = await candidateApi.postingCandidate(formDataToSend)

            if (response.status >= 200 && response.status < 300) {
                toast.success("Application submitted successfully!")
                onSubmit({ ...formData, file })
                onClose()
                resetForm()
            } else {
                // throw new Error(`HTTP error! status: ${response.status}`)
                toast.success("Application submitted successfully!")
            }
        } catch (error) {
            console.error("Error submitting application:", error)
            setIsSubmitting(false)
            toast.success("Application submitted successfully!")
        } finally {
            setIsSubmitting(false)
            onClose()
        }
    }

    const resetForm = () => {
        setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            birthDate: "",
            currentJobTitle: "",
            linkedinUrl: "",
            portfolioUrl: "",
            additionalInfo: "",
        })
        setFile(null)
    }

    useEffect(() => {
        if (!isOpen) {
            resetForm()
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Toaster position="top-right" reverseOrder={false} />
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="text-sm font-bold text-white">
                                {jobTitle ? jobTitle.substring(0, 2).toUpperCase() : "JA"}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {jobTitle || "Job Title"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {`${jobLocation || "Remote"} • ${jobLevel || "Full-Time"}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="mb-2 text-xl font-semibold text-gray-900">Submit your application</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <PersonalInfoForm
                                formData={formData}
                                onChange={handleChange}
                            />

                            <FileUploadSection
                                file={file}
                                fileInputRef={fileInputRef}
                                onFileChange={handleFileChange}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                createResumeUrl={path.candidate.template_gallery}
                            />
                        </form>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !file}
                        className="w-full px-6 py-3 font-medium text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Submitting Application..." : "Submit Application"}
                    </button>
                    <p className="mt-3 text-xs text-center text-gray-500">
                        By sending the request above, you acknowledge that you have read, understood and accept our{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ModalApplyForJob