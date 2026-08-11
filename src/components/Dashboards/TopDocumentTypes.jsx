import React from "react";
import { DOCUMENT_TYPES } from "../../data/mockVerifications";

const documentLabel = (documentType) =>
  DOCUMENT_TYPES.find((doc) => doc.id === documentType)?.label ?? documentType;

const TopDocumentTypes = ({ data }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
          Top Document Types
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="text-sm text-slate-400">No document verifications yet.</p>
      ) : (
        <div className="space-y-4">
          {data.map((doc) => (
            <div
              key={doc.documentType}
              className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3"
            >
              <div>
                <h4 className="font-medium text-slate-800 dark:text-white">
                  {documentLabel(doc.documentType)}
                </h4>

                <p className="text-sm text-slate-500">
                  {doc.volume} {doc.volume === 1 ? "Check" : "Checks"}
                </p>
              </div>

              <span className="font-semibold text-green-600">
                {doc.matchRate}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopDocumentTypes;
