import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import StatsGrid from "./components/Dashboards/StatsGrid";
import VerificationsTrendChart from "./components/Dashboards/VerificationsTrendChart";
import VerificationTypeChart from "./components/Dashboards/VerificationTypeChart";
import RecentVerificationsTable from "./components/Dashboards/RecentVerificationsTable";
import TopDocumentTypes from "./components/Dashboards/TopDocumentTypes";
import RecentActivity from "./components/Dashboards/RecentActivity";

import VerificationsList from "./components/Verifications/VerificationsList";
import NewVerification from "./components/Verifications/NewVerification";
import CreditScoreCheck from "./components/CreditScore/CreditScoreCheck";
import AuthPage from "./components/Auth/AuthPage";

import { useAuth } from "./context/AuthContext";
import { useVerifications } from "./hooks/useVerifications";
import { useWallet } from "./hooks/useWallet";
import { deriveDashboardStats } from "./utils/dashboardStats";

const App = () => {
  const { user, loading: authLoading } = useAuth();
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const { verifications, addVerification } = useVerifications();
  const { balance: walletBalance, debit } = useWallet();

  const handleFinishVerification = async (draft) => {
    await addVerification(draft);
    await debit(draft.cost);
    setCurrentPage("verifications");
  };

  const handleFinishCreditScore = async (draft) => {
    await addVerification(draft);
    await debit(draft.cost);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const stats = deriveDashboardStats(verifications);

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-50
        via-blue-50
        to-indigo-50
        dark:from-slate-900
        dark:via-slate-800
        dark:to-slate-900
        transition-all
        duration-500
      "
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() =>
            setSideBarCollapsed(!sideBarCollapsed)
          }
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentPage={currentPage}
            onNewVerificationClick={() => setCurrentPage("verifications-new")}
            onMenuClick={() =>
              setSideBarCollapsed(!sideBarCollapsed)
            }
          />

          <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900">
            <div className="p-6">

              {/* Dashboard */}
              {currentPage === "dashboard" && (
                <>
                  {/* Stats Cards */}
                  <StatsGrid stats={stats} walletBalance={walletBalance} />

                  {/* Charts */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                    <div className="xl:col-span-2">
                      <VerificationsTrendChart data={stats.trend} />
                    </div>

                    <div>
                      <VerificationTypeChart data={stats.typeBreakdown} />
                    </div>
                  </div>

                  {/* Verifications Table */}
                  <div className="mt-6">
                    <RecentVerificationsTable
                      verifications={verifications}
                      onViewAll={() => setCurrentPage("verifications")}
                    />
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                    <div className="xl:col-span-2">
                      <TopDocumentTypes data={stats.topDocumentTypes} />
                    </div>

                    <div>
                      <RecentActivity verifications={verifications} />
                    </div>
                  </div>
                </>
              )}

              {/* Verifications History */}
              {currentPage === "verifications" && (
                <VerificationsList
                  verifications={verifications}
                  onNewVerification={() => setCurrentPage("verifications-new")}
                />
              )}

              {/* New Verification */}
              {currentPage === "verifications-new" && (
                <NewVerification
                  walletBalance={walletBalance}
                  onFinish={handleFinishVerification}
                />
              )}

              {/* Credit Score */}
              {currentPage === "credit-score" && (
                <CreditScoreCheck
                  walletBalance={walletBalance}
                  onFinish={handleFinishCreditScore}
                />
              )}

              {/* Customers */}
              {currentPage === "customers" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Customers
                  </h2>
                </div>
              )}

              {/* Reports */}
              {currentPage === "reports" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Reports
                  </h2>
                </div>
              )}

              {/* Wallet & Billing */}
              {currentPage === "wallet" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Wallet & Billing
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Current balance: KES {walletBalance.toLocaleString()}.00
                  </p>
                </div>
              )}

              {/* Settings */}
              {currentPage === "settings" && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Settings
                  </h2>
                </div>
              )}

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
