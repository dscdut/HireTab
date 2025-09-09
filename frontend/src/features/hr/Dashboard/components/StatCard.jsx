import React from "react";

const StatCard = ({ title, value, color = "blue" }) => {
  const bg =
    color === "green"
      ? "bg-green-600"
      : color === "red"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div className={`p-4 rounded-xl shadow text-white ${bg}`}>
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default StatCard;