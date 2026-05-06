'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ClipboardCheck, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldAlert, 
  FileText,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function ReferralPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 text-center border border-zinc-200 dark:border-zinc-800">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Referral Submitted</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Thank you for submitting a referral to Haven House. Our team will review the information and contact you shortly.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-colors w-full"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
              <ClipboardCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
            Resident Referral Form
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Submit a referral for a potential resident to Haven House Recovery.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-zinc-900 shadow-xl rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Referral Source Section */}
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center mb-6">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </span>
                Referral Source Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Source Type
                  </label>
                  <select className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                    <option>Select source...</option>
                    <option>Jail/Correctional Facility</option>
                    <option>Hospital/Treatment Center</option>
                    <option>Social Worker/Case Manager</option>
                    <option>Self-Referral</option>
                    <option>Family Member</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Contact Person Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Client Section */}
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center mb-6">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </span>
                Client Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Client Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Full legal name"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Date of Birth
                  </label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Current Location
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Shelby County Jail"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Assessment Section */}
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center mb-6">
                <span className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                  <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </span>
                Clinical & Background Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Primary Reason for Referral
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Please describe the client's current situation and why Haven House is being considered."
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Medical/Mental Health Notes
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Any medications, diagnoses, or special needs we should be aware of."
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Acknowledgment Section */}
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-zinc-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-zinc-700 dark:text-zinc-300">
                    I certify that the information provided is accurate to the best of my knowledge.
                  </label>
                  <p className="text-zinc-500 dark:text-zinc-400">
                    By submitting this form, you acknowledge that Haven House will review this referral and follow up based on current availability and program fit.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-lg font-bold rounded-2xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-xl shadow-blue-500/25 disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Referral
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="mt-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          Need assistance? Contact our admissions team directly at <span className="font-semibold text-blue-600 dark:text-blue-400">admissions@havenhouse.org</span>
        </p>
      </div>
    </div>
  );
}
