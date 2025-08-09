"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ChevronDown,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Trash2,
  Edit,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Briefcase,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { jobApi } from "@/core/services/job.service"
import AddJobModal from "./Modal/AddJobModal"
import EditJobModal from "./Modal/EditJobModal"
import { toast } from "react-toastify"
import { path } from "@/core/constants/path"
export default function JobBoard() {
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

  const {
    data: jobListings = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        return await jobApi.listJobs()
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
        (status === "All Statuses" || job.status === status),
    )
  }, [jobListings, searchTerm, location, status])

  // Modern status color mapping with softer colors
  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-50 text-blue-700 border border-blue-200"
      case "In Progress":
        return "bg-amber-50 text-amber-700 border border-amber-200"
      case "Done":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200"
      case "Closed":
        return "bg-rose-50 text-rose-700 border border-rose-200"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200"
    }
  }

  // Modern job type color mapping
  const getJobTypeColor = (type) => {
    switch (type) {
      case "Fulltime":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200"
      case "Freelance":
        return "bg-orange-50 text-orange-700 border border-orange-200"
      case "Part-time":
        return "bg-purple-50 text-purple-700 border border-purple-200"
      case "Contract":
        return "bg-teal-50 text-teal-700 border border-teal-200"
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200"
    }
  }

  const handleViewDetails = (job) => {
    const pathWithId = path.hr.job_detail.replace(':id', job.id)
    navigate(pathWithId)
    setMenuOpen(null)
  }

  // Handle Edit Job
  const handleEditJob = (job) => {
    setSelectedJob(job)
    setShowEditModal(true)
    setMenuOpen(null)
  }

  const handleDeleteJob = async (job) => {
    try {
      await jobApi.deleteJob(job.id)
      toast.success("Job deleted successfully!")
      refetch()
      setMenuOpen(null)
    } catch (error) {
      toast.error("Failed to delete job!")
    }
  }

  // Toggle menu
  const toggleMenu = (jobId) => {
    setMenuOpen(menuOpen === jobId ? null : jobId)
  }

  // Handle row click
  const handleRowClick = (job) => {
    handleViewDetails(job)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-slate-200 border-t-slate-600 animate-spin"></div>
          <p className="font-medium text-slate-600">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="p-8 text-center bg-white border shadow-sm rounded-2xl border-slate-200">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-rose-100">
            <Filter className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Error loading jobs</h3>
          <p className="text-slate-600">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          {/* Title Section */}
          <div className="mb-4">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">Job Board</h1>
            <p className="text-gray-600">
              Manage and track all your job postings.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col items-start justify-between gap-3 lg:flex-row lg:items-center">
            <div className="flex flex-col items-start flex-1 w-full gap-3 sm:flex-row sm:items-center lg:w-auto">
              {/* Enhanced Search Input */}
              <div className="relative flex-grow min-w-[250px] max-w-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search jobs, descriptions..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Modern Dropdowns */}
              <div className="flex gap-2">
                {/* Location Dropdown */}
                <div className="relative">
                  <button
                    className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium min-w-[130px]"
                    onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                  >
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm truncate">{location}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showLocationDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute z-30 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          className="w-full px-4 py-3 text-left text-gray-700 transition-colors duration-150 border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                          onClick={() => {
                            setLocation(loc)
                            setShowLocationDropdown(false)
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <button
                    className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium min-w-[130px]"
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm truncate">{status}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute z-30 w-56 mt-2 overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                      {statuses.map((stat) => (
                        <button
                          key={stat}
                          className="w-full px-4 py-3 text-left text-gray-700 transition-colors duration-150 border-b border-gray-100 hover:bg-gray-50 last:border-b-0"
                          onClick={() => {
                            setStatus(stat)
                            setShowStatusDropdown(false)
                          }}
                        >
                          {stat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Add Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Add New Job
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No jobs found</h3>
            <p className="mb-6 text-gray-600">No jobs match your current search criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setLocation("All Locations")
                setStatus("All Statuses")
              }}
              className="px-4 py-2 font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="grid grid-cols-12 gap-6 text-sm font-semibold text-gray-700">
                <div className="col-span-3">Job Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Start Date</div>
                <div className="col-span-2">End Date</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-1">Applications</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredJobs.map((job, index) => (
                <div
                  key={index}
                  className="grid items-center grid-cols-12 gap-6 px-6 py-4 transition-colors cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(job)}
                >
                  {/* Job Title */}
                  <div className="col-span-3">
                    <h3 className="mb-1 font-medium text-gray-900">{job.title}</h3>
                    <p className="mb-1 text-sm text-gray-500">{job.location}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {typeof job.salary_min === "number" && typeof job.salary_max === "number"
                        ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                        : "Negotiable"} $
                    </p>
                  </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>

                    {/* Start Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {job.start_time
                            ? new Date(job.start_time).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* End Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {job.end_time
                            ? new Date(job.end_time).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                            : "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* Job Type */}
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type || "Fulltime")}`}
                      >
                        {job.type || "Fulltime"}
                      </span>
                    </div>

                    {/* Applications */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">{job.applicationsCount || 0}</span>
                          <span className="text-xs text-gray-400">/ {job.totalApplications || 0}</span>
                        </div>
                      </div>
                    </div>

                  {/* Actions Menu */}
                  <div className="flex justify-end col-span-1">
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMenu(job.id)
                        }}
                        className="p-1 transition-colors rounded-full hover:bg-gray-100"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === job.id && (
                        <div className="absolute right-0 z-20 w-32 bg-white border border-gray-200 rounded-lg shadow-lg top-8">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditJob(job)
                            }}
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 first:rounded-t-lg"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteJob(job)
                            }}
                            className="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 hover:bg-gray-50 last:rounded-b-lg"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {menuOpen && <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(null)} />}

      {/* Modals */}
      <AddJobModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      {showEditModal && <EditJobModal job={selectedJob} onClose={() => setShowEditModal(false)} />}
    </div>
  )
}