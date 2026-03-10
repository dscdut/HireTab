import React from "react";

const colorMap = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

const StatCard = ({ title, value, color = "blue", icon, subtitle }) => {
  return (
    <div
      className={`rounded-xl flex flex-col items-center justify-center gap-2 border border-gray-200 min-h-[110px] p-3 transition-all shadow bg-gradient-to-br from-[#f0f4ff] via-[#e0e7ef] to-[#c7d2fe] hover:scale-[1.025] hover:shadow-xl hover:z-10 duration-200 ${colorMap[color]}`}
      style={{ boxShadow: '0 6px 32px 0 rgba(71,85,105,0.10), 0 1.5px 6px 0 rgba(59,130,246,0.10)' }}
    >
      {icon && <div className="w-14 h-14 flex items-center justify-center rounded-full text-4xl font-bold shadow-sm bg-white/80 mb-2">{icon}</div>}
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-bold text-center text-gray-800 drop-shadow-sm">{title}</h3>
        {subtitle && <span className="mt-1 text-base text-gray-700">{subtitle}</span>}
        <p className="mt-1 text-4xl font-extrabold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;