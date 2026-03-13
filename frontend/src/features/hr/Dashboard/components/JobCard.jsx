import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="flex flex-col p-5 space-y-2 transition-all duration-200 bg-white border border-gray-200 shadow rounded-xl hover:scale-[1.025] hover:shadow-xl hover:z-10">
      <div className="flex items-center gap-2 mb-2">
        {job.icon && <span>{job.icon}</span>}
        <span className="px-2 py-1 text-xs font-semibold text-blue-700 rounded bg-blue-50">{job.type}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
      <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
      <div className="flex flex-wrap gap-2 mt-2 text-xs">
        {job.tags && job.tags.map((tag, i) => (
          <span key={i} className="px-2 py-1 font-medium text-blue-800 bg-blue-100 rounded-full">{tag}</span>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500">{job.capacity}</p>
    </div>
  );
};

export default JobCard;