import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Stepper from "./Stepper";
import CustomerDetailsStep from "./steps/CustomerDetailsStep";
import IprsMatchStep from "./steps/IprsMatchStep";
import ResultStep from "./steps/ResultStep";
import { verifyWithXobriq } from "../../utils/xobriqClient";
import { VERIFICATION_COST } from "../../data/mockVerifications";
import { TYPE_LABELS } from "../../utils/verificationStatus";

const INITIAL_WIZARD = {
  step: 1,
  verificationType: "identity",
  documentType: "national_id",
  fields: {},
  consent: false,
};

const STEP_COPY = {
  1: {
    title: "Start a new verification",
    subtitle: "Choose a verification type and run a live verification check.",
  },
  2: {
    title: "IPRS match",
    subtitle: "We're confirming these details against the registry.",
  },
  3: {
    title: "Result & audit log",
    subtitle: "Review the outcome and audit trail for this check.",
  },
};

const NewVerification = ({ walletBalance, onFinish }) => {
  const [wizard, setWizard] = useState(INITIAL_WIZARD);
  const [matching, setMatching] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [matchError, setMatchError] = useState(null);

  const cost = VERIFICATION_COST[wizard.verificationType];
  const canSubmit =
    Boolean(wizard.fields.reference) &&
    (wizard.verificationType !== "phone" || Boolean(wizard.fields.nationalId)) &&
    wizard.consent;

  const updateWizard = (patch) => setWizard((prev) => ({ ...prev, ...patch }));

  const handleClear = () => {
    setWizard(INITIAL_WIZARD);
    setResult(null);
    setMatchError(null);
  };

  const handleGoToMatch = () => {
    if (!canSubmit) return;
    updateWizard({ step: 2 });
  };

  const handleRunMatch = async () => {
    setMatching(true);
    setMatchError(null);

    try {
      const response = await verifyWithXobriq(wizard.verificationType, {
        ...wizard.fields,
        documentType: wizard.documentType,
      });
      setResult(response);
      updateWizard({ step: 3 });
    } catch (err) {
      setMatchError(err.message);
    } finally {
      setMatching(false);
    }
  };

  const handleStartNew = async () => {
    if (!result) {
      handleClear();
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      await onFinish({
        type: wizard.verificationType,
        documentType: wizard.verificationType === "identity" ? wizard.documentType : null,
        reference: wizard.fields.reference,
        customerName: wizard.fields.lastName || wizard.fields.businessName || TYPE_LABELS[wizard.verificationType],
        status: result.status,
        cost,
        result,
      });
      handleClear();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Stepper step={wizard.step} title={STEP_COPY[wizard.step].title} subtitle={STEP_COPY[wizard.step].subtitle} />

      {wizard.step === 1 && <CustomerDetailsStep wizard={wizard} onChange={updateWizard} />}
      {wizard.step === 2 && (
        <IprsMatchStep
          wizard={wizard}
          matching={matching}
          error={matchError}
          onRunMatch={handleRunMatch}
        />
      )}
      {wizard.step === 3 && result && <ResultStep wizard={wizard} result={result} />}

      {saveError && (
        <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-400">
          Couldn't save this verification: {saveError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Cost: {wizard.step === 3 ? `KES ${cost}.00` : "Not billed"}
          </span>
          {" · "}
          Wallet: KES {walletBalance.toLocaleString()}.00
        </div>

        <div className="flex items-center gap-3">
          {wizard.step === 1 && (
            <>
              <button
                onClick={handleClear}
                className="py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={handleGoToMatch}
                disabled={!canSubmit}
                className="flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                Run verification
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {wizard.step === 2 && (
            <button
              onClick={() => updateWizard({ step: 1 })}
              disabled={matching}
              className="flex items-center gap-2 py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {wizard.step === 3 && (
            <button
              onClick={handleStartNew}
              disabled={saving}
              className="py-2.5 px-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-60"
            >
              {saving ? "Saving…" : "Start new verification"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewVerification;
