import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const VerificationsTrendChart = ({ data }) => {
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
      "
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Verifications Trend
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Monthly verifications, passed vs failed
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Passed
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300">
              Failed
            </span>
          </div>
        </div>
      </div>

      <div className="h-[350px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            No verifications yet — run one to see the trend build up here.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.3}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
              />

              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#94a3b8"
                allowDecimals={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              />

              <Bar dataKey="passed" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="failed" fill="#94A3B8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default VerificationsTrendChart;
