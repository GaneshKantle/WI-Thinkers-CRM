import React from "react";
import { CUSTOMERS } from "../customers_updated_200";
import {
  BookOpen,
  DollarSign,
  Target,
  Users,
  ShoppingCart,
  Eye,
  Users as UsersIcon,
  MessageCircle,
  Edit3,
  DollarSign as DollarSignIcon,
  BarChart3,
} from "lucide-react";
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

export default function Overview() {
  // Calculate stage funnel data from real CRM data
  const stageFunnelData = [
    {
      name: "Warm-up",
      value: CUSTOMERS.filter(c => c.stage === "Warm-up").length,
      icon: UsersIcon,
      color: "#3B82F6", // blue
      description: "Getting to know customers"
    },
    {
      name: "Meeting",
      value: CUSTOMERS.filter(c => c.stage === "Meeting").length,
      icon: MessageCircle,
      color: "#8B5CF6", // purple
      description: "First meeting scheduled"
    },
    {
      name: "Editing",
      value: CUSTOMERS.filter(c => c.stage === "Editing").length,
      icon: Edit3,
      color: "#10B981", // green
      description: "Working on their project"
    },
    {
      name: "Sales",
      value: CUSTOMERS.filter(c => c.stage === "Sales").length,
      icon: DollarSignIcon,
      color: "#F59E0B", // amber
      description: "Final sales discussion"
    }
  ];

  // Filter out stages with 0 customers for cleaner display
  const activeStages = stageFunnelData.filter(stage => stage.value > 0);

  // Calculate magazine bar chart data from real CRM data
  const magazineBarData = [...new Set(CUSTOMERS.flatMap((c) => c.magazine))].map(
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
      
      return {
        name: magazine,
        totalCustomers: customers.length,
        buyers: buyers.length,
        viewers: viewers.length,
        color: "#6366F1", // indigo
        fill: "#818CF8", // lighter indigo for bars
      };
    }
  ).sort((a, b) => b.totalCustomers - a.totalCustomers); // Sort by customer count

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

  // Custom tooltip for funnel chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const IconComponent = data.icon;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <IconComponent size={16} style={{ color: data.color }} />
            <span className="font-semibold text-slate-900">{data.name}</span>
          </div>
          <div className="text-sm text-slate-600">
            <div className="font-medium">{data.value} customers</div>
            <div className="text-xs">{data.description}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-indigo-600" />
            <span className="font-semibold text-slate-900">{label}</span>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <div className="font-medium">Total: {data.totalCustomers} customers</div>
            <div className="text-green-600">Buyers: {data.buyers}</div>
            <div className="text-blue-600">Viewers: {data.viewers}</div>
          </div>
        </div>
      );
    }
    return null;
  };

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

      {/* Magazine Distribution Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <BarChart3 className="text-indigo-600" size={20} />
            Magazine Distribution
          </h3>
          <div className="text-sm text-slate-500">
            {magazineBarData.reduce((sum, mag) => sum + mag.totalCustomers, 0)} total customers across {magazineBarData.length} magazines
          </div>
        </div>

        {magazineBarData.length > 0 ? (
          <div className="space-y-6">
            {/* Bar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={magazineBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748B' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip content={<BarChartTooltip />} />
                  <Bar 
                    dataKey="totalCustomers" 
                    fill="#818CF8"
                    radius={[4, 4, 0, 0]}
                    name="Total Customers"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Magazine Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {magazineBarData.map((magazine, index) => {
                const percentage = CUSTOMERS.length > 0 
                  ? ((magazine.totalCustomers / CUSTOMERS.length) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={magazine.name} className="p-4 rounded-lg border bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={20} className="text-indigo-600" />
                        <h4 className="font-semibold text-slate-900">{magazine.name}</h4>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Total Customers</span>
                        <span className="font-bold text-slate-900">{magazine.totalCustomers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Buyers</span>
                        <span className="font-semibold text-green-600">{magazine.buyers}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Viewers</span>
                        <span className="font-semibold text-blue-600">{magazine.viewers}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">Market Share</span>
                          <span className="text-sm font-medium text-indigo-600">{percentage}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No magazine data available</h3>
            <p className="text-slate-500">
              Magazine distribution will appear here when customers are assigned to magazines.
            </p>
          </div>
        )}
      </div>

      {/* Customer Stage Funnel Chart */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Target className="text-indigo-600" size={20} />
            Customer Journey Funnel
          </h3>
          <div className="text-sm text-slate-500">
            {activeStages.reduce((sum, stage) => sum + stage.value, 0)} total customers in pipeline
          </div>
        </div>

        {activeStages.length > 0 ? (
          <div className="space-y-6">
            {/* Funnel Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart data={activeStages}>
                  <Tooltip content={<CustomTooltip />} />
                  <Funnel
                    dataKey="value"
                    data={activeStages}
                    isAnimationActive={true}
                    labelFormatter={(value) => `${value} customers`}
                  >
                    {activeStages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeStages.map((stage, index) => {
                const IconComponent = stage.icon;
                const percentage = activeStages.reduce((sum, s) => sum + s.value, 0) > 0 
                  ? ((stage.value / activeStages.reduce((sum, s) => sum + s.value, 0)) * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={stage.name} className="text-center p-4 rounded-lg border">
                    <div className="flex items-center justify-center mb-2">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${stage.color}20` }}
                      >
                        <IconComponent size={24} style={{ color: stage.color }} />
                      </div>
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{stage.name}</h4>
                    <div className="text-2xl font-bold mb-1" style={{ color: stage.color }}>
                      {stage.value}
                    </div>
                    <div className="text-sm text-slate-500 mb-2">
                      {percentage}% of pipeline
                    </div>
                    <div className="text-xs text-slate-400">
                      {stage.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No customers in pipeline</h3>
            <p className="text-slate-500">
              Customers will appear here as they move through different stages.
            </p>
          </div>
        )}
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