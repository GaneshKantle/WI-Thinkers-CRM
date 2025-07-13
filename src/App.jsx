import React, { useState, useEffect } from "react";
import { Menu, Calendar } from "lucide-react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Customers from "./components/Customers";
import CustomerDetail from "./components/CustomerDetail";
import Submissions from "./components/Submissions";
import Overview from "./components/Overview";
import HelpPage from "./components/HelpPage";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState(() => {
    // Initialize from localStorage, default to "dashboard"
    return localStorage.getItem('currentView') || "dashboard";
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Update localStorage whenever currentView changes
  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  const renderView = () => {
    if (selectedCustomer) {
      return (
        <CustomerDetail
          customer={selectedCustomer}
          onBack={() => setSelectedCustomer(null)}
        />
      );
    }

    switch (currentView) {
      case "customers":
        return <Customers setSelectedCustomer={setSelectedCustomer} />;
      case "submissions":
        return <Submissions />;
      case "overview":
        return <Overview />;
      case "help":
        return <HelpPage />;
      default:
        return <Dashboard setSelectedCustomer={setSelectedCustomer} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
        setSelectedCustomer={setSelectedCustomer}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-slate-900 capitalize">
                {currentView === "dashboard" ? "Dashboard" : currentView}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <Calendar size={16} />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 overflow-auto max-w-full w-full">{renderView()}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
