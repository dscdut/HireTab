"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Search, Filter, Plus, MoreVertical, Trash2, Edit, MapPin, Calendar, Users, Briefcase } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { jobApi } from "@/core/services/job.service"
import AddJobModal from "./components/AddJobModal"
import { candidateApi } from "@/core/services/candidate.service"
import EditJobModal from "./components/EditJobModal"
import { toast } from "react-toastify"
import { path } from "@/core/constants/path"
import ErrorState from "@/shared/components/ui/ErrorState"
import LoadingSpinner from "@/shared/components/ui/LoadingSpinner"

const JobPosting = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("All Locations")
  const [status, setStatus] = useState("All Statuses")
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [menuOpen, setMenuOpen] = useState(null)

  const statuses = ["All Statuses", "To Do", "In Progress", "Done", "Closed"]

  // Fetch job listings
  const {
    data: jobListings = [],
    isLoading: isJobsLoading,
    isError: isJobsError,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        const jobs = await jobApi.listJobs()
        const jobsWithCounts = await Promise.all(
          jobs.map(async (job) => {
            try {
              const candidates = await candidateApi.listCandidate(job.id)
              const candidateArray = Array.isArray(candidates) ? candidates : (candidates?.data || [])
              const totalApplications = candidateArray.length
              const applicationsCount = candidateArray.filter(
                (candidate) => candidate.status !== "In-Review"
              ).length
              return { ...job, totalApplications, applicationsCount }
            } catch (error) {
              return { ...job, totalApplications: 0, applicationsCount: 0 }
            }
          })
        )
        return jobsWithCounts
      } catch (error) {
        toast.error("Failed to load jobs!")
        throw error
      }
    },
    retry: false,
  })

  const locations = useMemo(() => {
    const uniqueLocations = new Set(jobListings.map((job) => job.location).filter(Boolean))
    return ["All Locations", ...Array.from(uniqueLocations)]
  }, [jobListings])

  const filteredJobs = useMemo(() => {
    return jobListings.filter(
      (job) =>
        (searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (location === "All Locations" || job.location === location) &&
        (status === "All Statuses" || job.status === status)
    )
  }, [jobListings, searchTerm, location, status])

  // Stats Calculation
  const stats = useMemo(() => {
    return {
      total: jobListings.length,
      active: jobListings.filter(j => j.status === "In Progress" || j.status === "To Do").length,
      newApplicants: jobListings.reduce((acc, curr) => acc + (curr.applicationsCount || 0), 0)
    }
  }, [jobListings])

  const getStatusDisplay = (status) => {
    switch (status) {
      case "To Do": return { label: "DRAFT", style: "bg-slate-50 text-slate-500 border border-slate-200 border-dashed opacity-80" }
      case "In Progress": return { label: "ACTIVE", style: "bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm" }
      case "Done": return { label: "COMPLETED", style: "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" }
      case "Closed": return { label: "CLOSED", style: "bg-rose-50 text-rose-600 border border-rose-100 shadow-sm" }
      default: return { label: status, style: "bg-gray-50 text-gray-600 border border-gray-100" }
    }
  }

  const handleRowClick = (job) => {
    const pathWithId = path.hr.job_detail.replace(':id', job.id)
    navigate(pathWithId)
  }

  const handleEditJob = (job) => {
    setSelectedJob(job)
    setShowEditModal(true)
    setMenuOpen(null)
  }

  const handleDeleteJob = async (job) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await jobApi.deleteJob(job.id)
      toast.success("Job deleted successfully!")
      refetch()
      setMenuOpen(null)
    } catch (error) {
      toast.error("Failed to delete job!")
    }
  }

  if (isJobsLoading) return <LoadingSpinner />
  if (isJobsError) return <ErrorState title="Error loading jobs" message="Please try refreshing the page" />

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B] mb-2">Job Postings</h1>
          <p className="text-gray-500 font-medium">Manage and track all your recruitment openings</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span>Create New Job</span>
        </button>
      </div>



      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by job title, department or keyword..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-100 transition-all font-medium text-[#1E293B]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <div className="relative flex-1 xl:flex-none">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="w-full xl:w-[200px] flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="truncate max-w-[120px]">{location}</span>
              </div>
              <ChevronDown size={16} />
            </button>
            {showLocationDropdown && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2">
                {locations.map(loc => (
                  <button key={loc} className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-gray-700" onClick={() => { setLocation(loc); setShowLocationDropdown(false); }}>{loc}</button>
                ))}
              </div>
            )}
          </div>
          <div className="relative flex-1 xl:flex-none">
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full xl:w-[180px] flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center gap-2">
                <Filter size={16} />
                <span className="truncate">{status}</span>
              </div>
              <ChevronDown size={16} />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl z-30 py-2">
                {statuses.map(s => (
                  <button key={s} className="w-full text-left px-4 py-2 hover:bg-gray-50 font-medium text-gray-700" onClick={() => { setStatus(s); setShowStatusDropdown(false); }}>{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Jobs Grid/Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-5 text-left text-sm font-semibold text-[#1E293B] w-[35%]">Postings Details</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-[#1E293B] w-[20%]">Applications</th>
              <th className="px-6 py-5 text-left text-sm font-semibold text-[#1E293B] w-[18%]">Timeline</th>
              <th className="px-6 py-5 text-center text-sm font-semibold text-[#1E293B] w-[15%]">Status</th>
              <th className="px-6 py-5 text-right text-sm font-semibold text-[#1E293B] w-[12%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredJobs.map((job) => (
              <tr key={job.id} className="group hover:bg-blue-50/10 transition-all cursor-pointer" onClick={() => handleRowClick(job)}>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all shadow-inner ${job.status === 'To Do' ? 'bg-slate-50 group-hover:bg-slate-100' : 'bg-gray-50 group-hover:bg-white'}`}>
                      <Briefcase className={job.status === 'To Do' ? 'text-slate-300' : 'text-gray-400'} size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`text-[16px] font-bold transition-colors capitalize ${job.status === 'To Do' ? 'text-slate-400 group-hover:text-slate-600' : 'text-[#1E293B] group-hover:text-blue-600'}`}>{job.title}</h4>
                        {job.status === "To Do" && <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[9px] rounded font-black uppercase tracking-widest">Draft</span>}
                      </div>
                      <p className={`text-sm font-medium mt-0.5 ${job.status === 'To Do' ? 'text-slate-300' : 'text-gray-400'}`}>{job.location} • {job.type || 'Full-time'}</p>
                    </div>
                  </div>
                </td>
                <td className={`px-6 py-6 transition-opacity ${job.status === 'To Do' ? 'opacity-40 grayscale' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${job.id + i}`} alt="" />
                        </div>
                      ))}
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        +{job.totalApplications || 0}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{job.applicationsCount || 0} New</span>
                  </div>
                </td>
                <td className={`px-6 py-6 transition-opacity ${job.status === 'To Do' ? 'opacity-40 grayscale' : ''}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                      <Calendar size={12} className="text-blue-400" />
                      <span>Start: {new Date(job.start_time).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                      <Calendar size={12} className="text-red-300" />
                      <span>End: {new Date(job.end_time).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6 text-center">
                  <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wider inline-block min-w-[100px] ${getStatusDisplay(job.status).style}`}>
                    {getStatusDisplay(job.status).label}
                  </span>
                </td>
                <td className="px-6 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEditJob(job); }}
                      className="p-2.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-xl transition-all shadow-sm"
                      title="Edit Post"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteJob(job); }}
                      className="p-2.5 text-red-600 bg-red-50/50 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                      title="Delete Post"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      className="p-2.5 text-gray-500 bg-gray-50 hover:bg-gray-200 rounded-xl transition-all shadow-sm"
                      title="More Options"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredJobs.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-medium">No job postings matched your criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddJobModal isOpen={showAddModal} onClose={() => { setShowAddModal(false); refetch(); }} />
      {showEditModal && <EditJobModal job={selectedJob} onClose={() => { setShowEditModal(false); refetch(); }} />}
    </div>
  );
};
export default JobPosting