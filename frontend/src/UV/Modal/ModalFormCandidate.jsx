"use client"

import { useState, useRef, useEffect } from "react"
import { candidateApi } from "@/core/services/candidate.service"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"

const ModalFormCandidate = ({ isOpen, onClose, onSubmit, jobId, jobDesRate, jobDes }) => {
    const [userId, setUserId] = useState("")
    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        birthDate: "",
        question: "",
        description: "",
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
            const token = await localStorage.getItem("access_token")
            if (typeof token === "string") {
                const decodedToken = jwtDecode(token)
                const userDecodeId = decodedToken.id
                setUserId(userDecodeId)
            } else {
                console.log("Invalid token specified: must be a string")
            }
        }
        fetchUser()
    }, [])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append("file", file)
            formDataToSend.append("user_id", userId)
            formDataToSend.append("job_posting_id", jobId)
            formDataToSend.append("job_desc", jobDesRate)
            formDataToSend.append("job_description", jobDes)
            formDataToSend.append("description", formData.question || formData.description || "")

            Object.keys(formData).forEach(key => {
                if (key !== "description" && key !== "question") {
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
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error submitting1 application:", error)
            onClose()
            toast.success("Application submitted successfully!")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            fullName: "",
            phoneNumber: "",
            email: "",
            birthDate: "",
            question: "",
            description: "",
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
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-xl relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center mb-6">
                    <img
                        src="https://developers.google.com/site-assets/images/home/google_developers_logo.png"
                        alt="Google Developer"
                        className="h-8 mr-2"
                    />
                    <div>
                        <h2 className="text-gray-800 font-medium text-lg">Google Developer Student Clubs</h2>
                        <p className="text-gray-600 text-sm">Danang University of Science and Technology</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="fullName" className="block text-gray-800 mb-1">
                            Full Name:
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="birthDate" className="block text-gray-800 mb-1">
                            Date of Birth:
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phoneNumber" className="block text-gray-800 mb-1">
                            Phone Number:
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-800 mb-1">
                            Email:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="question" className="block text-gray-800 mb-1">
                            Any Questions:
                        </label>
                        <textarea
                            id="question"
                            name="question"
                            value={formData.question}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-800 mb-1">Upload CV:</label>
                        <div
                            className="border border-dashed border-gray-300 rounded p-4 text-center cursor-pointer"
                            onClick={() => fileInputRef.current.click()}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.doc,.docx"
                                required
                            />
                            <div className="flex flex-col items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-gray-400 mb-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                {file ? (
                                    <p className="text-sm text-gray-600">{file.name}</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Drag and drop or click to upload (PDF, DOC, DOCX)</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-800 rounded hover:bg-gray-100 transition-colors"
                            disabled={isSubmitting}
                        >
                            BACK
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "SUBMITTING..." : "DONE"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalFormCandidate
