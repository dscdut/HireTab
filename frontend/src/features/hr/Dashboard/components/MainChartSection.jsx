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
            <CardHeader title="Income Statistics" moreLabel="More details" />
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
                            tickFormatter={(val) => `$${val / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid #f0f0f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="applicants" stroke="#3B82F6" strokeWidth={3} fill="transparent" name="Income" />
                        <Area type="monotone" dataKey="hires" stroke="#94A3B8" strokeWidth={2} fill="transparent" name="Expense" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    <span className="text-[11px] font-medium text-gray-500">Income</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-400"></div>
                    <span className="text-[11px] font-medium text-gray-500">Expense</span>
                </div>
            </div>
        </div>
    );
};

const PerformanceWidget = () => {
    const employees = [
        { name: 'Hazel Nutt', val: 85 },
        { name: 'Simon Cyrene', val: 92 },
        { name: 'Asisa Bugg', val: 78 },
        { name: 'Peg Legge', val: 88 },
        { name: 'Bart Alee', val: 45 },
    ];

    return (
        <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[420px] flex flex-col hover:shadow-md transition-all duration-300">
            <CardHeader title="Employee Performance Ratings" />

            <div className="flex flex-col gap-1 mb-8">
                <span className="text-4xl font-bold text-gray-900 leading-none">98%</span>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed max-w-[240px] mt-2">
                    Most of employees complete their jobs and on time. Give rewards to increase employee satisfaction 👏
                </p>
            </div>

            <div className="flex flex-col gap-6 flex-1">
                {employees.map((emp, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <span className="text-xs font-semibold text-gray-700 w-24 truncate">{emp.name}</span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-lg overflow-hidden flex">
                            <div className="bg-blue-600 h-full opacity-40" style={{ width: `${emp.val * 0.4}%` }}></div>
                            <div className="bg-blue-600 h-full opacity-70" style={{ width: `${emp.val * 0.3}%` }}></div>
                            <div className="bg-blue-600 h-full opacity-20" style={{ width: `${emp.val * 0.2}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 opacity-40"></div>
                    <span className="text-[10px] font-medium text-gray-500">Needs improvement</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 opacity-70"></div>
                    <span className="text-[10px] font-medium text-gray-500">Meets Expectations</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                    <span className="text-[10px] font-medium text-gray-500">Freelance</span>
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
