import React, { useState } from "react";
import {
  Instagram,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Filter,
  Search,
  Edit3,
  Save,
  X,
  BookOpen,
  Award,
} from "lucide-react";
import { SUBMISSIONS, THEME_TAGS, SUBMISSION_STATUSES, MAGAZINES } from "../submissions";

export default function Submissions() {
  const [submissions, setSubmissions] = useState(SUBMISSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [magazineFilter, setMagazineFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [qualityFilter, setQualityFilter] = useState("All");
  const [themeFilter, setThemeFilter] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch = 
      submission.instagramHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMagazine = magazineFilter === "All" || submission.magazine === magazineFilter;
    const matchesStatus = statusFilter === "All" || submission.submissionStatus === statusFilter;
    const matchesQuality = qualityFilter === "All" || 
      (qualityFilter === "Quality" && submission.qualityFlag) ||
      (qualityFilter === "Not Quality" && !submission.qualityFlag);
    const matchesTheme = themeFilter === "All" || submission.themeTag === themeFilter;
    
    return matchesSearch && matchesMagazine && matchesStatus && matchesQuality && matchesTheme;
  });

  // Handle status change
  const handleStatusChange = (id, newStatus) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === id ? { ...submission, submissionStatus: newStatus } : submission
      )
    );
  };

  // Handle quality flag toggle
  const handleQualityFlagToggle = (id) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === id ? { ...submission, qualityFlag: !submission.qualityFlag } : submission
      )
    );
  };

  // Handle theme tag change
  const handleThemeTagChange = (id, newTheme) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === id ? { ...submission, themeTag: newTheme } : submission
      )
    );
  };

  // Start editing
  const handleStartEdit = (submission) => {
    setEditingId(submission.id);
    setEditingData({
      reviewerNotes: submission.reviewerNotes || "",
      submissionStatus: submission.submissionStatus,
      qualityFlag: submission.qualityFlag,
      themeTag: submission.themeTag
    });
  };

  // Save editing
  const handleSaveEdit = () => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === editingId ? { ...submission, ...editingData } : submission
      )
    );
    setEditingId(null);
    setEditingData({});
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData({});
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Rejected":
        return <XCircle size={16} className="text-red-600" />;
      case "Pending":
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  // Format date
  const formatDate = (dateString) => {
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-slate-900">Submissions</h2>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="text-yellow-600" size={16} />
            <span className="text-slate-600">
              {submissions.filter(s => s.submissionStatus === "Pending").length} Pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600" size={16} />
            <span className="text-slate-600">
              {submissions.filter(s => s.submissionStatus === "Accepted").length} Accepted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="text-red-600" size={16} />
            <span className="text-slate-600">
              {submissions.filter(s => s.submissionStatus === "Rejected").length} Rejected
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by Instagram handle, name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Magazine Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-600" />
                Magazine
              </label>
              <select
                value={magazineFilter}
                onChange={(e) => setMagazineFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="All">All Magazines</option>
                {MAGAZINES.map(magazine => (
                  <option key={magazine} value={magazine}>{magazine}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Filter size={16} className="text-green-600" />
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="All">All Status</option>
                {SUBMISSION_STATUSES.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Quality Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Award size={16} className="text-yellow-600" />
                Quality
              </label>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="All">All Quality</option>
                <option value="Quality">Quality Flagged</option>
                <option value="Not Quality">Not Quality Flagged</option>
              </select>
            </div>

            {/* Theme Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                <Star size={16} className="text-purple-600" />
                Theme
              </label>
              <select
                value={themeFilter}
                onChange={(e) => setThemeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="All">All Themes</option>
                {THEME_TAGS.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {(magazineFilter !== "All" || statusFilter !== "All" || qualityFilter !== "All" || themeFilter !== "All") && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <span className="text-sm text-slate-500">Active filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {magazineFilter !== "All" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Magazine: {magazineFilter}
                  </span>
                )}
                {statusFilter !== "All" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Status: {statusFilter}
                  </span>
                )}
                {qualityFilter !== "All" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Quality: {qualityFilter}
                  </span>
                )}
                {themeFilter !== "All" && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Theme: {themeFilter}
                  </span>
                )}
                <button
                  onClick={() => {
                    setMagazineFilter("All");
                    setStatusFilter("All");
                    setQualityFilter("All");
                    setThemeFilter("All");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto w-full min-w-0">
          <table className="w-full min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Instagram Handle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Magazine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Theme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-slate-50">
                  {/* Instagram Handle */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Instagram className="text-pink-600" size={16} />
                      <a
                        href={submission.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {submission.instagramHandle}
                      </a>
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {submission.customerName}
                      </div>
                      <div className="text-sm text-slate-500">
                        {submission.customerEmail}
                      </div>
                    </div>
                  </td>

                  {/* Magazine */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <BookOpen className="text-indigo-600" size={16} />
                      <span className="text-sm font-medium text-slate-900">
                        {submission.magazine}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === submission.id ? (
                      <select
                        value={editingData.submissionStatus}
                        onChange={(e) => setEditingData(prev => ({ ...prev, submissionStatus: e.target.value }))}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {SUBMISSION_STATUSES.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(submission.submissionStatus)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(submission.submissionStatus)}`}>
                          {submission.submissionStatus}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Quality Flag */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === submission.id ? (
                      <input
                        type="checkbox"
                        checked={editingData.qualityFlag}
                        onChange={(e) => setEditingData(prev => ({ ...prev, qualityFlag: e.target.checked }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                      />
                    ) : (
                      <button
                        onClick={() => handleQualityFlagToggle(submission.id)}
                        className={`p-1 rounded-full transition-colors ${
                          submission.qualityFlag 
                            ? 'text-yellow-600 hover:text-yellow-700' 
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Star size={16} className={submission.qualityFlag ? 'fill-current' : ''} />
                      </button>
                    )}
                  </td>

                  {/* Theme Tag */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === submission.id ? (
                      <select
                        value={editingData.themeTag}
                        onChange={(e) => setEditingData(prev => ({ ...prev, themeTag: e.target.value }))}
                        className="px-2 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        {THEME_TAGS.map(theme => (
                          <option key={theme} value={theme}>{theme}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {submission.themeTag}
                      </span>
                    )}
                  </td>

                  {/* Submitted Date */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {formatDate(submission.submittedDate)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === submission.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 p-1"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(submission)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit3 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reviewer Notes Section */}
        {editingId && (
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Reviewer Notes
              </label>
              <textarea
                value={editingData.reviewerNotes}
                onChange={(e) => setEditingData(prev => ({ ...prev, reviewerNotes: e.target.value }))}
                placeholder="Add your review notes here..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                rows={4}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredSubmissions.length === 0 && (
          <div className="text-center py-12">
            <Instagram size={48} className="mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No submissions found</h3>
            <p className="text-slate-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 