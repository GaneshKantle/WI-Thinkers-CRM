import React from "react";
import {
  Home,
  Users,
  BookOpen,
  Sparkles,
  PieChart,
  FileText,
} from "lucide-react";

export default function Sidebar({
  open,
  setOpen,
  currentView,
  setCurrentView,
  setSelectedCustomer,
}) {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "submissions", icon: FileText, label: "Submissions" },
    { id: "overview", icon: BookOpen, label: "Overview" },
    { id: "help", icon: Sparkles, label: "Help" },
  ];

  return (
    <aside
      className={`
        bg-white
        fixed
        inset-0
        lg:static
        lg:inset-auto
        z-40
        w-64
        h-full
        lg:h-auto
        overflow-y-auto
        shadow-lg
        p-6
        transition-transform
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-indigo-600">
        <PieChart size={24} /> WI Thinkers
      </h2>
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id);
              setOpen(false);
              if (item.id === "customers") setSelectedCustomer(null);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              currentView === item.id
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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