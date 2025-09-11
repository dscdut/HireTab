import React from "react";
import { Bell, Plus } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-white shadow">
      <div className="text-xl font-semibold">Company: HireTab</div>
      <div className="flex items-center gap-4">
        <Bell />
        <button className="flex items-center gap-1 px-4 py-2 text-white bg-blue-600 rounded-lg">
          <Plus size={16} /> Post a Job
        </button>
      </div>
    </div>
  );
};

export default Topbar;