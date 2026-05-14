'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bed, 
  Search, 
  ArrowLeft, 
  Plus, 
  CheckCircle2, 
  Settings2, 
  MapPin, 
  Lock, 
  AlertTriangle, 
  UserPlus, 
  UserMinus,
  Trash2,
  Edit
} from 'lucide-react';
import { db } from '@/lib/firebase/clientApp';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';

interface BedData {
  id: string;
  roomName: string;
  isOccupied: boolean;
  status?: 'occupied' | 'available' | 'maintenance';
  residentName?: string;
  residentId?: string;
  lockboxId?: string;
  notes?: string;
}

export default function BedManagementPage() {
  const [beds, setBeds] = useState<BedData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<BedData | null>(null);
  const [formData, setFormData] = useState<Partial<BedData>>({
    roomName: '',
    status: 'available',
    isOccupied: false,
    lockboxId: '',
    notes: '',
    residentName: ''
  });
  
  React.useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'beds'), orderBy('roomName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BedData[];
      setBeds(data);
    });

    return () => unsubscribe();
  }, []);

  const stats = {
    total: beds.length,
    occupied: beds.filter(b => b.isOccupied).length,
    available: beds.filter(b => !b.isOccupied && b.status !== 'maintenance').length,
    maintenance: beds.filter(b => b.status === 'maintenance').length,
  };

  const handleOpenModal = (bed?: BedData) => {
    if (bed) {
      setEditingBed(bed);
      setFormData(bed);
    } else {
      setEditingBed(null);
      setFormData({
        roomName: '',
        status: 'available',
        isOccupied: false,
        lockboxId: '',
        notes: '',
        residentName: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBed(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    // Auto-update isOccupied based on status
    const isOccupied = formData.status === 'occupied';
    
    try {
      if (editingBed) {
        await updateDoc(doc(db, 'beds', editingBed.id), {
          ...formData,
          isOccupied,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'beds'), {
          ...formData,
          isOccupied,
          createdAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving bed:", err);
      alert('Failed to save bed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this bed?')) {
      try {
        await deleteDoc(doc(db, 'beds', id));
      } catch (err) {
        console.error('Error deleting bed:', err);
        alert('Failed to delete bed');
      }
    }
  };

  const handleDischarge = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to discharge the resident from this bed?')) {
      try {
        await updateDoc(doc(db, 'beds', id), {
          status: 'available',
          isOccupied: false,
          residentName: '',
          residentId: '',
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.error('Error discharging resident:', err);
      }
    }
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
              onClick={() => handleOpenModal()}
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
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleOpenModal(bed)}
                      className="p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-blue-500 rounded-lg transition-colors"
                      title="Edit Bed"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(bed.id)}
                      className="p-2 text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-colors"
                      title="Delete Bed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">{bed.roomName}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {bed.status === 'occupied' ? 'Assigned' : 'Available'}
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
                    <button 
                      onClick={() => handleOpenModal(bed)}
                      className="w-full py-4 px-4 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-zinc-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                    >
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
                  <button 
                    onClick={() => handleDischarge(bed.id)}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center"
                  >
                    <UserMinus className="w-3 h-3 mr-1" />
                    Discharge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
              {editingBed ? 'Edit Bed' : 'Add New Bed'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Room/Bed Name</label>
                <input 
                  required
                  type="text"
                  value={formData.roomName || ''}
                  onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  placeholder="e.g. Room 101A"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                  <select 
                    value={formData.status || 'available'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'available' | 'occupied' | 'maintenance'})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Lockbox ID</label>
                  <input 
                    type="text"
                    value={formData.lockboxId || ''}
                    onChange={(e) => setFormData({...formData, lockboxId: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              {formData.status === 'occupied' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Resident Name</label>
                  <input 
                    type="text"
                    required={formData.status === 'occupied'}
                    value={formData.residentName || ''}
                    onChange={(e) => setFormData({...formData, residentName: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                    placeholder="Enter resident's name"
                  />
                </div>
              )}

              {formData.status === 'maintenance' && (
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Maintenance Notes</label>
                  <textarea 
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white h-24 resize-none"
                    placeholder="Describe maintenance required..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-4 py-2 font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                >
                  Save Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
