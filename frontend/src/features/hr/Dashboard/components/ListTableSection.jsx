import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, Download, Eye, MoreVertical } from 'lucide-react';
import { candidateApi } from '@/core/services/candidate.service';
import { candidateList } from '../mockData';

const ListTableSection = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        candidateApi.getPaginationCandidate(1, 100)
            .then(res => {
                const apiData = res?.data || [];

                // Demo Scores for mock candidates
                const demoScores = {
                    "Huỳnh Thị Phước": 90,
                    "Hồ Đình Tuấn Kiệt": 92,
                    "NGUYEN LE TIEN DAT": 95,
                    "Lê Văn Cường": 88,
                    "Phạm Minh Danh": 85
                };

                // Merge API data with mock data
                const mergedData = [...apiData];

                candidateList.forEach(mockCand => {
                    if (!mergedData.find(c => c.email === mockCand.email)) {
                        mergedData.push({
                            ...mockCand,
                            score: demoScores[mockCand.name] || 75,
                            jobPostingName: mockCand.role
                        });
                    }
                });

                // Sort by score descending and take top 5
                const sortedData = mergedData.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 5);
                setCandidates(sortedData);
            })
            .catch(err => {
                console.error("Error fetching candidates:", err);
                // Fallback to mock data if API fails
                const fallback = candidateList.map(c => ({ ...c, score: 80, jobPostingName: c.role })).slice(0, 5);
                setCandidates(fallback);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-all duration-300">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-800">Top 5 Ranked Candidates</h3>
                </div>

                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        Top Performers Only
                    </span>
                    {/* Export */}
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-all border border-gray-100">
                        <Download size={16} /> Export Report
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
                            {['Emp ID', 'Name', 'Email', 'Role', 'Departments', 'Score', 'Status', 'Action'].map((head, i) => (head !== 'Departments' && (
                                <th key={i} className={`px-4 py-4 text-xs font-semibold text-gray-400 tracking-wider ${head === 'Score' ? 'text-center' : ''}`}>
                                    {head}
                                </th>
                            )))}
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
                                <td className="px-4 py-4 text-sm font-semibold text-gray-400">
                                    #{String(item.id).padStart(4, '0')}
                                </td>
                                <td className="px-4 py-4 font-semibold text-[#1E293B] text-sm">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.avatar || `https://i.pravatar.cc/150?u=${item.id}`}
                                            alt={item.name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100 shadow-sm"
                                        />
                                        <span className="capitalize">{item.name.toLowerCase()}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-500">{item.email}</td>
                                <td className="px-4 py-4 text-sm font-medium text-gray-700">{item.jobPostingName || 'N/A'}</td>
                                <td className="px-4 py-4 text-center">
                                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg border border-blue-100">
                                        {item.score || 0}%
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-100 bg-white min-w-[100px]">
                                        <div className={`w-2 h-2 rounded-full ${['Hired', 'Full-time', 'Xuất sắc', 'Excellent'].includes(item.status) ? 'bg-green-500' :
                                            ['Rejected', 'Cần cải thiện', 'Needs Improvement'].includes(item.status) ? 'bg-red-500' : 'bg-blue-400'
                                            }`}></div>
                                        <span className="text-[11px] font-bold text-gray-600 capitalize">{item.status?.toLowerCase() || 'Applied'}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={18} /></button>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={18} /></button>
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
