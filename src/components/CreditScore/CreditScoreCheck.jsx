import React, { useState } from "react";
import {
  TrendingUp,
  User,
  Building2,
  Zap,
  ShieldCheck,
  FileText,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { simulateCreditScore } from "../../utils/simulateCreditScore";
import { VERIFICATION_COST } from "../../data/mockVerifications";
import { TYPE_LABELS } from "../../utils/verificationStatus";

const BAND_STYLES = {
  red: { ring: "border-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  orange: { ring: "border-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
  blue: { ring: "border-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  emerald: { ring: "border-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
};

const cost = VERIFICATION_COST.credit_score;

const CreditScoreCheck = ({ walletBalance, onFinish }) => {
  const [subjectType, setSubjectType] = useState("individual");
  const [idNumber, setIdNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const canRun = Boolean(idNumber) && consent && !running;

  const handleRunReport = async () => {
    if (!canRun) return;

    setRunning(true);
    setError(null);
    setSaveError(null);

    try {
      const response = await simulateCreditScore({ subjectType, idNumber });
      setResult(response);
      setSaving(true);
      try {
        await onFinish({
          type: "credit_score",
          documentType: null,
          reference: idNumber,
          customerName: TYPE_LABELS.credit_score,
          status: "match",
          cost,
          result: response,
        });
      } catch (err) {
        setSaveError(err.message);
      } finally {
        setSaving(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRunning(false);
    }
  };

  const bandStyle = result ? BAND_STYLES[result.bandColor] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Info panel */}
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-blue-600 dark:text-blue-400 uppercase mb-3">
              <TrendingUp className="w-4 h-4" />
              Credit Score
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3">
              Know a credit score, instantly
            </h2>

            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Pull a bureau-style credit score and full report for any individual or
              company. Pick who, confirm consent, one click.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Results in seconds, not days
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Verified via credit bureau registry
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Full report: score, contracts &amp; payment history
                </span>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-2">
                1. Who is this for?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setSubjectType("individual");
                    setResult(null);
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    subjectType === "individual"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {subjectType === "individual" && (
                    <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
                  )}
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Individual</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">National ID lookup</p>
                </button>

                <button
                  onClick={() => {
                    setSubjectType("company");
                    setResult(null);
                  }}
                  className={`relative p-4 rounded-xl border text-left transition-all ${
                    subjectType === "company"
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  {subjectType === "company" && (
                    <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-emerald-500" />
                  )}
                  <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">Company</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Registration number</p>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase mb-2">
                2. {subjectType === "individual" ? "National ID" : "Registration number"}
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => {
                  setIdNumber(e.target.value);
                  setResult(null);
                }}
                placeholder={subjectType === "individual" ? "e.g. 12345678" : "e.g. CPR/2014/475757"}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded-full accent-emerald-500"
              />
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-white">
                  I confirm I have obtained the subject's consent to run this check
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Required before a credit bureau search can run, per the Kenya Data
                  Protection Act, 2019.
                </p>
              </div>
            </label>

            <button
              onClick={handleRunReport}
              disabled={!canRun}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {running ? "Pulling report…" : "Run Report"}
            </button>

            <p className="text-xs text-slate-400 text-center">
              {saving
                ? "Saving to history…"
                : `Cost: KES ${cost}.00 · Wallet: KES ${walletBalance.toLocaleString()}.00`}
            </p>
          </div>
        </div>
      </div>

      {saveError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-sm text-red-700 dark:text-red-400">
          Report retrieved, but couldn't be saved to history: {saveError}
        </div>
      )}

      {/* Result / placeholder panel */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
        {error ? (
          <div className="flex flex-col items-center text-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">Couldn't pull the report</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
          </div>
        ) : running ? (
          <div className="flex flex-col items-center text-center py-8">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">Pulling credit report…</p>
          </div>
        ) : result ? (
          <div>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className={`w-32 h-32 rounded-full border-8 ${bandStyle.ring} flex flex-col items-center justify-center flex-shrink-0`}>
                <span className="text-3xl font-black text-slate-800 dark:text-white">{result.score}</span>
                <span className="text-xs text-slate-400">/ 900</span>
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bandStyle.bg} ${bandStyle.text} mb-2`}>
                  {result.band}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {result.subjectType === "individual" ? "Individual" : "Company"} credit report — {result.idNumber}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {result.paymentHistory.onTimeRate}% on-time payments across{" "}
                  {result.paymentHistory.totalAccounts} account
                  {result.paymentHistory.totalAccounts === 1 ? "" : "s"}
                  {result.paymentHistory.missedPayments > 0 &&
                    ` · ${result.paymentHistory.missedPayments} overdue`}
                </p>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Contracts</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Lender</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Type</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.contracts.map((contract, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-white">{contract.lender}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{contract.type}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">
                        KES {contract.amount.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            contract.status === "Overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {contract.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">
              Pop in a name or ID above and we'll pull their credit report right here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditScoreCheck;
