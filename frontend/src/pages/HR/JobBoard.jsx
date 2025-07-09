"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, Filter, Plus, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jobApi } from "@/core/services/job.service";
import AddJobModal from "./Modal/AddJobModal";
import EditJobModal from "./Modal/EditJobModal";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function JobBoard() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [status, setStatus] = useState("All Statuses");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const statuses = ["All Statuses", "To Do", "In Progress", "Done", "Closed"];

  const { data: jobListings = [], isLoading, isError } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        return await jobApi.listJobs();
      } catch (error) {
        toast.error("Failed to load jobs!");
        throw error;
      }
    },
    retry: false,
  });

  const locations = useMemo(() => {
    const uniqueLocations = new Set(jobListings.map((job) => job.location).filter(Boolean));
    return ["All Locations", ...Array.from(uniqueLocations)];
  }, [jobListings]);

  const filteredJobs = useMemo(() => {
    return jobListings.filter(
      (job) =>
        (searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (location === "All Locations" || job.location === location) &&
        (status === "All Statuses" || job.status === status)
    );
  }, [jobListings, searchTerm, location, status]);

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Done":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Handle View Details - Navigate to job detail page
  const handleViewDetails = (job) => {
    navigate(`/hr/job-detail/${job.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-red-600">Error loading jobs!</div>
      </div>
    );
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
                        setLocation(loc);
                        setShowLocationDropdown(false);
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
                        setStatus(stat);
                        setShowStatusDropdown(false);
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
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <span className="text-sm">{job.location}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                
                <div className="flex justify-end">
                  <Link
                    to={`/hr/job-detail/${job.id}`}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddJobModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      {showEditModal && <EditJobModal job={selectedJob} onClose={() => setShowEditModal(false)} />}
    </div>
  );
}