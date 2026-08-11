import React from "react";
import { Sparkles, Info, CreditCard, Phone, Building2 } from "lucide-react";
import { VERIFICATION_TYPES, DOCUMENT_TYPES } from "../../../data/mockVerifications";

const TYPE_ICONS = {
  identity: CreditCard,
  phone: Phone,
  business: Building2,
};

const AUTO_FILL_VALUES = {
  identity: { national_id: "29184023", kra_pin: "A012345678Z", alien_id: "AL-88213" },
  phone: { nationalId: "29184023", mobileNumber: "0723456789" },
  business: "CPR/2014/475757",
};

const CustomerDetailsStep = ({ wizard, onChange }) => {
  const { verificationType, documentType, fields, consent } = wizard;
  const activeDocument = DOCUMENT_TYPES.find((doc) => doc.id === documentType);

  const setVerificationType = (type) => {
    onChange({
      verificationType: type,
      documentType: type === "identity" ? "national_id" : null,
      fields: {},
    });
  };

  const setDocumentType = (id) => {
    if (DOCUMENT_TYPES.find((doc) => doc.id === id)?.disabled) return;
    onChange({ documentType: id, fields: {} });
  };

  const setField = (key, value) => {
    onChange({ fields: { ...fields, [key]: value } });
  };

  const handleAutoFill = () => {
    if (verificationType === "identity") {
      const value = AUTO_FILL_VALUES.identity[documentType] || "29184023";
      onChange({ fields: { ...fields, reference: value, lastName: "Kamau" } });
    } else if (verificationType === "phone") {
      onChange({
        fields: {
          ...fields,
          nationalId: AUTO_FILL_VALUES.phone.nationalId,
          reference: AUTO_FILL_VALUES.phone.mobileNumber,
        },
      });
    } else {
      onChange({ fields: { ...fields, reference: AUTO_FILL_VALUES.business, businessName: "Very Good Company" } });
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            Enter customer details
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Data is transmitted over TLS and never stored beyond your retention policy.
          </p>
        </div>

        <button
          onClick={handleAutoFill}
          className="flex items-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex-shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Auto fill
        </button>
      </div>

      {/* Verification type tabs */}
      <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-2">
        Verification type
      </p>
      <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
        {VERIFICATION_TYPES.map((type) => {
          const Icon = TYPE_ICONS[type.id];
          const isActive = verificationType === type.id;

          return (
            <button
              key={type.id}
              onClick={() => setVerificationType(type.id)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-slate-800 dark:bg-slate-700 text-white shadow"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {type.label}
            </button>
          );
        })}
      </div>

      {/* Document type pills */}
      {verificationType === "identity" && (
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-2">
            Document type
          </p>
          <div className="flex flex-wrap gap-2">
            {DOCUMENT_TYPES.map((doc) => {
              const isActive = documentType === doc.id;

              return (
                <button
                  key={doc.id}
                  onClick={() => setDocumentType(doc.id)}
                  disabled={doc.disabled}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                    doc.disabled
                      ? "border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                      : isActive
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {doc.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activeDocument?.helper && (
        <div className="flex items-start gap-2 p-3 mb-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-blue-700 dark:text-blue-400">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{activeDocument.helper}</span>
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {verificationType === "identity" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                {activeDocument?.label ?? "ID"} number
              </label>
              <input
                type="text"
                value={fields.reference || ""}
                onChange={(e) => setField("reference", e.target.value)}
                placeholder="e.g. 29184023"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Example: 29184023</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Last name (optional)
              </label>
              <input
                type="text"
                value={fields.lastName || ""}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="e.g. Kamau"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">Stored on the record for your reference — not sent to IPRS.</p>
            </div>
          </>
        )}

        {verificationType === "phone" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Kenyan National ID number
              </label>
              <input
                type="text"
                value={fields.nationalId || ""}
                onChange={(e) => setField("nationalId", e.target.value)}
                placeholder="e.g. 29184023"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">The phone number is verified against this ID.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Phone number
              </label>
              <input
                type="text"
                value={fields.reference || ""}
                onChange={(e) => setField("reference", e.target.value)}
                placeholder="e.g. 0723456789"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {verificationType === "business" && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Business registration number
              </label>
              <input
                type="text"
                value={fields.reference || ""}
                onChange={(e) => setField("reference", e.target.value)}
                placeholder="e.g. CPR/2014/475757"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Business name (optional)
              </label>
              <input
                type="text"
                value={fields.businessName || ""}
                onChange={(e) => setField("businessName", e.target.value)}
                placeholder="e.g. Very Good Company"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Consent */}
      <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => onChange({ consent: e.target.checked })}
          className="mt-0.5 w-5 h-5 rounded-full accent-emerald-500"
        />
        <div>
          <p className="font-medium text-slate-800 dark:text-white">
            I have the customer's consent
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You confirm you have obtained explicit consent from the data subject as required by the Kenya Data Protection Act, 2019.
          </p>
        </div>
      </label>
    </div>
  );
};

export default CustomerDetailsStep;
