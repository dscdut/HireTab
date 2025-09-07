import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BiBrain } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import ChatWootWidget from '@/components/ui/chatwoot-widget'; 
import Header from '@/components/layout/Header';
export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
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
    if (!job.status || job.status === null) return false;
    const status = job.status.toString().toLowerCase().trim();
    console.log('Filtering job:', job.title, 'Status:', job.status, 'Normalized:', status);
    return status !== 'closed';
  });

  // Apply search and filters
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
      if (!matchesSearch) return false;
    }

    // Location filter
    if (filters.location.length > 0) {
      const jobLocation = job.location?.toLowerCase() || '';
      const matchesLocation = filters.location.some(loc => 
        jobLocation.includes(loc.toLowerCase()) ||
        (loc.toLowerCase() === 'remote' && (job.workType?.toLowerCase() === 'remote' || jobLocation.includes('remote')))
      );
      if (!matchesLocation) return false;
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

  // Debug: Log the first job to see API structure
  if (allJobs.length > 0) {
    console.log('Sample job from API:', allJobs[0]);
  }

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <Header />
      <div className="container px-4 py-10 mx-auto mt-28">
      <h2 className="mb-10 text-5xl font-extrabold tracking-tight text-center text-blue-900">Featured Jobs</h2>

        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Sidebar: Filters */}
          <aside className="sticky flex flex-col self-start w-full gap-8 p-8 border border-blue-100 shadow-2xl lg:w-1/4 bg-white/90 mt-18 rounded-3xl top-28">
            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-blue-700">Job Search</h2>
            <div className="flex items-center px-3 py-2 border border-blue-100 rounded-lg bg-blue-50">
              <FiSearch className="w-5 h-5 mr-2 text-blue-400" />
              <input
                type="text"
                placeholder="Java, Mobile, React..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-base text-blue-900 bg-transparent border-none focus:outline-none placeholder:text-blue-300"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="text-sm text-blue-600">
                Found {jobListings.length} jobs for "{searchTerm}"
              </div>
            )}
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Location</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.location.includes('Ho Chi Minh')}
                    onChange={() => handleFilterChange('location', 'Ho Chi Minh')}
                  /> Ho Chi Minh
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.location.includes('Da Nang')}
                    onChange={() => handleFilterChange('location', 'Da Nang')}
                  /> Da Nang
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.location.includes('Ha Noi')}
                    onChange={() => handleFilterChange('location', 'Ha Noi')}
                  /> Ha Noi
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.location.includes('Remote')}
                    onChange={() => handleFilterChange('location', 'Remote')}
                  /> Remote
                </label>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Level</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.level.includes('Intern')}
                    onChange={() => handleFilterChange('level', 'Intern')}
                  /> Intern
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.level.includes('Fresher')}
                    onChange={() => handleFilterChange('level', 'Fresher')}
                  /> Fresher
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.level.includes('Junior')}
                    onChange={() => handleFilterChange('level', 'Junior')}
                  /> Junior
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.level.includes('Senior')}
                    onChange={() => handleFilterChange('level', 'Senior')}
                  /> Senior
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.level.includes('Lead')}
                    onChange={() => handleFilterChange('level', 'Lead')}
                  /> Lead
                </label>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Type</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.type.includes('Full-time')}
                    onChange={() => handleFilterChange('type', 'Full-time')}
                  /> Full-time
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.type.includes('Part-time')}
                    onChange={() => handleFilterChange('type', 'Part-time')}
                  /> Part-time
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.type.includes('Remote')}
                    onChange={() => handleFilterChange('type', 'Remote')}
                  /> Remote
                </label>
                <label className="flex items-center gap-2 text-blue-900">
                  <input 
                    type="checkbox" 
                    className="accent-blue-600"
                    checked={filters.type.includes('Hybrid')}
                    onChange={() => handleFilterChange('type', 'Hybrid')}
                  /> Hybrid
                </label>
              </div>
            </div>
            {(filters.location.length > 0 || filters.level.length > 0 || filters.type.length > 0) && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 mb-2">
                  Active filters: {filters.location.length + filters.level.length + filters.type.length}
                </div>
                <button 
                  onClick={clearAllFilters}
                  className="w-full py-2 font-bold text-blue-600 transition bg-white border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </aside>

          {/* Main Content: Job Cards */}
          <main className="w-full lg:w-3/4">
            {jobListings.length === 0 && !searchTerm && (
              <div className="flex flex-col items-center justify-center py-20 text-blue-300">
                <span className="mb-4 text-7xl">🔍</span>
                <div className="text-2xl font-semibold">No suitable jobs found</div>
                <div className="text-blue-400">Please try again later or change the filter.</div>
              </div>
            )}
            {jobListings.length === 0 && searchTerm && (
              <div className="flex flex-col items-center justify-center py-20 text-blue-300">
                <span className="mb-4 text-7xl">🔍</span>
                <div className="text-2xl font-semibold">No jobs found for "{searchTerm}"</div>
                <div className="text-blue-400">Try a different search term or clear the search.</div>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Clear Search
                </button>
              </div>
            )}
            <div className="flex flex-col gap-8">
              {jobListings.map((job) => (
                <Link to={`/candidate/job/${job.id}`} key={job.id} className="block group">
                  <div className="relative flex flex-col items-stretch w-full h-full overflow-hidden transition-all duration-200 border border-blue-100 shadow-xl cursor-pointer bg-white/90 rounded-2xl hover:shadow-2xl hover:border-blue-500 md:flex-row p-7">
                    {/* Left: Info */}
                    <div className="flex flex-col justify-between flex-1 pr-0 md:pr-8">
                      <div className="flex flex-col gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-blue-700 transition group-hover:underline group-hover:text-blue-800">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-1">
                          <span className="px-3 py-1 text-xs font-semibold text-blue-700 rounded-full bg-blue-50">{job.level || 'Experienced'}</span>
                          <span className="px-3 py-1 text-xs font-semibold text-green-700 rounded-full bg-green-50">{job.location || 'Ho Chi Minh'}</span>
                          <span className="px-3 py-1 text-xs font-semibold text-yellow-700 rounded-full bg-yellow-50">{job.employmentType || 'Full-time'}</span>
                          {job.workType === 'Hybrid' && (
                            <span className="px-3 py-1 text-xs font-semibold text-purple-700 rounded-full bg-purple-50">Hybrid</span>
                          )}
                          {job.workType === 'Remote' && (
                            <span className="px-3 py-1 text-xs font-semibold text-pink-700 rounded-full bg-pink-50">Remote</span>
                          )}
                        </div>
                        <p className="mb-2 text-base text-gray-700 line-clamp-2">{job.description}</p>
                        <div className="flex items-center gap-2 text-sm text-blue-400">
                          <BiBrain className="w-5 h-5" />
                          <span>{job.industryName || 'Technology'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Right: Badge + Apply */}
                    <div className="flex flex-col justify-between items-end min-w-[180px] md:pl-8 mt-6 md:mt-0">
                      {(() => {
                        const statusInfo = getJobStatusDisplay(job);
                        return (
                          <span className={`px-4 py-2 mb-4 text-xs font-semibold rounded-full shadow md:mb-8 ${statusInfo.style}`}>
                            {statusInfo.text}
                          </span>
                        );
                      })()}
                      <span className="inline-block px-8 py-3 text-base font-bold text-white transition shadow bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl hover:from-blue-700 hover:to-blue-500">Apply</span>
                    </div>
                    <div className="absolute w-32 h-32 transition-transform duration-300 bg-blue-100 rounded-full -top-8 -right-8 opacity-30 group-hover:scale-110" />
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
      <ChatWootWidget />
    </div>
  );
}