import React from 'react';

export const jobsOverview = {
    total: 180,
    breakdown: [
        { label: "Active Jobs", value: 100, color: "#3B82F6" },
        { label: "In reviews Jobs", value: 50, color: "#F59E0B" },
        { label: "Finish Jobs", value: 30, color: "#8B5CF6" },
    ]
};

export const attendanceRate = {
    rate: 90,
    change: 20,
    segments: [
        { label: "Sick Leave", value: 10, color: "#F59E0B" },
        { label: "Day Off", value: 20, color: "#60A5FA" },
        { label: "On time", value: 70, color: "#8B5CF6" },
    ]
};

export const totalsStats = [
    { label: "Fulltime Candidate", value: 150, change: 50, trend: "up" },
    { label: "Freelance Candidate", value: 50, change: -10, trend: "down" },
];

export const recruitmentFunnelData = [
    { name: 'Jan', applicants: 4000, hires: 2400 },
    { name: 'Feb', applicants: 3000, hires: 1398 },
    { name: 'Mar', applicants: 2000, hires: 9800 },
    { name: 'Apr', applicants: 2780, hires: 3908 },
    { name: 'May', applicants: 1890, hires: 4800 },
    { name: 'Jun', applicants: 2390, hires: 3800 },
    { name: 'Jul', applicants: 3490, hires: 4300 },
    { name: 'Aug', applicants: 4000, hires: 2400 },
    { name: 'Sep', applicants: 3000, hires: 1398 },
    { name: 'Oct', applicants: 2000, hires: 9800 },
    { name: 'Nov', applicants: 2780, hires: 3908 },
    { name: 'Dec', applicants: 1890, hires: 4800 },
];

export const candidatePerformance = [
    { name: 'Hazel Nutt', technical: 80, communication: 70, culture: 90 },
    { name: 'Simon Cyrene', technical: 90, communication: 85, culture: 75 },
    { name: 'Aida Bugg', technical: 70, communication: 90, culture: 85 },
    { name: 'Peg Legge', technical: 85, communication: 75, culture: 90 },
    { name: 'Barb Akew', technical: 75, communication: 80, culture: 70 },
];

export const candidateList = [
    { id: "CAN120124", name: "Hazel Nutt", email: "hazelnutt@mail.com", role: "Lead UI/UX Designer", department: "Team Projects", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=hazel" },
    { id: "CAN120125", name: "Simon Cyrene", email: "simoncyr@mail.com", role: "Sr UI/UX Designer", department: "Team Projects", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=simon" },
    { id: "CAN120126", name: "Aida Bugg", email: "aidabug@mail.com", role: "Jr Graphics Designer", department: "Team Marketing", status: "Freelance", avatar: "https://i.pravatar.cc/150?u=aida" },
    { id: "CAN120127", name: "Peg Legge", email: "peglegge@mail.com", role: "Jr Animator", department: "Team Marketing", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=peg" },
];
