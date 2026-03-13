import React from "react";
import TopBar from "./components/TopBar";
import TopStatsRow from "./components/TopStatsRow";
import MainChartSection from "./components/MainChartSection";
import ListTableSection from "./components/ListTableSection";
import { ChevronDown, Download } from 'lucide-react';

const HrDashboard = () => {
  return (
    <div className="min-h-screen bg-[#FDFDFE] overflow-x-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50/10">
        <div className="max-w-[1600px] mx-auto w-full p-4 lg:p-6">

          {/* Header */}
          <div className="mb-6">
            <TopBar />
          </div>

          {/* Dahboard Widgets Row 1: Gauge, Attendance, Totals */}
          <TopStatsRow />

          {/* Dashboard Charts Row 2: Funnel Chart, Performance ratings */}
          <MainChartSection />

          {/* Dashboard Table Row 3: List Candidates */}
          <ListTableSection />

          {/* Footer spacer */}
          <div className="h-10"></div>
        </div>
      </div>
    </div>
  );
};

export default HrDashboard;
