"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileCheck, 
  Calendar,
  BookOpen,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'My Dashboard', href: '/portal' },
  { icon: ClipboardList, label: 'Daily Chores', href: '/portal/chores' },
  { icon: FileCheck, label: 'Sign Documents', href: '/portal/forms' },
  { icon: BookOpen, label: 'House Rules', href: '/portal/rules' },
  { icon: MessageSquare, label: 'Support Request', href: '/portal/support' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 hidden lg:block">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Resident Portal
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto px-6 py-6">
          <div className="bg-blue-600 rounded-2xl p-4 text-white shadow-lg shadow-blue-500/20">
            <HelpCircle size={20} className="mb-2" />
            <h4 className="text-xs font-bold mb-1">Need help?</h4>
            <p className="text-[10px] text-blue-100 opacity-80 leading-relaxed">
              If you have any questions or need to report an issue, please contact the House Manager.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
