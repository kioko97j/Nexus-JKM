import React from "react";
import { Loader2, ShieldCheck, User, AlertTriangle } from "lucide-react";
import { DOCUMENT_TYPES } from "../../../data/mockVerifications";
import { TYPE_LABELS } from "../../../utils/verificationStatus";

const IprsMatchStep = ({ wizard, matching, error, onRunMatch }) => {
  const { verificationType, documentType, fields } = wizard;
  const documentLabel = DOCUMENT_TYPES.find((doc) => doc.id === documentType)?.label;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Confirm details before matching
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This is the record that will be sent for verification.
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
          <dt className="text-xs font-semibold text-slate-500 uppercase">Verification type</dt>
          <dd className="text-slate-800 dark:text-white font-medium mt-1">{TYPE_LABELS[verificationType]}</dd>
        </div>

        {documentLabel && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
            <dt className="text-xs font-semibold text-slate-500 uppercase">Document type</dt>
            <dd className="text-slate-800 dark:text-white font-medium mt-1">{documentLabel}</dd>
          </div>
        )}

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
          <dt className="text-xs font-semibold text-slate-500 uppercase">Reference</dt>
          <dd className="text-slate-800 dark:text-white font-medium mt-1">{fields.reference}</dd>
        </div>

        {fields.lastName && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
            <dt className="text-xs font-semibold text-slate-500 uppercase">Last name</dt>
            <dd className="text-slate-800 dark:text-white font-medium mt-1">{fields.lastName}</dd>
          </div>
        )}

        {fields.nationalId && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900">
            <dt className="text-xs font-semibold text-slate-500 uppercase">National ID</dt>
            <dd className="text-slate-800 dark:text-white font-medium mt-1">{fields.nationalId}</dd>
          </div>
        )}
      </dl>

      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center">
        {matching ? (
          <>
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">
              Matching against the registry…
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              This usually takes a few seconds.
            </p>
          </>
        ) : error ? (
          <>
            <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">
              Couldn't complete the match
            </p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1 mb-4">{error}</p>
            <button
              onClick={onRunMatch}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              Try again
            </button>
          </>
        ) : (
          <>
            <ShieldCheck className="w-8 h-8 text-slate-400 mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">
              Ready to run the IPRS match
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
              We'll compare the submitted details against the live registry record.
            </p>
            <button
              onClick={onRunMatch}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              Run IPRS match
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default IprsMatchStep;
