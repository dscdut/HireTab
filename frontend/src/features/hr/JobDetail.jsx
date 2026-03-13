
"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { jobApi } from "@/core/services/job.service"
import { toast } from "react-toastify"
import { ArrowLeft, Calendar, MapPin, DollarSign, Users, Briefcase } from "lucide-react"
import { useState } from "react"
import EditJobModal from "./JobPosting/components/EditJobModal"
import ReactMarkdown from "react-markdown"

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
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      {/* Premium Hero Section with Cover */}
      <div className="relative bg-white border-b border-gray-100 pb-12">
        {/* Cover Image Header */}
        <div
          className="absolute top-0 left-0 w-full h-[320px] z-0"
          style={{
            backgroundImage: "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col pt-8">
          {/* Navigation & Actions */}
          <div className="flex items-center justify-between mb-24">
            <button
              className="flex items-center text-white/90 hover:text-white transition-colors text-sm font-semibold"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-3">
              <button
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/20 backdrop-blur-md shadow-sm text-sm"
                onClick={() => setShowEditModal(true)}
              >
                Edit Details
              </button>
              <button
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg text-sm"
                onClick={() => navigate(`/hr/job-dashboard/${job?.id}`)}
              >
                View Candidates
              </button>
            </div>
          </div>

          {/* Job Header Content (Overlapping) */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 bg-white p-8 rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-200/60 mt-4 ring-1 ring-black/5">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${job.status === 'To Do' ? 'bg-slate-100 text-slate-500 border border-slate-200 border-dashed' :
                  job.status === 'In Progress' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    job.status === 'Done' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      job.status === 'Closed' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        'bg-gray-100 text-gray-600'
                  }`}>
                  {job.status === 'To Do' ? 'DRAFT' : job.status === 'In Progress' ? 'ACTIVE' : job.status.toUpperCase()}
                </span>
                <span className="text-sm font-bold text-gray-400">•</span>
                <span className="text-sm font-bold text-gray-400">ID: #{job.id}</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  <MapPin className="text-gray-400 w-4 h-4" />
                  {job.location || 'Location not specified'}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  <Briefcase className="text-gray-400 w-4 h-4" />
                  {job.type || 'Full-Time'}
                </div>
                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                  <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-black text-gray-500">Lv</span>
                  {job.level || 'Mid-Senior'}
                </div>
                <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-4 py-2 rounded-lg border border-blue-100/50">
                  {job.industryName || 'Industry not specified'}
                </div>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="w-full md:w-[320px] bg-white border border-gray-100 shadow-sm rounded-2xl p-6 flex flex-col gap-5 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Salary Offer</p>
                  <p className="text-base font-bold text-gray-900">{formatSalary(salaryMin, salaryMax)}</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Applicants</p>
                  <p className="text-base font-bold text-gray-900">{job.applicationsCount || 0} Candidates</p>
                </div>
              </div>
              <div className="w-full h-px bg-gray-50"></div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Timeline</p>
                  <p className="text-base font-bold text-gray-900">{job.end_time ? calculateDaysLeft(job.end_time) : "No deadline"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div >

      {/* Company Information */}
      <div className="bg-white py-12 border-b border-gray-100" >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col gap-6">
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
      < div className="container mx-auto px-6 py-12 max-w-6xl" >
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
                <ReactMarkdown>
                  {getJobProperty("description", "No description provided")}
                </ReactMarkdown>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Requirements</h2>
              <ul className="space-y-3 text-gray-700">
                {job?.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 ? (
                  job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">{requirement}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Bachelor’s degree in Computer Science, Software Engineering, or related field.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Independent and Collaborative Work: Ability to work both independently and as part of a team, with a passion for continuous learning and excellence in software development.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Experience with RESTful APIs and state management libraries (Redux, Zustand, etc.).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Problem-Solving: Strong analytical and problem-solving skills with the ability to manage technical complexities.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Solid understanding of Git and collaborative development workflows.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
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
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">{responsibility}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Work Environment: Fun, open, and family-like atmosphere.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Compensation: Excellent salary with 13th month bonus and quarterly bonuses available based on personal and corporate goals met.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Health Benefits: Yearly renewed health allowance or a comprehensive health insurance package, depending on your preference.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Extra Paid Time Off: 1 Christmas day, and up to 10 days of Sick leave.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2.5 flex-shrink-0"></div>
                      <span className="leading-relaxed">Work Schedule: 5-day work week (Mon-Fri) with no regular overtime expected.</span>
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
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                Hiring Progress
              </h3>

              {/* Hiring Progress Mock */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-sm font-medium">Applied</span>
                    <span className="font-bold text-gray-900">{job.applicationsCount || 0}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-sm font-medium">Interviewing</span>
                    <span className="font-bold text-gray-900">{Math.floor((job.applicationsCount || 50) * 0.4)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-gray-500 text-sm font-medium">Hired</span>
                    <span className="font-bold text-gray-900">1</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 my-8"></div>

              {/* Hiring Team Mock */}
              <h3 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                Hiring Team
              </h3>

              <div className="flex items-center gap-4 mb-2">
                <img src="https://i.pravatar.cc/150?u=phuoc" alt="Hiring Manager" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">Huỳnh Thị Phước</p>
                  <p className="text-gray-500 text-xs font-medium">Lead HR Manager</p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-[15px] transition-all shadow-lg"
                  onClick={() => navigate(`/hr/job-dashboard/${job.id}`)}
                >
                  View Candidates
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="w-full bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 py-3.5 rounded-xl font-bold text-[15px] transition-all"
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
      </div >
    </div >
  )
}