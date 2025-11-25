'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Radio, Wallet, MapPin, Settings, LogOut } from 'lucide-react';
import { supabase } from '../app/supabaseClient';

export default function MobileNav({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
  };

  const menuItems = [
    { icon: Radio, label: 'Dashboard', href: `/${locale}/dashboard` },
    { icon: Wallet, label: 'Finance', href: `/${locale}/dashboard/finance` },
    { icon: MapPin, label: 'Visa', href: `/${locale}/dashboard/visa` },
    { icon: Settings, label: 'Settings', href: `/${locale}/dashboard/settings` },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-xl font-black text-white">Orbit</span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Slide-in Menu */}
          <div className="md:hidden fixed top-0 right-0 h-full w-64 bg-slate-950 border-l border-slate-800 z-50 p-6 space-y-4 animate-slide-in">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>

            {/* Mini Clock */}
            <div className="text-center py-4 mt-8 border-b border-slate-800">
              <div className="text-2xl font-mono font-bold text-white tabular-nums">
                {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2 mt-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all w-full mt-8 border-t border-slate-800 pt-8"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </>
      )}
    </>
  );
}