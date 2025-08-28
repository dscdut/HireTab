"use client"

import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { industryApi } from "@/core/services/industry.service"
import { jobApi } from "@/core/services/job.service"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"
import { Plus, Trash2, AlertCircle, X } from "lucide-react"

export default function AddJobModal({ isOpen, onClose }) {
    // State for job fields
    const [jobData, setJobData] = useState({
        industryId: "",
        title: "",
        description: "",
        location: "",
        descRate: "",
        salaryMin: "",
        salaryMax: "",
        level: "",
        startTime: "",
        endTime: "",
    })

    // State for criteria
    const [criteria, setCriteria] = useState([{ name: "", weight: "", detail: "" }])

    // State for validation errors
    const [salaryError, setSalaryError] = useState({ min: false, max: false })
    const [dateError, setDateError] = useState(false)
    const [weightErrors, setWeightErrors] = useState([])
    const [weightExceeded, setWeightExceeded] = useState(false)

    // State for AI Assistant
    const [showQuickReplyPrompt, setShowQuickReplyPrompt] = useState(null) // Changed to store index of criterion or 'job' for job description
    const [quickReplyPrompt, setQuickReplyPrompt] = useState("")
    const [isGeneratingContent, setIsGeneratingContent] = useState(false)

    // Fetch industries
    const { data: industries = [], isLoading, isError } = useQuery({
        queryKey: ["industries"],
        queryFn: async () => {
            try {
                const response = await industryApi.listIndustry()
                return response
            } catch (error) {
                toast.error("Failed to load industries!")
                throw error
            }
        },
        retry: false,
    })

    // Mutation to create a new job
    const createJobMutation = useMutation({
        mutationFn: async (newJob) => {
            const response = await jobApi.createJob(newJob)
            return response
        },
        onSuccess: () => {
            toast.success("Job created successfully!")
            onClose()
        },
        onError: () => {
            toast.error("Failed to create job!")
        },
    })

    // Handle changes for job data fields
    const handleJobDataChange = (field, value) => {
        setJobData({ ...jobData, [field]: value })
    }

    // Handle criteria changes
    const updateCriterion = (index, field, value) => {
        const updatedCriteria = [...criteria]
        updatedCriteria[index][field] = value
        setCriteria(updatedCriteria)
    }

    const addCriterion = () => {
        setCriteria([...criteria, { name: "", weight: "", detail: "" }])
    }

    const removeCriterion = (index) => {
        if (criteria.length > 1) {
            const updatedCriteria = criteria.filter((_, i) => i !== index)
            setCriteria(updatedCriteria)
            if (showQuickReplyPrompt === index) {
                setShowQuickReplyPrompt(null)
                setQuickReplyPrompt("")
            }
        }
    }

    const totalWeight = () => {
        return criteria.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0)
    }

    // AI Assistant content generation
    const onGenerateContent = async (target) => {
        if (!quickReplyPrompt.trim()) {
            toast.error("Please enter a description for the AI to generate content!")
            return
        }

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
                                        text:
                                            target === "job"
                                                ? `Write a professional job description based on this prompt: "${quickReplyPrompt}".  

The description should be detailed, professional, and formatted in valid **Markdown** suitable for rendering in a Markdown viewer.  

Include the following sections using Markdown syntax:  
- A main title using \`#\` for the job title  
- A section titled **Key Responsibilities** using \`##\`, followed by a bulleted list  
- A section titled **Required Qualifications** using \`##\`, followed by a bulleted list  
- A section titled **Company Benefits** using \`##\`, followed by a bulleted list  

Use appropriate Markdown features like paragraphs, **bold**, *italic*, and lists where suitable.  
Do not include any HTML or CSS, only pure Markdown.`
                                                : `Write recruitment criteria based on this request: ${quickReplyPrompt}. Do not include scoring or additional evaluation details.`
                                    }
                                ]
                            }
                        ]
                    })


                }
            )

            const data = await response.json()
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const generatedContent = data.candidates[0].content.parts[0].text
                if (target === "job") {
                    setJobData({ ...jobData, description: generatedContent })
                } else {
                    updateCriterion(target, "detail", generatedContent)
                }
                setShowQuickReplyPrompt(null)
                setQuickReplyPrompt("")
                toast.success(target === "job" ? "Job description generated successfully!" : "Criterion detail generated successfully!")
            } else {
                throw new Error("Unexpected API response")
            }
        } catch (error) {
            console.error("Error generating content:", error)
            toast.error("Failed to generate content. Please try again.")
        } finally {
            setIsGeneratingContent(false)
        }
    }

    const handleSubmit = () => {
        const accessToken = localStorage.getItem("access_token")
        if (!accessToken) {
            toast.error("Access token is missing!")
            return
        }

        let userId = ""
        try {
            const decodedToken = jwtDecode(accessToken)
            userId = decodedToken.id
        } catch (error) {
            toast.error("Failed to decode access token!")
            return
        }

        if (!jobData.industryId || !jobData.title || !jobData.description || !jobData.location) {
            toast.error("Please fill out all required fields!")
            return
        }

        if (isNaN(jobData.salaryMin) || isNaN(jobData.salaryMax)) {
            setSalaryError({ min: isNaN(jobData.salaryMin), max: isNaN(jobData.salaryMax) })
            toast.error("Salary must contain numbers only!")
            return
        }

        if (new Date(jobData.startTime) >= new Date(jobData.endTime)) {
            setDateError(true)
            toast.error("End date must be after start date!")
            return
        }

        const descRateValue = criteria
            .map((c) => `${c.name} (${c.weight}%): ${c.detail}`)
            .join("; ")

        if (totalWeight() > 100) {
            setWeightExceeded(true)
            toast.error("Total weight cannot exceed 100!")
            return
        }

        const payload = {
            ...jobData,
            descRate: descRateValue,
            userId: userId
        }
        createJobMutation.mutate(payload)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader className="border-b border-gray-100 pb-6">
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        Create New Job Posting
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        Fill out the information below to create a professional job posting. All required fields must be completed.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-8 py-6">
                    {/* Basic Information Section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="w-2 h-6 bg-blue-500 rounded mr-3"></div>
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Industry Selection */}
                            <div>
                                <select
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={jobData.industryId}
                                    onChange={(e) => handleJobDataChange("industryId", e.target.value)}
                                >
                                    <option value="">Select an industry</option>
                                    {industries.map((industry) => (
                                        <option key={industry.id} value={industry.id}>
                                            {industry.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Job Title */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Software Engineer, Marketing Manager"
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={jobData.title}
                                    onChange={(e) => handleJobDataChange("title", e.target.value)}
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <select
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={jobData.location}
                                    onChange={(e) => handleJobDataChange("location", e.target.value)}
                                >
                                    <option value="">Select city</option>
                                    <option value="danang">Da Nang</option>
                                    <option value="hanoi">Ha Noi</option>
                                    <option value="hochiminh">Ho Chi Minh City</option>
                                </select>
                            </div>

                            {/* Experience Level */}
                            <div>
                                <select
                                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    value={jobData.level}
                                    onChange={(e) => handleJobDataChange("level", e.target.value)}
                                >
                                    <option value="">Select experience level</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Junior">Junior (0-2 years)</option>
                                    <option value="Middle">Middle</option>
                                    <option value="Senior">Senior (3+ years)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Salary & Timeline Section */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                            <div className="w-2 h-6 bg-green-500 rounded mr-3"></div>
                            Salary & Timeline
                        </h3>

                        <div className="space-y-8">
                            {/* Salary Range */}
                            <div>
                                <div className="flex gap-4 items-center">
                                    <input
                                        type="text"
                                        placeholder="1000"
                                        className={`flex-1 border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-center ${salaryError.min ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                                        value={jobData.salaryMin}
                                        onChange={(e) => handleJobDataChange("salaryMin", e.target.value)}
                                    />
                                    <span className="text-gray-500 font-medium px-2">to</span>
                                    <input
                                        type="text"
                                        placeholder="2000"
                                        className={`flex-1 block w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors text-center ${salaryError.max ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                                        value={jobData.salaryMax}
                                        onChange={(e) => handleJobDataChange("salaryMax", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <input
                                            type="date"
                                            className={`w-full border px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${dateError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                                            value={jobData.startTime}
                                            onChange={(e) => handleJobDataChange("startTime", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="date"
                                            className={`w-full border px-3 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${dateError ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                                            value={jobData.endTime}
                                            onChange={(e) => handleJobDataChange("endTime", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="w-ần h-6 bg-purple-500 rounded mr-3"></div>
                            Job Description
                            <button
                                onClick={() => setShowQuickReplyPrompt(showQuickReplyPrompt === "job" ? null : "job")}
                                className={`ml-4 px-2 py-1 rounded-lg hover:bg-blue-200 flex items-center space-x-2 text-sm font-medium transition-colors ${showQuickReplyPrompt === "job" ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700"}`}
                            >
                                <span>✨ AI Assistant</span>
                            </button>
                        </h3>

                        {/* Quick Reply Prompt for Job Description */}
                        {showQuickReplyPrompt === "job" && (
                            <div className="p-4 mb-4 border-b border-gray-200 bg-blue-50">
                                <div className="flex items-center space-x-2 mb-3">
                                    <span className="text-sm font-medium text-blue-800">✨ AI Job Description</span>
                                    <button
                                        onClick={() => {
                                            setShowQuickReplyPrompt(null)
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
                                        placeholder="Describe the job description you want to generate..."
                                        className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                        onKeyPress={(e) => e.key === "Enter" && onGenerateContent("job")}
                                    />
                                    <button
                                        onClick={() => onGenerateContent("job")}
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
                                    AI will generate a professional job description based on your input
                                </p>
                            </div>
                        )}

                        <div>
                            <textarea
                                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Provide a detailed job description including:&#10;• Key responsibilities and duties&#10;• Required qualifications and skills&#10;• Company culture and benefits&#10;• Working conditions and environment&#10;&#10;Example: We are seeking a Senior Software Engineer to join our dynamic team. You will be responsible for designing and developing scalable web applications, collaborating with cross-functional teams, and mentoring junior developers..."
                                rows={8}
                                value={jobData.description}
                                onChange={(e) => handleJobDataChange("description", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Scoring Criteria */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <div className="w-2 h-6 bg-orange-500 rounded mr-3"></div>
                            Evaluation Criteria & Weights
                        </h3>

                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-800">
                                    Total Weight Distribution:
                                </span>
                                <span className={`text-lg font-bold ${totalWeight() > 100 ? "text-red-600" : totalWeight() === 100 ? "text-green-600" : "text-blue-600"}`}>
                                    {totalWeight()}/100
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {criteria.map((criterion, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">
                                                Criterion #{index + 1}
                                            </span>
                                            <button
                                                onClick={() => setShowQuickReplyPrompt(showQuickReplyPrompt === index ? null : index)}
                                                className={`px-2 py-1 rounded-lg hover:bg-blue-200 flex items-center space-x-2 text-sm font-medium transition-colors ${showQuickReplyPrompt === index ? "bg-blue-200 text-blue-800" : "bg-blue-100 text-blue-700"}`}
                                            >
                                                <span>✨ AI Assistant</span>
                                            </button>
                                        </div>
                                        {criteria.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCriterion(index)}
                                                className="text-red-500 hover:text-red-700 p-1 rounded transition-colors"
                                                title="Remove criterion"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Quick Reply Prompt for Criterion */}
                                    {showQuickReplyPrompt === index && (
                                        <div className="p-4 mb-4 border-b border-gray-200 bg-blue-50">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="text-sm font-medium text-blue-800">✨ AI Quick Description</span>
                                                <button
                                                    onClick={() => {
                                                        setShowQuickReplyPrompt(null)
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
                                                    placeholder="Describe the criterion detail you want to generate..."
                                                    className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    onKeyPress={(e) => e.key === "Enter" && onGenerateContent(index)}
                                                />
                                                <button
                                                    onClick={() => onGenerateContent(index)}
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
                                                AI will generate a professional criterion detail based on your input
                                            </p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                        <div className="md:col-span-2">
                                            <input
                                                type="text"
                                                placeholder="e.g. Technical Skills, Communication"
                                                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                value={criterion.name}
                                                onChange={(e) => updateCriterion(index, "name", e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <input
                                                type="text"
                                                placeholder="0-100"
                                                className={`w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${weightErrors[index] ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                                                value={criterion.weight}
                                                onChange={(e) => updateCriterion(index, "weight", e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            placeholder="Describe what will be evaluated and how points will be awarded for this criterion..."
                                            className="w-full h-[13.25rem] border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            rows={2}
                                            value={criterion.detail}
                                            onChange={(e) => updateCriterion(index, 'detail', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addCriterion}
                                disabled={totalWeight() >= 100}
                                className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Criterion
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-100 pt-6 flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="px-6 py-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={
                            dateError ||
                            salaryError.min ||
                            salaryError.max ||
                            weightExceeded ||
                            totalWeight() !== 100 ||
                            createJobMutation.isLoading ||
                            isGeneratingContent
                        }
                        className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50"
                    >
                        {createJobMutation.isLoading ? "Creating..." : "Create Job Posting"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}