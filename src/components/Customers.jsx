import React, { useState } from "react";
import { CUSTOMERS } from "../customers_updated_200";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Users,
  ShoppingCart,
  Eye,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Check,
  Tag,
  Calendar,
  Edit3,
} from "lucide-react";
import { extractInstagramHandle, extractInstagramUrl } from "../utils";

export default function Customers({ setSelectedCustomer }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  // Add local state for customers to allow stage editing
  const [localCustomers, setLocalCustomers] = useState(
    CUSTOMERS.map((c) => ({ ...c }))
  );
  // State for inline editing
  const [editingNotes, setEditingNotes] = useState(null);
  const [editingNotesValue, setEditingNotesValue] = useState("");

  // Available themes
  const availableThemes = ["Red Carpet", "Body Art", "Fashion", "Glamour", "Casual", "Professional"];

  let filteredCustomers = [];
  try {
    filteredCustomers = localCustomers.filter((customer) => {
      const name = customer.name?.toLowerCase().trim() || "";
      const email = customer.email?.toLowerCase().trim() || "";
      let status = customer.status?.toLowerCase().trim() || "";
      if (
        status === "buyer" &&
        (!customer.totalAmount || customer.totalAmount === 0)
      )
        status = "viewer";
      const search = searchTerm.toLowerCase().trim();
      const filterStatus = statusFilter.toLowerCase().trim();
      const filterStage = stageFilter.toLowerCase().trim();
      const matchesSearch = name.includes(search) || email.includes(search);
      const matchesStatus = filterStatus === "all" || status === filterStatus;
      const matchesStage = filterStage === "all" || customer.stage === stageFilter;
      return matchesSearch && matchesStatus && matchesStage;
    });
  } catch (e) {
    filteredCustomers = [];
  }

  // Handler to update stage
  const handleStageChange = (id, newStage) => {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, stage: newStage } : c
      )
    );
  };

  // Handler to toggle quality flag
  const handleQualityFlagToggle = (id) => {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, qualityFlag: !c.qualityFlag } : c
      )
    );
  };

  // Handler to toggle congratulated status
  const handleCongratulatedToggle = (id) => {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, congratulated: !c.congratulated } : c
      )
    );
  };

  // Handler to update theme
  const handleThemeChange = (id, newTheme) => {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, theme: newTheme } : c
      )
    );
  };

  // Handler to update meeting date
  const handleMeetingDateChange = (id, date) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : null;
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, meetingDate: formattedDate } : c
      )
    );
  };

  // Handler to start editing notes
  const handleStartEditNotes = (id, currentNotes) => {
    setEditingNotes(id);
    setEditingNotesValue(currentNotes || "");
  };

  // Handler to save notes
  const handleSaveNotes = (id) => {
    setLocalCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, notes: editingNotesValue } : c
      )
    );
    setEditingNotes(null);
    setEditingNotesValue("");
  };

  // Handler to cancel editing notes
  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setEditingNotesValue("");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
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
          {/* Stage Filter Dropdown */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
          >
            <option value="All">All Stages</option>
            <option value="Warm-up">Warm-up</option>
            <option value="Meeting">Meeting</option>
            <option value="Editing">Editing</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={20} />
            <div>
              <p className="text-sm text-slate-500">Quality Approved</p>
              <p className="text-xl font-semibold">
                {filteredCustomers.filter((c) => c.qualityFlag).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-3">
            <Check className="text-purple-600" size={20} />
            <div>
              <p className="text-sm text-slate-500">Congratulated</p>
              <p className="text-xl font-semibold">
                {filteredCustomers.filter((c) => c.congratulated).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Customer List - Cards on mobile, table on md+ */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden w-full max-w-full">
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
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {customer.stage || "Warm-up"}
                  </span>
                  <span className="font-semibold text-slate-900 ml-auto">
                    {status === "Buyer"
                      ? `$${customer.totalAmount?.toFixed(2) || "0.00"}`
                      : "-"}
                  </span>
                </div>
                {/* Quality Flag and Congratulated for mobile */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleQualityFlagToggle(customer.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      customer.qualityFlag
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    {customer.qualityFlag ? (
                      <>
                        <CheckCircle size={12} />
                        Quality Approved
                      </>
                    ) : (
                      <>
                        <XCircle size={12} />
                        Needs Review
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleCongratulatedToggle(customer.id)}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                      customer.congratulated
                        ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <Check size={12} />
                    {customer.congratulated ? "Congratulated" : "Not Congratulated"}
                  </button>
                </div>
                {/* Theme for mobile */}
                <div className="flex items-center gap-2 mt-2">
                  <Tag size={12} className="text-slate-500" />
                  <select
                    value={customer.theme || "Red Carpet"}
                    onChange={(e) => handleThemeChange(customer.id, e.target.value)}
                    className="px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {availableThemes.map((theme) => (
                      <option key={theme} value={theme}>
                        {theme}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Meeting Date for mobile */}
                <div className="flex items-center gap-2 mt-2">
                  <Calendar size={12} className="text-slate-500" />
                  <DatePicker
                    selected={customer.meetingDate ? new Date(customer.meetingDate) : null}
                    onChange={(date) => handleMeetingDateChange(customer.id, date)}
                    dateFormat="MMM dd, yyyy"
                    placeholderText="Select meeting date"
                    className="px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-32"
                    isClearable
                  />
                </div>
                {/* Notes for mobile */}
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Edit3 size={12} className="text-slate-500" />
                    <span className="text-xs font-medium text-slate-700">Notes:</span>
                  </div>
                  {editingNotes === customer.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNotesValue}
                        onChange={(e) => setEditingNotesValue(e.target.value)}
                        onBlur={() => handleSaveNotes(customer.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleSaveNotes(customer.id);
                          }
                          if (e.key === 'Escape') {
                            handleCancelEditNotes();
                          }
                        }}
                        className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        rows={2}
                        placeholder="Add notes..."
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSaveNotes(customer.id)}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEditNotes}
                          className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => handleStartEditNotes(customer.id, customer.notes)}
                      className="px-2 py-1 border border-slate-200 rounded text-xs bg-slate-50 cursor-pointer hover:bg-slate-100 min-h-[2rem] flex items-center"
                    >
                      {customer.notes || "Click to add notes..."}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Table for md+ */}
        <div className="hidden md:block overflow-x-auto w-full min-w-0 max-w-full">
          <table className="w-full min-w-[400px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-2 font-medium text-slate-700">
                  Customer
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Contact
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Magazine
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Status
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Stage
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Quality
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Congratulated
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Theme
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Meeting Date
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Notes
                </th>
                <th className="text-left p-2 font-medium text-slate-700">
                  Amount
                </th>
                <th className="text-right p-2 font-medium text-slate-700">
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {customer.stage || "Warm-up"}
                      </span>
                    </td>
                    {/* Quality Flag Toggle */}
                    <td className="p-4">
                      <button
                        onClick={() => handleQualityFlagToggle(customer.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          customer.qualityFlag
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title={customer.qualityFlag ? "Click to mark as needs review" : "Click to approve quality"}
                      >
                        {customer.qualityFlag ? (
                          <>
                            <CheckCircle size={12} />
                            Approved
                          </>
                        ) : (
                          <>
                            <XCircle size={12} />
                            Review
                          </>
                        )}
                      </button>
                    </td>
                    {/* Congratulated Checkbox */}
                    <td className="p-4">
                      <button
                        onClick={() => handleCongratulatedToggle(customer.id)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                          customer.congratulated
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                        title={customer.congratulated ? "Click to mark as not congratulated" : "Click to mark as congratulated"}
                      >
                        <Check size={12} />
                        {customer.congratulated ? "Yes" : "No"}
                      </button>
                    </td>
                    {/* Theme Selector */}
                    <td className="p-4">
                      <select
                        value={customer.theme || "Red Carpet"}
                        onChange={(e) => handleThemeChange(customer.id, e.target.value)}
                        className="px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        title="Select theme for this customer"
                      >
                        {availableThemes.map((theme) => (
                          <option key={theme} value={theme}>
                            {theme}
                          </option>
                        ))}
                      </select>
                    </td>
                    {/* Meeting Date */}
                    <td className="p-4">
                      <DatePicker
                        selected={customer.meetingDate ? new Date(customer.meetingDate) : null}
                        onChange={(date) => handleMeetingDateChange(customer.id, date)}
                        dateFormat="MMM dd, yyyy"
                        placeholderText="Select date"
                        className="px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-28"
                        isClearable
                        title="Select meeting date"
                      />
                    </td>
                    {/* Notes */}
                    <td className="p-4">
                      {editingNotes === customer.id ? (
                        <div className="space-y-1">
                          <textarea
                            value={editingNotesValue}
                            onChange={(e) => setEditingNotesValue(e.target.value)}
                            onBlur={() => handleSaveNotes(customer.id)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handleSaveNotes(customer.id);
                              }
                              if (e.key === 'Escape') {
                                handleCancelEditNotes();
                              }
                            }}
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                            rows={2}
                            placeholder="Add notes..."
                            autoFocus
                          />
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleSaveNotes(customer.id)}
                              className="px-1 py-0.5 bg-green-100 text-green-800 rounded text-xs hover:bg-green-200"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEditNotes}
                              className="px-1 py-0.5 bg-gray-100 text-gray-800 rounded text-xs hover:bg-gray-200"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleStartEditNotes(customer.id, customer.notes)}
                          className="px-2 py-1 border border-slate-200 rounded text-xs bg-slate-50 cursor-pointer hover:bg-slate-100 min-h-[2rem] flex items-center max-w-[150px]"
                          title="Click to edit notes"
                        >
                          <span className="truncate">
                            {customer.notes || "Click to add notes..."}
                          </span>
                        </div>
                      )}
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