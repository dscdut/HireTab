import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import Header from '@/components/landing/Header';
import { Link } from 'react-router-dom';
import { BiBrain } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';

export default function JobBoard() {
  const { data: jobListings = [], isLoading, isError } = useQuery({
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

  const calculateDaysLeft = (endTime) => {
    const endDate = new Date(endTime);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : 'Closed';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <span className="text-5xl mb-4">😢</span>
        <div className="text-lg font-semibold text-red-500 mb-2">Error loading jobs!</div>
        <div className="text-gray-500">Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-10 mt-28">
      <h2 className="text-5xl font-extrabold mb-10 text-blue-900 text-center tracking-tight">Featured Jobs</h2>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar: Filters */}
          <aside className="lg:w-1/4 w-full bg-white/90 p-8 mt-18 rounded-3xl shadow-2xl border border-blue-100 flex flex-col gap-8 sticky top-28 self-start">
            <h2 className="text-2xl font-extrabold text-blue-700 mb-2 tracking-tight">Job Search</h2>
            <div className="flex items-center bg-blue-50 rounded-lg px-3 py-2 border border-blue-100">
              <FiSearch className="text-blue-400 w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Java, Mobile, React..."
                className="w-full bg-transparent border-none focus:outline-none text-base text-blue-900 placeholder:text-blue-300"
              />
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold mb-2">Location</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Ho Chi Minh</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Da Nang</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Ha Noi</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Remote</label>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold mb-2">Level</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Intern</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Fresher</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Junior</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Senior</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Lead</label>
              </div>
            </div>
            <div>
              <p className="text-sm text-blue-700 font-semibold mb-2">Type</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Full-time</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Part-time</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Remote</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Hybrid</label>
              </div>
            </div>
            <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg shadow transition">Filter Results</button>
          </aside>

          {/* Main Content: Job Cards */}
          <main className="lg:w-3/4 w-full">
            {jobListings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-blue-300">
                <span className="text-7xl mb-4">🔍</span>
                <div className="text-2xl font-semibold">No suitable jobs found</div>
                <div className="text-blue-400">Please try again later or change the filter.</div>
              </div>
            )}
            <div className="flex flex-col gap-8">
              {jobListings.map((job) => (
                <Link to={`/candidate/job/${job.id}`} key={job.id} className="block group">
                  <div className="bg-white/90 w-full rounded-2xl shadow-xl border border-blue-100 hover:shadow-2xl hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col md:flex-row items-stretch h-full relative overflow-hidden p-7">
                    {/* Left: Info */}
                    <div className="flex-1 flex flex-col justify-between pr-0 md:pr-8">
                      <div className="flex flex-col gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-blue-700 group-hover:underline group-hover:text-blue-800 transition">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-1">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">{job.experienceLevel || 'Experienced'}</span>
                          <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">{job.location || 'Ho Chi Minh'}</span>
                          <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">{job.category || 'Engineering'}</span>
                          {job.workType === 'Hybrid' && (
                            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">Hybrid</span>
                          )}
                          {job.workType === 'Remote' && (
                            <span className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold">Remote</span>
                          )}
                        </div>
                        <p className="text-gray-700 line-clamp-2 text-base mb-2">{job.description}</p>
                        <div className="flex items-center gap-2 text-blue-400 text-sm">
                          <BiBrain className="w-5 h-5" />
                          <span>{job.industryName || 'Technology'}</span>
                        </div>
                      </div>
                    </div>
                    {/* Right: Badge + Apply */}
                    <div className="flex flex-col justify-between items-end min-w-[180px] md:pl-8 mt-6 md:mt-0">
                      <span className="mb-4 md:mb-8 text-xs font-semibold px-4 py-2 rounded-full bg-gradient-to-r from-red-100 to-red-200 text-red-700 shadow">{calculateDaysLeft(job.endTime)}</span>
                      <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-xl font-bold text-base shadow hover:from-blue-700 hover:to-blue-500 transition">Apply</span>
                    </div>
                    <div className="absolute -top-8 -right-8 w-32 h-32 bg-blue-100 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </Link>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}