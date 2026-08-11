import React, { useState } from "react";
import { ShieldCheck, Loader2, User, AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const INDUSTRIES = [
  "Banking & Finance",
  "Fintech",
  "Insurance",
  "Telecommunications",
  "Government & Public Sector",
  "Legal Services",
  "Retail & E-commerce",
  "Healthcare",
  "Real Estate",
  "Other",
];

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.66-.22-2.44H12v4.62h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24z" />
    <path fill="#FBBC05" d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.27a12 12 0 0 0 0 10.74l4-3.1z" />
    <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.63l4 3.1C6.22 6.88 8.87 4.77 12 4.77z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <rect x="1" y="1" width="10" height="10" fill="#F25022" />
    <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
    <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
    <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
  </svg>
);

const AuthPage = () => {
  const { signIn, signUp, signInWithOAuth } = useAuth();
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [oauthProvider, setOauthProvider] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const switchMode = (next) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleOAuth = async (provider) => {
    setError(null);
    setOauthProvider(provider);
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError(err.message);
      setOauthProvider(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (mode === "signup" && !PASSWORD_RULE.test(password)) {
      setError("Password must be 12+ characters with upper, lower, number and symbol.");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        await signIn(email, password);
      } else {
        const { needsEmailConfirmation } = await signUp(email, password, {
          full_name: fullName,
          industry,
        });
        if (needsEmailConfirmation) {
          setNotice("Account created. Check your inbox to confirm your email, then log in.");
          switchMode("login");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {mode === "signup" ? "Create your Nexus KYC Account" : "Welcome back to Nexus KYC"}
          </h1>

          <p className="text-slate-400 mt-2">
            {mode === "signup"
              ? "Join the next generation of autonomous enterprise intelligence."
              : "Log in to access your verification dashboard."}
          </p>
        </div>

        <div className="bg-[#0f1729] border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth("google")}
              disabled={Boolean(oauthProvider)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-[#141d33] text-slate-200 text-xs font-semibold tracking-wide hover:bg-[#1a2540] transition-colors disabled:opacity-60"
            >
              {oauthProvider === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
              CONTINUE WITH GOOGLE
            </button>

            <button
              type="button"
              onClick={() => handleOAuth("azure")}
              disabled={Boolean(oauthProvider)}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-700 bg-[#141d33] text-slate-200 text-xs font-semibold tracking-wide hover:bg-[#1a2540] transition-colors disabled:opacity-60"
            >
              {oauthProvider === "azure" ? <Loader2 className="w-4 h-4 animate-spin" /> : <MicrosoftIcon />}
              MICROSOFT AZURE SSO
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-800" />
            <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              {mode === "signup" ? "Or register with work email" : "Or log in with email"}
            </span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {notice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-900/30 border border-emerald-800 text-sm text-emerald-400">
              {notice}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/30 border border-red-800 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141d33] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                {mode === "signup" ? "Work email" : "Email"}
              </label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#141d33] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {mode === "signup" && (
                <p className="text-xs text-slate-500 mt-1">Domain must match a registered corporate entity.</p>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                  Industry selection
                </label>
                <select
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#141d33] border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select your industry…
                  </option>
                  {INDUSTRIES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={mode === "signup" ? 12 : 6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#141d33] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-xs text-slate-500 mt-1">
                  12+ characters with upper, lower, number and symbol.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-900/40 transition-all disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "signup" ? "Create Account →" : "Log in →"}
            </button>

            {mode === "signup" && (
              <p className="text-xs text-slate-500 text-center">
                By clicking "Create Account" you agree to our{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">User Policy</span> and{" "}
                <span className="text-blue-400 hover:underline cursor-pointer">Privacy Statement</span>.
              </p>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          {mode === "signup" ? "Already have an account?" : "New to Nexus KYC?"}{" "}
          <button
            onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
            className="text-blue-400 font-medium hover:underline"
          >
            {mode === "signup" ? "Log in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
