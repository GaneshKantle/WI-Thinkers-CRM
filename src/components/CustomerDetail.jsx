import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowRight,
  Phone,
  MapPin,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Mic,
  Gift,
  Star,
  Users,
  MessageCircle,
  Edit3,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  Info,
} from "lucide-react";
import { extractInstagramHandle, extractInstagramUrl } from "../utils";

export default function CustomerDetail({ customer, onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  // State for interview tracking
  const [interviewData, setInterviewData] = useState({
    scheduled: customer.interviewScheduled || false,
    interviewDate: customer.interviewDate ? new Date(customer.interviewDate) : null,
    interviewNotes: customer.interviewNotes || "",
    readyForSalesPitch: customer.readyForSalesPitch || false,
  });

  // State for sales info
  const [salesData, setSalesData] = useState({
    interestedInPodcast: customer.interestedInPodcast || false,
    upsellOffered: customer.upsellOffered || false,
    upsellCompleted: customer.upsellCompleted || false,
  });

  // State for meeting date
  const [meetingDate, setMeetingDate] = useState(
    customer.meetingDate ? new Date(customer.meetingDate) : null
  );

  // Generate smart alerts based on customer data
  const generateSmartAlerts = () => {
    const alerts = [];

    // Alert 1: No meeting set
    if (!meetingDate && !customer.meetingDate) {
      alerts.push({
        type: "warning",
        icon: AlertTriangle,
        title: "No Meeting Set",
        message: "This customer doesn't have a meeting scheduled yet",
        color: "amber",
        action: "Set Meeting Date"
      });
    }

    // Alert 2: Interview not marked complete
    if (interviewData.scheduled && !interviewData.interviewNotes.trim()) {
      alerts.push({
        type: "info",
        icon: AlertCircle,
        title: "Interview Not Complete",
        message: "Interview is scheduled but no notes have been added",
        color: "blue",
        action: "Add Interview Notes"
      });
    }

    // Alert 3: No follow-up note
    if (!customer.notes || customer.notes.trim() === "") {
      alerts.push({
        type: "warning",
        icon: Info,
        title: "No Follow-up Note",
        message: "This customer doesn't have any notes yet",
        color: "orange",
        action: "Add Notes"
      });
    }

    return alerts;
  };

  const smartAlerts = generateSmartAlerts();

  // Generate stage history based on current stage
  const generateStageHistory = (currentStage) => {
    const stages = [
      { name: "Warm-up", icon: Users, color: "blue", description: "Getting to know the customer" },
      { name: "Meeting", icon: MessageCircle, color: "purple", description: "First meeting scheduled" },
      { name: "Editing", icon: Edit3, color: "green", description: "Working on their project" },
      { name: "Sales", icon: DollarSign, color: "orange", description: "Final sales discussion" }
    ];

    const currentStageIndex = stages.findIndex(stage => stage.name === currentStage);
    
    // Generate realistic dates based on current stage
    const baseDate = new Date();
    const stageHistory = [];
    
    stages.forEach((stage, index) => {
      const isCompleted = index <= currentStageIndex;
      const isCurrent = index === currentStageIndex;
      
      // Calculate date (going backwards from current date)
      const daysAgo = currentStageIndex - index;
      const stageDate = new Date(baseDate);
      stageDate.setDate(stageDate.getDate() - (daysAgo * 3)); // 3 days between stages
      
      stageHistory.push({
        ...stage,
        date: stageDate,
        isCompleted,
        isCurrent,
        timestamp: stageDate.toISOString()
      });
    });

    return stageHistory;
  };

  const stageHistory = generateStageHistory(customer.stage);

  // Handle meeting date change
  const handleMeetingDateChange = (date) => {
    setMeetingDate(date);
    // Here you would typically update the customer data in your store/state
    console.log("Meeting date updated:", date);
  };

  // Handle interview data changes
  const handleInterviewChange = (field, value) => {
    setInterviewData(prev => ({
      ...prev,
      [field]: value
    }));
    // Here you would typically update the customer data in your store/state
    console.log(`Interview ${field} updated:`, value);
  };

  // Handle sales data changes
  const handleSalesChange = (field, value) => {
    setSalesData(prev => ({
      ...prev,
      [field]: value
    }));
    // Here you would typically update the customer data in your store/state
    console.log(`Sales ${field} updated:`, value);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get color classes for stages
  const getStageColorClasses = (stage, isCompleted, isCurrent) => {
    const colorMap = {
      blue: {
        bg: isCompleted ? 'bg-blue-500' : 'bg-blue-100',
        text: isCompleted ? 'text-white' : 'text-blue-600',
        border: isCurrent ? 'border-blue-500' : 'border-blue-200'
      },
      purple: {
        bg: isCompleted ? 'bg-purple-500' : 'bg-purple-100',
        text: isCompleted ? 'text-white' : 'text-purple-600',
        border: isCurrent ? 'border-purple-500' : 'border-purple-200'
      },
      green: {
        bg: isCompleted ? 'bg-green-500' : 'bg-green-100',
        text: isCompleted ? 'text-white' : 'text-green-600',
        border: isCurrent ? 'border-green-500' : 'border-green-200'
      },
      orange: {
        bg: isCompleted ? 'bg-orange-500' : 'bg-orange-100',
        text: isCompleted ? 'text-white' : 'text-orange-600',
        border: isCurrent ? 'border-orange-500' : 'border-orange-200'
      }
    };
    return colorMap[stage.color];
  };

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
              
              {/* Meeting Date Picker */}
              <div className="pt-4 border-t border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Calendar className="text-slate-400" size={16} />
                  Meeting Date
                </label>
                <DatePicker
                  selected={meetingDate}
                  onChange={handleMeetingDateChange}
                  dateFormat="MMMM dd, yyyy"
                  placeholderText="Pick a meeting date"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  isClearable
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={15}
                />
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

          {/* Quick Actions - Moved here */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
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

          {/* Engagement Overview - Moved here */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
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

          {/* Purchase History - Moved here */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
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
                <TrendingUp size={48} className="mx-auto mb-3 opacity-50" />
                <p>
                  This customer is a viewer and hasn't made any purchases yet.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Activity & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Alerts - Commented out for future use */}
          {/* 
          {smartAlerts.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-600" />
                Smart Alerts
              </h4>
              
              <div className="space-y-3">
                {smartAlerts.map((alert, index) => {
                  const IconComponent = alert.icon;
                  const colorClasses = {
                    amber: {
                      bg: 'bg-amber-50',
                      border: 'border-amber-200',
                      text: 'text-amber-800',
                      icon: 'text-amber-600',
                      button: 'bg-amber-600 hover:bg-amber-700'
                    },
                    blue: {
                      bg: 'bg-blue-50',
                      border: 'border-blue-200',
                      text: 'text-blue-800',
                      icon: 'text-blue-600',
                      button: 'bg-blue-600 hover:bg-blue-700'
                    },
                    orange: {
                      bg: 'bg-orange-50',
                      border: 'border-orange-200',
                      text: 'text-orange-800',
                      icon: 'text-orange-600',
                      button: 'bg-orange-600 hover:bg-orange-700'
                    }
                  };
                  
                  const colors = colorClasses[alert.color];
                  
                  return (
                    <div key={index} className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
                      <div className="flex items-start gap-3">
                        <IconComponent size={20} className={`mt-0.5 ${colors.icon}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className={`text-sm font-medium ${colors.text}`}>
                              {alert.title}
                            </h5>
                            <button
                              className={`px-3 py-1 text-xs font-medium text-white rounded-md transition-colors ${colors.button}`}
                              onClick={() => {
                                // Handle alert action
                                console.log(`Action clicked: ${alert.action}`);
                              }}
                            >
                              {alert.action}
                            </button>
                          </div>
                          <p className="text-xs text-slate-600">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 text-center">
                  💡 These alerts help you remember important tasks for this customer
                </p>
              </div>
            </div>
          )}
          */}

          {/* Interview Tracker */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-600" />
              Interview Tracker
            </h4>
            
            <div className="space-y-4">
              {/* Scheduled Toggle */}
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-600" size={20} />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Interview Scheduled
                    </label>
                    <p className="text-xs text-slate-500">
                      {interviewData.scheduled ? "Yes, interview is planned" : "No interview scheduled yet"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleInterviewChange('scheduled', !interviewData.scheduled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    interviewData.scheduled ? 'bg-purple-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      interviewData.scheduled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Interview Date Picker */}
              {interviewData.scheduled && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={16} />
                    Interview Date
                  </label>
                  <DatePicker
                    selected={interviewData.interviewDate}
                    onChange={(date) => handleInterviewChange('interviewDate', date)}
                    dateFormat="MMMM dd, yyyy 'at' h:mm aa"
                    placeholderText="Pick interview date and time"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    isClearable
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={15}
                  />
                </div>
              )}

              {/* Interview Notes */}
              <div className="p-4 bg-green-50 rounded-lg">
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <FileText className="text-green-600" size={16} />
                  Interview Notes
                </label>
                <textarea
                  value={interviewData.interviewNotes}
                  onChange={(e) => handleInterviewChange('interviewNotes', e.target.value)}
                  placeholder="Write your interview notes here..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                  rows={4}
                />
              </div>

              {/* Ready for Sales Pitch Checkbox */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-orange-600" size={20} />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Ready for Sales Pitch
                    </label>
                    <p className="text-xs text-slate-500">
                      {interviewData.readyForSalesPitch ? "Customer is ready for sales discussion" : "Customer needs more preparation"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={interviewData.readyForSalesPitch}
                  onChange={(e) => handleInterviewChange('readyForSalesPitch', e.target.checked)}
                  className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Sales Info */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Gift size={20} className="text-emerald-600" />
              Sales Info
            </h4>
            
            <div className="space-y-4">
              {/* Interested in Podcast */}
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mic className="text-emerald-600" size={20} />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Interested in Podcast
                    </label>
                    <p className="text-xs text-slate-500">
                      {salesData.interestedInPodcast ? "Customer wants to be on our podcast" : "Customer hasn't shown podcast interest yet"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={salesData.interestedInPodcast}
                  onChange={(e) => handleSalesChange('interestedInPodcast', e.target.checked)}
                  className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
              </div>

              {/* Upsell Offered */}
              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Gift className="text-amber-600" size={20} />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Upsell Offered
                    </label>
                    <p className="text-xs text-slate-500">
                      {salesData.upsellOffered ? "We offered additional services to customer" : "Haven't offered upsell yet"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={salesData.upsellOffered}
                  onChange={(e) => handleSalesChange('upsellOffered', e.target.checked)}
                  className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-slate-300 rounded"
                />
              </div>

              {/* Upsell Completed */}
              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Star className="text-rose-600" size={20} />
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Upsell Completed
                    </label>
                    <p className="text-xs text-slate-500">
                      {salesData.upsellCompleted ? "Customer bought the additional services" : "Upsell not completed yet"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={salesData.upsellCompleted}
                  onChange={(e) => handleSalesChange('upsellCompleted', e.target.checked)}
                  className="h-5 w-5 text-rose-600 focus:ring-rose-500 border-slate-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Stage History Timeline */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              Stage History
            </h4>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              
              <div className="space-y-6">
                {stageHistory.map((stage, index) => {
                  const colors = getStageColorClasses(stage, stage.isCompleted, stage.isCurrent);
                  const IconComponent = stage.icon;
                  
                  return (
                    <div key={index} className="relative flex items-start gap-4">
                      {/* Stage dot */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full border-2 ${colors.border} ${colors.bg} flex items-center justify-center`}>
                        <IconComponent size={20} className={colors.text} />
                      </div>
                      
                      {/* Stage content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className={`text-sm font-medium ${stage.isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                            {stage.name}
                          </h5>
                          {stage.isCurrent && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              Current
                            </span>
                          )}
                          {stage.isCompleted && !stage.isCurrent && (
                            <CheckCircle size={14} className="text-green-500" />
                          )}
                        </div>
                        
                        <p className="text-xs text-slate-500 mb-2">
                          {stage.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar size={12} />
                          <span>{formatDate(stage.date)}</span>
                          {stage.isCurrent && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-indigo-50 text-indigo-600">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Current Stage: {customer.stage || "Not set"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {stageHistory.filter(s => s.isCompleted).length} of {stageHistory.length} stages completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-700">
                    {Math.round((stageHistory.filter(s => s.isCompleted).length / stageHistory.length) * 100)}%
                  </div>
                  <div className="text-xs text-slate-500">Complete</div>
                </div>
              </div>
            </div>
          </div>
          

            {/* <h4 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h4> */}

            {/* <div className="flex flex-wrap gap-3"> */}
              {/* ✉️  E‑mail */}
              {/* <a
                href={`mailto:${customer.email}`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mail size={16} />
                Send&nbsp;Email
              </a> */}

              {/* 📞  Phone */}
              {/* <a
                href={`tel:${customer.phone}`}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Phone size={16} />
                Call&nbsp;Customer
              </a> */}

              {/* 📸  Instagram */}
              {/* {extractInstagramUrl(customer.instagram) && (
                <a
                  href={extractInstagramUrl(customer.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
                >
                  {/* use your own icon set or keep the svg */}
                  {/* <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 2 .2 2.5.4.6.2 1.1.5 1.6.9.5.4.7 1 .9 1.6.2.5.3 1.3.4 2.5.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 2-.4 2.5-.2.6-.5 1.1-.9 1.6-.4.5-1 .7-1.6.9-.5.2-1.3.3-2.5.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-2-.2-2.5-.4-.6-.2-1.1-.5-1.6-.9-.5-.4-.7-1-.9-1.6-.2-.5-.3-1.3-.4-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-2 .4-2.5.2-.6.5-1.1.9-1.6.4-.5 1-.7 1.6-.9.5-.2 1.3-.3 2.5-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.8.1-1.2.1-1.9.3-2.3.5-.6.2-1 .5-1.4.9-.4.4-.6.9-.9 1.4-.2.4-.4 1.1-.5 2.3-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.2.3 1.9.5 2.3.2.6.5 1 .9 1.4.4.4.9.6 1.4.9.4.2 1.1.4 2.3.5 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.2-.1 1.9-.3 2.3-.5.6-.2 1-.5 1.4-.9.4-.4.6-.9.9-1.4.2-.4.4-1.1.5-2.3.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.2-.3-1.9-.5-2.3-.2-.6-.5-1-.9-1.4-.4-.4-.9-.6-1.4-.9-.4-.2-1.1-.4-2.3-.5-1.3-.1-1.7-.1-4.8-.1zm0 3.7a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2zm0 1.8a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm4.7-2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                  </svg> */}
                  {/* {extractInstagramHandle(customer.instagram)} */}
                {/* </a> */}
              {/* )} */}
            {/* </div> */}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
} 