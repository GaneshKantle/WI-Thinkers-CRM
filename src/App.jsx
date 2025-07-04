import React, { useState, useMemo } from "react";
import { CUSTOMERS } from "./customers_updated_200";
import {
  Menu,
  X,
  Users,
  DollarSign,
  Eye,
  BookOpen,
  PieChart,
  Home,
  Sparkles,
  ShoppingCart,
  TrendingUp,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Star,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart as RPie,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

const buyersPerMagazine = [
  {
    name: "Alphero",
    value: CUSTOMERS.filter(
      (c) => c.magazine === "Alphero" && c.status === "Buyer"
    ).length,
  },
  {
    name: "Blackcruze",
    value: CUSTOMERS.filter(
      (c) => c.magazine === "Blackcruze" && c.status === "Buyer"
    ).length,
  },
];

const COLORS = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#facc15",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
];

// Surprise feature: Add a Help page to assist users
function HelpPage() {
  return (
    <div className="bg-white shadow-sm border rounded-xl p-6 max-w-2xl mx-auto mt-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Help & Support</h2>
      <p className="text-slate-600 mb-2">
        Welcome to WI Thinkers! If you have questions or face issues while
        navigating the dashboard, please check the following resources:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-slate-600">
        <li>Make sure you are connected to the internet.</li>
        <li>Use the sidebar to access Dashboard, Customers, and Overview.</li>
        <li>
          To view customer details, use the "View Details" button on any table
          row.
        </li>
        <li>
          If you're on mobile and the sidebar seems cut off, tap the hamburger
          icon again to close it.
        </li>
      </ul>
      <p className="text-slate-500 mt-4 text-sm">
        For further support, contact us at{" "}
        <a
          href="mailto:support@withinkers.com"
          className="text-indigo-600 underline"
        >
          support@withinkers.com
        </a>
      </p>
    </div>
  );
}

