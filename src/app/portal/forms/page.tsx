'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  PenTool, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface Document {
  id: string;
  title: string;
  status: 'signed' | 'pending' | 'needs_review';
  dateAdded: string;
  description: string;
}

const DOCUMENTS: Document[] = [
  { id: '1', title: 'House Rules & Code of Conduct', status: 'pending', dateAdded: '2026-05-06', description: 'Agreement to follow all Haven House community guidelines.' },
  { id: '2', title: 'HIPAA Release & Consent', status: 'signed', dateAdded: '2026-05-01', description: 'Authorization to share medical information for care coordination.' },
  { id: '3', title: 'Financial Responsibility Agreement', status: 'pending', dateAdded: '2026-05-06', description: 'Outline of program fees and payment expectations.' },
  { id: '4', title: 'Medication Storage Policy', status: 'pending', dateAdded: '2026-05-06', description: 'Rules regarding the use and storage of prescribed medications.' },
];

export default function ResidentFormsPage() {
  const [docs, setDocs] = useState<Document[]>(DOCUMENTS);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white flex items-center">
            <FileText className="w-8 h-8 mr-3 text-blue-600" />
            Documents & Signatures
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Please review and sign all pending documents to maintain compliance with house policies.
          </p>
        </div>

        {/* Alert for Pending Actions */}
        {docs.some(d => d.status === 'pending') && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/20 rounded-2xl flex items-start gap-4">
            <div className="text-amber-600 mt-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 dark:text-amber-400">Action Required</h4>
              <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1">
                You have {docs.filter(d => d.status === 'pending').length} documents awaiting your signature.
              </p>
            </div>
          </div>
        )}

        {/* Documents List */}
        <div className="space-y-4">
          {docs.map((doc) => (
            <div 
              key={doc.id}
              className={`bg-white dark:bg-zinc-900 p-6 rounded-3xl border transition-all hover:shadow-md ${
                doc.status === 'pending' 
                  ? 'border-blue-200 dark:border-blue-900/30' 
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl ${
                    doc.status === 'signed' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600' 
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                  }`}>
                    {doc.status === 'signed' ? <ShieldCheck className="w-6 h-6" /> : <PenTool className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-white">{doc.title}</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{doc.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-zinc-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        Added {doc.dateAdded}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {doc.status === 'signed' ? (
                    <button className="flex items-center px-4 py-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </button>
                  ) : (
                    <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                      Sign Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Completed Section */}
        <div className="mt-12 text-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
          <CheckCircle2 className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            All your signed documents are securely stored and accessible here at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
