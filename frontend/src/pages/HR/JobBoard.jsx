"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, Search, Filter, Plus, MoreVertical, Trash2, Edit } from "lucide-react"
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

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800"
      case "Done":
        return "bg-green-100 text-green-800"
      case "Closed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Job type color mapping
  const getJobTypeColor = (type) => {
    switch (type) {
      case "Fulltime":
        return "bg-blue-100 text-blue-800"
      case "Freelance":
        return "bg-orange-100 text-orange-800"
      case "Part-time":
        return "bg-purple-100 text-purple-800"
      case "Contract":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle View Details - Navigate to job detail page
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

  // Handle Delete Job
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
  const toggleMenu = (jobId, event) => {
    event.stopPropagation() // Prevent row click when clicking menu
    setMenuOpen(menuOpen === jobId ? null : jobId)
  }

  // Handle row click
  const handleRowClick = (job) => {
    handleViewDetails(job)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">Error loading jobs!</div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gray-50">
      {/* Header với Search và Filter */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center flex-1">
            {/* Search Input */}
            <div className="relative flex-grow min-w-[250px] max-w-md">
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <button
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                {location} <ChevronDown size={16} />
              </button>
              {showLocationDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {locations.map((loc) => (
                    <div
                      key={loc}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setLocation(loc)
                        setShowLocationDropdown(false)
                      }}
                    >
                      {loc}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <button
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              >
                {status} <ChevronDown size={16} />
              </button>
              {showStatusDropdown && (
                <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {statuses.map((stat) => (
                    <div
                      key={stat}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm first:rounded-t-lg last:rounded-b-lg"
                      onClick={() => {
                        setStatus(stat)
                        setShowStatusDropdown(false)
                      }}
                    >
                      {stat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add New Job Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm font-medium"
          >
            <Plus size={18} /> Add New Job
          </button>
        </div>
      </div>

      {/* Job Listings Content */}
      <div className="flex-1 overflow-auto p-4">
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
            <Filter className="mb-4 text-gray-400" size={48} />
            <p className="text-xl text-gray-600">No jobs match your current filters</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="col-span-4">Job Title</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Start Date</div>
              <div className="col-span-2">End Date</div>
              <div className="col-span-1">Level</div>
              <div className="col-span-1">Applications</div>
              <div className="col-span-1"></div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredJobs.map((job, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center cursor-pointer"
                  onClick={() => handleRowClick(job)}
                >
                  {/* Job Title */}
                  <div className="col-span-4">
                    <h3 className="font-medium text-gray-900 mb-1">{job.title}</h3>
                    <p className="text-sm text-gray-500 mb-1">{job.location}</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {typeof job.salary_min === "number" && typeof job.salary_max === "number"
                        ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                        : "Negotiable"} $
                    </p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  {/* Start Date */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-900">
                      {job.start_time
                        ? new Date(job.start_time).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "Not set"}
                    </span>
                  </div>

                  {/* End Date */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-900">
                      {job.end_time
                        ? new Date(job.end_time).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "Not set"}
                    </span>
                  </div>

                  {/* Level */}
                  <div className="col-span-1">
                    <span className="text-sm text-gray-900">{job.level || "Mid-Senior"}</span>
                  </div>

                  {/* Applications */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-gray-900">{job.applicationsCount || 0}</span>
                      <span className="text-xs text-gray-400">/ {job.totalApplications || 0}</span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="col-span-1 flex justify-end">
                    <div className="relative">
                      <button
                        onClick={(e) => toggleMenu(job.id, e)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={16} className="text-gray-500" />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpen === job.id && (
                        <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditJob(job)
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 first:rounded-t-lg"
                          >
                            <Edit size={14} />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteJob(job)
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 last:rounded-b-lg"
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
      {menuOpen && <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />}

      {/* Modals */}
      <AddJobModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      {showEditModal && <EditJobModal job={selectedJob} onClose={() => setShowEditModal(false)} />}
    </div>
  )
}