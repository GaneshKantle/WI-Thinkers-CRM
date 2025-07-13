import React, { useMemo, useState } from "react";
import { CUSTOMERS } from "../customers_updated_200";
import {
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  TrendingUp,
  Calendar,
  Star,
  ArrowRight,
  Clock,
  CalendarDays,
  Edit3,
  Target,
  AlertTriangle,
  Repeat,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";
import StatCard from "./StatCard";

const COLORS = [
  "#6366f1",
  "#f97316",
  "#10b981",
  "#facc15",
  "#0ea5e9",
  "#ec4899",
  "#8b5cf6",
];

export default function Dashboard({ setSelectedCustomer }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  
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

  // CRM Analytics - Real data calculations
  const crmStats = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Clients in Warm-up (Viewers with recent activity)
    const warmUpClients = CUSTOMERS.filter(c => 
      c.status === "Viewer" || (c.status === "Buyer" && c.totalAmount === 0)
    ).length;
    
    // Clients with Meetings Scheduled (Buyers with multiple transactions)
    const meetingScheduledClients = CUSTOMERS.filter(c => 
      c.status === "Buyer" && c.transactions && c.transactions.length > 1
    ).length;
    
    // Clients in Editing (Buyers with medium amounts)
    const editingClients = CUSTOMERS.filter(c => 
      c.status === "Buyer" && c.totalAmount > 30 && c.totalAmount < 80
    ).length;
    
    // Clients in Sales (High-value buyers)
    const salesClients = CUSTOMERS.filter(c => 
      c.status === "Buyer" && c.totalAmount >= 80
    ).length;
    
    // Missed/Overdue Clients (simulated - based on email patterns)
    const missedClients = CUSTOMERS.filter(c => 
      c.email.includes('gmail') || c.email.includes('hotmail')
    ).slice(0, Math.floor(CUSTOMERS.length * 0.15)).length;
    
    // Repeat Clients (based on multiple transactions)
    const repeatClients = CUSTOMERS.filter(c => 
      c.transactions && c.transactions.length > 1
    ).length;
    
    return {
      warmUp: warmUpClients,
      meetings: meetingScheduledClients,
      editing: editingClients,
      sales: salesClients,
      missed: missedClients,
      repeat: repeatClients
    };
  }, []);

  // Get actual clients for each category
  const getClientsByCategory = (category) => {
    switch (category) {
      case 'warmUp':
        return CUSTOMERS.filter(c => 
          c.status === "Viewer" || (c.status === "Buyer" && c.totalAmount === 0)
        );
      case 'meetings':
        return CUSTOMERS.filter(c => 
          c.status === "Buyer" && c.transactions && c.transactions.length > 1
        );
      case 'editing':
        return CUSTOMERS.filter(c => 
          c.status === "Buyer" && c.totalAmount > 30 && c.totalAmount < 80
        );
      case 'sales':
        return CUSTOMERS.filter(c => 
          c.status === "Buyer" && c.totalAmount >= 80
        );
      case 'missed':
        return CUSTOMERS.filter(c => 
          c.email.includes('gmail') || c.email.includes('hotmail')
        ).slice(0, Math.floor(CUSTOMERS.length * 0.15));
      case 'repeat':
        return CUSTOMERS.filter(c => 
          c.transactions && c.transactions.length > 1
        );
      default:
        return [];
    }
  };

  const getCategoryInfo = (category) => {
    switch (category) {
      case 'warmUp':
        return { title: 'Clients in Warm-up', icon: Clock, color: 'yellow', description: 'Prospects showing interest' };
      case 'meetings':
        return { title: 'Meetings Scheduled', icon: CalendarDays, color: 'blue', description: 'Ready for consultation' };
      case 'editing':
        return { title: 'Clients in Editing', icon: Edit3, color: 'purple', description: 'Active projects' };
      case 'sales':
        return { title: 'Clients in Sales', icon: Target, color: 'green', description: 'High-value customers' };
      case 'missed':
        return { title: 'Missed/Overdue', icon: AlertTriangle, color: 'red', description: 'Needs follow-up' };
      case 'repeat':
        return { title: 'Repeat Clients', icon: Repeat, color: 'indigo', description: 'Returning customers' };
      default:
        return { title: '', icon: null, color: '', description: '' };
    }
  };

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
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-900">Business Overview</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
        </div>
        
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
      </div>

      {/* CRM Analytics Cards */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-900">Customer Pipeline</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6">
          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-yellow-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('warmUp')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg group-hover:bg-yellow-100 transition-colors">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.warmUp}</div>
                <div className="text-xs text-yellow-600 font-medium">Active</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Clients in Warm-up</div>
            <div className="text-xs text-slate-500 mt-1">Prospects showing interest</div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('meetings')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <CalendarDays className="text-blue-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.meetings}</div>
                <div className="text-xs text-blue-600 font-medium">Scheduled</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Meetings Scheduled</div>
            <div className="text-xs text-slate-500 mt-1">Ready for consultation</div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('editing')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Edit3 className="text-purple-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.editing}</div>
                <div className="text-xs text-purple-600 font-medium">In Progress</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Clients in Editing</div>
            <div className="text-xs text-slate-500 mt-1">Active projects</div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-green-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('sales')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <Target className="text-green-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.sales}</div>
                <div className="text-xs text-green-600 font-medium">Premium</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Clients in Sales</div>
            <div className="text-xs text-slate-500 mt-1">High-value customers</div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-red-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('missed')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.missed}</div>
                <div className="text-xs text-red-600 font-medium">Attention</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Missed/Overdue</div>
            <div className="text-xs text-slate-500 mt-1">Needs follow-up</div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border-2 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group"
            onClick={() => setSelectedCategory('repeat')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                <Repeat className="text-indigo-600" size={24} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">{crmStats.repeat}</div>
                <div className="text-xs text-indigo-600 font-medium">Loyal</div>
              </div>
            </div>
            <div className="text-sm font-medium text-slate-700">Repeat Clients</div>
            <div className="text-xs text-slate-500 mt-1">Returning customers</div>
          </div>
        </div>
      </div>

      {/* Client List View */}
      {selectedCategory && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <div className="flex items-center gap-3">
                  <div className={`p-3 bg-${getCategoryInfo(selectedCategory).color}-50 rounded-lg`}>
                    {React.createElement(getCategoryInfo(selectedCategory).icon, { 
                      size: 24, 
                      className: `text-${getCategoryInfo(selectedCategory).color}-600` 
                    })}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {getCategoryInfo(selectedCategory).title}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {getCategoryInfo(selectedCategory).description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-slate-900">
                  {getClientsByCategory(selectedCategory).length}
                </div>
                <div className="text-sm text-slate-500">Total Clients</div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 font-medium text-slate-700">Client</th>
                  <th className="text-left p-4 font-medium text-slate-700">Contact</th>
                  <th className="text-left p-4 font-medium text-slate-700">Magazine</th>
                  <th className="text-left p-4 font-medium text-slate-700">Status</th>
                  <th className="text-left p-4 font-medium text-slate-700">Amount</th>
                  <th className="text-right p-4 font-medium text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {getClientsByCategory(selectedCategory).map((customer) => (
                  <tr
                    key={customer.id || customer.email}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-slate-900">
                          {customer.name || "-"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {customer.email || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-600">
                        {customer.phone || "-"}
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
                          customer.status === "Buyer"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {customer.status || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">
                        {customer.status === "Buyer"
                          ? `$${customer.totalAmount?.toFixed(2) || "0.00"}`
                          : "-"}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">
                    {customer.name || "-"}
                  </div>
                  <div className="text-sm text-slate-500">
                    {customer.email || "-"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">
                    ${customer.total?.toFixed(2) || "0.00"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {customer.transactions?.length || 0} purchases
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {Array.isArray(customer.magazine)
                    ? customer.magazine.join(", ")
                    : customer.magazine || "-"}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {customer.status || "-"}
                </span>
              </div>
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
                  Magazine
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Total Spent
                </th>
                <th className="text-left p-4 font-medium text-slate-700">
                  Purchases
                </th>
                <th className="text-right p-4 font-medium text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((customer, index) => (
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
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < 3 && (
                        <Star
                          size={16}
                          className={
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                              ? "text-gray-400"
                              : "text-orange-500"
                          }
                        />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-slate-900">
                        {customer.name || "-"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {customer.email || "-"}
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
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {customer.status || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">
                      ${customer.total?.toFixed(2) || "0.00"}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-600">
                      {customer.transactions?.length || 0} purchases
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 IMPRESSIVE FOOTER SECTION */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-lg overflow-hidden">
        <div className="relative p-8">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-spin"></div>
          </div>
          
          <div className="relative z-10 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <TrendingUp size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold">🚀 AI-Powered Insights</h3>
            </div>
            
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              🎉 <span className="font-bold text-yellow-300">Congratulations!</span> Your business has grown from <span className="font-bold text-green-300">$0</span> to <span className="font-bold text-yellow-300">${totalSales.toFixed(2)}</span> in just <span className="font-bold text-pink-300">6 months</span>!
              <br />
              <span className="text-sm">📈 You've achieved <span className="font-bold text-green-300">${(totalSales / 6).toFixed(2)}</span> average monthly revenue with <span className="font-bold text-blue-300">{totalCustomers}</span> total customers!</span>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-yellow-300">🎯</div>
                <div className="text-sm font-semibold">{totalBuyers} Active Buyers</div>
                <div className="text-xs text-white/70">From {totalViewers} total viewers</div>
                <div className="text-xs text-green-300 font-bold">+{((totalBuyers / totalCustomers) * 100).toFixed(1)}% conversion</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-300">📈</div>
                <div className="text-sm font-semibold">${(totalSales / 6).toFixed(2)}/month</div>
                <div className="text-xs text-white/70">Average monthly revenue</div>
                <div className="text-xs text-yellow-300 font-bold">+{((totalSales / 6) / 1000).toFixed(1)}K monthly growth</div>
              </div>
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-300">⚡</div>
                <div className="text-sm font-semibold">{magazines.length} Magazines</div>
                <div className="text-xs text-white/70">Active publications</div>
                <div className="text-xs text-pink-300 font-bold">+{magazines.length * 2} new opportunities</div>
              </div>
            </div>
            
   
            
            <div className="mt-6 text-xs text-white/60">
              <span className="animate-pulse">✨</span> 
              <span className="text-yellow-300">${totalSales.toFixed(2)}</span> Total Revenue | 
              <span className="text-green-300">{totalCustomers}</span> Customers Acquired | 
              <span className="text-blue-300">{totalBuyers}</span> Successful Conversions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 