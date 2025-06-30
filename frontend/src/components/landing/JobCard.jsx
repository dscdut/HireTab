const JobCard = ({ job }) => {
    const getTagColor = (tag) => {
      const colors = {
        "Full-Time": "bg-green-100 text-green-800",
        Marketing: "bg-orange-100 text-orange-800",
        Design: "bg-purple-100 text-purple-800",
      }
      return colors[tag] || "bg-gray-100 text-gray-800"
    }
  
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start space-x-4">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: job.companyColor }}
          >
            <span className="text-white font-bold text-lg">{job.companyInitial}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-sm mb-1">{job.company}</p>
            <p className="text-gray-500 text-sm mb-3">{job.location}</p>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default JobCard
  