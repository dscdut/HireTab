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


export default function AddJobModal({isOpen, onClose}) {
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

    const totalWeight = () => {
        return criteria.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0)
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
            userId: userId,
        }
        createJobMutation.mutate(payload)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Job</DialogTitle>
                    <DialogDescription>
                        Please fill out the information to create a new job post.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Industry ID (Select) */}
                    {isLoading ? (
                        <p>Loading industries...</p>
                    ) : isError ? (
                        <p className="text-red-500">Failed to load industries.</p>
                    ) : (
                        <select
                            className="w-full border px-3 py-2 rounded"
                            value={jobData.industryId}
                            onChange={(e) => handleJobDataChange("industryId", e.target.value)}
                        >
                            <option value="">Select Industry</option>
                            {industries.map((industry) => (
                                <option key={industry.id} value={industry.id}>
                                    {industry.name}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full border px-3 py-2 rounded"
                        value={jobData.title}
                        onChange={(e) => handleJobDataChange("title", e.target.value)}
                    />

                    {/* Location */}
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={jobData.location}
                        onChange={(e) => handleJobDataChange("location", e.target.value)}
                    >
                        <option value="">Select Location</option>
                        <option value="danang">Danang</option>
                        <option value="hanoi">Hanoi</option>
                        <option value="hochiminh">Ho Chi Minh City</option>
                    </select>

                    {/* Level, Start Time, End Time */}
                    <div className="flex gap-2">
                        <select
                            className="flex-1 border px-3 py-2 rounded"
                            value={jobData.level}
                            onChange={(e) => handleJobDataChange("level", e.target.value)}
                        >
                            <option value="">Select Level</option>
                            <option value="Intern">Intern</option>
                            <option value="Junior">Junior</option>
                            <option value="Senior">Senior</option>
                        </select>

                        <input
                            type="date"
                            className="flex-1 border px-3 py-2 rounded"
                            value={jobData.startTime}
                            onChange={(e) => handleJobDataChange("startTime", e.target.value)}
                        />
                        <input
                            type="date"
                            className="flex-1 border px-3 py-2 rounded"
                            value={jobData.endTime}
                            onChange={(e) => handleJobDataChange("endTime", e.target.value)}
                        />
                    </div>

                    

                    {/* Salary range */}
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Min Salary"
                            className={`flex-1 border px-3 py-2 rounded ${salaryError.min ? "border-red-500" : ""}`}
                            value={jobData.salaryMin}
                            onChange={(e) => handleJobDataChange("salaryMin", e.target.value)}
                        />
                        <span className="text-gray-500">to</span>
                        <input
                            type="text"
                            placeholder="Max Salary"
                            className={`flex-1 border px-3 py-2 rounded ${salaryError.max ? "border-red-500" : ""}`}
                            value={jobData.salaryMax}
                            onChange={(e) => handleJobDataChange("salaryMax", e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <textarea
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Job Description"
                        rows={4}
                        value={jobData.description}
                        onChange={(e) => handleJobDataChange("description", e.target.value)}
                    ></textarea>

                    {/* Scoring Criteria */}
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2 text-lg">Scoring Criteria and Weights</h3>
                        <div className="text-sm text-gray-600 mb-2">
                            Total Weight:{" "}
                            <span className={weightExceeded ? "text-red-500 font-bold" : "font-semibold"}>
                                {totalWeight()}
                            </span>
                        </div>

                        {criteria.map((c, idx) => (
                            <div key={idx} className="mb-4 space-y-2 border border-gray-300 p-3 rounded-lg shadow-sm">
                                <input
                                    type="text"
                                    placeholder="Criterion name"
                                    className="w-full border px-3 py-2 rounded"
                                    value={c.name}
                                    onChange={(e) => updateCriterion(idx, "name", e.target.value)}
                                />
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Weight (0-100)"
                                        className={`w-full border px-3 py-2 rounded ${
                                            weightErrors[idx] ? "border-red-500" : ""
                                        }`}
                                        value={c.weight}
                                        onChange={(e) => updateCriterion(idx, "weight", e.target.value)}
                                    />
                                    {weightErrors[idx] && (
                                        <p className="text-red-500 text-sm mt-1">Weight must contain numbers only</p>
                                    )}
                                </div>
                                <textarea
                                    placeholder="Details"
                                    className="w-full border px-3 py-2 rounded"
                                    rows={2}
                                    value={c.detail}
                                    onChange={(e) => updateCriterion(idx, "detail", e.target.value)}
                                ></textarea>
                            </div>
                        ))}

                        {weightExceeded && (
                            <p className="text-red-500 text-sm mb-2">
                                Total weight cannot exceed 100. Please adjust the weights.
                            </p>
                        )}

                        <div className="flex justify-between mt-2">
                            <Button variant="outline" onClick={addCriterion} disabled={totalWeight() >= 100}>
                                + Add Criterion
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={dateError || salaryError.min || salaryError.max || weightExceeded}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}