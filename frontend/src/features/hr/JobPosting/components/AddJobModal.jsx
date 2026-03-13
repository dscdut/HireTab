import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog"
import { Button } from "@/shared/components/ui/button"
import { useState } from "react"
import { industryApi } from "@/core/services/industry.service"
import { jobApi } from "@/core/services/job.service"
import { useQuery, useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { jwtDecode } from "jwt-decode"
import { Plus, Trash2, X, MapPin, Briefcase, Calendar, DollarSign, Users, ArrowLeft, Eye } from "lucide-react"
import ReactMarkdown from "react-markdown"

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
    const [imageBase64, setImageBase64] = useState("")
    const [hasPhoto, setHasPhoto] = useState(false)
    const [weightErrors, setWeightErrors] = useState([])
    const [weightExceeded, setWeightExceeded] = useState(false)

    // State for Smart Assistant
    const [showQuickReplyPrompt, setShowQuickReplyPrompt] = useState(null)
    const [quickReplyPrompt, setQuickReplyPrompt] = useState("")
    const [isGeneratingContent, setIsGeneratingContent] = useState(false)
    const [showPreview, setShowPreview] = useState(false)

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
            const response = await fetch(import.meta.env.VITE_API_CREATE_JOB_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newJob),
            });
            if (!response.ok) {
                throw new Error("Failed to create job");
            }
            return response.json();
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
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImageBase64(reader.result)
                setHasPhoto(true)
            }
            reader.readAsDataURL(file)
        } else {
            setImageBase64("")
            setHasPhoto(false)
        }
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

    // Smart Assistant content generation
    const onGenerateContent = async (target) => {
        if (!quickReplyPrompt.trim()) {
            toast.error("Please enter a description for the assistant!")
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
                toast.success(target === "job" ? "Description generated!" : "Details generated!")
            } else {
                throw new Error("Unexpected response")
            }
        } catch (error) {
            console.error("Error generating content:", error)
            toast.error("Failed to generate content.")
        } finally {
            setIsGeneratingContent(false)
        }
    }

    const handleSubmit = (shouldPublish = true) => {
        const accessToken = localStorage.getItem("access_token");
        if (!accessToken) return toast.error("Access token is missing!");

        let userId = "";
        try {
            userId = jwtDecode(accessToken).id;
        } catch {
            return toast.error("Failed to decode token!");
        }

        // Define all required fields for publishing
        const requiredFields = [
            { field: "industryId", name: "Industry" },
            { field: "title", name: "Job Title" },
            { field: "description", name: "Job Description" },
            { field: "location", name: "Location" },
            { field: "salaryMin", name: "Min Salary" },
            { field: "salaryMax", name: "Max Salary" },
            { field: "level", name: "Job Level" },
            { field: "startTime", name: "Start Date" },
            { field: "endTime", name: "End Date" },
        ];

        let missingFields = [];

        // Check for missing data
        for (const { field, name } of requiredFields) {
            if (!jobData[field] || (typeof jobData[field] === "string" && jobData[field].trim() === "")) {
                missingFields.push(name);
            }
        }

        const salaryMin = parseFloat(jobData.salaryMin);
        const salaryMax = parseFloat(jobData.salaryMax);

        // --- VALIDATION FOR PUBLISHING ---
        if (shouldPublish) {
            if (missingFields.length > 0) {
                return toast.error(`Missing required fields: ${missingFields[0]}!`);
            }

            if (isNaN(salaryMin) || isNaN(salaryMax)) {
                setSalaryError({ min: isNaN(salaryMin), max: isNaN(salaryMax) });
                return toast.error("Salary must contain numbers only!");
            }

            if (salaryMin > salaryMax) {
                setSalaryError({ min: true, max: true });
                return toast.error("Min salary cannot exceed max salary!");
            } else {
                setSalaryError({ min: false, max: false });
            }

            if (new Date(jobData.startTime) >= new Date(jobData.endTime)) {
                setDateError(true);
                return toast.error("End date must be after start date!");
            } else {
                setDateError(false);
            }

            if (totalWeight() > 100) {
                setWeightExceeded(true);
                return toast.error("Total weight cannot exceed 100!");
            } else {
                setWeightExceeded(false);
            }
        }
        // --- END VALIDATION ---

        const descRateValue = criteria
            .map((c) => `${c.name} (${c.weight}%): ${c.detail}`)
            .join("; ");

        // Auto-generate title if missing during draft save
        const finalTitle = jobData.title?.trim() || `Untitled Job ${new Date().toLocaleDateString()}`;

        // Safe default dates for backend DB constraints if empty
        const defaultStart = jobData.startTime || new Date().toISOString().split('T')[0];
        const defaultEnd = jobData.endTime || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Safe default industry
        const defaultIndustryId = jobData.industryId || (industries && industries.length > 0 ? industries[0].id : 1);

        // Clean empty string properties from jobData to prevent Joi validation errors
        const cleanedJobData = Object.fromEntries(
            Object.entries(jobData).filter(([_, v]) => v !== "")
        );

        const payload = {
            ...cleanedJobData,
            title: finalTitle,
            industryId: defaultIndustryId || 1, // Fallback if still empty
            startTime: defaultStart,
            endTime: defaultEnd,
            salaryMin: isNaN(salaryMin) ? 0 : salaryMin, // Default to 0 for drafts if invalid
            salaryMax: isNaN(salaryMax) ? 0 : salaryMax,
            descRate: descRateValue,
            userId,
            data: imageBase64,
            isPhoto: !!imageBase64,
            status: shouldPublish ? "In Progress" : "To Do"
        };

        jobApi.createJob(payload).then(async (response) => {
            if (shouldPublish) {
                try {
                    await fetch(import.meta.env.VITE_API_CREATE_JOB_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });
                    toast.success("Job published successfully!");
                } catch (error) {
                    toast.error("Created but failed to publish automatically.");
                }
            } else {
                // Smart Feedback for Drafts
                if (missingFields.length > 0) {
                    toast.info(
                        <div className="flex flex-col gap-1">
                            <span className="font-bold">Draft saved successfully!</span>
                            <span className="text-xs opacity-90">Missing {missingFields.length} fields to publish (e.g. {missingFields[0]}).</span>
                        </div>,
                        { autoClose: 4000 }
                    );
                } else {
                    toast.success("Draft saved successfully!");
                }
            }
            onClose();
        }).catch((error) => {
            console.error(error.response?.data);
            const detailMsg = error.response?.data?.detail?.[0]?.message;
            const mainMsg = error.response?.data?.message;
            toast.error(`Failed to process job! ${detailMsg || mainMsg || error.message}`);
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white rounded-[32px] p-0 border-none shadow-2xl">
                {/* Header - Styled like image */}
                <div className="sticky top-0 z-20 bg-white px-10 py-8 flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="p-2.5 hover:bg-gray-50 rounded-xl transition-all border border-slate-100">
                            <X className="w-5 h-5 text-slate-400" />
                        </button>
                        <DialogTitle className="text-[32px] font-extrabold text-[#0F172A] tracking-tight">
                            Create Job Posting
                        </DialogTitle>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={() => setShowPreview(true)}
                            variant="ghost"
                            className="px-8 py-6 rounded-2xl font-bold bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2"
                        >
                            <Eye size={18} />
                            Preview
                        </Button>
                        <Button onClick={() => handleSubmit(false)} variant="outline" className="px-8 py-6 rounded-2xl font-bold border-slate-200 text-[#0F172A] hover:bg-slate-50 transition-all">
                            Save as Draft
                        </Button>
                        <Button
                            onClick={() => handleSubmit(true)}
                            disabled={dateError || salaryError.min || salaryError.max || weightExceeded || totalWeight() !== 100 || isGeneratingContent}
                            className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 transition-all disabled:opacity-30"
                        >
                            {createJobMutation.isPending ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </div>

                <PreviewModal
                    isOpen={showPreview}
                    onClose={() => setShowPreview(false)}
                    jobData={jobData}
                    criteria={criteria}
                    imageBase64={imageBase64}
                    industries={industries}
                />

                <div className="px-10 pb-12 space-y-0">
                    {/* UI Pattern: Left Label/Sub-description, Right Field */}

                    {/* Job Title */}
                    <Section
                        title="Job post title"
                        subtitle="Create a strong job post title"
                    >
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="e.g. Senior Legal Counsel"
                                className="w-full px-6 py-4 bg-slate-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-semibold text-[#0F172A] placeholder:text-slate-300"
                                value={jobData.title}
                                onChange={(e) => handleJobDataChange("title", e.target.value)}
                            />
                            <div className="space-y-2">
                                <p className="text-[13px] font-bold text-gray-400">Examples:</p>
                                <ul className="text-[13px] font-medium text-gray-400 space-y-1 ml-1">
                                    <li>• Legal Counsel for Law Issues</li>
                                    <li>• Experienced Corporate Attorney for Established Law Firm</li>
                                    <li>• Contract Attorney for Short-Term Project</li>
                                </ul>
                            </div>
                        </div>
                    </Section>

                    {/* Description */}
                    <Section
                        title="Description"
                        subtitle="Provide a brief and concise job description"
                    >
                        <div className="relative">
                            <textarea
                                className="w-full px-6 py-6 bg-slate-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-medium text-[#0F172A] placeholder:text-slate-300 min-h-[220px] leading-relaxed"
                                placeholder="Describe the role, responsibilities, and key requirements..."
                                value={jobData.description}
                                onChange={(e) => handleJobDataChange("description", e.target.value)}
                            />

                            <div className="absolute bottom-6 right-6 flex items-center gap-3">
                                <div className="flex items-center gap-3 px-3 border-r border-gray-200">
                                    <span className="font-serif italic text-gray-400 cursor-pointer hover:text-gray-600">B</span>
                                    <span className="font-serif italic text-gray-400 cursor-pointer hover:text-gray-600">I</span>
                                    <span className="font-serif underline text-gray-400 cursor-pointer hover:text-gray-600">U</span>
                                </div>
                                <button
                                    onClick={() => setShowQuickReplyPrompt(showQuickReplyPrompt === "job" ? null : "job")}
                                    className="px-4 py-2 bg-[#1E293B] text-white rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-2"
                                >
                                    Use Smart Assistant
                                </button>
                            </div>
                        </div>

                        {showQuickReplyPrompt === "job" && (
                            <div className="mt-4 bg-blue-50 p-6 rounded-2xl border border-blue-100 animate-fade-in relative">
                                <button onClick={() => setShowQuickReplyPrompt(null)} className="absolute top-4 right-4 text-blue-400 hover:text-blue-600">
                                    <X className="w-4 h-4" />
                                </button>
                                <label className="block text-[13px] font-semibold text-blue-800 mb-3">Generation prompt</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={quickReplyPrompt}
                                        onChange={(e) => setQuickReplyPrompt(e.target.value)}
                                        placeholder="Outline the role & requirements..."
                                        className="flex-1 px-5 py-3 bg-white rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium"
                                        onKeyPress={(e) => e.key === "Enter" && onGenerateContent("job")}
                                    />
                                    <button
                                        onClick={() => onGenerateContent("job")}
                                        disabled={isGeneratingContent || !quickReplyPrompt.trim()}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {isGeneratingContent ? 'Thinking...' : 'Generate'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* Industry & Location */}
                    <Section
                        title="Industry & Location"
                        subtitle="Choose the market segment and work location"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <label className="text-[13px] font-semibold text-gray-500 ml-1">Focus industry</label>
                                <select
                                    className="w-full px-6 py-4 bg-gray-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-medium text-[#1E293B] appearance-none"
                                    value={jobData.industryId}
                                    onChange={(e) => handleJobDataChange("industryId", e.target.value)}
                                >
                                    <option value="">Select industry field</option>
                                    {industries.map((ind) => (
                                        <option key={ind.id} value={ind.id}>{ind.name}</option>
                                    ))}
                                </select>
                                <div className="flex flex-wrap gap-2">
                                    {jobData.industryId && (
                                        <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-2">
                                            {industries.find(i => i.id === jobData.industryId)?.name}
                                            <X className="w-3 h-3 cursor-pointer" onClick={() => handleJobDataChange("industryId", "")} />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[13px] font-semibold text-gray-500 ml-1">Work location</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Ho Chi Minh City / Remote"
                                    className="w-full px-6 py-4 bg-gray-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-medium text-[#1E293B]"
                                    value={jobData.location || ""}
                                    onChange={(e) => handleJobDataChange("location", e.target.value)}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Job Type & Level */}
                    <Section
                        title="Job Type & Level"
                        subtitle="Define the engagement and seniority"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div onClick={() => handleJobDataChange("level", "Middle")} className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${jobData.level === 'Middle' ? 'border-blue-600 bg-blue-50/10' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${jobData.level === 'Middle' ? 'border-blue-600' : 'border-gray-300'}`}>
                                        {jobData.level === 'Middle' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>}
                                    </div>
                                    <span className={`font-bold ${jobData.level === 'Middle' ? 'text-blue-600' : 'text-gray-500'}`}>Middle Senior</span>
                                </div>
                            </div>
                            <select
                                className="px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-medium text-[#1E293B]"
                                value={jobData.level}
                                onChange={(e) => handleJobDataChange("level", e.target.value)}
                            >
                                <option value="">Other Level...</option>
                                <option value="Intern">Intern</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                                <option value="Leader">Leader</option>
                                <option value="Manager">Manager</option>
                            </select>
                        </div>
                    </Section>

                    {/* Cost / Salary */}
                    <Section
                        title="Budget Allocation"
                        subtitle="Define salary range for this position"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className={`w-full pl-12 pr-6 py-4 bg-gray-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-bold text-[#1E293B] ${salaryError.min ? 'bg-red-50 border-red-200' : ''}`}
                                        value={jobData.salaryMin}
                                        onChange={(e) => handleJobDataChange("salaryMin", e.target.value)}
                                    />
                                </div>
                                <span className="text-gray-300 font-bold">—</span>
                                <div className="relative flex-1">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className={`w-full pl-12 pr-6 py-4 bg-gray-50 border border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-bold text-[#1E293B] ${salaryError.max ? 'bg-red-50 border-red-200' : ''}`}
                                        value={jobData.salaryMax}
                                        onChange={(e) => handleJobDataChange("salaryMax", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-blue-50/30 p-4 rounded-xl">
                                <span className="text-xs font-bold text-gray-400">Projected Total Cost</span>
                                <span className="text-sm font-bold text-blue-600">${parseFloat(jobData.salaryMax) || 0}</span>
                            </div>
                        </div>
                    </Section>

                    {/* Scoring Matrix */}
                    <Section
                        title="Evaluation Matrix"
                        subtitle="Set criteria to score your candidates"
                    >
                        <div className="space-y-4">
                            {criteria.map((crit, idx) => (
                                <div key={idx} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[13px] font-semibold text-gray-500">Criterion #{idx + 1}</span>
                                        </div>
                                        {criteria.length > 1 && (
                                            <Trash2 onClick={() => removeCriterion(idx)} className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer transition-colors" />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-8">
                                            <input
                                                type="text"
                                                placeholder="Criterion Name"
                                                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-sm font-bold text-[#1E293B]"
                                                value={crit.name}
                                                onChange={(e) => updateCriterion(idx, "name", e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-4 relative">
                                            <input
                                                type="number"
                                                placeholder="Weight"
                                                className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-sm font-bold text-[#1E293B]"
                                                value={crit.weight}
                                                onChange={(e) => updateCriterion(idx, "weight", e.target.value)}
                                            />
                                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs font-bold">%</span>
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder="Description of ideal skills..."
                                        className="w-full px-4 py-3 bg-white border border-blue-200 rounded-lg text-sm font-medium text-gray-500 h-24"
                                        value={crit.detail}
                                        onChange={(e) => updateCriterion(idx, 'detail', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={addCriterion}
                                disabled={totalWeight() >= 100}
                                className="w-full py-4 rounded-xl border-dashed border-2 border-gray-200 text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all font-bold"
                            >
                                <Plus size={16} className="mr-2" /> Add Criterion
                            </Button>
                        </div>
                    </Section>

                    {/* Dates */}
                    <Section
                        title="Recruitment Timeline"
                        subtitle="Schedule your recruitment dates"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-gray-500 ml-1">Start date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-lg font-medium text-[#1E293B] focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all"
                                    value={jobData.startTime}
                                    onChange={(e) => handleJobDataChange("startTime", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[13px] font-semibold text-gray-500 ml-1">End date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-4 bg-gray-50 border border-blue-200 rounded-lg font-medium text-[#1E293B] focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all font-sans"
                                    value={jobData.endTime}
                                    onChange={(e) => handleJobDataChange("endTime", e.target.value)}
                                />
                            </div>
                        </div>
                    </Section>

                    {/* Banner Image */}
                    <Section
                        title="Publication Banner"
                        subtitle="Upload a visual for this job posting"
                    >
                        <label className="flex flex-col items-center justify-center w-full min-h-[180px] border-2 border-dashed border-gray-100 rounded-[28px] cursor-pointer bg-gray-50/30 hover:bg-gray-50 transition-all overflow-hidden relative">
                            {imageBase64 ? (
                                <>
                                    <img src={imageBase64} alt="Preview" className="w-full h-full object-contain p-6" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button
                                            onClick={(e) => { e.preventDefault(); setImageBase64(""); }}
                                            className="bg-red-500 text-white p-2 rounded-xl shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Plus className="w-10 h-10 text-gray-200 mb-4" />
                                    <p className="text-[14px] text-gray-500 font-semibold">Upload visual asset</p>
                                </div>
                            )}
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </Section>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Sub-component for side-by-side sections with prominent vertical divider
const Section = ({ title, subtitle, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 py-12">
        <div className="space-y-4 pr-12 md:border-r-2 border-blue-100/80 self-start min-h-[140px]">
            <h4 className="text-[20px] font-bold text-[#0F172A] leading-tight tracking-tight">{title}</h4>
            <p className="text-[14px] text-slate-500 font-medium leading-relaxed max-w-[260px]">{subtitle}</p>
        </div>
        <div className="md:col-span-2 pl-12">
            {children}
        </div>
    </div>
)

// Preview Modal Component
const PreviewModal = ({ isOpen, onClose, jobData, criteria, imageBase64, industries }) => {
    const industryName = industries.find(i => i.id === jobData.industryId)?.name || "Not specified";
    const salaryMin = parseFloat(jobData.salaryMin) || 0;
    const salaryMax = parseFloat(jobData.salaryMax) || 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto bg-slate-50 p-0 border-none rounded-[32px] shadow-2xl">
                {/* Hero Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent z-10 rounded-t-[32px]" />
                    <div
                        className="relative bg-cover bg-center h-[400px] rounded-t-[32px]"
                        style={{
                            backgroundImage: imageBase64 ? `url(${imageBase64})` : "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
                        }}
                    >
                        <div className="relative z-20 p-8 flex justify-between items-center">
                            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl backdrop-blur-md transition-all border border-white/20 flex items-center gap-2 font-bold text-sm">
                                <ArrowLeft size={16} /> Back to Editor
                            </button>
                            <div className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-xl font-semibold text-[13px] backdrop-blur-md border border-white/20">
                                <Eye size={14} /> Preview mode
                            </div>
                        </div>

                        <div className="relative z-20 px-12 pb-12 mt-20">
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                                {jobData.title || "Untitled Job Position"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10 text-white flex items-center gap-2 font-semibold">
                                    <MapPin size={14} className="text-blue-400" /> {jobData.location || "Remote / Office"}
                                </span>
                                <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10 text-white flex items-center gap-2 font-semibold">
                                    <Briefcase size={14} className="text-blue-400" /> {jobData.level || "Middle"}
                                </span>
                                <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10 text-white font-semibold">
                                    {industryName}
                                </span>
                                <span className="bg-emerald-500 text-white px-5 py-2 rounded-full text-[13px] font-bold shadow-lg shadow-emerald-500/20">
                                    Active now
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-8 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                </div>
                                Role Overview & Description
                            </h2>
                            <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-headings:text-slate-900 prose-li:text-slate-600 text-lg leading-relaxed">
                                <ReactMarkdown>
                                    {jobData.description || "_Describe the purpose of this role and the impact it will have on the company._"}
                                </ReactMarkdown>
                            </div>
                        </div>

                        {/* Evaluation Matrix / Highlights */}
                        <div className="bg-white p-10 rounded-[32px] shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-[#0F172A] mb-8 flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-emerald-600" />
                                </div>
                                Key Requirements & Criteria
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                {criteria.map((c, i) => (
                                    <div key={i} className="flex gap-6 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-100 transition-all">
                                        <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 text-blue-600 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-lg">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-bold text-[#0F172A] text-xl">{c.name || "Core Skillset"}</h4>
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[12px] font-bold">{c.weight || 0}% weight</span>
                                            </div>
                                            <p className="text-slate-500 font-medium leading-relaxed">{c.detail || "Detail any specific skills or qualifications expected from the applicant."}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-8">
                            <h3 className="text-xl font-bold text-[#0F172A] mb-8">Role Quick Stats</h3>
                            <div className="space-y-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-500 mb-1">Estimated budget</p>
                                        <p className="text-xl font-bold text-[#0F172A]">${salaryMin.toLocaleString()} – ${salaryMax.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Closing Date</p>
                                        <p className="text-xl font-bold text-[#0F172A]">{jobData.endTime ? new Date(jobData.endTime).toLocaleDateString() : "Rolling Basis"}</p>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all opacity-50 cursor-not-allowed">
                                Apply for this Position
                            </button>

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                        This is a secure preview. Candidates will see this exact layout upon publication.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
                    .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 1rem; margin-bottom: 1rem; }
                    .prose li { margin-bottom: 0.5rem; }
                    .prose h1, .prose h2, .prose h3 { margin-top: 2rem; margin-bottom: 1rem; font-weight: 800; color: #0F172A; }
                `}</style>
            </DialogContent>
        </Dialog>
    );
};