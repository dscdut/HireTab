import React from 'react';

export const jobsOverview = {
    total: 180,
    breakdown: [
        { label: "Đang mở", value: 100, color: "#3B82F6" },
        { label: "Đang duyệt", value: 50, color: "#F59E0B" },
        { label: "Đã hoàn thành", value: 30, color: "#8B5CF6" },
    ]
};

export const attendanceRate = {
    rate: 90,
    change: 20,
    segments: [
        { label: "Nghỉ phép", value: 10, color: "#F59E0B" },
        { label: "Ngày nghỉ", value: 20, color: "#60A5FA" },
        { label: "Đúng giờ", value: 70, color: "#8B5CF6" },
    ]
};

export const totalsStats = [
    { label: "Ứng viên Full-time", value: 150, change: 50, trend: "up" },
    { label: "Ứng viên Freelance", value: 50, change: -10, trend: "down" },
];

export const recruitmentFunnelData = [
    { name: 'Tháng 1', applicants: 4000, interviews: 3200, hires: 2400 },
    { name: 'Tháng 2', applicants: 3000, interviews: 2000, hires: 1398 },
    { name: 'Tháng 3', applicants: 2000, interviews: 5000, hires: 9800 },
    { name: 'Tháng 4', applicants: 2780, interviews: 3100, hires: 3908 },
    { name: 'Tháng 5', applicants: 1890, interviews: 3500, hires: 4800 },
    { name: 'Tháng 6', applicants: 2390, interviews: 3000, hires: 3800 },
    { name: 'Tháng 7', applicants: 3490, interviews: 4000, hires: 4300 },
    { name: 'Tháng 8', applicants: 4000, interviews: 3100, hires: 2400 },
    { name: 'Tháng 9', applicants: 3000, interviews: 2100, hires: 1398 },
    { name: 'Tháng 10', applicants: 2000, interviews: 6000, hires: 9800 },
    { name: 'Tháng 11', applicants: 2780, interviews: 3200, hires: 3908 },
    { name: 'Tháng 12', applicants: 1890, interviews: 3500, hires: 4800 },
];

export const candidatePerformance = [
    { name: 'Huỳnh Thị Phước', score: 85 },
    { name: 'Hồ Đình Tuấn Kiệt', score: 92 },
    { name: 'Lê Văn Cường', score: 78 },
    { name: 'Phạm Minh Danh', score: 88 },
    { name: 'Hoàng Anh Tuấn', score: 45 },
];

export const candidateList = [
    { id: "CAN120124", name: "Huỳnh Thị Phước", email: "phuoc@mail.com", role: "Lead UI/UX Designer", department: "Team Projects", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: "CAN120125", name: "Hồ Đình Tuấn Kiệt", email: "kiet@mail.com", role: "Sr UI/UX Designer", department: "Team Projects", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: "CAN120128", name: "NGUYEN LE TIEN DAT", email: "tiendat.hr@fpt.edu.vn", role: "Backend Developer", department: "External Team", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=dat" },
    { id: "CAN120126", name: "Lê Văn Cường", email: "cuong@mail.com", role: "Jr Graphics Designer", department: "Team Marketing", status: "Freelance", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: "CAN120127", name: "Phạm Minh Danh", email: "danh@mail.com", role: "Jr Animator", department: "Team Marketing", status: "Full-time", avatar: "https://i.pravatar.cc/150?u=4" },
];
