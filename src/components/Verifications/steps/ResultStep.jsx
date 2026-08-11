import React from "react";
import { CheckCircle2, XCircle, FileClock } from "lucide-react";
import { VERIFICATION_COST } from "../../../data/mockVerifications";

const AUDIT_LOG_STEPS = [
  "Customer details submitted",
  "Consent captured",
  "Request sent to Xobriq",
  "Response received from Xobriq",
];

const ResultStep = ({ wizard, result }) => {
  const isMatch = result.status === "match";
  const cost = VERIFICATION_COST[wizard.verificationType];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div
        className={`flex items-center gap-4 p-5 rounded-xl mb-6 ${
          isMatch
            ? "bg-emerald-50 dark:bg-emerald-900/20"
            : "bg-red-50 dark:bg-red-900/20"
        }`}
      >
        {isMatch ? (
          <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-9 h-9 text-red-600 dark:text-red-400 flex-shrink-0" />
        )}

        <div>
          <h3 className={`text-lg font-bold ${isMatch ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
            {isMatch ? "Match confirmed" : "No match found"}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isMatch
              ? "The submitted details match the registry record."
              : "The submitted details do not match the registry record."}
          </p>
          {result.ref && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Reference: {result.ref}
              {typeof result.durationMs === "number" && ` · ${result.durationMs}ms`}
            </p>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Verification details</h4>
      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">Field</th>
              <th className="text-left py-3 text-xs font-semibold text-slate-500 uppercase">Value</th>
            </tr>
          </thead>
          <tbody>
            {result.fields.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-3 text-slate-500 dark:text-slate-400">
                  No additional details returned.
                </td>
              </tr>
            ) : (
              result.fields.map((field) => (
                <tr key={field.label} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="py-3 font-medium text-slate-800 dark:text-white">{field.label}</td>
                  <td className="py-3 text-slate-600 dark:text-slate-300">{field.value}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Audit log</h4>
      <div className="space-y-3 mb-6">
        {AUDIT_LOG_STEPS.map((entry) => (
          <div key={entry} className="flex items-center gap-3 text-sm">
            <FileClock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-600 dark:text-slate-300">{entry}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm text-slate-600 dark:text-slate-300">
        KES {cost}.00 has been deducted from your wallet for this verification.
      </div>
    </div>
  );
};

export default ResultStep;
