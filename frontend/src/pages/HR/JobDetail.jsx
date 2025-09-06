
"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { jobApi } from "@/core/services/job.service"
import { toast } from "react-toastify"
import { ArrowLeft, Calendar, MapPin, DollarSign, Users, Briefcase } from "lucide-react"
import { useState } from "react"
import EditJobModal from "./JobPosting/components/EditJobModal"

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const {
    data: job,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      try {
        const response = await jobApi.getJobById(id)
        return response
      } catch (error) {
        toast.error("Failed to load job details!")
        throw error
      }
    },
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error loading job details!</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const calculateDaysLeft = (endTime) => {
    if (!endTime) return "No deadline"
    const end = new Date(endTime)
    const now = new Date()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    if (diff < 0) return "Closed"
    if (diff === 0) return "Last day"
    return `${diff} day${diff > 1 ? "s" : ""} left`
  }

  // FIX: handle both salaryMin/salaryMax and salary_min/salary_max, and allow 0 salary
  const formatSalary = (min, max) => {
    if (
      (typeof min !== "number" && typeof min !== "string") ||
      (typeof max !== "number" && typeof max !== "string") ||
      min === "" || max === "" ||
      isNaN(Number(min)) || isNaN(Number(max))
    ) {
      return "Salary not specified"
    }
    const formatNumber = (num) =>
      Number(num).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    return `${formatNumber(min)} - ${formatNumber(max)}`
  }

  const getJobProperty = (property, fallback = "Not specified") => {
    return job && job[property] ? job[property] : fallback
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-500/90"
      case "In Progress":
        return "bg-yellow-500/90"
      case "Done":
        return "bg-green-500/90"
      case "Closed":
        return "bg-red-500/90"
      default:
        return "bg-gray-500/90"
    }
  }

  // FIX: support both camelCase and snake_case for salary fields
  const salaryMin = job.salaryMin ?? job.salary_min
  const salaryMax = job.salaryMax ?? job.salary_max

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero section with blue overlay */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600/80 to-blue-400/80 z-10" />
        <div
          className="relative bg-cover bg-center h-[340px] md:h-[420px]"
          style={{
            backgroundImage:
              "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')",
          }}
        >
          {/* Navigation */}
          <div className="relative z-20 p-6 flex items-center justify-between">
            <button
              className="flex items-center text-white hover:text-blue-100 transition text-lg font-medium bg-blue-700/40 px-4 py-2 rounded-lg shadow backdrop-blur-sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              <span>Back to Jobs</span>
            </button>
          </div>

          {/* Apply Button */}
          <div className="absolute z-20 top-6 right-6">
            <button
              className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-medium shadow-lg"
              onClick={() => navigate(`/hr/job-dashboard/${job?.id}`)}
            >
              View List Candidate
            </button>
          </div>

          {/* Job Title and Info */}
          <div className="relative z-20 flex flex-col justify-center h-full px-6 pb-10 md:pb-16 max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white text-lg font-medium mb-4">
              <span className="bg-blue-900/60 px-4 py-2 rounded-full text-base backdrop-blur-sm flex items-center gap-2">
                <MapPin size={16} />
                {job.location}
              </span>
              <span className="bg-blue-900/60 px-4 py-2 rounded-full text-base backdrop-blur-sm flex items-center gap-2">
                <Briefcase size={16} />
                Full-Time
              </span>
              <span className="bg-blue-900/60 px-4 py-2 rounded-full text-base backdrop-blur-sm">
                {job.level || "Mid-Senior Level"}
              </span>
              <span className="bg-blue-900/60 px-4 py-2 rounded-full text-base backdrop-blur-sm">
                {job.industryName}
              </span>
              <span className={`${getStatusColor(job.status)} px-4 py-2 rounded-full text-base backdrop-blur-sm`}>
                {job.status}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign size={16} />
                <span>{formatSalary(salaryMin, salaryMax)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>{job.applicationsCount || 0} Applications</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{job.end_time ? calculateDaysLeft(job.end_time) : "No deadline"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              G
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3 text-gray-900">About the Company</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                At HireTab, we are your digital outsourcing and technology partner, dedicated to helping clients transform their ideas and strategies into high-end digital products. Our international team is made up of passionate individuals who believe that excellence stems from within.
                When you become a part of our family, we care not just about what you do, but who you are. Our vision is to empower our employees to reach their fullest potential by nurturing both their skills and character.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We take immense pride in fostering a remarkable company culture that uplifts our team, believing that together, there's no limit to what we can achieve.
                Beyond our work, we are committed to giving back to our community through various community service programs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                Job Description
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {getJobProperty(
                    "description",
                    "As a Software Engineer at GDSC - DUT, you will design, develop, and maintain innovative web applications that empower our student community. You will work closely with other engineers and designers to deliver high-quality solutions that address real-world problems in education and technology."
                  )}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Requirements</h2>
              <ul className="space-y-3 text-gray-700">
                {job?.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                  job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{requirement}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Bachelor’s degree in Computer Science, Software Engineering, or related field.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Independent and Collaborative Work: Ability to work both independently and as part of a team, with a passion for continuous learning and excellence in software development.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Experience with RESTful APIs and state management libraries (Redux, Zustand, etc.).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Problem-Solving: Strong analytical and problem-solving skills with the ability to manage technical complexities.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Solid understanding of Git and collaborative development workflows.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Strong problem-solving skills and attention to detail.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Job highlights</h2>
              <ul className="space-y-3 text-gray-700">
                {job?.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? (
                  job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Work Environment: Fun, open, and family-like atmosphere.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Compensation: Excellent salary with 13th month bonus and quarterly bonuses available based on personal and corporate goals met..</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Health Benefits: Yearly renewed health allowance or a comprehensive health insurance package, depending on your preference..</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Extra Paid Time Off: 1 Christmas day, and up to 10 days of Sick leave. .</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="leading-relaxed">Work Schedule: 5-day work week (Mon-Fri) with no regular overtime expected..</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                </div>
                Job Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Industry</p>
                    <p className="font-semibold text-gray-900">{getJobProperty("industryName", "Not specified")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Job Level</p>
                    <p className="font-semibold text-gray-900">{getJobProperty("level", "Mid-Senior Level")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Employment Type</p>
                    <p className="font-semibold text-gray-900">{getJobProperty("employmentType", "Full-Time")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Salary Range</p>
                    <p className="font-semibold text-gray-900">{formatSalary(salaryMin, salaryMax)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 ${getStatusColor(job?.status).replace("/90", "/20")} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <div className={`w-3 h-3 ${getStatusColor(job?.status)} rounded-full`}></div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium">Status</p>
                    <p className="font-semibold text-gray-900">{getJobProperty("status", "Open")}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  onClick={() => navigate(`/hr/job-dashboard/${job.id}`)}
                >
                  View Candidates
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  type="button"
                >
                  Edit Job
                </button>
              </div>
            </div>
          </div>
          {showEditModal && (
            <EditJobModal
              job={job}
              open={showEditModal}
              onClose={() => setShowEditModal(false)}
              onSuccess={refetch}
            />
          )}
        </div>

        <style>
          {`.prose ul {
        list-style-type: disc;
        padding-left: 1.5rem;
      }
      .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
        font-weight: bold;
      }`}
        </style>
      </div>
    </div>
  )
}