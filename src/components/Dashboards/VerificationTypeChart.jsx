import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TYPE_LABELS } from "../../utils/verificationStatus";

const TYPE_COLORS = {
  identity: "#3B82F6",
  phone: "#8B5CF6",
  business: "#10B981",
  credit_score: "#F59E0B",
};

const VerificationTypeChart = ({ data }) => {
  const chartData = data.map((item) => ({
    name: TYPE_LABELS[item.type],
    value: item.percentage,
    color: TYPE_COLORS[item.type],
  }));

  return (
    <div
      className="
        bg-white
        dark:bg-slate-800
        rounded-2xl
        p-6
        shadow-sm
        border
        border-slate-200
        dark:border-slate-700
        h-full
      "
    >
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">
        Verification Types
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Share of volume by type
      </p>

      <div className="h-[220px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400 text-center px-4">
            No verifications yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="space-y-3 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-medium text-slate-700 dark:text-white">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationTypeChart;
