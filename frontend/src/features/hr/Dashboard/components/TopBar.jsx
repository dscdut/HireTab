import React from 'react';
import { Search, Mail, Bell, UserPlus } from 'lucide-react';

const TopBar = () => {
  return (
    <div className="flex items-center justify-between mb-2 w-full p-2">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-72 pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all text-sm"
          />
        </div>

        {/* Notification Items */}
        <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
          <button className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
            <Mail size={20} />
          </button>
          <button className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors">
            <Bell size={20} />
          </button>

          {/* User Avatars */}
          <div className="flex -space-x-2 ml-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/150?u=${i}`}
                alt="User"
                className="w-9 h-9 rounded-full border-2 border-white object-cover"
              />
            ))}
            <div className="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
              +4
            </div>
          </div>

          {/* Invite Button */}
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            <UserPlus size={18} />
            Invite
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
