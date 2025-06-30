import JobCard from "./JobCard"

const OpenJobs = ({ jobs }) => {
  return (
    <div className="bg-gray-50 px-6 py-2">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Open Jobs</h2>
          <a href="#" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            Show all jobs
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default OpenJobs
