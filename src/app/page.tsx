import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Home, Users, Heart, ClipboardCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-purple-400 rounded-full blur-[120px]"></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-wider dark:bg-blue-900/20 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              Empowering Recovery through Community
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.1]">
              Welcome to <span className="text-blue-600">Haven House</span>
            </h1>
            
            <p className="text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Breaking the cycle of homelessness through structured recovery housing, 
              peer support, and holistic rehabilitation services.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/referral" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95"
              >
                Submit a Referral
                <ArrowRight size={20} />
              </Link>
              <Link 
                href="/login" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-zinc-200 bg-white text-zinc-900 font-bold text-lg hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white transition-all active:scale-95"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Home size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Safe Housing</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Structured living environment providing stability and security for residents in their recovery journey.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Peer Support</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Connection with others who share similar experiences, fostering mutual accountability and growth.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 hover:shadow-md transition-all group">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <ClipboardCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">Structured Recovery</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                Clear guidelines, daily chores, and responsibility tracking to build essential life skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                Our Mission: Focus Rehabilitation and Ministry Center
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white mt-1">
                    <ShieldCheck size={14} />
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Dedicated to providing a transition path for those exiting correctional facilities or experiencing homelessness.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white mt-1">
                    <Heart size={14} />
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Rooted in faith and community support, Haven House offers a sanctuary for renewal and permanent lifestyle change.
                  </p>
                </div>
              </div>
              <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Learn more about our programs
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square relative rounded-[40px] overflow-hidden shadow-2xl rotate-3">
                 {/* This would be an image of the house or team */}
                 <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 italic">
                    [Haven House Facility Image]
                 </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl border border-zinc-100 shadow-xl dark:bg-zinc-900 dark:border-zinc-800 -rotate-6 hidden sm:block">
                <p className="text-3xl font-bold text-blue-600">100%</p>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Success Oriented</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Home size={18} />
            </div>
            <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Haven House
            </span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2026 Haven House | Focus Rehabilitation and Ministry Center. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Privacy</Link>
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
