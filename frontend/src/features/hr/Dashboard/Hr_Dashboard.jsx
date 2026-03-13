import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BookOpen, Briefcase, User, Sparkles } from 'lucide-react';

// Mock Data
const dashboardStats = [
  { title: "New candidates to review", value: "76", color: "bg-blue-100 text-blue-800", icon: "👤", subtitle: "Pending review" },
  { title: "Schedule for today", value: "3", color: "bg-green-100 text-green-800", icon: "📅", subtitle: "Today's events" },
];

const jobStatsData = [
  { day: "Mon", views: 122, applied: 34 },
  { day: "Tue", views: 100, applied: 60 },
  { day: "Wed", views: 80, applied: 50 },
  { day: "Thu", views: 110, applied: 90 },
  { day: "Fri", views: 70, applied: 30 },
  { day: "Sat", views: 30, applied: 15 },
  { day: "Sun", views: 50, applied: 25 },
];

const jobSummary = {
  open: 12,
  applicants: 67,
  views: 2342,
  applied: 654,
  viewsChange: 6.4,
  appliedChange: -0.5,
};

const jobCards = [
  {
    title: "Social Media Assistant",
    company: "Nomad",
    location: "Paris, France",
    tags: ["Marketing", "Design"],
    capacity: "5 applied of 10 capacity",
    type: "Full-Time",
    icon: <BookOpen className="text-blue-600 w-7 h-7" />,
  },
  {
    title: "Brand Designer",
    company: "Nomad",
    location: "Berlin, Germany",
    tags: ["Business", "Design"],
    capacity: "5 applied of 10 capacity",
    type: "Full-Time",
    icon: <Briefcase className="text-blue-600 w-7 h-7" />,
  },
  {
    title: "Interactive Developer",
    company: "Terraform",
    location: "Berlin, Germany",
    tags: ["Marketing", "Design"],
    capacity: "5 applied of 10 capacity",
    type: "Full-Time",
    icon: <User className="text-blue-600 w-7 h-7" />,
  },
  {
    title: "Product Designer",
    company: "ClassPass",
    location: "Berlin, Germany",
    tags: ["Business", "Design"],
    capacity: "5 applied of 10 capacity",
    type: "Full-Time",
    icon: <Sparkles className="text-blue-600 w-7 h-7" />,
  },
];

const StatCard = ({ title, value, color, icon, subtitle }) => (
  <div
    className={`rounded-xl flex flex-col items-center justify-center gap-2 border border-gray-400 min-h-[110px] p-3 transition-all shadow bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ef] to-[#c7d2fe] hover:scale-[1.025] hover:shadow-xl hover:z-10 duration-200`}
    style={{ boxShadow: '0 6px 32px 0 rgba(71,85,105,0.10), 0 1.5px 6px 0 rgba(59,130,246,0.10)' }}
  >
    <div className={`w-14 h-14 flex items-center justify-center rounded-full text-4xl font-bold shadow-sm ${color} bg-white/80`}>{icon}</div>
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-center text-gray-800 drop-shadow-sm">{title}</h3>
      {subtitle && <span className="mt-1 text-base text-gray-700">{subtitle}</span>}
      <p className="mt-1 text-4xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);

const JobStatsChart = () => (
  <ResponsiveContainer width="100%" height={450}>
    <BarChart data={jobStatsData} barGap={4}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="views" fill="#6366f1" name="Job Views" radius={[8, 8, 0, 0]} />
      <Bar dataKey="applied" fill="#fbbf24" name="Job Applied" radius={[8, 8, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

const JobSummaryCard = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col items-center gap-2 p-6 transition-all duration-200 bg-white border border-gray-400 shadow rounded-xl hover:scale-[1.025] hover:shadow-xl hover:z-10">
      <span className="text-4xl font-bold text-blue-700">{jobSummary.open}</span>
      <span className="text-sm text-gray-500">Jobs Opened</span>
    </div>
    <div className="flex flex-col items-center gap-2 p-6 transition-all duration-200 bg-white border border-gray-400 shadow rounded-xl hover:scale-[1.025] hover:shadow-xl hover:z-10">
      <span className="text-4xl font-bold text-green-600">{jobSummary.applicants}</span>
      <span className="text-sm text-gray-500">Applicants</span>
    </div>
  </div>
);

const JobViewsApplied = () => (
  <div className="flex flex-col gap-4 min-h-[450px] justify-between">
    <div className="flex flex-col items-center justify-center flex-1 p-8 transition-all duration-200 bg-white border border-gray-400 shadow-xl rounded-xl shadow-blue-100/40 hover:scale-[1.025] hover:shadow-xl hover:z-10">
      <span className="text-lg font-semibold text-gray-700">Job Views</span>
      <span className="text-2xl font-bold text-blue-700">{jobSummary.views}</span>
      <span className="text-xs text-blue-500">This Week <span className="font-bold">{jobSummary.viewsChange > 0 ? `+${jobSummary.viewsChange}%` : `${jobSummary.viewsChange}%`}</span></span>
    </div>
    <div className="flex flex-col items-center justify-center flex-1 p-8 transition-all duration-200 bg-white border border-gray-400 shadow-xl rounded-xl shadow-yellow-100/40 hover:scale-[1.025] hover:shadow-xl hover:z-10">
      <span className="text-lg font-semibold text-gray-700">Job Applied</span>
      <span className="text-2xl font-bold text-yellow-600">{jobSummary.applied}</span>
      <span className="text-xs text-yellow-500">This Week <span className="font-bold">{jobSummary.appliedChange > 0 ? `+${jobSummary.appliedChange}%` : `${jobSummary.appliedChange}%`}</span></span>
    </div>
  </div>
);

const JobCard = ({ job }) => (
  <div className="flex flex-col p-5 space-y-2 transition-all duration-200 bg-white border border-gray-400 shadow rounded-xl hover:scale-[1.025] hover:shadow-xl hover:z-10">
    <div className="flex items-center gap-2 mb-2">
      {job.icon}
      <span className="px-2 py-1 text-xs font-semibold text-blue-700 rounded bg-blue-50">{job.type}</span>
    </div>
    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
    <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
    <div className="flex flex-wrap gap-2 mt-2 text-xs">
      {job.tags.map((tag, i) => (
        <span key={i} className="px-2 py-1 font-medium text-blue-800 bg-blue-100 rounded-full">{tag}</span>
      ))}
    </div>
    <p className="mt-2 text-xs text-gray-500">{job.capacity}</p>
  </div>
);

const HrDashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex flex-col gap-6 mb-8 md:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
          {dashboardStats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
        <div className="flex flex-col gap-6 min-w-[200px]">
          <JobSummaryCard />
        </div>
      </div>

      <div className="grid items-start grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-8 bg-white shadow md:col-span-2 rounded-xl flex flex-col justify-start min-h-[370px] border border-gray-400">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Job Statistics</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-semibold text-blue-700 rounded bg-blue-50">Week</button>
              <button className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded">Month</button>
              <button className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded">Year</button>
            </div>
          </div>
          <JobStatsChart />
        </div>
        <div className="flex flex-col gap-6 min-h-[370px] justify-start">
          <JobViewsApplied />
        </div>
      </div>

      <div className="p-6 bg-white shadow rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Job Updates</h2>
          <button className="text-sm font-semibold text-blue-600 hover:underline">View All →</button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {jobCards.map((job, idx) => (
            <JobCard key={idx} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;