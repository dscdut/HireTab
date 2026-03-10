import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Eye, MoreVertical } from 'lucide-react';
import { candidateApi } from '@/core/services/candidate.service';

const ListTableSection = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        candidateApi.getPaginationCandidate(1, 100)
            .then(res => {
                // Ensure we handle the response structure { data: [...], ... }
                const data = res?.data || [];
                setCandidates(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Error fetching candidates:", err);
                setCandidates([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                <h3 className="text-lg font-bold text-gray-800">List Candidates</h3>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 lg:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search Employee"
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-gray-200 outline-none transition-all text-sm"
                        />
                    </div>

                    {/* Filters */}
                    {['All Status', 'All Role'].map((filter, idx) => (
                        <button key={idx} className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all border border-gray-100">
                            {filter} <ChevronDown size={14} className="text-gray-400" />
                        </button>
                    ))}

                    {/* Export */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all border border-gray-100">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-50">
                            <th className="px-4 py-4 w-10">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 transition-all" />
                            </th>
                            {['Employee ID', 'Name', 'Email', 'Role', 'Departments', 'Status', 'Action'].map((head, i) => (
                                <th key={i} className="px-4 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    {head}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="8" className="text-center py-10 text-gray-400">Loading candidates...</td></tr>
                        ) : candidates.length === 0 ? (
                            <tr><td colSpan="8" className="text-center py-10 text-gray-400">No candidates found.</td></tr>
                        ) : candidates.map((item, idx) => (
                            <tr key={item.id || idx} className="group hover:bg-gray-50/50 transition-all">
                                <td className="px-4 py-4">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 transition-all" />
                                </td>
                                <td className="px-4 py-4 text-sm font-semibold text-gray-500 uppercase">
                                    EMP{String(item.id).padStart(6, '0')}
                                </td>
                                <td className="px-4 py-4 font-semibold text-gray-900 text-sm">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.avatar || `https://i.pravatar.cc/150?u=${item.id}`}
                                            alt={item.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">{item.email}</td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700">{item.jobPostingName || 'N/A'}</td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700">Internal Team</td>
                                <td className="px-4 py-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-gray-100 bg-white min-w-[100px]">
                                        <div className={`w-1.5 h-1.5 rounded-full ${['Hired', 'Full-time'].includes(item.status) ? 'bg-green-500' :
                                                item.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-400'
                                            }`}></div>
                                        <span className="text-[11px] font-bold text-gray-600">{item.status || 'Applied'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 opacity-10 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
                                        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListTableSection;
