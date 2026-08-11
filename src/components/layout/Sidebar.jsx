import React, { useState } from "react";
import {
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Users,
  FileText,
  Wallet,
  Settings,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    id: "verifications",
    icon: ShieldCheck,
    label: "Verifications",
    children: [
      { id: "verifications-new", label: "New Verification" },
      { id: "verifications", label: "History" },
    ],
  },
  {
    id: "customers",
    icon: Users,
    label: "Customers",
  },
  {
    id: "reports",
    icon: FileText,
    label: "Reports",
  },
  {
    id: "wallet",
    icon: Wallet,
    label: "Wallet & Billing",
  },
  {
    id: "settings",
    icon: Settings,
    label: "Settings",
  },
];

const Sidebar = ({
  collapsed,
  onToggle,
  currentPage,
  onPageChange,
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user, signOut } = useAuth();

  const handleMenuClick = (item) => {
    if (item.children) {
      setOpenDropdown(
        openDropdown === item.id ? null : item.id
      );
    }

    onPageChange(item.id);
  };

  return (
    <div
      className={`
        ${collapsed ? "w-20" : "w-72"}
        transition-all duration-300 ease-in-out
        bg-white/80
        dark:bg-slate-900/80
        backdrop-blur-xl
        border-r border-slate-200/50
        dark:border-slate-700/50
        flex flex-col h-screen
      `}
    >
      {/* Logo */}
      <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-center">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                  Nexus KYC
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Verification Suite
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            currentPage === item.id ||
            item.children?.some(
              (child) => child.id === currentPage
            );

          const isOpen = openDropdown === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`
                  w-full flex items-center
                  ${
                    collapsed
                      ? "justify-center"
                      : "justify-between"
                  }
                  p-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />

                  {!collapsed && (
                    <span className="font-medium">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}

                    {item.count && (
                      <span
                        className={`
                          text-xs px-2 py-1 rounded-full
                          ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }
                        `}
                      >
                        {item.count}
                      </span>
                    )}

                    {item.children && (
                      <ChevronDown
                        className={`
                          w-4 h-4 transition-transform duration-200
                          ${isOpen ? "rotate-180" : ""}
                        `}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Dropdown */}
              {!collapsed &&
                item.children &&
                isOpen && (
                  <div className="mt-2 ml-10 space-y-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() =>
                          onPageChange(child.id)
                        }
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                          ${
                            currentPage === child.id
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                              : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }
                        `}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
        <button
          onClick={signOut}
          title="Sign out"
          className="w-full flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-10 h-10 rounded-full ring-2 ring-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {(user?.email ?? "?").charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                  {user?.email}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sign out
                </p>
              </div>

              <LogOut className="w-4 h-4 text-slate-400 flex-shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;