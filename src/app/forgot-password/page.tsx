"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
            <Mail size={28} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Forgot password?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="mt-8 bg-white p-8 shadow-2xl shadow-zinc-200/50 rounded-3xl dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
          {!isSent ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-zinc-200 rounded-xl leading-5 bg-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-lg shadow-blue-500/20"
              >
                Reset Password
                <Send size={16} />
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Check your email</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                We've sent password reset instructions to <span className="font-bold">{email}</span>.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="text-sm font-bold text-blue-600 hover:text-blue-500"
              >
                Didn't receive it? Click to retry
              </button>
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/login" className="font-semibold text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-white inline-flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
