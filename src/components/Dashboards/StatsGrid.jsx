import React from "react";
import { ShieldCheck, CheckCircle2, Wallet, Clock } from "lucide-react";

const StatsGrid = ({ stats, walletBalance }) => {
  const cards = [
    {
      title: "Total Verifications",
      value: stats.total.toLocaleString(),
      caption: "All time",
      icon: ShieldCheck,
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Pass Rate",
      value: `${stats.passRate}%`,
      caption: "Of decided checks",
      icon: CheckCircle2,
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Wallet Balance",
      value: `KES ${walletBalance.toLocaleString()}`,
      caption: "Available now",
      icon: Wallet,
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "Pending Reviews",
      value: stats.pendingCount.toLocaleString(),
      caption: "Awaiting outcome",
      icon: Clock,
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="
              bg-white/80 dark:bg-slate-900/80
              backdrop-blur-xl
              rounded-2xl
              p-6
              border border-slate-200/50 dark:border-slate-700/50
              hover:shadow-xl
              hover:shadow-slate-200/20
              dark:hover:shadow-slate-900/20
              transition-all duration-300
              group
            "
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                  {card.value}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
                  {card.caption}
                </p>
              </div>

              <div
                className={`
                  p-3 rounded-xl
                  ${card.bgColor}
                  group-hover:scale-110
                  transition-all duration-200
                `}
              >
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
