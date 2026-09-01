import React from "react";
// import React, { useEffect, useState } from "react";
// import { Sun, Moon } from "lucide-react";
import {
  Menu,
  Search,
  Plus,
  Sun,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  verifications: "Verifications",
  "verifications-new": "New Verification",
  "credit-score": "Credit Score",
  customers: "Customers",
  reports: "Reports",
  wallet: "Wallet & Billing",
  settings: "Settings",
};

const Header = ({
  currentPage = "dashboard",
  onMenuClick,
  onNewVerificationClick,
}) => {
  const { user } = useAuth();

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4">
      <div className="flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-2xl font-black text-slate-800 dark:text-white">
              {PAGE_TITLES[currentPage] ?? "Dashboard"}
            </h1>

            <p className="text-slate-500 dark:text-slate-400">
              Welcome back! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search Anything"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />

            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">

          {/* New Verification Button */}
          <button
            onClick={onNewVerificationClick}
            className="hidden lg:flex items-center space-x-2 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm font-medium">New Verification</span>
          </button>

          {/* Theme Toggle */}
          <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Sun className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5" />

            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full ring-2 ring-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {(user?.email ?? "?").charAt(0).toUpperCase()}
            </div>

            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-800 dark:text-white">
                {user?.email}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Administrator
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;