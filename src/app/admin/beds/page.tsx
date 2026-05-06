'use client';

import React, { useState } from 'react';
import { 
  Bed, 
  UserPlus, 
  UserMinus, 
  Lock, 
  MoreVertical, 
  Plus, 
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Settings2,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

interface BedData {
  id: string;
  room: string;
  status: 'occupied' | 'available' | 'maintenance';
  residentName?: string;
  residentId?: string;
  lockboxId?: string;
  notes?: string;
}

const INITIAL_BEDS: BedData[] = [
  { id: '101-A', room: 'Room 101', status: 'occupied', residentName: 'John Doe', lockboxId: 'LB-001' },
  { id: '101-B', room: 'Room 101', status: 'available', lockboxId: 'LB-002' },
  { id: '102-A', room: 'Room 102', status: 'maintenance', lockboxId: 'LB-003', notes: 'Needs mattress replacement' },
  { id: '102-B', room: 'Room 102', status: 'available', lockboxId: 'LB-004' },
];

export default function BedManagementPage() {
  const [beds, setBeds] = useState<BedData[]>(INITIAL_BEDS);
  const [searchTerm, setSearchTerm] = useState('');
  
  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.status === 'occupied').length,
    available: beds.filter(b => b.status === 'available').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };

  const addBed = () => {
    const newId = `BED-${Math.floor(Math.random() * 900) + 100}`;
    setBeds([...beds, { id: newId, room: 'New Room', status: 'available', lockboxId: `LB-${newId.split('-')[1]}` }]);
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
              <Bed className="w-8 h-8 mr-3 text-blue-600" />
              Bed Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search beds or residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64 text-sm"
              />
            </div>
            <button 
              onClick={addBed}
              className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Bed
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Beds" value={stats.total} icon={<Bed className="w-5 h-5" />} color="blue" />
          <StatCard label="Occupied" value={stats.occupied} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
          <StatCard label="Available" value={stats.available} icon={<Plus className="w-5 h-5" />} color="emerald" />
          <StatCard label="Maintenance" value={stats.maintenance} icon={<Settings2 className="w-5 h-5" />} color="orange" />
        </div>

        {/* Beds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {beds.map((bed) => (
            <div 
              key={bed.id}
              className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    bed.status === 'occupied' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                    bed.status === 'maintenance' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    <Bed className="w-6 h-6" />
                  </div>
                  <button className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{bed.id}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {bed.room}
                  </p>
                </div>

                <div className="space-y-4">
                  {bed.status === 'occupied' ? (
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-bold mb-1">Resident</p>
                      <p className="font-bold text-zinc-900 dark:text-white mb-3">{bed.residentName}</p>
                      <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                        <Lock className="w-3 h-3 mr-2 text-blue-500" />
                        Lockbox: {bed.lockboxId}
                      </div>
                    </div>
                  ) : bed.status === 'maintenance' ? (
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                      <div className="flex items-center text-orange-600 dark:text-orange-400 mb-2">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        <span className="font-bold text-sm">Under Maintenance</span>
                      </div>
                      <p className="text-xs text-orange-600/70 dark:text-orange-400/70">{bed.notes}</p>
                    </div>
                  ) : (
                    <button className="w-full py-4 px-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                      <UserPlus className="w-5 h-5 mb-1" />
                      <span className="text-sm font-bold">Assign Resident</span>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-zinc-50/50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  bed.status === 'occupied' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                  bed.status === 'maintenance' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                }`}>
                  {bed.status}
                </span>
                {bed.status === 'occupied' && (
                  <button className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center">
                    <UserMinus className="w-3 h-3 mr-1" />
                    Discharge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-900/30',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-100 dark:border-green-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-900/30',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 border-orange-100 dark:border-orange-900/30',
  };

  return (
    <div className={`p-4 rounded-2xl border ${colors[color]} shadow-sm`}>
      <div className="flex items-center justify-between mb-2">
        <span className="p-2 bg-white/50 dark:bg-black/20 rounded-lg">{icon}</span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70">{label}</p>
    </div>
  );
}
