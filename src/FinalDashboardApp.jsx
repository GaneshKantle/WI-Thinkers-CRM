
import { useState } from "react";
import { Mail, Phone, BookOpen, ArrowRight, PieChart, Home, Users, Book, User, ShoppingCart, Eye } from "lucide-react";
import { CUSTOMERS } from "./customers";

function Sidebar({ open, setOpen, currentView, setCurrentView }) {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "overview", icon: BookOpen, label: "Overview" },
  ];

  return (
    <aside
      className={`bg-white dark:bg-slate-900 w-64 lg:static fixed top-0 left-0 h-full shadow-lg p-6 transition-transform z-40 ${
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-indigo-600 dark:text-white">
        <PieChart size={24} /> WI Thinkers
      </h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id);
              setOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function StatCard({ icon: Icon, label, value, breakdown, color = "indigo" }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="relative">
      <div
        className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border-2 hover:shadow-md transition-all cursor-pointer ${
          breakdown && breakdown.length > 0 ? "hover:border-indigo-300" : ""
        }`}
        onMouseEnter={() =>
          breakdown && breakdown.length > 0 && setShowBreakdown(true)
        }
        onMouseLeave={() => setShowBreakdown(false)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
          )}
        </div>

        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Breakdown:</p>
            <div className="space-y-1">
              {breakdown.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  <span className="font-medium">
                    {typeof item.value === "number"
                      ? `$${item.value.toFixed(2)}`
                      : item.value}
                  </span>
                </div>
              ))}
              {breakdown.length > 3 && (
                <p className="text-xs text-slate-400">+{breakdown.length - 3} more...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showBreakdown && breakdown && breakdown.length > 0 && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-xl z-20">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
            Detailed Breakdown
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {typeof item.value === "number"
                    ? `$${item.value.toFixed(2)}`
                    : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <div className="flex dark:bg-slate-950">
      <Sidebar open={open} setOpen={setOpen} currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-6">
        {currentView === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={User}
              label="Total Customers"
              value={CUSTOMERS.length}
              color="indigo"
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Buyers"
              value={CUSTOMERS.filter(c => c.status === "Buyer").length}
              color="green"
            />
            <StatCard
              icon={Eye}
              label="Total Viewers"
              value={CUSTOMERS.filter(c => c.status === "Viewer").length}
              color="blue"
            />
            <StatCard
              icon={Book}
              label="Magazines"
              value="Summary"
              color="orange"
              breakdown={[
                { name: "Alphero", value: CUSTOMERS.filter(c => c.magazine === "Alphero").length },
                { name: "Blackcruze", value: CUSTOMERS.filter(c => c.magazine === "Blackcruze").length },
              ]}
            />
          </div>
        )}
      </main>
    </div>
  );
}
