'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Radio, Wallet, MapPin, Settings, LogOut } from 'lucide-react';
import { supabase } from '../app/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Sidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  const menuItems = [
    { icon: Radio, label: 'Dashboard', href: `/${locale}/dashboard`, exact: true },
    { icon: Wallet, label: 'Finance', href: `/${locale}/dashboard/finance` },
    { icon: MapPin, label: 'Visa', href: `/${locale}/dashboard/visa` },
    { icon: Settings, label: 'Settings', href: `/${locale}/dashboard/settings` },
  ];

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-950 border-r border-slate-800 h-screen sticky top-0">
      {/* Logo / Clock Area */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xl font-black text-white">Orbit</span>
        </div>
        
        {/* Mini Clock */}
        <div className="text-center py-4">
          <div className="text-3xl font-mono font-bold text-white tabular-nums">
            {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all w-full"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}