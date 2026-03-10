import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from 'recharts';
import { MoreHorizontal, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { jobsOverview, attendanceRate, totalsStats } from '../mockData';

const CardHeader = ({ title }) => (
    <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
        <button className="text-gray-400 hover:bg-gray-50 p-1 rounded-md transition-colors">
            <MoreHorizontal size={18} />
        </button>
    </div>
);

const JobsWidget = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[160px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <CardHeader title="Total Jobs" />
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900 mb-1">180</span>
                <span className="text-sm text-gray-400 font-medium">total jobs</span>
            </div>
        </div>
    );
};

const AttendanceWidget = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[160px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <CardHeader title="Attendance Rate" />
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-gray-900">90%</span>
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                        <ArrowUpRight size={14} className="text-green-600" />
                        <span className="text-[11px] font-bold text-green-600">2.3% <span className="text-gray-400 font-medium">since last month</span></span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-gray-100">
                        <div className="bg-blue-600 w-[30%] opacity-40"></div>
                        <div className="bg-blue-600 w-[40%]"></div>
                        <div className="bg-gray-200 flex-1"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600 opacity-40"></div>
                            <span className="text-[11px] font-medium text-gray-500">Salk Lawe</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="text-[11px] font-medium text-gray-500">Day Off</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TotalsWidget = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[160px] flex flex-col justify-between hover:shadow-md transition-all duration-300">
            <CardHeader title="Total Employees" />
            <div className="flex flex-col">
                <span className="text-4xl font-bold text-gray-900 mb-4">150</span>
                <div className="flex items-center gap-12">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">120 <span className="text-sm font-medium text-gray-400">Full-time</span></span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-gray-900">330 <span className="text-sm font-medium text-gray-400">Full-time</span></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopStatsRow = () => {
    return (
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <JobsWidget />
            <AttendanceWidget />
            <TotalsWidget />
        </div>
    );
};

export default TopStatsRow;