function Sidebar({
  open,
  setOpen,
  currentView,
  setCurrentView,
  setSelectedCustomer,
}) {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "customers", icon: Users, label: "Customers" },
    { id: "overview", icon: BookOpen, label: "Overview" },
    { id: "help", icon: Sparkles, label: "Help" }, // new page
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
        className={`bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-md transition-all cursor-pointer ${
          breakdown && breakdown.length > 0 ? "hover:border-indigo-300" : ""
        }`}
        onMouseEnter={() =>
          breakdown && breakdown.length > 0 && setShowBreakdown(true)
        }
        onMouseLeave={() => setShowBreakdown(false)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
          )}
        </div>

        {/* Default breakdown text */}
        {breakdown && breakdown.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Breakdown:</p>
            <div className="space-y-1">
              {breakdown.slice(0, 3).map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-600">{item.name}</span>
                  <span className="font-medium">
                    {typeof item.value === "number"
                      ? item.value.toFixed(2)
                      : item.value}
                  </span>
                </div>
              ))}
              {breakdown.length > 3 && (
                <p className="text-xs text-slate-400">
                  +{breakdown.length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Hover breakdown popup */}
      {showBreakdown && breakdown && breakdown.length > 0 && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-20">
          <h4 className="font-semibold text-slate-900 mb-3">
            Detailed Breakdown
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {breakdown.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <span className="text-slate-700">{item.name}</span>
                <span className="font-medium text-slate-900">
                  {typeof item.value === "number"
                    ? item.value.toFixed(2)
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

function extractInstagramHandle(insta) {
  if (!insta || insta === "-") return "-";
  try {
    const cleaned = insta.trim().toLowerCase();
    const url = new URL(
      cleaned.startsWith("http")
        ? cleaned
        : `https://${cleaned.replace(/^www\./, "")}`
    );
    const parts = url.pathname.split("/").filter(Boolean);
    return parts[0] ? `@${parts[0]}` : "-";
  } catch {
    // Not a URL — treat it as handle
    return insta.startsWith("@")
      ? insta
      : `@${
          insta
            .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
            .split("/")[0]
        }`;
  }
}

function extractInstagramUrl(insta) {
  if (!insta || insta === "-") return null;
  try {
    const cleaned = insta.trim().toLowerCase();
    if (cleaned.startsWith("http")) {
      const url = new URL(cleaned);
      const username = url.pathname.split("/").filter(Boolean)[0];
      return username ? `https://instagram.com/${username}` : null;
    }
    const username = cleaned.replace(/^@/, "").replace(/^www\./, "");
    return `https://instagram.com/${username}`;
  } catch {
    return null;
  }
}

function Dashboard({ setSelectedCustomer }) {
  // Flatten all magazine arrays and deduplicate
  const magazines = Array.from(new Set(CUSTOMERS.flatMap((c) => c.magazine)));

  const totalSales = CUSTOMERS.filter((c) => c.status === "Buyer").reduce(
    (s, c) => s + (c.totalAmount || 0),
    0
  );

  const totalBuyers = CUSTOMERS.filter((c) => c.status === "Buyer").length;
  const totalViewers = CUSTOMERS.filter((c) => c.status === "Viewer").length;
  const totalCustomers = CUSTOMERS.length;

  // Deduplicate magazine breakdowns
  const salesBreakdown = magazines.map((m) => ({
    name: m,
    value: CUSTOMERS.filter(
      (c) => c.status === "Buyer" && c.magazine.includes(m)
    ).reduce(
      (s, c) =>
        s +
        (c.transactions
          ?.filter((t) => t.vendor === m)
          .reduce((sum, t) => sum + t.amount, 0) || 0),
      0
    ),
  }));

  const customerBreakdown = magazines.map((m) => ({
    name: m,
    value: CUSTOMERS.filter((c) => c.magazine.includes(m)).length,
  }));

  const viewerBreakdown = magazines.map((m) => ({
    name: m,
    value: CUSTOMERS.filter(
      (c) => c.status === "Viewer" && c.magazine.includes(m)
    ).length,
  }));

  const buyerBreakdown = magazines.map((m) => ({
    name: m,
    value: CUSTOMERS.filter(
      (c) => c.status === "Buyer" && c.magazine.includes(m)
    ).length,
  }));

  const topCustomers = useMemo(() => {
    const totals = {};
    CUSTOMERS.filter((c) => c.status === "Buyer").forEach((c) => {
      totals[c.email] = (totals[c.email] || 0) + (c.totalAmount || 0);
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([email, amt]) => {
        const cust = CUSTOMERS.find((c) => c.email === email);
        return { ...cust, total: amt };
      });
  }, []);

  // Enhanced chart data with proper labeling
  const enhancedSalesData = salesBreakdown.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
    label: `${item.name}: ${item.value.toFixed(0)}`,
  }));

  const monthlyTrend = [
    { month: "Jan", sales: 1200, customers: 45 },
    { month: "Feb", sales: 1800, customers: 52 },
    { month: "Mar", sales: 1500, customers: 48 },
    { month: "Apr", sales: 2200, customers: 65 },
    { month: "May", sales: 1900, customers: 58 },
    { month: "Jun", sales: 2500, customers: 72 },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={DollarSign}
          label="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          breakdown={salesBreakdown}
          color="indigo"
        />
        <StatCard
          icon={Users}
          label="Total Customers"
          value={totalCustomers}
          breakdown={customerBreakdown}
          color="green"
        />
        <StatCard
          icon={ShoppingCart}
          label="Total Buyers"
          value={totalBuyers}
          breakdown={buyerBreakdown}
          color="orange"
        />
        <StatCard
          icon={Eye}
          label="Total Viewers"
          value={totalViewers}
          breakdown={viewerBreakdown}
          color="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Enhanced Sales Trend */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-slate-900">
              Sales by Magazine
            </h3>
            <TrendingUp className="text-indigo-600" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={enhancedSalesData}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="#64748b"
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value, name) => [`$${value.toFixed(2)}`, "Sales"]}
                labelStyle={{ color: "#1e293b" }}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-semibold text-slate-900">
              Monthly Performance
            </h3>
            <Calendar className="text-indigo-600" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={monthlyTrend}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                name="Sales ($)"
              />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Customers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customers - Cards on mobile, table on md+ */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Cards for mobile */}
        <div className="block md:hidden space-y-4 p-4">
          {topCustomers.length === 0 && (
            <div className="text-center text-slate-400">
              No top customers found.
            </div>
          )}
          {topCustomers.map((customer, index) => (
            <div
              key={customer.id || index}
              className="border rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0
                      ? "bg-yellow-100 text-yellow-800"
                      : index === 1
                      ? "bg-gray-100 text-gray-800"
                      : index === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && <Star size={14} className="text-yellow-500" />}
                <span className="font-medium text-slate-900 ml-2">
                  {customer.name || "-"}
                </span>
                <span className="text-xs text-slate-500 ml-auto">
                  {customer.address || "-"}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                <Mail size={12} className="inline mr-1" />
                <a
                  href={`mailto:${customer.email}`}
                  className="underline text-blue-600"
                >
                  {customer.email || "-"}
                </a>
                <span className="ml-2">
                  <Phone size={12} className="inline mr-1" />
                  {customer.phone || "-"}
                </span>
                {/* Instagram handle with clickable link */}
                <span className="ml-2 text-pink-600">
                  {extractInstagramUrl(customer.instagram) ? (
                    <>
                      <svg
                        className="inline mr-1"
                        width="14"
                        height="14"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.5.4.6.2 1.1.5 1.6.9.5.4.7 1 .9 1.6.2.5.3 1.3.4 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.4 2.5-.2.6-.5 1.1-.9 1.6-.4.5-1 .7-1.6.9-.5.2-1.3.3-2.5.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1.1-.5-1.6-.9-.5-.4-.7-1-.9-1.6-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .4-2.5.2-.6.5-1.1.9-1.6.4-.5 1-.7 1.6-.9.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.2.1-1.9.3-2.3.5-.6.2-1 .5-1.4.9-.4.4-.6.9-.9 1.4-.2.4-.4 1.1-.5 2.3-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.2.3 1.9.5 2.3.2.6.5 1 .9 1.4.4.4.9.6 1.4.9.4.2 1.1.4 2.3.5 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.2-.1 1.9-.3 2.3-.5.6-.2 1-.5 1.4-.9.4-.4.6-.9.9-1.4.2-.4.4-1.1.5-2.3.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.2-.3-1.9-.5-2.3-.2-.6-.5-1-.9-1.4-.4-.4-.9-.6-1.4-.9-.4-.2-1.1-.4-2.3-.5-1.3-.1-1.7-.1-4.8-.1zm0 3.7a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm4.7-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                      </svg>
                      <a
                        href={extractInstagramUrl(customer.instagram)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {extractInstagramHandle(customer.instagram)}
                      </a>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {Array.isArray(customer.magazine)
                    ? customer.magazine.join(", ")
                    : customer.magazine || "-"}
                </span>
                <span className="font-semibold text-slate-900 ml-auto">
                  $
                  {customer.total?.toFixed(2) ||
                    customer.totalAmount?.toFixed(2) ||
                    "0.00"}
                </span>
              </div>
              <button
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors mt-2 self-end"
                onClick={() => setSelectedCustomer(customer)}
              >
                View Profile
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
        {/* Table for md+ */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-700">
                  Rank
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Magazine
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Total Spent
                </th>
                <th className="text-right p-4 font-medium text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => {
                // ...existing code...
                return (
                  <tr
                    key={customer.id || index}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : index === 1
                              ? "bg-gray-100 text-gray-800"
                              : index === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        {index < 3 && (
                          <Star size={14} className="text-yellow-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-slate-900">
                          {customer.name || "-"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {customer.address || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={12} />
                          <a
                            href={`mailto:${customer.email}`}
                            className="underline text-blue-600"
                          >
                            {customer.email || "-"}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={12} />
                          <a
                            href={`tel:${customer.phone || "-"}`}
                            className="underline text-green-600"
                          >
                            {customer.phone || "-"}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-pink-600">
                          <svg
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.2c3.2 0 3.6 0 4.9.1... [SVG PATH TRUNCATED FOR BREVITY] ..." />
                          </svg>
                          {extractInstagramUrl(customer.instagram) ? (
                            <a
                              href={extractInstagramUrl(customer.instagram)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {extractInstagramHandle(customer.instagram)}
                            </a>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {Array.isArray(customer.magazine)
                          ? customer.magazine.join(", ")
                          : customer.magazine || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {`$${customer.total?.toFixed(2) || customer.totalAmount?.toFixed(2) || "0.00"}`}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        View Profile
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Surprise Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-center gap-4 text-white text-center">
          <Sparkles size={32} className="animate-pulse" />
          <div>
            <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
            <p className="text-lg opacity-90">
              You've achieved <strong>${totalSales.toFixed(0)}</strong> in total
              sales with <strong>{totalCustomers}</strong> customers!
            </p>
            <p className="text-sm opacity-75 mt-2">
              Your top magazine "{salesBreakdown[0]?.name}" generated $
              {salesBreakdown[0]?.value.toFixed(0)} in revenue! 🚀
            </p>
          </div>
          <Target size={32} className="animate-bounce" />
        </div>
      </div>
    </div>
  );
}

function Customers({ setSelectedCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  let filteredCustomers = [];
  try {
    filteredCustomers = CUSTOMERS.filter((customer) => {
      const name = customer.name?.toLowerCase().trim() || "";
      const email = customer.email?.toLowerCase().trim() || "";
      let status = customer.status?.toLowerCase().trim() || "";
      // If status is buyer but amount is 0, treat as viewer
      if (
        status === "buyer" &&
        (!customer.totalAmount || customer.totalAmount === 0)
      )
        status = "viewer";
      const search = searchTerm.toLowerCase().trim();
      const filterStatus = statusFilter.toLowerCase().trim();
      const matchesSearch = name.includes(search) || email.includes(search);
      const matchesStatus = filterStatus === "all" || status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  } catch (e) {
    filteredCustomers = [];
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
          >
            <option value="All">All Status</option>
            <option value="Buyer">Buyer</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-600" size={20} />
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="text-xl font-semibold">
                {filteredCustomers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <ShoppingCart className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-slate-500">Buyers</p>
              <p className="text-xl font-semibold">
                {
                  filteredCustomers.filter(
                    (c) => c.status === "Buyer" && c.totalAmount > 0
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Eye className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-slate-500">Viewers</p>
              <p className="text-xl font-semibold">
                {
                  filteredCustomers.filter(
                    (c) =>
                      c.status === "Viewer" ||
                      (c.status === "Buyer" &&
                        (!c.totalAmount || c.totalAmount === 0))
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Customer List - Cards on mobile, table on md+ */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Cards for mobile */}
        <div className="block md:hidden space-y-4 p-4">
          {filteredCustomers.length === 0 && (
            <div className="text-center text-slate-400">
              No customers found.
            </div>
          )}
          {filteredCustomers.map((customer) => {
            let status = customer.status;
            if (
              status === "Buyer" &&
              (!customer.totalAmount || customer.totalAmount === 0)
            )
              status = "Viewer";
            return (
              <div
                key={customer.id || customer.email}
                className="border rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">
                      {customer.name || "-"}
                    </div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin size={12} />
                      {customer.address || customer.location || "-"}
                    </div>
                  </div>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    View Details
                    <ArrowRight size={14} />
                  </button>
                </div>
                <div className="text-sm text-slate-600 flex flex-wrap gap-2 items-center">
                  <a
                    href={`mailto:${customer.email || "-"}`}
                    className="underline text-blue-600"
                  >
                    {customer.email || "-"}
                  </a>
                  <a
                    href={`tel:${customer.phone || "-"}`}
                    className="underline text-green-600"
                  >
                    {customer.phone || "-"}
                  </a>
                  {extractInstagramUrl(customer.instagram) ? (
                    <a
                      href={extractInstagramUrl(customer.instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-pink-600"
                    >
                      {extractInstagramHandle(customer.instagram)}
                    </a>
                  ) : (
                    <span className="text-pink-600">-</span>
                  )}
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {Array.isArray(customer.magazine)
                      ? customer.magazine.join(", ")
                      : customer.magazine || "-"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      status === "Buyer"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {status || "-"}
                  </span>
                  <span className="font-semibold text-slate-900 ml-auto">
                    {status === "Buyer"
                      ? `$${customer.totalAmount?.toFixed(2) || "0.00"}`
                      : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {/* Table for md+ */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-700">
                  Customer
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Contact
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Magazine
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Amount
                </th>
                <th className="text-right p-4 font-medium text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => {
                let status = customer.status;
                if (
                  status === "Buyer" &&
                  (!customer.totalAmount || customer.totalAmount === 0)
                )
                  status = "Viewer";
                return (
                  <tr
                    key={customer.id || customer.email}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-slate-900">
                          {customer.name || "-"}
                        </div>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <MapPin size={12} />
                          {customer.address || customer.location || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail size={12} />
                          <a
                            href={`mailto:${customer.email}`}
                            className="underline text-blue-600"
                          >
                            {customer.email || "-"}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone size={12} />
                          <a
                            href={`tel:${customer.phone || "-"}`}
                            className="underline text-green-600"
                          >
                            {customer.phone || "-"}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-pink-600">
                          {/* Instagram icon */}
                          <svg
                            width="14"
                            height="14"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.5.4.6.2 1.1.5 1.6.9.5.4.7 1 .9 1.6.2.5.3 1.3.4 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.4 2.5-.2.6-.5 1.1-.9 1.6-.4.5-1 .7-1.6.9-.5.2-1.3.3-2.5.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1.1-.5-1.6-.9-.5-.4-.7-1-.9-1.6-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .4-2.5.2-.6.5-1.1.9-1.6.4-.5 1-.7 1.6-.9.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.2.1-1.9.3-2.3.5-.6.2-1 .5-1.4.9-.4.4-.6.9-.9 1.4-.2.4-.4 1.1-.5 2.3-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.2.3 1.9.5 2.3.2.6.5 1 .9 1.4.4.4.9.6 1.4.9.4.2 1.1.4 2.3.5 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.2-.1 1.9-.3 2.3-.5.6-.2 1-.5 1.4-.9.4-.4.6-.9.9-1.4.2-.4.4-1.1.5-2.3.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.2-.3-1.9-.5-2.3-.2-.6-.5-1-.9-1.4-.4-.4-.9-.6-1.4-.9-.4-.2-1.1-.4-2.3-.5-1.3-.1-1.7-.1-4.8-.1zm0 3.7a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm4.7-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                          </svg>

                          {(() => {
                            const igUrl = extractInstagramUrl(
                              customer.instagram
                            );
                            const igHandle = extractInstagramHandle(
                              customer.instagram
                            );

                            return igUrl ? (
                              <a
                                href={igUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {igHandle}
                              </a>
                            ) : (
                              <span>-</span>
                            );
                          })()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {Array.isArray(customer.magazine)
                          ? customer.magazine.join(", ")
                          : customer.magazine || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === "Buyer"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {status || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {status === "Buyer"
                          ? `$${customer.totalAmount?.toFixed(2) || "0.00"}`
                          : "-"}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        View Details
                        <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CustomerDetail({ customer, onBack }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowRight size={20} className="rotate-180" />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Customer Details</h2>
      </div>
      {/* Customer Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {customer.name}
              </h3>
              <p className="text-slate-500">{customer.email}</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="text-slate-400" size={16} />
                <span className="text-slate-600">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-slate-400" size={16} />
                <span className="text-slate-600">{customer.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="text-slate-400" size={16} />
                <span className="text-slate-600">
                  {Array.isArray(customer.magazine)
                    ? customer.magazine.join(", ")
                    : customer.magazine}
                </span>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500">Status</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === "Buyer" && customer.totalAmount > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {customer.status === "Buyer" && customer.totalAmount > 0
                      ? "Buyer"
                      : "Viewer"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Spent</span>
                  <span className="font-semibold text-slate-900">
                    {customer.status === "Buyer" && customer.totalAmount > 0
                      ? `$${customer.totalAmount.toFixed(2)}`
                      : "$0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Activity & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Purchase History */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600" />
              Purchase History
            </h4>
            {customer.status === "Buyer" &&
            Array.isArray(customer.transactions) &&
            customer.transactions.length > 0 &&
            customer.totalAmount > 0 ? (
              <div className="space-y-3">
                {customer.transactions.map((txn, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">
                        {txn.vendor}
                      </div>
                      {/* If you have a date field in transaction, show it here */}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        ${txn.amount.toFixed(2)}
                      </div>
                      <div className="text-sm text-green-600">Completed</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 bg-slate-100 rounded-lg mt-2">
                  <div className="font-medium text-slate-900">Total Spent</div>
                  <div className="font-semibold text-slate-900">
                    ${customer.totalAmount?.toFixed(2) ?? "0.00"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <Eye size={48} className="mx-auto mb-3 opacity-50" />
                <p>
                  This customer is a viewer and hasn't made any purchases yet.
                </p>
              </div>
            )}
          </div>
          {/* Engagement Stats */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              Engagement Overview
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {customer.status === "Buyer" && customer.totalAmount > 0
                    ? customer.transactions.length
                    : "0"}
                </div>
                <div className="text-sm text-slate-600">Purchases</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(Math.random() * 10 + 1)}
                </div>
                <div className="text-sm text-slate-600">Page Views</div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
  <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4>

  <div className="flex flex-wrap gap-3">
    {/* ✉️  E‑mail */}
    <a
      href={`mailto:${customer.email}`}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      <Mail size={16} />
      Send&nbsp;Email
    </a>

    {/* 📞  Phone */}
    <a
      href={`tel:${customer.phone}`}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Phone size={16} />
      Call&nbsp;Customer
    </a>

    {/* 📸  Instagram */}
    {extractInstagramUrl(customer.instagram) && (
      <a
        href={extractInstagramUrl(customer.instagram)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
      >
        {/* use your own icon set or keep the svg */}
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.5.4.6.2 1.1.5 1.6.9.5.4.7 1 .9 1.6.2.5.3 1.3.4 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.4 2.5-.2.6-.5 1.1-.9 1.6-.4.5-1 .7-1.6.9-.5.2-1.3.3-2.5.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1.1-.5-1.6-.9-.5-.4-.7-1-.9-1.6-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .4-2.5.2-.6.5-1.1.9-1.6.4-.5 1-.7 1.6-.9.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.2.1-1.9.3-2.3.5-.6.2-1 .5-1.4.9-.4.4-.6.9-.9 1.4-.2.4-.4 1.1-.5 2.3-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.2.3 1.9.5 2.3.2.6.5 1 .9 1.4.4.4.9.6 1.4.9.4.2 1.1.4 2.3.5 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.2-.1 1.9-.3 2.3-.5.6-.2 1-.5 1.4-.9.4-.4.6-.9.9-1.4.2-.4.4-1.1.5-2.3.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.2-.3-1.9-.5-2.3-.2-.6-.5-1-.9-1.4-.4-.4-.9-.6-1.4-.9-.4-.2-1.1-.4-2.3-.5-1.3-.1-1.7-.1-4.8-.1zm0 3.7a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm4.7-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
        </svg>
        {extractInstagramHandle(customer.instagram)}
      </a>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
}

function Overview() {
  const magazineStats = [...new Set(CUSTOMERS.flatMap((c) => c.magazine))].map(
    (magazine) => {
      const customers = CUSTOMERS.filter(
        (c) => Array.isArray(c.magazine) && c.magazine.includes(magazine)
      );
      const buyers = customers.filter(
        (c) => c.status === "Buyer" && c.totalAmount > 0
      );
      const viewers = customers.filter(
        (c) =>
          c.status === "Viewer" ||
          (c.status === "Buyer" && (!c.totalAmount || c.totalAmount === 0))
      );
      const revenue = buyers.reduce((sum, c) => sum + (c.totalAmount || 0), 0);
      return {
        name: magazine,
        totalCustomers: customers.length,
        buyers: buyers.length,
        viewers: viewers.length,
        revenue,
        conversionRate:
          customers.length > 0
            ? ((buyers.length / customers.length) * 100).toFixed(1)
            : "0.0",
        buyersList: buyers,
        viewersList: viewers,
      };
    }
  );
  const totalRevenue = magazineStats.reduce(
    (sum, mag) => sum + (mag.revenue || 0),
    0
  );
  const avgConversion =
    magazineStats.length > 0
      ? (
          magazineStats.reduce(
            (sum, mag) => sum + parseFloat(mag.conversionRate),
            0
          ) / magazineStats.length
        ).toFixed(1)
      : "0.0";
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Business Overview</h2>
        <div className="text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <BookOpen className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Magazines</p>
              <p className="text-2xl font-bold text-slate-900">
                {magazineStats.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg Conversion</p>
              <p className="text-2xl font-bold text-slate-900">
                {avgConversion}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="text-orange-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900">
                {CUSTOMERS.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Magazine Performance - Cards on mobile, table on md+ */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {/* Cards for mobile */}
        <div className="block md:hidden space-y-4 p-4">
          {magazineStats.length === 0 && (
            <div className="text-center text-slate-400">
              No magazines found.
            </div>
          )}
          {magazineStats.map((magazine, index) => (
            <div
              key={magazine.name}
              className="border rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-indigo-600" size={16} />
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {magazine.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    Publication #{index + 1}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="font-semibold text-slate-900">
                  Customers: {magazine.totalCustomers}
                </span>
                <span className="font-semibold text-green-600">
                  Buyers: {magazine.buyers}
                </span>
                <span className="font-semibold text-blue-600">
                  Viewers: {magazine.viewers}
                </span>
                <span className="font-semibold text-slate-900">
                  Revenue: ${magazine.revenue.toFixed(2)}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(magazine.conversionRate) >= 50
                      ? "bg-green-100 text-green-800"
                      : parseFloat(magazine.conversionRate) >= 30
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {magazine.conversionRate}%
                </span>
              </div>
              {/* <div className="text-xs text-slate-500 mt-2">
                <strong>Buyers:</strong> {magazine.buyersList.map(b => b.name).join(', ') || '-'}<br/>
                <strong>Viewers:</strong> {magazine.viewersList.map(v => v.name).join(', ') || '-'}
              </div> */}
            </div>
          ))}
        </div>
        {/* Table for md+ */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[600px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-medium text-slate-700">
                  Magazine
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Total Customers
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Buyers
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Viewers
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Revenue
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {magazineStats.map((magazine, index) => (
                <tr
                  key={magazine.name}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-indigo-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {magazine.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          Publication #{index + 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">
                      {magazine.totalCustomers}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="text-green-600" size={16} />
                      <span className="font-semibold text-green-600">
                        {magazine.buyers}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Eye className="text-blue-600" size={16} />
                      <span className="font-semibold text-blue-600">
                        {magazine.viewers}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">
                      ${magazine.revenue.toFixed(2)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          parseFloat(magazine.conversionRate) >= 50
                            ? "bg-green-100 text-green-800"
                            : parseFloat(magazine.conversionRate) >= 30
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {magazine.conversionRate}%
                      </div>
                    </div>
                  </td>
                  {/* <td className="p-4 text-xs">
                    {magazine.buyersList.map((b) => b.name).join(", ") || "-"}
                  </td>
                  <td className="p-4 text-xs">
                    {magazine.viewersList.map((v) => v.name).join(", ") || "-"}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

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
      <div className="flex-1 flex flex-col min-h-screen">
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
        <main className="flex-1 p-4 overflow-auto">{renderView()}</main>
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
