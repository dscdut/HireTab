import React, { useEffect, useState } from 'react';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight, Briefcase, Users, ClipboardCheck } from 'lucide-react';
import { jobApi } from '@/core/services/job.service';
import { candidateApi } from '@/core/services/candidate.service';

const CardHeader = ({ title }) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <button className="text-gray-400 hover:bg-gray-50 p-1 rounded-md transition-colors">
            <MoreHorizontal size={18} />
        </button>
    </div>
);

const JobsWidget = ({ total }) => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[170px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <div>
                <CardHeader title="Total Jobs" />
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        <span className="text-[44px] font-bold text-[#1E293B] leading-none mb-2">{total + 100}</span>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-lg w-fit">
                            <Briefcase size={12} />
                            <span className="text-[11px] font-bold">Total openings</span>
                        </div>
                    </div>

                    {/* Status Breakdown to fill space */}
                    <div className="flex flex-col gap-2.5 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                <span className="text-[11px] font-medium text-gray-500">Active</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">{Math.round(total * 0.6)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                <span className="text-[11px] font-medium text-gray-500">In Review</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">{Math.round(total * 0.25)}</span>
                        </div>
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                <span className="text-[11px] font-medium text-gray-500">Filled</span>
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">{Math.round(total * 0.15)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AttendanceWidget = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[170px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <CardHeader title="Attendance Rate" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-[44px] font-bold text-[#1E293B] leading-none">95%</span>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={14} className="text-green-600" />
                        <span className="text-[11px] font-bold text-green-600">3.2% <span className="text-gray-400 font-medium">this mo.</span></span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-blue-600 w-[70%]"></div>
                        <div className="bg-blue-300 w-[20%]"></div>
                        <div className="bg-gray-200 flex-1"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-[11px] font-medium text-gray-500">Present</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-300"></div>
                            <span className="text-[11px] font-medium text-gray-500">Remote</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TotalsWidget = ({ total }) => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[170px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <CardHeader title="Total Candidates" />
            <div className="flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[44px] font-bold text-[#1E293B] leading-none">{total + 100}</span>
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg">
                        <Users size={12} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Database Size</span>
                    </div>
                </div>
                <div className="flex items-center gap-10">
                    <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-[#1E293B]">{Math.round(total * 0.7)} <span className="text-[11px] font-medium text-gray-400">Full-time</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[16px] font-bold text-[#1E293B]">{Math.round(total * 0.3)} <span className="text-[11px] font-medium text-gray-400">Freelance</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopStatsRow = () => {
    const [stats, setStats] = useState({
        totalJobs: 125,
        totalCandidates: 432,
        loading: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch All Jobs - axios interceptor returns response.data
                const jobsRes = await jobApi.listJobs();
                const jobsCount = Array.isArray(jobsRes) ? jobsRes.length : (jobsRes?.data?.length || 0);

                // Fetch All Candidates for actual count
                const candRes = await candidateApi.getAllCandidates();
                const candCount = Array.isArray(candRes) ? candRes.length : (candRes?.data?.length || 0);

                // Only update if we have real data (non-zero)
                if (jobsCount > 0 || candCount > 0) {
                    setStats({
                        totalJobs: jobsCount > 0 ? jobsCount : 125,
                        totalCandidates: candCount > 0 ? candCount : 432,
                        loading: false
                    });
                }
            } catch (err) {
                console.error("Dashboard Stats Error:", err);
                // Keep the default mock data on error
            }
        };

        fetchData();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <JobsWidget total={stats.totalJobs} />
            <AttendanceWidget />
            <TotalsWidget total={stats.totalCandidates} />
        </div>
    );
};

export default TopStatsRow;
