import { useQuery } from '@tanstack/react-query';
import { jobApi } from '@/core/services/job.service';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { BiBrain } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import ChatWootWidget from '@/components/ui/chatwoot-widget'; 
import Header from '@/components/layout/Header';
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
                className="w-full text-base text-blue-900 bg-transparent border-none focus:outline-none placeholder:text-blue-300"
              />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Location</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Ho Chi Minh</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Da Nang</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Ha Noi</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Remote</label>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Level</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Intern</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Fresher</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Junior</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Senior</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Lead</label>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-700">Type</p>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Full-time</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Part-time</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Remote</label>
                <label className="flex items-center gap-2 text-blue-900"><input type="checkbox" className="accent-blue-600" /> Hybrid</label>
              </div>
            </div>
            <button className="w-full py-2 mt-4 font-bold text-white transition bg-blue-600 rounded-lg shadow hover:bg-blue-700">Filter Results</button>
          </aside>

          {/* Main Content: Job Cards */}
          <main className="w-full lg:w-3/4">
            {jobListings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-blue-300">
                <span className="mb-4 text-7xl">🔍</span>
                <div className="text-2xl font-semibold">No suitable jobs found</div>
                <div className="text-blue-400">Please try again later or change the filter.</div>
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
                          <span className="px-3 py-1 text-xs font-semibold text-blue-700 rounded-full bg-blue-50">{job.experienceLevel || 'Experienced'}</span>
                          <span className="px-3 py-1 text-xs font-semibold text-green-700 rounded-full bg-green-50">{job.location || 'Ho Chi Minh'}</span>
                          <span className="px-3 py-1 text-xs font-semibold text-yellow-700 rounded-full bg-yellow-50">{job.category || 'Engineering'}</span>
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
                      <span className="px-4 py-2 mb-4 text-xs font-semibold text-red-700 rounded-full shadow md:mb-8 bg-gradient-to-r from-red-100 to-red-200">{calculateDaysLeft(job.endTime)}</span>
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