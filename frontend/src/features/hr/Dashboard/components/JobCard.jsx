import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="p-4 space-y-2 bg-white shadow rounded-xl">
      <p className="text-sm text-gray-500">Full-Time</p>
      <h3 className="font-semibold">{job.title}</h3>
      <p className="text-sm text-gray-500">
        {job.company} · {job.location}
      </p>
      <div className="flex flex-wrap gap-2 mt-2 text-xs">
        {job.tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 text-blue-800 bg-blue-100 rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm">{job.capacity}</p>
    </div>
  );
};

export default JobCard;