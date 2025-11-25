'use client';

import { useEffect, useState } from 'react';
import { Radio, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../supabaseClient';

export default function DashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const [time, setTime] = useState<Date | null>(null);
  const [monthSpend, setMonthSpend] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    fetchFinanceData();
    return () => clearInterval(timer);
  }, []);

  const fetchFinanceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startOfMonth = new Date().toISOString().slice(0, 7) + '-01';
      const { data, error } = await supabase
        .from('fin_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .lt('amount', 0)
        .gte('start_date', startOfMonth);

      if (error) throw error;
      const total = data?.reduce((sum, log) => sum + Math.abs(log.amount), 0) || 0;
      setMonthSpend(Math.round(total));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="min-h-full p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Status Badge */}
        <div className="flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5 w-fit">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            System Online
          </span>
        </div>

        {/* Large Clock Widget */}
        <div className="w-full bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl">
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-[1.3rem] p-12 text-center">
            <div className="flex items-center justify-center space-x-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Radio size={12} className="animate-pulse" />
              <span>Local Time</span>
            </div>
            
            <div className="font-mono text-7xl font-bold tracking-tighter text-white tabular-nums mb-2">
              {time ? formatTime(time) : '00:00:00'}
            </div>
            <div className="text-slate-500 text-lg font-medium">
              {time ? formatDate(time) : 'Loading...'}
            </div>
          </div>
        </div>

        {/* Finance Summary Card */}
        <Link href={`/${locale}/dashboard/finance`} className="block group">
          <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between hover:border-blue-500/30 transition-all shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                <Wallet size={28} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Current Burn Rate
                </div>
                <div className="text-3xl font-mono font-bold text-white flex items-baseline gap-2">
                  ${loading ? '...' : monthSpend}
                  <span className="text-sm text-slate-600 font-sans font-normal">/ Month</span>
                </div>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight size={20} />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}