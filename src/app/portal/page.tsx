"use client";

import React from 'react';
import { 
  Calendar, 
  ClipboardList, 
  FileCheck, 
  BookOpen, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function PortalDashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Hello, {currentUser?.name}</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Welcome to your Haven House portal. Here is your status for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Chores */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Today's Chores</h2>
              </div>
              <span className="text-xs font-medium text-zinc-400">May 6, 2026</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl dark:bg-zinc-800">
                    <Clock size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Living Room Vacuuming</h4>
                    <p className="text-xs text-zinc-500">Morning (before 10 AM)</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-500">Mark Complete</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-800/50 dark:border-zinc-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl dark:bg-zinc-800">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-400 line-through">Kitchen Trash Emptying</h4>
                    <p className="text-xs text-zinc-400">Completed at 7:30 AM</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-500">Done</span>
              </div>
            </div>
            <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-50 dark:bg-zinc-800/30 dark:border-zinc-800">
              <button className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 flex items-center gap-1">
                View Weekly Schedule
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Pending Documents */}
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center gap-2">
              <FileCheck size={20} className="text-amber-500" />
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Pending Documents</h2>
            </div>
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
              <Link href="/portal/forms" className="p-6 flex items-center justify-between group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-50 rounded-2xl dark:bg-amber-900/10">
                    <AlertCircle size={20} className="text-amber-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">House Orientation Acknowledgment</h4>
                    <p className="text-xs text-zinc-500">Required before end of day</p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-300 group-hover:text-zinc-500 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Info Area */}
        <div className="space-y-8">
          {/* Bed/Room Info */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-4">My Assignment</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Assigned Bed</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Bed 4</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Lockbox ID</span>
                <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">LB-004</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Entry Date</span>
                <span className="font-bold text-zinc-700 dark:text-zinc-300">May 1, 2026</span>
              </div>
            </div>
          </div>

          {/* House Rules Shortcut */}
          <div className="bg-gradient-to-br from-zinc-900 to-black p-6 rounded-3xl text-white shadow-xl shadow-zinc-900/20">
            <BookOpen size={24} className="text-blue-400 mb-4" />
            <h3 className="text-lg font-bold mb-2">House Rules</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Review our community guidelines and policies to ensure a positive environment for everyone.
            </p>
            <button className="w-full py-3 bg-white text-zinc-900 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-all flex items-center justify-center gap-2">
              Read Rules
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
