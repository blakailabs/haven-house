"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  ClipboardCheck, 
  FileText, 
  Calendar,
  Settings,
  Bell
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
  { icon: FileText, label: 'Referrals', href: '/admin/referrals' },
  { icon: Users, label: 'Residents', href: '/admin/residents' },
  { icon: Bed, label: 'Bed Management', href: '/admin/beds' },
  { icon: ClipboardCheck, label: 'Checklists', href: '/admin/checklists' },
  { icon: Calendar, label: 'Chores', href: '/admin/chores' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 hidden lg:block">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Main Menu
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
        
        <div className="mt-auto px-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 rounded-xl hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-all"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 rounded-xl hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-all">
            <Bell size={18} />
            Notifications
          </button>
        </div>
      </div>
    </aside>
  );
}
