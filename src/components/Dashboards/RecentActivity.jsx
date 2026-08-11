import React from "react";
import { TYPE_LABELS } from "../../utils/verificationStatus";

const STATUS_COLOR = {
  match: "bg-green-500",
  no_match: "bg-red-500",
  pending: "bg-yellow-500",
};

const STATUS_VERB = {
  match: "passed",
  no_match: "failed",
  pending: "submitted",
};

const timeAgo = (isoDate) => {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const RecentActivity = ({ verifications }) => {
  const activities = verifications.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Recent Activity
        </h3>
      </div>

      {activities.length === 0 ? (
        <p className="text-sm text-slate-400">No activity yet — run a verification to get started.</p>
      ) : (
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${STATUS_COLOR[activity.status]}`} />

              <div>
                <p className="font-medium text-slate-700 dark:text-white">
                  {TYPE_LABELS[activity.type]} verification {STATUS_VERB[activity.status]} — {activity.reference}
                </p>

                <p className="text-sm text-slate-500">{timeAgo(activity.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
