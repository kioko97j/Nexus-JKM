import React, { useState } from "react";
import { Plus, Search, MoreHorizontal } from "lucide-react";
import { DOCUMENT_TYPES, VERIFICATION_TYPES } from "../../data/mockVerifications";
import { STATUS_STYLES, TYPE_LABELS } from "../../utils/verificationStatus";

const documentLabel = (documentType) =>
  DOCUMENT_TYPES.find((doc) => doc.id === documentType)?.label ?? "—";

const VerificationsList = ({ verifications, onNewVerification }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = verifications.filter((record) => {
    const matchesSearch =
      record.customerName.toLowerCase().includes(search.toLowerCase()) ||
      record.reference.toLowerCase().includes(search.toLowerCase()) ||
      record.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || record.type === typeFilter;
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-slate-200 dark:border-slate-700">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Verifications
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {verifications.length} total checks run against live registries
          </p>
        </div>

        <button
          onClick={onNewVerification}
          className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">New Verification</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 p-6 pb-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, reference or ID"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="py-2.5 px-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All types</option>
          {VERIFICATION_TYPES.map((type) => (
            <option key={type.id} value={type.id}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-2.5 px-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All statuses</option>
          <option value="match">Match</option>
          <option value="no_match">No Match</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Reference</th>
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Customer</th>
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Document</th>
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="text-center py-4 text-xs font-semibold text-slate-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((record) => (
              <tr
                key={record.id}
                className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30"
              >
                <td className="py-4 font-medium text-slate-800 dark:text-white">{record.reference}</td>
                <td className="py-4 text-slate-600 dark:text-slate-300">{record.customerName}</td>
                <td className="py-4 text-slate-600 dark:text-slate-300">{TYPE_LABELS[record.type]}</td>
                <td className="py-4 text-slate-600 dark:text-slate-300">{documentLabel(record.documentType)}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[record.status].className}`}>
                    {STATUS_STYLES[record.status].label}
                  </span>
                </td>
                <td className="py-4 text-slate-600 dark:text-slate-300">{record.date}</td>
                <td className="py-4 text-center">
                  <button className="text-slate-500 hover:text-slate-700">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-500 dark:text-slate-400">
                  No verifications match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VerificationsList;
