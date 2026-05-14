'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Bed,
  Calendar,
  Phone,
  FileText,
  AlertTriangle,
  ArrowLeft,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/clientApp';
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'active' | 'graduated' | 'discharged';
  bed?: string;
  entryDate?: string;
  phone?: string;
  compliance?: 'good' | 'warning' | 'critical';
  createdAt?: unknown;
}

export default function ResidentsPage() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [formData, setFormData] = useState<Partial<Resident>>({
    firstName: '',
    lastName: '',
    email: '',
    status: 'active',
    bed: '',
    phone: '',
    compliance: 'good'
  });

  React.useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'residents'), orderBy('lastName', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resident[];
      setResidents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredResidents = residents.filter(res => {
    const fullName = `${res.firstName} ${res.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) ||
           (res.bed && res.bed.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleOpenModal = (resident?: Resident) => {
    if (resident) {
      setEditingResident(resident);
      setFormData(resident);
    } else {
      setEditingResident(null);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        status: 'active',
        bed: '',
        phone: '',
        compliance: 'good'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingResident(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    try {
      if (editingResident) {
        await updateDoc(doc(db, 'residents', editingResident.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'residents'), {
          ...formData,
          entryDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error('Error saving resident:', err);
      alert('Failed to save resident');
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    if (window.confirm('Are you sure you want to delete this resident?')) {
      try {
        await deleteDoc(doc(db, 'residents', id));
      } catch (err) {
        console.error('Error deleting resident:', err);
        alert('Failed to delete resident');
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
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              New Admission
            </button>
          </div>
        </div>

        {/* Residents Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredResidents.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-12 text-center border border-zinc-200 dark:border-zinc-800">
            <div className="inline-flex p-4 rounded-full bg-zinc-50 dark:bg-zinc-800 mb-4">
              <Users className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No residents found</h3>
            <p className="text-zinc-500 mt-1">Try adjusting your search or add a new admission.</p>
          </div>
        ) : (
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
                      {res.firstName?.[0]}{res.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {res.firstName} {res.lastName}
                      </h3>
                      <p className="text-xs text-zinc-500 flex items-center">
                        <Bed className="w-3 h-3 mr-1" />
                        Bed {res.bed || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    res.compliance === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    res.compliance === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {res.compliance || 'good'} Compliance
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <Calendar className="w-4 h-4 mr-3 text-zinc-400" />
                    Entry: {res.entryDate || 'N/A'}
                  </div>
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <Phone className="w-4 h-4 mr-3 text-zinc-400" />
                    {res.phone || 'No phone'}
                  </div>
                  <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                    <FileText className="w-4 h-4 mr-3 text-zinc-400" />
                    4 signed documents
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(res)}
                    className="flex-1 py-2.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl text-center text-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center"
                  >
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => handleDelete(res.id)}
                    className="p-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <AlertTriangle className="w-5 h-5" />
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
        )}
      </div>

      {/* Resident Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">
              {editingResident ? 'Edit Resident' : 'New Admission'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">First Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Last Name</label>
                  <input 
                    required
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email</label>
                <input 
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Phone</label>
                  <input 
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Bed Assignment</label>
                  <input 
                    type="text"
                    value={formData.bed || ''}
                    onChange={(e) => setFormData({...formData, bed: e.target.value})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                    placeholder="e.g. 101A"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Status</label>
                  <select 
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({...formData, status: e.target.value as 'active' | 'graduated' | 'discharged'})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="graduated">Graduated</option>
                    <option value="discharged">Discharged</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Compliance</label>
                  <select 
                    value={formData.compliance || 'good'}
                    onChange={(e) => setFormData({...formData, compliance: e.target.value as 'good' | 'warning' | 'critical'})}
                    className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-zinc-900 dark:text-white"
                  >
                    <option value="good">Good</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
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
                  Save Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
