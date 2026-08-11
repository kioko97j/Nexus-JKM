import React from "react";
import { MoreHorizontal } from "lucide-react";
import { DOCUMENT_TYPES } from "../../data/mockVerifications";
import { STATUS_STYLES, TYPE_LABELS } from "../../utils/verificationStatus";

const documentLabel = (documentType) =>
  DOCUMENT_TYPES.find((doc) => doc.id === documentType)?.label ?? "—";

const RecentVerificationsTable = ({ verifications, onViewAll }) => {
  const rows = verifications.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Recent Verifications
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Latest customer verification checks
          </p>
        </div>

        <button
          onClick={onViewAll}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Reference
              </th>

              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Customer
              </th>

              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Type
              </th>

              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Document
              </th>

              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Status
              </th>

              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">
                Date
              </th>

              <th className="text-center py-4 text-xs font-semibold text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((record) => (
              <tr
                key={record.id}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                <td className="py-4 font-medium text-slate-800 dark:text-white">
                  {record.reference}
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-300">
                  {record.customerName}
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-300">
                  {TYPE_LABELS[record.type]}
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-300">
                  {documentLabel(record.documentType)}
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[record.status].className}`}
                  >
                    {STATUS_STYLES[record.status].label}
                  </span>
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-300">
                  {record.date}
                </td>

                <td className="py-4 text-center">
                  <button className="text-slate-500 hover:text-slate-700">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No verifications yet — run one to see it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentVerificationsTable;
