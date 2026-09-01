import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Building2,
  Zap,
  ShieldCheck,
  FileText,
  Search,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { verifyWithXobriq } from "../../utils/xobriqClient";
import { VERIFICATION_COST } from "../../data/mockVerifications";
import { TYPE_LABELS } from "../../utils/verificationStatus";

const BAND_STYLES = {
  red: { ring: "border-red-500", text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  orange: { ring: "border-orange-500", text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" },
  blue: { ring: "border-blue-500", text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
  emerald: { ring: "border-emerald-500", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  slate: { ring: "border-slate-300 dark:border-slate-600", text: "text-slate-500 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-900" },
};

const GRADE_COLORS = {
  "A+": "emerald", A: "emerald", "A-": "emerald",
  "B+": "blue", B: "blue", "B-": "blue",
  "C+": "orange", C: "orange", "C-": "orange",
  D: "red", E: "red", F: "red",
};

const colorForGrade = (grade) => GRADE_COLORS[grade] ?? "slate";

const TREND_ICON = { up: TrendingUp, down: TrendingDown };

const PERFORMANCE_STYLES = {
  Performing: "bg-green-100 text-green-700",
  NonPerforming: "bg-red-100 text-red-700",
  Defaulted: "bg-red-100 text-red-700",
};

const formatMoney = (amount, currency) =>
  `${currency ?? "KES"} ${Number(amount ?? 0).toLocaleString()}`;

const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "—");

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
      const response = await verifyWithXobriq("credit_score", {
        subjectType,
        reference: idNumber,
      });
      setResult(response);
      setSaving(true);
      try {
        await onFinish({
          type: "credit_score",
          documentType: null,
          reference: idNumber,
          customerName: response.profile.fullName || TYPE_LABELS.credit_score,
          status: response.hasCreditHistory ? "match" : "no_match",
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

  const bandStyle = result ? BAND_STYLES[colorForGrade(result.grade)] : null;
  const TrendIcon = result ? TREND_ICON[result.scoreTrend] : null;

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
              Pull a bureau-verified credit score and full report for any individual or
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
                placeholder={subjectType === "individual" ? "e.g. 29184023" : "e.g. CPR/2014/475757"}
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
        ) : result && !result.hasCreditHistory ? (
          <div className="flex flex-col items-center text-center py-8">
            <Info className="w-8 h-8 text-slate-400 mb-3" />
            <p className="font-medium text-slate-800 dark:text-white">No credit history found</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
              {result.reasons.length > 0
                ? result.reasons.map((r) => r.label).join(", ")
                : "No bureau record exists for this ID."}
            </p>
          </div>
        ) : result ? (
          <div>
            <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
              {result.score !== null ? (
                <div className={`w-32 h-32 rounded-full border-8 ${bandStyle.ring} flex flex-col items-center justify-center flex-shrink-0`}>
                  <span className="text-3xl font-black text-slate-800 dark:text-white">{result.score}</span>
                  <span className="text-xs text-slate-400">Grade {result.grade}</span>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full border-8 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center flex-shrink-0 text-center px-2">
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Not scored</span>
                  {result.rawScore && (
                    <span className="text-xs text-slate-400">raw {result.rawScore}</span>
                  )}
                </div>
              )}
              <div>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${bandStyle.bg} ${bandStyle.text} mb-2`}>
                  {TrendIcon ? <TrendIcon className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                  Grade {result.grade}
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                  {result.profile.fullName || (subjectType === "individual" ? "Individual" : "Company")} —{" "}
                  {result.profile.idNumber}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {result.summary.openContracts ?? 0} open · {result.summary.closedContracts ?? 0} closed ·{" "}
                  {result.summary.inquiriesLast12Months ?? 0} inquiries (12mo) ·{" "}
                  {result.summary.activeDisputes ?? 0} disputes
                </p>
              </div>
            </div>

            {result.reasons.length > 0 && (
              <div className="flex items-start gap-2 p-3 mb-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-sm text-orange-700 dark:text-orange-400">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{result.reasons.map((r) => r.label).join(", ")}</span>
              </div>
            )}

            {(result.profile.phone || result.profile.email || result.profile.address || result.profile.dateOfBirthOrRegistration) && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {result.profile.dateOfBirthOrRegistration && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      {subjectType === "individual" ? "Date of Birth" : "Registered"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {formatDate(result.profile.dateOfBirthOrRegistration)}
                    </p>
                  </div>
                )}
                {result.profile.phone && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Phone</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{result.profile.phone}</p>
                  </div>
                )}
                {result.profile.email && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Email</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{result.profile.email}</p>
                  </div>
                )}
                {result.profile.address && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Address</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">{result.profile.address}</p>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                { label: "Open Contracts", value: result.summary.openContracts },
                { label: "Closed Contracts", value: result.summary.closedContracts },
                { label: "Overdue Amount", value: formatMoney(result.summary.overdueAmount, result.summary.currency) },
                { label: "Inquiries (12mo)", value: result.summary.inquiriesLast12Months },
                { label: "Active Disputes", value: result.summary.activeDisputes },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-center">
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{stat.value ?? "—"}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {result.scoreHistory.length > 0 && (
              <>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Score History</h4>
                <div className="flex flex-wrap gap-3 mb-8">
                  {result.scoreHistory.map((entry, index) => (
                    <div key={index} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-sm">
                      <span className="text-slate-500 dark:text-slate-400">{entry.date}</span>{" "}
                      <span className="font-semibold text-slate-800 dark:text-white">{entry.score}</span>{" "}
                      <span className="text-slate-400">({entry.grade})</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Contracts</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Subscriber</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Product</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Outstanding</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Overdue</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {result.contracts.map((contract, index) => (
                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-white">{contract.subscriber}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{contract.productType}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">
                        {formatMoney(contract.outstandingAmount, contract.currency)}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">
                        {contract.overdueAmount > 0
                          ? `${formatMoney(contract.overdueAmount, contract.currency)} (${contract.daysInArrears}d)`
                          : "—"}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{contract.status}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            PERFORMANCE_STYLES[contract.performingIndicator] ?? "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {contract.performingIndicator ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {result.contracts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-500 dark:text-slate-400">
                        No contracts on file.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {result.providerMessage && (
              <p className="text-xs text-slate-400 mt-4">
                Bureau response: {result.providerMessage}
                {result.ref && ` · Ref: ${result.ref}`}
              </p>
            )}
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
