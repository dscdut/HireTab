"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search, Bell, Filter, ChevronRight } from "lucide-react";
import Header from "./components/HRHeader";
import { useSearchParams, useParams } from "react-router-dom";
import { candidateApi } from "@/core/services/candidate.service";

export default function JobPostingDashboard() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const { jobId } = useParams();


  const { data: candidates = [], isLoading, isError } = useQuery({
    queryKey: ["candidates", jobId],
    queryFn: async () => {
      if (!jobId) {
        console.error("Job ID is undefined");
        return [];
      }
      try {
        const response = await candidateApi.listCandidate(jobId);

        if (!Array.isArray(response)) {
          return [response];
        }

        return response || [];
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
        throw error;
      }
    },
    enabled: !!jobId,
  });

  const filteredCandidates = useMemo(() => {
    let result = [...candidates];
    if (activeTab !== "All") {
      result = result.filter((candidate) => candidate.status === activeTab);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(query) ||
          candidate.jobPostingName.toLowerCase().includes(query) ||
          candidate.email.toLowerCase().includes(query)
      );
    }
    return result;
  }, [candidates, activeTab, searchQuery]);

  // Sắp xếp ứng viên
  const sortedCandidates = useMemo(() => {
    const sortableItems = [...filteredCandidates];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCandidates, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
      2,
      "0"
    )}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Hired":
        return "bg-indigo-100 text-indigo-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Interview":
        return "bg-lime-100 text-lime-700";
      case "In-Review":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (isError) {
    return <div>Error loading candidates!</div>;
  }

  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white p-4 shadow-lg flex justify-between items-center rounded-md">

          <div className="h-12 w-full"></div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates, names, roles, etc..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 bg-white hover:bg-gray-50">
                <span>Filter</span>
                <Filter size={16} />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort By:</span>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 bg-white hover:bg-gray-50"
                  onClick={() => requestSort("createdAt")}
                >
                  <span>{sortConfig.direction === "asc" ? "Oldest" : "Latest"}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${sortConfig.direction === "asc" ? "rotate-180" : ""
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm">
            <div className="flex border-b overflow-x-auto">
              {["All", "In-Review", "Interview", "Hired", "Rejected"].map((tab) => (
                <button
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === tab
                      ? "text-gray-800 border-b-2 border-gray-800"
                      : "text-gray-500 hover:text-gray-800"
                    }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}{" "}
                  {tab !== "All" &&
                    `(${candidates.filter((c) => c.status === tab).length})`}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    {[
                      { key: "name", label: "Name" },
                      { key: "email", label: "Email" },
                      { key: "jobPostingName", label: "Job Posting" },
                      { key: "createdAt", label: "Applied Date" },
                      { key: "resumeFile", label: "CV File " },
                      { key: "status", label: "Status" },
                      { key: "score", label: "Score(%)" },
                    ].map((column) => (
                      <th
                        key={column.key || column.label}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-600"
                      >
                        {column.key ? (
                          <button
                            className="flex items-center hover:text-gray-800"
                            onClick={() => requestSort(column.key)}
                          >
                            {column.label}
                            <ChevronDown
                              size={16}
                              className={`ml-1 transition-transform ${sortConfig.key === column.key &&
                                  sortConfig.direction === "asc"
                                  ? "rotate-180"
                                  : ""
                                }`}
                            />
                          </button>
                        ) : (
                          column.label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedCandidates.length > 0 ? (
                    sortedCandidates.map((candidate) => (
                      console.log(candidate),
                      <tr
                        key={candidate.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">
                          {candidate.name}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {candidate.email}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {candidate.jobPostingName}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {formatDate(candidate.createdAt)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {candidate.resumeFile ? (
                            <a
                              href={candidate.resumeFile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View CV
                            </a>
                          ) : (
                            "No CV"
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                              candidate.status
                            )}`}
                          >
                            {candidate.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {candidate.score}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-6 text-center text-sm text-gray-500"
                      >
                        No candidates found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}