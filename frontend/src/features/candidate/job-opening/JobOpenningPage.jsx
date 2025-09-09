import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BiBrain } from 'react-icons/bi';
import { FiSearch, FiFilter, FiX, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';
import { STATUS, isStatusIn } from '@/core/constants/jobStatus.constants';
import CandidateLayout from '@/shared/layout/candidate-layout/candidate-layout';
export default function JobOpeningPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: [],
    level: [],
    type: []
  });

  // Filter handler functions
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      location: [],
      level: [],
      type: []
    });
    setSearchTerm('');
    setShowFilters(false);
  };
  const { data: allJobs = [], isLoading, isError } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      try {
        return await jobApi.listJobs();
      } catch (error) {
        toast.error('Failed to load jobs!');
        throw error;
      }
    },
    retry: false,
  });

  // Filter out jobs with status "closed" or null (case-insensitive)
  const filteredJobs = allJobs.filter(job => {
    if (!job.status || job.status === null) {
      return false;
    }
    return !isStatusIn(job.status, STATUS.CLOSED);
  });

  const jobListings = filteredJobs.filter(job => {
    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.category?.toLowerCase().includes(searchLower) ||
        job.industryName?.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower) ||
        job.level?.toLowerCase().includes(searchLower) ||
        job.employmentType?.toLowerCase().includes(searchLower)
      );
      if (!matchesSearch) {
        return false;
      }
    }

    // Location filter
    if (filters.location.length > 0) {
      const jobLocation = job.location?.toLowerCase() || '';
      const matchesLocation = filters.location.some(loc => 
        jobLocation.includes(loc.toLowerCase()) ||
        (loc.toLowerCase() === 'remote' && (job.workType?.toLowerCase() === 'remote' || jobLocation.includes('remote')))
      );
      if (!matchesLocation) {
        return false;
      }
    }

    // Level filter
    if (filters.level.length > 0) {
      const jobLevel = job.level?.toLowerCase() || '';
      const matchesLevel = filters.level.some(level => 
        jobLevel.includes(level.toLowerCase())
      );
      if (!matchesLevel) return false;
    }

    // Type filter
    if (filters.type.length > 0) {
      const jobEmploymentType = job.employmentType?.toLowerCase() || '';
      const jobWorkType = job.workType?.toLowerCase() || '';
      const matchesType = filters.type.some(type => {
        const typeLower = type.toLowerCase();
        return (
          jobEmploymentType.includes(typeLower) ||
          jobWorkType.includes(typeLower) ||
          (typeLower === 'full-time' && (jobEmploymentType.includes('full') || jobEmploymentType.includes('fulltime'))) ||
          (typeLower === 'part-time' && (jobEmploymentType.includes('part') || jobEmploymentType.includes('parttime'))) ||
          (typeLower === 'remote' && jobWorkType.includes('remote')) ||
          (typeLower === 'hybrid' && jobWorkType.includes('hybrid'))
        );
      });
      if (!matchesType) return false;
    }

    return true;
  });

  const getJobStatusDisplay = (job) => {
    // Use API status directly if available
    if (job.status && job.status !== null) {
      switch (job.status.toLowerCase()) {
        case 'open':
        case 'active':
          // For open jobs, show days left with appropriate color
          const endDate = new Date(job.endTime);
          const today = new Date();
          const diffTime = endDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 3) {
            return { text: `${diffDays} days left`, style: 'text-green-700 bg-gradient-to-r from-green-100 to-green-200' };
          } else if (diffDays > 0) {
            return { text: `${diffDays} days left`, style: 'text-orange-700 bg-gradient-to-r from-orange-100 to-orange-200' };
          } else {
            return { text: 'Expiring soon', style: 'text-red-700 bg-gradient-to-r from-red-100 to-red-200' };
          }
        case 'done':
          return { text: 'Done', style: 'text-green-700 bg-gradient-to-r from-green-100 to-green-200' };
        case 'todo':
          return { text: 'To Do', style: 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200' };
        case 'in progress':
        case 'inprogress':
        case 'progress':
          return { text: 'In Progress', style: 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200' };
        case 'closed':
          return { text: 'Closed', style: 'text-red-700 bg-gradient-to-r from-red-100 to-red-200' };
        case 'expired':
          return { text: 'Expired', style: 'text-red-700 bg-gradient-to-r from-red-100 to-red-200' };
        case 'paused':
          return { text: 'Paused', style: 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200' };
        default:
          return { text: job.status, style: 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200' };
      }
    }
    
    // Fallback to time-based calculation if no status
    const endDate = new Date(job.endTime);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      return { text: `${diffDays} days left`, style: 'text-green-700 bg-gradient-to-r from-green-100 to-green-200' };
    } else {
      return { text: 'Expired', style: 'text-red-700 bg-gradient-to-r from-red-100 to-red-200' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <span className="mb-4 text-5xl">😢</span>
        <div className="mb-2 text-lg font-semibold text-red-500">Error loading jobs!</div>
        <div className="text-gray-500">Please try again later.</div>
      </div>
    );
  }

  return (
    <CandidateLayout>
      <div className="container mx-auto mt-4 lg:mt-10 lg:py-5">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-blue-900 lg:mb-10 lg:text-5xl">Featured Jobs</h2>

        {/* Mobile Search and Filter Toggle */}
        <div className="block mb-6 lg:hidden">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute w-5 h-5 text-blue-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-base text-blue-900 bg-white border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute text-blue-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                showFilters || (filters.location.length + filters.level.length + filters.type.length > 0)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50'
              }`}
            >
              <FiFilter className="w-5 h-5" />
              <span className="font-medium">Filter</span>
              {(filters.location.length + filters.level.length + filters.type.length > 0) && (
                <span className="px-2 py-1 text-xs rounded-full bg-white/20">
                  {filters.location.length + filters.level.length + filters.type.length}
                </span>
              )}
            </button>
          </div>
          
          {searchTerm && (
            <div className="mt-3 text-sm text-blue-600">
              Found {jobListings.length} jobs for "{searchTerm}"
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:gap-10 lg:flex-row">
          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)}>
              <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto bg-white rounded-t-3xl p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-blue-900">Filters</h3>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Mobile Filter Content */}
                <div className="space-y-6">
                  <div>
                    <p className="mb-3 text-lg font-semibold text-blue-700">Location</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['Ho Chi Minh', 'Da Nang', 'Ha Noi', 'Remote'].map((location) => (
                        <label key={location} className="flex items-center gap-3 p-3 border border-blue-100 cursor-pointer rounded-xl hover:bg-blue-50">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-blue-600"
                            checked={filters.location.includes(location)}
                            onChange={() => handleFilterChange('location', location)}
                          />
                          <span className="font-medium text-blue-900">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-3 text-lg font-semibold text-blue-700">Level</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['Intern', 'Fresher', 'Junior', 'Senior', 'Lead'].map((level) => (
                        <label key={level} className="flex items-center gap-3 p-3 border border-blue-100 cursor-pointer rounded-xl hover:bg-blue-50">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-blue-600"
                            checked={filters.level.includes(level)}
                            onChange={() => handleFilterChange('level', level)}
                          />
                          <span className="font-medium text-blue-900">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="mb-3 text-lg font-semibold text-blue-700">Type</p>
                    <div className="grid grid-cols-2 gap-3">
                      {['Full-time', 'Part-time', 'Remote', 'Hybrid'].map((type) => (
                        <label key={type} className="flex items-center gap-3 p-3 border border-blue-100 cursor-pointer rounded-xl hover:bg-blue-50">
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-blue-600"
                            checked={filters.type.includes(type)}
                            onChange={() => handleFilterChange('type', type)}
                          />
                          <span className="font-medium text-blue-900">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {(filters.location.length > 0 || filters.level.length > 0 || filters.type.length > 0) && (
                    <div className="p-4 rounded-xl bg-blue-50">
                      <div className="mb-3 text-sm text-blue-600">
                        Active filters: {filters.location.length + filters.level.length + filters.type.length}
                      </div>
                      <button 
                        onClick={clearAllFilters}
                        className="w-full py-3 font-bold text-blue-600 transition bg-white border border-blue-300 rounded-xl hover:bg-blue-50"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-blue-100">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 font-bold text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <aside className="sticky hidden w-full lg:flex lg:flex-col lg:self-start lg:w-80 top-28">
            <div className="overflow-hidden bg-white border border-blue-100 shadow-sm rounded-2xl">
              {/* Header */}
              <div className="p-6 border-b border-blue-50 bg-gradient-to-r from-blue-50 to-blue-25">
                <h2 className="mb-1 text-xl font-semibold text-blue-900">Filter Jobs</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Search */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-blue-700">Search</label>
                  <div className="relative">
                    <FiSearch className="absolute w-4 h-4 text-blue-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                      type="text"
                      placeholder="Job title, keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute text-blue-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {searchTerm && (
                    <div className="mt-2 text-xs text-blue-600">
                      {jobListings.length} results found
                    </div>
                  )}
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiMapPin className="w-4 h-4 text-blue-500" />
                    <label className="text-sm font-medium text-blue-700">Location</label>
                  </div>
                  <div className="space-y-2">
                    {['Ho Chi Minh', 'Da Nang', 'Ha Noi', 'Remote'].map((location) => (
                      <label key={location} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                          checked={filters.location.includes(location)}
                          onChange={() => handleFilterChange('location', location)}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiUsers className="w-4 h-4 text-blue-500" />
                    <label className="text-sm font-medium text-blue-700">Experience Level</label>
                  </div>
                  <div className="space-y-2">
                    {['Intern', 'Fresher', 'Junior', 'Senior', 'Lead'].map((level) => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                          checked={filters.level.includes(level)}
                          onChange={() => handleFilterChange('level', level)}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Job Type */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FiClock className="w-4 h-4 text-blue-500" />
                    <label className="text-sm font-medium text-blue-700">Job Type</label>
                  </div>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Remote', 'Hybrid'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', type)}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-blue-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                {(filters.location.length > 0 || filters.level.length > 0 || filters.type.length > 0) && (
                  <div className="pt-4 border-t border-blue-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-blue-500">
                        {filters.location.length + filters.level.length + filters.type.length} filters active
                      </span>
                    </div>
                    <button 
                      onClick={clearAllFilters}
                      className="w-full px-3 py-2 text-sm font-medium text-blue-700 transition-colors border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 hover:border-blue-300"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content: Job Cards */}
          <main className="w-full lg:flex-1">
            {jobListings.length === 0 && !searchTerm && (
              <div className="flex flex-col items-center justify-center py-12 text-blue-300 lg:py-20">
                <span className="mb-4 text-5xl lg:text-7xl">🔍</span>
                <div className="text-xl font-semibold lg:text-2xl">No suitable jobs found</div>
                <div className="text-center text-blue-400">Please try again later or change the filter.</div>
              </div>
            )}
            {jobListings.length === 0 && searchTerm && (
              <div className="flex flex-col items-center justify-center py-12 text-blue-300 lg:py-20">
                <span className="mb-4 text-5xl lg:text-7xl">🔍</span>
                <div className="text-xl font-semibold text-center lg:text-2xl">No jobs found for "{searchTerm}"</div>
                <div className="text-center text-blue-400">Try a different search term or clear the search.</div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            )}
            <div className="flex flex-col gap-4 lg:gap-6">
              {jobListings.map((job) => (
                <Link to={`/candidate/job/${job.id}`} key={job.id} className="block group">
                  <div className="relative flex flex-col w-full h-full p-4 overflow-hidden transition-all duration-300 border border-blue-100 shadow-lg cursor-pointer bg-white/95 backdrop-blur-sm rounded-2xl hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 lg:flex-row lg:p-6">
                    {/* Left: Info */}
                    <div className="flex flex-col justify-between flex-1 mb-4 lg:mb-0 lg:pr-6">
                      <div className="flex flex-col gap-2 mb-3 lg:gap-3 lg:mb-4">
                        <h3 className="text-lg font-bold text-blue-700 transition group-hover:text-blue-800 lg:text-xl line-clamp-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 text-xs font-semibold text-blue-700 rounded-full bg-blue-50 lg:px-3">{job.level || 'Experienced'}</span>
                          <span className="px-2 py-1 text-xs font-semibold text-green-700 rounded-full bg-green-50 lg:px-3">{job.location || 'Ho Chi Minh'}</span>
                          <span className="px-2 py-1 text-xs font-semibold text-yellow-700 rounded-full bg-yellow-50 lg:px-3">{job.employmentType || 'Full-time'}</span>
                          {job.workType === 'Hybrid' && (
                            <span className="px-2 py-1 text-xs font-semibold text-purple-700 rounded-full bg-purple-50 lg:px-3">Hybrid</span>
                          )}
                          {job.workType === 'Remote' && (
                            <span className="px-2 py-1 text-xs font-semibold text-pink-700 rounded-full bg-pink-50 lg:px-3">Remote</span>
                          )}
                        </div>
                        <p className="mb-2 text-sm text-gray-700 lg:text-base line-clamp-2 lg:line-clamp-3">{job.description}</p>
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                          <BiBrain className="w-4 h-4 lg:w-5 lg:h-5" />
                          <span className="text-xs lg:text-sm">{job.industryName || 'Technology'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Right: Status + Apply */}
                    <div className="flex flex-row items-center justify-between lg:flex-col lg:justify-between lg:items-end lg:min-w-[160px]">
                      {(() => {
                        const statusInfo = getJobStatusDisplay(job);
                        return (
                          <span className={`px-3 py-1 lg:px-4 lg:py-2 mb-0 lg:mb-4 text-xs font-semibold rounded-full shadow whitespace-nowrap ${statusInfo.style}`}>
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                      <span className="inline-block px-4 py-2 text-sm font-bold text-white transition shadow lg:px-6 lg:py-3 lg:text-base bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl hover:from-blue-700 hover:to-blue-500 hover:shadow-lg">
                        Apply
                      </span>
                    </div>
                    {/* Background Decoration */}
                    <div className="absolute w-20 h-20 transition-transform duration-300 bg-blue-100 rounded-full -top-4 -right-4 opacity-20 group-hover:scale-110 lg:w-32 lg:h-32 lg:-top-8 lg:-right-8 lg:opacity-30" />
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </CandidateLayout>
  );
}