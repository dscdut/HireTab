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
  Eye,
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
    navigate(`/hr/job-detail/${job.id}`)
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

  const toggleMenu = (jobId) => {
    setMenuOpen(menuOpen === jobId ? null : jobId)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading jobs...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Error loading jobs</h3>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Job Board</h1>
            <p className="text-gray-600">
              Manage and track all your job postings.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1 w-full lg:w-auto">
              {/* Enhanced Search Input */}
              <div className="relative flex-grow min-w-[250px] max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
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
                    <span className="truncate text-sm">{location}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showLocationDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showLocationDropdown && (
                    <div className="absolute z-30 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-gray-700 border-b border-gray-100 last:border-b-0"
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
                    <span className="truncate text-sm">{status}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showStatusDropdown ? "rotate-180" : ""}`}
                    />
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute z-30 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      {statuses.map((stat) => (
                        <button
                          key={stat}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-gray-700 border-b border-gray-100 last:border-b-0"
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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-6">No jobs match your current search criteria</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setLocation("All Locations")
                setStatus("All Statuses")
              }}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-3">Job Title</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2">Start Date</div>
                <div className="col-span-2">End Date</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Applications</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredJobs.map((job, index) => (
                <div key={index} className="px-6 py-5 hover:bg-gray-50 transition-colors duration-150 group">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Job Title */}
                    <div className="col-span-3">
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <DollarSign className="w-3 h-3" />
                          <span className="font-medium">
                            {typeof job.salary_min === "number" && typeof job.salary_max === "number"
                              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                              : "Negotiable"}{" "}
                            $
                          </span>
                        </div>
                      </div>
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
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.type || "Fulltime")}`}
                      >
                        {job.type || "Fulltime"}
                      </span>
                    </div>

                    {/* Applications */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-semibold text-gray-900">{job.applicationsCount || 0}</span>
                          <span className="text-xs text-gray-400">/ {job.totalApplications || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="col-span-1 flex justify-end">
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(job.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {menuOpen === job.id && (
                          <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-30 overflow-hidden">
                            <button
                              onClick={() => handleViewDetails(job)}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 border-b border-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job)}
                              className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Job
                            </button>
                          </div>
                        )}
                      </div>
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
