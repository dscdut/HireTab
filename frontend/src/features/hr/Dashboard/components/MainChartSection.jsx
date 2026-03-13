import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { recruitmentFunnelData, candidatePerformance } from '../mockData';

const CardHeader = ({ title, moreLabel }) => (
    <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-500 tracking-tight">{title}</h3>
        <div className="flex items-center gap-4">
            {moreLabel && <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 tracking-tight transition-colors">{moreLabel} &gt;</button>}
            <button className="text-gray-400 hover:bg-gray-50 p-1.5 rounded-lg transition-all duration-300">
                <MoreHorizontal size={20} />
            </button>
        </div>
    </div>
);

const IncomeWidget = () => {
    return (
        <div className="flex-[2] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[420px] flex flex-col hover:shadow-md transition-all duration-300">
            <CardHeader title="Recruitment Statistics" moreLabel="Detail" />
            <div className="flex-1 -ml-4 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={recruitmentFunnelData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="applicants" stroke="#3B82F6" strokeWidth={3} fill="transparent" name="Ứng viên" />
                        <Area type="monotone" dataKey="interviews" stroke="#F59E0B" strokeWidth={3} fill="transparent" name="Phỏng vấn" />
                        <Area type="monotone" dataKey="hires" stroke="#94A3B8" strokeWidth={2} fill="transparent" name="Trúng tuyển" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-[11px] font-medium text-gray-500">New Candidates</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <span className="text-[11px] font-medium text-gray-500">Interviews</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                    <span className="text-[11px] font-medium text-gray-500">Hired</span>
                </div>
            </div>
        </div>
    );
};

const PerformanceWidget = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[420px] flex flex-col hover:shadow-md transition-all duration-300">
            <CardHeader title="Top Candidate Performance" />

            <div className="flex flex-col gap-1 mb-8">
                <span className="text-4xl font-bold text-gray-900 leading-none">98%</span>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[240px] mt-2">
                    A high number of candidates meet the professional standards. Reach out soon to secure top talent!
                </p>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                {candidatePerformance.map((cand, i) => (
                    <div key={i} className="flex items-center gap-6">
                        <span className="text-xs font-bold text-[#1E293B] w-36 shrink-0 capitalize">{cand.name.toLowerCase()}</span>
                        <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden flex max-w-[180px]">
                            <div className="bg-blue-600 h-full opacity-80" style={{ width: `${cand.score}%` }}></div>
                            <div className="bg-gray-100 flex-1"></div>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 w-10 text-right">{cand.score}%</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#94A3B8]"></div>
                    <span className="text-[10px] font-medium text-gray-500">Needs Improvement</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-[10px] font-medium text-gray-500">Meets Expectations</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-medium text-gray-500">Excellent</span>
                </div>
            </div>
        </div>
    );
};

const MainChartSection = () => {
    return (
        <div className="flex flex-col xl:flex-row gap-6 mb-8">
            <IncomeWidget />
            <PerformanceWidget />
        </div>
    );
};

export default MainChartSection;
