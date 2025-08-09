"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import dayjs from "dayjs"
import { jobApi } from "@/core/services/job.service"
import { industryApi } from "@/core/services/industry.service"
import { toast } from "react-toastify"

export default function EditJobModal({ job, open, onClose, onSuccess }) {
    // State for job fields, initialized with job prop
    const [industries, setIndustries] = useState([])
    const [jobData, setJobData] = useState({
        industryId: job?.industryId || "",
        title: job?.title || "",
        description: job?.description || "",
        location: job?.location || "",
        descRate: job?.descRate || "",
        salaryMin: job?.salaryMin || "",
        salaryMax: job?.salaryMax || "",
        level: job?.level || "",
        startTime: job?.startTime || "",
        endTime: job?.endTime || "",
        notes: job?.notes || "",
    })
    useEffect(() => {
        if (open) {
            industryApi.listIndustry().then(res => {
                setIndustries(res?.data || [])
            })
        }
    }, [open])
    // State for criteria, initialized with job criteria
    const [criteria, setCriteria] = useState(
        job?.criteria?.length > 0
            ? job.criteria
            : [{ name: "", weight: "", detail: "" }]
    )
    const formatDate = (date) => {
        if (!date) return ""
        // Hỗ trợ cả trường hợp date là Date object hoặc string
        return dayjs(date).format("YYYY-MM-DD")
    }

    // State for input validation errors
    const [salaryError, setSalaryError] = useState({ min: false, max: false })
    const [weightErrors, setWeightErrors] = useState(criteria.map(() => false))
    const [dateError, setDateError] = useState(false)

    // Update validation states when job prop changes
    useEffect(() => {
        setSalaryError({
            min: jobData.salaryMin && !/^\d+$/.test(jobData.salaryMin),
            max: jobData.salaryMax && !/^\d+$/.test(jobData.salaryMax),
        })

        if (jobData.startTime && jobData.endTime) {
            setDateError(new Date(jobData.endTime) <= new Date(jobData.startTime))
        }

        setWeightErrors(criteria.map(c => c.weight && !/^\d+$/.test(c.weight)))
    }, [jobData, criteria])

    // Reset form when modal is closed
    useEffect(() => {
        if (open && job) {
            console.log("job data", job)
            setJobData({
                industryId: job.industryId || "",
                title: job.title || "",
                description: job.description || "",
                location: job.location || "",
                descRate: job.descRate || "",
                salaryMin: job.salaryMin || "",
                salaryMax: job.salaryMax || "",
                level: job.level || "",
                startTime: formatDate(job.startTime || job.start_time),
                endTime: formatDate(job.endTime || job.end_time),
                notes: job.notes || "",
            })
            setCriteria(
                job.criteria?.length > 0
                    ? job.criteria
                    : [{ name: "", weight: "", detail: "" }]
            )
        }
    }, [open, job])

    // Handle changes for job data fields
    const handleJobDataChange = (field, value) => {
        setJobData({ ...jobData, [field]: value })

        if (field === "salaryMin" || field === "salaryMax") {
            if (value === "" || /^\d+$/.test(value)) {
                setSalaryError({ ...salaryError, [field === "salaryMin" ? "min" : "max"]: false })
            } else {
                setSalaryError({ ...salaryError, [field === "salaryMin" ? "min" : "max"]: true })
            }
        }

        if (field === "startTime" || field === "endTime") {
            const start = field === "startTime" ? value : jobData.startTime
            const end = field === "endTime" ? value : jobData.endTime
            if (start && end) {
                setDateError(new Date(end) <= new Date(start))
            } else {
                setDateError(false)
            }
        }
    }

    // Update criterion
    const updateCriterion = (index, field, value) => {
        const updated = [...criteria]

        if (field === "weight") {
            if (value === "" || /^\d+$/.test(value)) {
                updated[index][field] = value
                const newWeightErrors = [...weightErrors]
                newWeightErrors[index] = false
                setWeightErrors(newWeightErrors)
            } else {
                const newWeightErrors = [...weightErrors]
                newWeightErrors[index] = true
                setWeightErrors(newWeightErrors)
                return
            }
        } else {
            updated[index][field] = value
        }

        setCriteria(updated)
    }

    // Add new criterion
    const addCriterion = () => {
        if (totalWeight() < 100) {
            setCriteria([...criteria, { name: "", weight: "", detail: "" }])
            setWeightErrors([...weightErrors, false])
        }
    }

    // Calculate total weight
    const totalWeight = () => {
        return criteria.reduce((acc, curr) => {
            const w = parseFloat(curr.weight)
            return acc + (isNaN(w) ? 0 : w)
        }, 0)
    }

    const handleSubmit = async () => {
        try {
            await jobApi.updateJob(job.id, {
                ...jobData,
                criteria,
            })
            toast.success("Job updated successfully!")
            if (onSuccess) onSuccess()
            if (onClose) onClose()
        } catch (error) {
            // Hiển thị thông báo lỗi nếu cần
            alert("Failed to update job!")
        }
    }

    const weightExceeded = totalWeight() > 100

    // Define available levels
    const levels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead", "Manager"];

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Job</DialogTitle>
                    <DialogDescription>
                        Update the information to edit this job post.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={jobData.industryId}
                        onChange={(e) => handleJobDataChange("industryId", e.target.value)}
                    >
                        {/* Nếu có industryName, hiển thị option đầu tiên là industry hiện tại */}
                        {job.industryName && (
                            <option value={jobData.industryId || ""}>
                                {job.industryName}
                            </option>
                        )}
                        {/* Hiển thị các industry khác từ API, loại bỏ industry hiện tại */}
                        {industries
                            .filter((ind) => ind.name !== job.industryName)
                            .map((ind) => (
                                <option key={ind.id} value={ind.id}>
                                    {ind.name}
                                </option>
                            ))}
                    </select>

                    {/* Title */}
                    <input
                        type="text"
                        placeholder="Title"
                        className="w-full border px-3 py-2 rounded"
                        value={jobData.title}
                        onChange={(e) => handleJobDataChange("title", e.target.value)}
                    />

                    <select
                        className="border px-3 py-2 rounded w-full"
                        value={jobData.location}
                        onChange={(e) => handleJobDataChange("location", e.target.value)}
                    >
                        <option value="">Select Location</option>
                        <option value="danang">Danang</option>
                        <option value="hanoi">Hanoi</option>
                        <option value="hochiminh">Ho Chi Minh City</option>
                        <option value="Australia">Australia</option>
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            className="border px-3 py-2 rounded w-full"
                            value={jobData.level}
                            onChange={(e) => handleJobDataChange("level", e.target.value)}
                        >
                            <option value="">Select Level</option>
                            {levels.map((lvl) => (
                                <option key={lvl} value={lvl}>
                                    {lvl}
                                </option>
                            ))}
                        </select>

                        {/* Start Time */}
                        <input
                            type="date"
                            placeholder="Start Time"
                            className={`border px-3 py-2 rounded w-full ${dateError ? "border-red-500" : ""}`}
                            value={jobData.startTime}
                            onChange={(e) => handleJobDataChange("startTime", e.target.value)}
                        />

                        {/* End Time */}
                        <input
                            type="date"
                            placeholder="End Time"
                            className={`border px-3 py-2 rounded w-full ${dateError ? "border-red-500" : ""}`}
                            value={jobData.endTime}
                            onChange={(e) => handleJobDataChange("endTime", e.target.value)}
                        />
                    </div>

                    {/* Error for date */}
                    {dateError && (
                        <p className="text-red-500 text-sm mt-1">
                            End date must be after start date
                        </p>
                    )}

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
                    {(salaryError.min || salaryError.max) && (
                        <p className="text-red-500 text-sm mt-1">
                            Salary must contain numbers only
                        </p>
                    )}

                    {/* Description */}
                    <textarea
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Job Description"
                        rows={4}
                        value={jobData.description}
                        onChange={(e) => handleJobDataChange("description", e.target.value)}
                    ></textarea>

                    {/* Description Rate */}
                    <input
                        type="text"
                        placeholder="Description Rate"
                        className="w-full border px-3 py-2 rounded"
                        value={jobData.descRate}
                        onChange={(e) => handleJobDataChange("descRate", e.target.value)}
                    />

                    {/* Scoring Criteria and Weights */}
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2 text-lg">
                            Scoring Criteria and Weights
                        </h3>

                        <div className="text-sm text-gray-600 mb-2">
                            Total Weight:{" "}
                            <span className={weightExceeded ? "text-red-500 font-bold" : "font-semibold"}>
                                {totalWeight()} / 100
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
                                        className={`w-full border px-3 py-2 rounded ${weightErrors[idx] ? "border-red-500" : ""}`}
                                        value={c.weight}
                                        onChange={(e) => updateCriterion(idx, "weight", e.target.value)}
                                    />
                                    {weightErrors[idx] && (
                                        <p className="text-red-500 text-sm mt-1">
                                            Weight must contain numbers only
                                        </p>
                                    )}
                                </div>
                                <textarea
                                    placeholder="Details"
                                    className="w-full border px-3 py-2 rounded"
                                    rows={2}
                                    value={c.detail}
                                    onChange={(e) => updateCriterion(idx, "detail", e.target.value)}
                                />
                            </div>
                        ))}

                        {weightExceeded && (
                            <p className="text-red-500 text-sm mb-2">
                                Total weight cannot exceed 100. Please adjust the weights.
                            </p>
                        )}

                        <div className="flex justify-between mt-2">
                            <Button
                                variant="outline"
                                onClick={addCriterion}
                                disabled={totalWeight() >= 100}
                            >
                                + Add Criterion
                            </Button>
                            <Button onClick={handleSubmit} disabled={dateError || salaryError.min || salaryError.max || weightExceeded}>
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}