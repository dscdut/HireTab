import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { jobApi } from "@/core/services/job.service"
import { candidateApi } from "@/core/services/candidate.service"
import { toast } from "react-toastify"
import { ArrowLeft, Calendar, DollarSign, Users, Briefcase, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
import ModalApplyForJob from "./components/ModalApplyForJob"
import SuggestedCoursesModal from "./components/SuggestedCoursesModal"
import ChatWootWidget from "@/shared/components/ui/chatwoot-widget"
import Header from "@/shared/layout/candidate-layout/Header"
import ReactMarkdown from "react-markdown"

export default function JobOpeningDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  console.log("Job ID:", id)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false)
  const [suggestionSkills, setSuggestionSkills] = useState([])
  const [coursesLoading, setCoursesLoading] = useState(false)

  // Function to fetch suggested courses
  const fetchSuggestedCourses = async () => {
    if (coursesLoading) return; // Prevent multiple calls

    setCoursesLoading(true)
    try {
      console.log("Step 1: Getting suggestion skills from getSuggestionSkillsByCandidateId")

      // First, get suggestion skills data
      const suggestionSkillsResponse = await candidateApi.getSuggestionSkillsByCandidateId(7)
      console.log("Suggestion Skills Response:", suggestionSkillsResponse)

      // Extract the suggestion_skills data
      const suggestion_skills = suggestionSkillsResponse || []
      console.log("Suggestion Skills Data:", suggestion_skills)

      console.log("Step 2: Sending suggestion_skills to getSuggestedCourses API")

      // Use suggestion_skills as input for getSuggestedCourses
      const requestData = {
        suggestion_skills: suggestion_skills
      }

      console.log("Request data for getSuggestedCourses:", requestData)

      const coursesResponse = await candidateApi.getSuggestedCourses(requestData)
      console.log("Suggested Courses API Response:", coursesResponse)

      // API should return array of courses directly
      const courses = Array.isArray(coursesResponse) ? coursesResponse : []
      console.log("Final Suggested Courses Data:", courses)
      setSuggestionSkills(courses)
    } catch (error) {
      console.error("Error fetching suggested courses:", error)
      setSuggestionSkills([])
      toast.error("Failed to load suggested courses")
    } finally {
      setCoursesLoading(false)
    }
  }

  // Handle opening courses modal
  const handleOpenCoursesModal = () => {
    setIsCoursesModalOpen(true)
    // Fetch courses when modal is opened
    if (suggestionSkills.length === 0) {
      fetchSuggestedCourses()
    }
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData)
    setIsModalOpen(false)
  }

  const {
    data: job,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      try {
        console.log("Calling API for Job ID:", id)
        const response = await jobApi.getJobById(id)
        console.log("API Response:", response)
        return response
      } catch (error) {
        console.error("API Error:", error)
        toast.error("Failed to load job details!")
        throw error
      }
    },
    retry: false,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error loading job details!</div>
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "open":
        return "bg-green-900/60"
      case "closed":
        return "bg-red-900/60"
      case "to do":
        return "bg-orange-900/60"
      default:
        return "bg-gray-900/60"
    }
  }

  const calculateDaysLeft = (endTime) => {
    if (!endTime) return "No deadline"
    const end = new Date(endTime)
    const now = new Date()
    const diffTime = end - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "1 day left"
    return `${diffDays} days left`
  }

  const formatSalary = (min, max) => {
    if (typeof min !== "number" || typeof max !== "number" || isNaN(min) || isNaN(max)) {
      return "Negotiable"
    }
    const formatNumber = (num) =>
      num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    return `${formatNumber(min)} - ${formatNumber(max)}`
  }

  // Convert requirements and responsibilities arrays to Markdown lists
  const requirementsMarkdown = job?.requirements && Array.isArray(job.requirements) && job.requirements.length > 0
    ? job.requirements.map(req => `- ${req}`).join('\n')
    : `- Bachelor's degree in Computer Science, Software Engineering, or related field.\n` +
    `- Independent and Collaborative Work: Ability to work both independently and as part of a team, with a passion for continuous learning and excellence in software development.\n` +
    `- Experience with RESTful APIs and state management libraries (Redux, Zustand, etc.).\n` +
    `- Problem-Solving: Strong analytical and problem-solving skills with the ability to manage technical complexities.\n` +
    `- Solid understanding of Git and collaborative development workflows.\n` +
    `- Strong problem-solving skills and attention to detail.`

  const responsibilitiesMarkdown = job?.responsibilities && Array.isArray(job.responsibilities) && job.responsibilities.length > 0
    ? job.responsibilities.map(resp => `- ${resp}`).join('\n')
    : `- Work Environment: Fun, open, and family-like atmosphere.\n` +
    `- Compensation: Excellent salary with 13th month bonus and quarterly bonuses available based on personal and corporate goals met.\n` +
    `- Health Benefits: Yearly renewed health allowance or a comprehensive health insurance package, depending on your preference.\n` +
    `- Extra Paid Time Off: 1 Christmas day, and up to 10 days of Sick leave.\n` +
    `- Work Schedule: 5-day work week (Mon-Fri) with no regular overtime expected.`

  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen mt-24">
        {/* Hero section with blue overlay */}
        <div className="relative">
          <div className="absolute inset-0 z-10 bg-blue-600/80" />
          <div
            className="relative bg-cover bg-center h-[400px]"
            style={{
              backgroundImage:
                "url('https://github.com/meishenry/HireNova/blob/main/%E1%BB%A8ng%20Vi%C3%AAn/M%C3%B4%20t%E1%BA%A3%20c%C3%B4ng%20vi%E1%BB%87c%20khi%20ch%C6%B0a%20apply%20(%E1%BB%A9ng%20vi%C3%AAn)/images/main-image.jpg?raw=true')",
            }}
          >
            <div className="relative z-20 p-6">
              <button
                className="flex items-center text-white transition hover:text-blue-100"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span>Open Positions</span>
              </button>
            </div>
            <div className="relative z-20 flex flex-col justify-center h-full max-w-6xl px-6 pb-10 mx-auto md:pb-16">
              <h1 className="mb-6 text-3xl font-extrabold text-white md:text-5xl drop-shadow-lg">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4 text-lg font-medium text-white">
                <span className="flex items-center gap-2 px-4 py-2 text-base rounded-full bg-blue-900/60 backdrop-blur-sm">
                  <MapPin size={16} />
                  {job.location}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 text-base rounded-full bg-blue-900/60 backdrop-blur-sm">
                  <Briefcase size={16} />
                  Full-Time
                </span>
                <span className="px-4 py-2 text-base rounded-full bg-blue-900/60 backdrop-blur-sm">
                  {job.level || "Mid-Senior Level"}
                </span>
                <span className="px-4 py-2 text-base rounded-full bg-blue-900/60 backdrop-blur-sm">
                  {job.industryName}
                </span>
                <span className={`${getStatusColor(job.status)} px-4 py-2 rounded-full text-base backdrop-blur-sm`}>
                  {job.status}
                </span>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
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
        <div className="py-12 bg-white border-b border-gray-200">
          <div className="container max-w-6xl px-6 mx-auto">
            <div className="flex items-start gap-6">
              <div className="flex items-center justify-center w-16 h-16 text-xl font-bold text-white shadow-lg bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl">
                H
              </div>
              <div className="flex-1">
                <h2 className="mb-3 text-2xl font-bold text-gray-900">About the Company</h2>
                <p className="mb-4 leading-relaxed text-gray-700">
                  At HireTab, we are your digital outsourcing and technology partner, dedicated to helping clients transform their ideas and strategies into high-end digital products. Our international team is made up of passionate individuals who believe that excellence stems from within.
                  When you become a part of our family, we care not just about what you do, but who you are. Our vision is to empower our employees to reach their fullest potential by nurturing both their skills and character.
                </p>
                <p className="leading-relaxed text-gray-700">
                  We take immense pride in fostering a remarkable company culture that uplifts our team, believing that together, there's no limit to what we can achieve.
                  Beyond our work, we are committed to giving back to our community through various community service programs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="container max-w-6xl px-6 py-12 mx-auto">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              {/* Job Description */}
              <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h2 className="flex items-center gap-3 mb-6 text-2xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  Job Description
                </h2>
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown>
                    {job.description ||
                      "As a Software Engineer at GDSC - DUT, you will design, develop, and maintain innovative web applications that empower our student community. You will work closely with other engineers and designers to deliver high-quality solutions that address real-world problems in education and technology."}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Requirements */}
              <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Requirements</h2>
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown>{requirementsMarkdown}</ReactMarkdown>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">Job highlights</h2>
                <div className="prose prose-gray max-w-none">
                  <ReactMarkdown>{responsibilitiesMarkdown}</ReactMarkdown>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky p-8 bg-white border border-gray-100 shadow-lg rounded-2xl top-8">
                <h3 className="flex items-center gap-3 mb-6 text-xl font-bold text-gray-900">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  Job Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Industry</p>
                      <p className="font-semibold text-gray-900">{job.industryName || "Software Development"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Level</p>
                      <p className="font-semibold text-gray-900">{job.level || "Senior"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employment Type</p>
                      <p className="font-semibold text-gray-900">Full-Time</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salary Range</p>
                      <p className="font-semibold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className="font-semibold text-gray-900">{job.status || "To Do"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <button
                    onClick={handleOpenModal}
                    className="w-full py-3 text-lg font-semibold text-white transition-all duration-200 bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl"
                  >
                    Apply for this position
                  </button>

                  <button
                    onClick={handleOpenCoursesModal}
                    disabled={coursesLoading}
                    className="w-full py-3 text-lg font-semibold text-blue-600 bg-blue-50 border-2 border-blue-200 transition-all duration-200 hover:bg-blue-100 hover:border-blue-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {coursesLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Loading Courses...
                      </span>
                    ) : (
                      `View Suggested Courses ${suggestionSkills.length > 0 ? `(${suggestionSkills.length})` : ''}`
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ModalApplyForJob
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            jobId={job.id}
            jobTitle={job.title}
            jobLocation={job.location}
            jobLevel={job.level}
            jobDesRate={job.descRate}
            jobDescription={job.description}
          />

          <SuggestedCoursesModal
            isOpen={isCoursesModalOpen}
            onClose={() => setIsCoursesModalOpen(false)}
            suggestionSkills={suggestionSkills}
            loading={coursesLoading}
          />
        </div>

        <ChatWootWidget />
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
    </>
  )
}