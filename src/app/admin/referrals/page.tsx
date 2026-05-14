import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpRight,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/clientApp';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface Referral {
  id: string;
  clientName: string;
  sourceType: string;
  sourceName: string;
  status: 'pending' | 'assessing' | 'approved' | 'denied';
  createdAt: any;
  sourcePhone: string;
  reason: string;
}

export default function ReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'referrals'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const referralData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Referral[];
      
      setReferrals(referralData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching referrals:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'referrals', id), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    assessing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    denied: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const filteredReferrals = referrals.filter(ref => 
    ref.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.sourceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ref.sourceType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <Link 
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center">
              <FileText className="w-8 h-8 mr-3 text-blue-600" />
              Incoming Referrals
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search referrals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm"
              />
            </div>
            <button className="p-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Referrals List */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Applicant</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Source</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Date Received</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredReferrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold dark:bg-blue-900/30">
                            {ref.clientName ? ref.clientName[0] : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{ref.clientName}</p>
                            <p className="text-xs text-zinc-500">{ref.sourcePhone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{ref.sourceName}</p>
                        <p className="text-xs text-zinc-500">{ref.sourceType}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-zinc-500">
                        {formatDate(ref.createdAt)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[ref.status || 'pending']}`}>
                          {ref.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleUpdateStatus(ref.id, 'approved')}
                            className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" 
                            title="Approve"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(ref.id, 'denied')}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" 
                            title="Deny"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(ref.id, 'assessing')}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" 
                            title="Mark as Assessing"
                          >
                            <Clock className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {!loading && filteredReferrals.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">No referrals found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
          
          {filteredReferrals.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 dark:text-zinc-400">No referrals found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
