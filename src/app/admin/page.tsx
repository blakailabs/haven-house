"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Bed, 
  FileText, 
  AlertCircle, 
  ArrowUpRight, 
  Plus,
  CheckCircle2,
  Clock,
  ClipboardCheck
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/clientApp';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export default function AdminDashboard() {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeResidents: '0',
    availableBeds: '0',
    pendingReferrals: '0',
    tasksToday: '0'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    // Fetch recent referrals
    const qReferrals = query(
      collection(db, 'referrals'), 
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    
    const unsubscribeReferrals = onSnapshot(qReferrals, (snapshot) => {
      const referralData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReferrals(referralData);
    });

    // Listen to pending referrals count
    const qPending = query(collection(db, 'referrals'));
    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const pendingCount = snapshot.docs.filter(d => d.data().status === 'pending').length;
      setStats(prev => ({ ...prev, pendingReferrals: pendingCount.toString() }));
    });

    // Listen to active residents
    const qResidents = query(collection(db, 'residents'));
    const unsubscribeResidents = onSnapshot(qResidents, (snapshot) => {
      const activeCount = snapshot.docs.filter(d => d.data().status === 'active').length;
      setStats(prev => ({ ...prev, activeResidents: activeCount.toString() }));
    });

    // Listen to available beds
    const qBeds = query(collection(db, 'beds'));
    const unsubscribeBeds = onSnapshot(qBeds, (snapshot) => {
      const availableCount = snapshot.docs.filter(d => !d.data().isOccupied).length;
      setStats(prev => ({ ...prev, availableBeds: availableCount.toString() }));
    });

    // Listen to tasks today
    const today = new Date().toISOString().split('T')[0];
    const qTasks = query(collection(db, 'tasks'));
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const tasksToday = snapshot.docs.filter(d => d.data().dueDate === today && !d.data().completed).length;
      setStats(prev => ({ ...prev, tasksToday: tasksToday.toString() }));
      setLoading(false);
    });

    return () => {
      unsubscribeReferrals();
      unsubscribePending();
      unsubscribeResidents();
      unsubscribeBeds();
      unsubscribeTasks();
    };
  }, []);

  const statsConfig = [
    { label: 'Active Residents', value: stats.activeResidents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Available Beds', value: stats.availableBeds, icon: Bed, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Referrals', value: stats.pendingReferrals, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Tasks Today', value: stats.tasksToday, icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Welcome back. Here's what's happening at Haven House today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          New Admission
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{stat.value}</h3>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions / Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Recent Referrals</h2>
              <Link href="/admin/referrals" className="text-sm font-medium text-blue-600 hover:text-blue-500">View all</Link>
            </div>
            <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {loading ? (
                <div className="p-12 flex justify-center">
                  <div className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : referrals.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">No referrals yet.</div>
              ) : referrals.map((ref, i) => (
                <div key={ref.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30">
                      {ref.clientName ? ref.clientName[0] : 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{ref.clientName}</h4>
                      <p className="text-xs text-zinc-500">From: {ref.sourceName} • {formatRelativeTime(ref.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      ref.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      ref.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                      ref.status === 'denied' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {ref.status || 'Pending'}
                    </span>
                    <Link href={`/admin/referrals`} className="p-2 hover:bg-zinc-200 rounded-lg dark:hover:bg-zinc-700 transition-colors text-zinc-400">
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickLinkCard 
              href="/admin/beds" 
              title="Bed Management" 
              desc="Manage occupancy and assignments" 
              icon={<Bed className="w-5 h-5" />} 
            />
            <QuickLinkCard 
              href="/admin/checklists" 
              title="Staff Checklists" 
              desc="Track daily & weekly house tasks" 
              icon={<ClipboardCheck className="w-5 h-5" />} 
            />
          </div>
        </div>

        {/* House Status / Alerts */}
        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50">House Alerts</h2>
            <AlertCircle size={18} className="text-zinc-400" />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-red-50 border border-red-100 dark:bg-red-900/10 dark:border-red-900/20">
              <div className="text-red-600 pt-1">
                <AlertCircle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-900 dark:text-red-400">Bed 4 Lockbox Issue</h4>
                <p className="text-xs text-red-700 dark:text-red-500/80 mt-1">Resident reported lockbox malfunction. Needs maintenance.</p>
              </div>
            </div>
            
            <div className="flex gap-4 p-4 rounded-2xl bg-blue-50 border border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20">
              <div className="text-blue-600 pt-1">
                <Users size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400">New Intake Today</h4>
                <p className="text-xs text-blue-700 dark:text-blue-500/80 mt-1">Michael Scott scheduled for intake at 2:00 PM.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLinkCard({ href, title, desc, icon }: { href: string; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <Link 
      href={href}
      className="flex items-center p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
    >
      <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 mr-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{desc}</p>
      </div>
      <ArrowUpRight className="ml-auto w-4 h-4 text-zinc-300 group-hover:text-blue-500 transition-colors" />
    </Link>
  );
}
