import React, { useState } from "react";

export default function StatCard({ icon: Icon, label, value, breakdown, color = "indigo" }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const colorClasses = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
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