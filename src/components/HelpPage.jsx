import React, { useState } from "react";
import { ChevronDown, ChevronRight, Users, FileText, BookOpen, Award, Star, Filter, CheckCircle, XCircle, Clock, Calendar, MessageSquare, Flag, Tag } from "lucide-react";

export default function HelpPage() {
  const [openSections, setOpenSections] = useState({
    stages: false,
    fields: false,
    submissions: false,
    navigation: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Main Help Section */}
      <div className="bg-white shadow-sm border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Help & Support</h2>
        <p className="text-slate-600 mb-4">
          Welcome to WI Thinkers! This is your guide to understanding how our magazine dashboard works. 
          Everything is designed to be super simple and easy to use.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Tips:</h3>
          <ul className="list-disc pl-5 space-y-1 text-blue-800 text-sm">
            <li>Make sure you are connected to the internet</li>
            <li>Use the sidebar to move between different pages</li>
            <li>Click "View Details" on any customer row to see more information</li>
            <li>On mobile, tap the hamburger menu to open/close the sidebar</li>
          </ul>
        </div>

        <p className="text-slate-500 text-sm">
          For further support, contact us at{" "}
          <a
            href="mailto:support@withinkers.com"
            className="text-indigo-600 underline hover:text-indigo-800"
          >
            support@withinkers.com
          </a>
        </p>
      </div>

      {/* CRM Glossary Section */}
      <div className="bg-white shadow-sm border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <BookOpen className="text-indigo-600" size={24} />
          CRM Glossary & Usage Tips
        </h2>
        <p className="text-slate-600 mb-6">
          Learn what all the words and buttons mean in our system. Everything is explained in simple terms!
        </p>

        {/* Stages Section */}
        <div className="border border-slate-200 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('stages')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Users className="text-green-600" size={20} />
              <h3 className="font-semibold text-slate-900">Customer Stages - Where is your customer?</h3>
            </div>
            {openSections.stages ? (
              <ChevronDown className="text-slate-500" size={20} />
            ) : (
              <ChevronRight className="text-slate-500" size={20} />
            )}
          </button>
          
          {openSections.stages && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-slate-600 text-sm">
                Stages tell you where each customer is in their journey with us. Think of it like a game where customers move through different levels:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-800 mb-1">🌱 Warm-up</h4>
                  <p className="text-yellow-700 text-sm">Just getting to know us. Like saying "hello" for the first time!</p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-medium text-blue-800 mb-1">🤝 Meeting</h4>
                  <p className="text-blue-700 text-sm">We're talking and planning their photoshoot together.</p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <h4 className="font-medium text-purple-800 mb-1">✏️ Editing</h4>
                  <p className="text-purple-700 text-sm">We're making their photos look perfect and beautiful.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-1">💰 Sales</h4>
                  <p className="text-green-700 text-sm">They're ready to buy their photos or magazine feature!</p>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <h4 className="font-medium text-indigo-800 mb-1">⭐ Pro</h4>
                  <p className="text-indigo-700 text-sm">They're a professional model or photographer who works with us regularly.</p>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <h4 className="font-medium text-orange-800 mb-1">🚀 Rising</h4>
                  <p className="text-orange-700 text-sm">They're new but showing great potential to become a Pro!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fields Section */}
        <div className="border border-slate-200 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('fields')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Tag className="text-purple-600" size={20} />
              <h3 className="font-semibold text-slate-900">Customer Fields - What information do we track?</h3>
            </div>
            {openSections.fields ? (
              <ChevronDown className="text-slate-500" size={20} />
            ) : (
              <ChevronRight className="text-slate-500" size={20} />
            )}
          </button>
          
          {openSections.fields && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-slate-600 text-sm">
                These are the different pieces of information we keep about each customer:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <Calendar className="text-blue-600" size={16} />
                    Meeting Date
                  </h4>
                  <p className="text-slate-700 text-sm">When we're planning to meet or talk with the customer.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <MessageSquare className="text-green-600" size={16} />
                    Notes
                  </h4>
                  <p className="text-slate-700 text-sm">Important things to remember about this customer.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <Star className="text-yellow-600" size={16} />
                    Theme
                  </h4>
                  <p className="text-slate-700 text-sm">What style of photos they want (Fashion, Body Art, Red Carpet, etc.).</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <Flag className="text-red-600" size={16} />
                    Quality Flag
                  </h4>
                  <p className="text-slate-700 text-sm">A special mark for customers who are really good or need extra attention.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    Congratulated
                  </h4>
                  <p className="text-slate-700 text-sm">Whether we've sent them a congratulations message for their work.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1 flex items-center gap-2">
                    <BookOpen className="text-indigo-600" size={16} />
                    Magazine
                  </h4>
                  <p className="text-slate-700 text-sm">Which magazine they're interested in (ALPHERO, BLACKCRUZE, etc.).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submissions Section */}
        <div className="border border-slate-200 rounded-lg mb-4">
          <button
            onClick={() => toggleSection('submissions')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-indigo-600" size={20} />
              <h3 className="font-semibold text-slate-900">Submissions - Photo submissions from customers</h3>
            </div>
            {openSections.submissions ? (
              <ChevronDown className="text-slate-500" size={20} />
            ) : (
              <ChevronRight className="text-slate-500" size={20} />
            )}
          </button>
          
          {openSections.submissions && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-slate-600 text-sm">
                When customers send us their photos, we track them here. Here's what each status means:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-800 mb-1 flex items-center gap-2">
                    <Clock className="text-yellow-600" size={16} />
                    Pending
                  </h4>
                  <p className="text-yellow-700 text-sm">We're still looking at their photos and deciding.</p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-1 flex items-center gap-2">
                    <CheckCircle className="text-green-600" size={16} />
                    Accepted
                  </h4>
                  <p className="text-green-700 text-sm">Great! We love their photos and want to use them.</p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-medium text-red-800 mb-1 flex items-center gap-2">
                    <XCircle className="text-red-600" size={16} />
                    Rejected
                  </h4>
                  <p className="text-red-700 text-sm">We can't use these photos, but we'll tell them why nicely.</p>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Submission Fields:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div><strong>Instagram Handle:</strong> Their Instagram username</div>
                  <div><strong>Quality Flag:</strong> Special mark for really good submissions</div>
                  <div><strong>Reviewer Notes:</strong> What we think about their photos</div>
                  <div><strong>Theme Tag:</strong> What style their photos are (Fashion, Body Art, etc.)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Section */}
        <div className="border border-slate-200 rounded-lg">
          <button
            onClick={() => toggleSection('navigation')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-blue-600" size={20} />
              <h3 className="font-semibold text-slate-900">Navigation - How to move around the dashboard</h3>
            </div>
            {openSections.navigation ? (
              <ChevronDown className="text-slate-500" size={20} />
            ) : (
              <ChevronRight className="text-slate-500" size={20} />
            )}
          </button>
          
          {openSections.navigation && (
            <div className="px-4 pb-4 space-y-3">
              <p className="text-slate-600 text-sm">
                Use the sidebar on the left to move between different pages:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1">🏠 Dashboard</h4>
                  <p className="text-slate-700 text-sm">See a quick overview of everything - like a bird's eye view!</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1">👥 Customers</h4>
                  <p className="text-slate-700 text-sm">See all your customers in a big list. Click any row to see details.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1">📄 Submissions</h4>
                  <p className="text-slate-700 text-sm">Look at all the photos customers have sent us.</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <h4 className="font-medium text-slate-800 mb-1">📊 Overview</h4>
                  <p className="text-slate-700 text-sm">See charts and graphs about your customers and sales.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 