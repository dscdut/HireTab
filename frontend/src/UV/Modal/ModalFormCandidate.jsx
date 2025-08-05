"use client"

import { useState, useRef, useEffect } from "react"
import { candidateApi } from "@/core/services/candidate.service"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"
import { X, Upload, FileText, Brain, CheckCircle, AlertCircle } from "lucide-react"
import * as pdfjsLib from "pdfjs-dist"
// Đặt worker URL sử dụng dynamic import
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString()

const ModalFormCandidate = ({ isOpen,
    onClose,
    onSubmit,
    jobId,
    jobTitle,
    jobLocation,
    jobLevel,
    jobDesRate,
    jobDes
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
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [matchingResult, setMatchingResult] = useState(null)
    const [analysisError, setAnalysisError] = useState(null)
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

    // Function to extract text from PDF
    const extractTextFromPDF = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = async function (e) {
                try {
                    const arrayBuffer = e.target.result
                    const uint8Array = new Uint8Array(arrayBuffer)

                    let rawText = ""
                    for (let i = 0; i < uint8Array.length; i++) {
                        rawText += String.fromCharCode(uint8Array[i])
                    }

                    const textPatterns = [
                        /BT\s*(.*?)\s*ET/gs,
                        /Tj\s*\[(.*?)\]/gs,
                        /\((.*?)\)\s*Tj/gs,
                        /\((.*?)\)\s*TJ/gs,
                    ]

                    let extractedText = ""
                    textPatterns.forEach(pattern => {
                        const matches = rawText.matchAll(pattern)
                        for (const match of matches) {
                            if (match[1]) {
                                extractedText += match[1] + " "
                            }
                        }
                    })

                    if (extractedText.trim().length < 100) {
                        let simpleText = ""
                        for (let i = 0; i < uint8Array.length - 1; i++) {
                            const char = uint8Array[i]
                            if ((char >= 32 && char <= 126) || char === 10 || char === 13) {
                                const currentText = String.fromCharCode(char)
                                if (!isPDFTechnicalChar(simpleText, currentText, i, uint8Array)) {
                                    simpleText += currentText
                                }
                            }
                        }
                        extractedText = simpleText
                    }

                    let cleanedText = extractedText
                        .replace(/\b(obj|endobj|stream|endstream|xref|trailer|startxref)\b/gi, ' ')
                        .replace(/\b(Type|Page|Parent|Resources|MediaBox|Contents|Length)\b/gi, ' ')
                        .replace(/\b(BT|ET|Tj|TJ|Td|TD|Tf|TL|TjETBT)\b/gi, ' ')
                        .replace(/\b[A-Z]{2,}\b/g, ' ')
                        .replace(/\b\d{1,4}\.\d{6,}\b/g, ' ')
                        .replace(/\b\d{3,}\.\d{3,}\b/g, ' ')
                        .replace(/\b\d+\s+\d+\s+\d+\s+\d+\b/g, ' ')
                        .replace(/[0-9.]{10,}/g, ' ')
                        .replace(/\s+/g, ' ')
                        .replace(/\n\s*\n/g, '\n')
                        .trim()

                    // Log extracted text to console
                    console.log("Extracted PDF Content:", cleanedText)

                    const extractedInfo = extractMeaningfulInfo(cleanedText)
                    if (extractedInfo.length > 50) {
                        resolve(extractedInfo)
                    } else {
                        resolve(cleanedText)
                    }
                } catch (error) {
                    reject(error)
                }
            }
            reader.onerror = reject
            reader.readAsArrayBuffer(file)
        })
    }

    const isPDFTechnicalChar = (currentText, newChar, position, uint8Array) => {
        const recentText = currentText.slice(-20).toLowerCase()
        const technicalKeywords = ['obj', 'endobj', 'stream', 'xref', 'type', 'page', 'parent']
        for (const keyword of technicalKeywords) {
            if (recentText.includes(keyword)) {
                return true
            }
        }

        const surroundingChars = []
        for (let i = Math.max(0, position - 10); i < Math.min(uint8Array.length, position + 10); i++) {
            surroundingChars.push(uint8Array[i])
        }

        const digitCount = surroundingChars.filter(char => char >= 48 && char <= 57).length
        if (digitCount > 8) {
            return true
        }

        return false
    }

    const extractMeaningfulInfo = (text) => {
        const info = []
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
        const emails = text.match(emailRegex)
        if (emails) {
            info.push(`Email: ${emails.join(', ')}`)
        }

        const phoneRegex = /(?:\+\d{1,3}\s?)?(?:\(\d{1,4}\))?\s?\d{1,4}[\s.-]?\d{1,4}[\s.-]?\d{1,9}/g
        const phones = text.match(phoneRegex)?.filter(phone => {
            const cleanPhone = phone.replace(/\D/g, '')
            return cleanPhone.length >= 8 && cleanPhone.length <= 15
        })
        if (phones) {
            info.push(`Phone: ${phones.join(', ')}`)
        }

        const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/g
        const urls = text.match(urlRegex)
        if (urls) {
            info.push(`URLs: ${urls.join(', ')}`)
        }

        const linkedinRegex = /linkedin\.com\/[^\s]+/gi
        const linkedin = text.match(linkedinRegex)
        if (linkedin) {
            info.push(`LinkedIn: ${linkedin.join(', ')}`)
        }

        const educationKeywords = /(university|college|degree|bachelor|master|phd|education|graduated|gpa)/gi
        const educationMatches = text.match(educationKeywords)
        if (educationMatches) {
            const sentences = text.split(/[.!?]+/)
            const educationSentences = sentences.filter(sentence =>
                educationKeywords.test(sentence) && sentence.length > 10 && sentence.length < 200
            )
            if (educationSentences.length > 0) {
                info.push(`Education: ${educationSentences.slice(0, 2).join('. ')}`)
            }
        }

        const experienceKeywords = /(experience|work|job|position|role|company|years|developer|engineer|manager)/gi
        const experienceSentences = text.split(/[.!?]+/).filter(sentence =>
            experienceKeywords.test(sentence) && sentence.length > 15 && sentence.length < 300
        )
        if (experienceSentences.length > 0) {
            info.push(`Experience: ${experienceSentences.slice(0, 3).join('. ')}`)
        }

        const skillsKeywords = /(javascript|python|java|react|node|sql|html|css|git|aws|docker|kubernetes|api|database)/gi
        const skills = text.match(skillsKeywords)
        if (skills) {
            const uniqueSkills = [...new Set(skills.map(s => s.toLowerCase()))]
            info.push(`Skills: ${uniqueSkills.join(', ')}`)
        }

        const cleanContextText = text
            .replace(/[^\w\s@.,()-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 500)

        if (cleanContextText.length > 50) {
            info.push(`Additional Context: ${cleanContextText}`)
        }

        return info.join('\n\n')
    }

    // Function to analyze CV with Gemini API (from second code snippet)
    const analyzeWithGemini = async (cvText, jobDescription) => {
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY
            if (!apiKey) {
                throw new Error("Gemini API key not found")
            }

            const prompt = `
            Analyze the matching between this CV and job description. Provide a detailed analysis in JSON format:

            CV Content:
            ${cvText}

            Job Description:
            ${jobDescription}

            Please provide analysis in this exact JSON format:
            {
                "matchingScore": number (0-100),
                "strengths": ["strength1", "strength2", "strength3"],
                "gaps": ["gap1", "gap2", "gap3"],
                "recommendations": ["recommendation1", "recommendation2"],
                "overallAssessment": "brief overall assessment"
            }
            `

            // Retry logic for 503 errors
            const maxRetries = 3
            let attempt = 1
            while (attempt <= maxRetries) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            contents: [{
                                parts: [{
                                    text: prompt
                                }]
                            }]
                        })
                    })

                    if (!response.ok) {
                        if (response.status === 503 && attempt < maxRetries) {
                            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
                            attempt++
                            continue
                        }
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    const data = await response.json()
                    const generatedText = data.candidates[0].content.parts[0].text
                    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
                    if (jsonMatch) {
                        return JSON.parse(jsonMatch[0])
                    } else {
                        throw new Error("Could not parse analysis result")
                    }
                } catch (error) {
                    if (attempt === maxRetries) {
                        throw error
                    }
                    attempt++
                }
            }
        } catch (error) {
            console.error("Error analyzing with Gemini:", error)
            throw error
        }
    }

    const validatePdfContent = async (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader()

            fileReader.onload = async function (e) {
                try {
                    const arrayBuffer = e.target.result
                    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
                    const pdf = await loadingTask.promise

                    if (pdf.numPages === 0) {
                        reject(new Error("PDF file has no pages"))
                        return
                    }

                    const page = await pdf.getPage(1)
                    const textContent = await page.getTextContent()
                    const textItems = textContent.items.map(item => item.str).join(' ')

                    if (textItems.trim().length < 50) {
                        reject(new Error("PDF content appears to be too short or may be scanned images only"))
                        return
                    }

                    resolve({
                        isValid: true,
                        pageCount: pdf.numPages,
                        textLength: textItems.length,
                        hasText: textItems.trim().length > 0
                    })
                } catch (error) {
                    reject(new Error(`Failed to read PDF: ${error.message}`))
                }
            }

            fileReader.onerror = () => {
                reject(new Error("Failed to read file"))
            }

            fileReader.readAsArrayBuffer(file)
        })
    }

    const handleFileChange = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]

            if (selectedFile.type !== "application/pdf") {
                toast.error("Please upload only PDF files")
                e.target.value = ""
                return
            }

            if (selectedFile.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                e.target.value = ""
                return
            }

            try {
                toast.info("Validating CV content...")
                const validation = await validatePdfContent(selectedFile)

                if (validation.isValid) {
                    setFile(selectedFile)

                    setIsAnalyzing(true)
                    setAnalysisError(null)
                    try {
                        const cvText = await extractTextFromPDF(selectedFile)
                        const jobDescription = `${jobDes}\n${jobDesRate}`
                        const analysisResult = await analyzeWithGemini(cvText, jobDescription)
                        setMatchingResult(analysisResult)
                        toast.success("CV analysis completed!")
                    } catch (error) {
                        setAnalysisError("Failed to analyze CV due to server issues. You can still submit your application.")
                        toast.error("CV analysis failed. You can still proceed with submission.")
                    } finally {
                        setIsAnalyzing(false)
                    }
                }
            } catch (error) {
                console.error("PDF validation error:", error)
                toast.error(error.message)
                e.target.value = ""
                setIsAnalyzing(false)
            }
        }
    }

    const handleDrop = async (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]

            if (droppedFile.type !== "application/pdf") {
                toast.error("Please upload only PDF files")
                return
            }

            if (droppedFile.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                return
            }

            try {
                toast.info("Validating CV content...")
                const validation = await validatePdfContent(droppedFile)

                if (validation.isValid) {
                    setFile(droppedFile)
                    toast.success(`PDF validated! ${validation.pageCount} pages, ${validation.textLength} characters detected.`)

                    setIsAnalyzing(true)
                    setAnalysisError(null)
                    try {
                        const cvText = await extractTextFromPDF(droppedFile)
                        const jobDescription = `${jobDes}\n${jobDesRate}`
                        const analysisResult = await analyzeWithGemini(cvText, jobDescription)
                        setMatchingResult(analysisResult)
                        toast.success("CV analysis completed!")
                    } catch (error) {
                        setAnalysisError("Failed to analyze CV due to server issues. You can still submit your application.")
                        toast.error("CV analysis failed. You can still proceed with submission.")
                    } finally {
                        setIsAnalyzing(false)
                    }
                }
            } catch (error) {
                console.error("PDF validation or analysis error:", error)
                toast.error(error.message)
                setIsAnalyzing(false)
            }
        }
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
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error submitting application:", error)
            toast.error("Failed to submit application. Please try again.")
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
            currentJobTitle: "",
            linkedinUrl: "",
            portfolioUrl: "",
            additionalInfo: "",
        })
        setFile(null)
        setMatchingResult(null)
        setAnalysisError(null)
        setIsAnalyzing(false)
    }

    useEffect(() => {
        if (!isOpen) {
            resetForm()
        }
    }, [isOpen])

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-yellow-600"
        return "text-red-600"
    }

    const getScoreBgColor = (score) => {
        if (score >= 80) return "bg-green-100"
        if (score >= 60) return "bg-yellow-100"
        return "bg-red-100"
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
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
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Submit your application</h3>
                            <p className="text-sm text-gray-600">The following is required and will only be shared with JobHunty</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Full name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="currentJobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                                        Current or previous job title
                                    </label>
                                    <input
                                        type="text"
                                        id="currentJobTitle"
                                        name="currentJobTitle"
                                        value={formData.currentJobTitle}
                                        onChange={handleChange}
                                        placeholder="What's your current or previous job title?"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-900">LINKS</h4>

                                <div>
                                    <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedinUrl"
                                        name="linkedinUrl"
                                        value={formData.linkedinUrl}
                                        onChange={handleChange}
                                        placeholder="Link to your LinkedIn profile"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                                        Portfolio URL
                                    </label>
                                    <input
                                        type="url"
                                        id="portfolioUrl"
                                        name="portfolioUrl"
                                        value={formData.portfolioUrl}
                                        onChange={handleChange}
                                        placeholder="Link to your portfolio"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional information
                                </label>
                                <textarea
                                    id="additionalInfo"
                                    name="additionalInfo"
                                    value={formData.additionalInfo}
                                    onChange={handleChange}
                                    placeholder="Add a cover letter or anything else you want to share"
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                                <div className="text-right text-xs text-gray-400 mt-1">{formData.additionalInfo.length}/500</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Attach your resume</label>
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf"
                                        required
                                    />
                                    <div className="flex flex-col items-center">
                                        {file ? (
                                            <>
                                                <FileText className="w-8 h-8 text-blue-500 mb-2" />
                                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                                <p className="text-xs text-gray-500">PDF • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                                <p className="text-sm font-medium text-gray-900 mb-1">Attach Resume/CV</p>
                                                <p className="text-xs text-gray-500">Drag and drop or click to upload (PDF only)</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isAnalyzing && (
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <div className="flex items-center space-x-3">
                                            <Brain className="w-6 h-6 text-blue-600 animate-spin" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900">Analyzing your CV...</p>
                                                <p className="text-xs text-blue-700">Our AI is comparing your resume with the job requirements</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {analysisError && !isAnalyzing && (
                                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <AlertCircle className="w-5 h-5 text-red-600" />
                                            <h4 className="text-sm font-semibold text-red-900">CV Analysis Failed</h4>
                                        </div>
                                        <p className="text-xs text-red-700">{analysisError}</p>
                                    </div>
                                )}

                                {matchingResult && !isAnalyzing && !analysisError && (
                                    <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <h4 className="text-sm font-semibold text-gray-900">CV Analysis Complete</h4>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Matching Score</span>
                                                <span className={`text-lg font-bold ${getScoreColor(matchingResult.matchingScore)}`}>
                                                    {matchingResult.matchingScore}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${getScoreBgColor(matchingResult.matchingScore)}`}
                                                    style={{ width: `${matchingResult.matchingScore}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        {matchingResult.strengths && matchingResult.strengths.length > 0 && (
                                            <div className="mb-3">
                                                <h5 className="text-xs font-semibold text-green-700 mb-1">STRENGTHS</h5>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    {matchingResult.strengths.slice(0, 3).map((strength, index) => (
                                                        <li key={index} className="flex items-start space-x-1">
                                                            <span className="text-green-500 mt-0.5">•</span>
                                                            <span>{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {matchingResult.gaps && matchingResult.gaps.length > 0 && (
                                            <div className="mb-3">
                                                <h5 className="text-xs font-semibold text-orange-700 mb-1">AREAS TO IMPROVE</h5>
                                                <ul className="text-xs text-gray-600 space-y-1">
                                                    {matchingResult.gaps.slice(0, 2).map((gap, index) => (
                                                        <li key={index} className="flex items-start space-x-1">
                                                            <span className="text-orange-500 mt-0.5">•</span>
                                                            <span>{gap}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {matchingResult.overallAssessment && (
                                            <div className="text-xs text-gray-600 bg-white p-2 rounded border-l-4 border-blue-400">
                                                <span className="font-medium">Assessment: </span>
                                                {matchingResult.overallAssessment}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !file || isAnalyzing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmitting ? "Submitting Application..." :
                            isAnalyzing ? "Analyzing CV..." :
                                "Submit Application"}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-3">
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

export default ModalFormCandidate