// JobBoardHR component
"use client";

import Header from "./components/HRHeader";

export default function JobBoard() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <Header />
      
      {/* Main content với padding-top để tránh bị che */}
      <div className="flex-1 overflow-auto pt-20"> {/* pt-20 = 80px height của header */}
        <div className="p-4">
          {/* Nội dung chính của trang */}
        </div>
      </div>
    </div>
  );
}