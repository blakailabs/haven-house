'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Bed,
  Calendar,
  Phone,
  FileText,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

interface Resident {
  id: string;
  name: string;
  bed: string;
  entryDate: string;
  phone: string;
  status: 'active' | 'graduated' | 'discharged';
  compliance: 'good' | 'warning' | 'critical';
}

const INITIAL_RESIDENTS: Resident[] = [
  { id: 'RES-001', name: 'John Doe', bed: '101-A', entryDate: '2026-04-15', phone: '(555) 111-2222', status: 'active', compliance: 'good' },
  { id: 'RES-002', name: 'Michael Scott', bed: '102-A', entryDate: '2026-05-01', phone: '(555) 333-4444', status: 'active', compliance: 'warning' },
  { id: 'RES-003', name: 'Jim Halpert', bed: '101-B', entryDate: '2026-03-20', phone: '(555) 555-6666', status: 'active', compliance: 'good' },
  { id: 'RES-004', name: 'Dwight Schrute', bed: '102-B', entryDate: '2026-02-10', phone: '(555) 777-8888', status: 'graduated', compliance: 'good' },
];

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>(INITIAL_RESIDENTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredResidents = residents.filter(res => 
    res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    res.bed.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Active Residents
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm"
              />
            </div>
            <button className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              <UserPlus className="w-4 h-4 mr-2" />
              New Admission
            </button>
          </div>
        </div>

        {/* Residents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.map((res) => (
            <div 
              key={res.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-zinc-400 dark:text-zinc-500">
                      {res.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">{res.name}</h3>
                      <p className="text-xs text-zinc-500 flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        Bed {res.bed}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    res.compliance === 'good' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    res.compliance === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {res.compliance} Compliance
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 mr-3 text-zinc-400" />
                    Entry: {res.entryDate}
                  </div>
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 mr-3 text-zinc-400" />
                    {res.phone}
                  </div>
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <FileText className="w-4 h-4 mr-3 text-zinc-400" />
                    4 signed documents
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link 
                    href={`/admin/residents/${res.id}`}
                    className="flex-1 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
                  >
                    View Profile
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                  <button className="p-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {res.compliance === 'warning' && (
                <div className="px-6 py-2 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/20 flex items-center text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3 h-3 mr-2" />
                  Drug test pending or missed chore
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
