'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Radio, Wallet, ArrowRight, MapPin } from 'lucide-react'; 
import Link from 'next/link';
import { supabase } from '../app/supabaseClient'; // ✅ 修正引入

export default function Dashboard() {
  const t = useTranslations('App');
  
  // 狀態管理
  const [time, setTime] = useState<Date | null>(null);
  const [monthSpend, setMonthSpend] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentLocale, setCurrentLocale] = useState('en');

  // 1. 初始化：設定時鐘與讀取數據
  useEffect(() => {
    // 設定時鐘
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);

    // 讀取當前語言 (從 URL)
    const path = window.location.pathname;
    if (path.includes('/zh')) setCurrentLocale('zh');

    // 讀取財務數據
    fetchFinanceData();

    return () => clearInterval(timer);
  }, []);

  // 2. 數據讀取函數
  const fetchFinanceData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 計算本月起始日
      const startOfMonth = new Date().toISOString().slice(0, 7) + '-01';

      // 查詢本月總支出 (修正為 fin_transactions)
      const { data, error } = await supabase
        .from('fin_transactions')
        .select('amount')
        .eq('user_id', user.id)
        .lt('amount', 0) // 只計算支出
        .gte('start_date', startOfMonth);

      if (error) throw error;

      // 計算總和並轉為正數顯示
      const total = data?.reduce((sum, log) => sum + Math.abs(log.amount), 0) || 0;
      setMonthSpend(Math.round(total));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 時間格式化
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
    <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500 selection:text-white pb-20">
      
      <main className="max-w-md mx-auto px-6 py-8 flex flex-col items-center space-y-6">
        
        {/* 狀態標籤 */}
        <div className="flex items-center space-x-2 bg-white/5 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
            {t('system_status')}
          </span>
        </div>

        {/* 核心儀表板 (時鐘) */}
        <div className="w-full bg-slate-900 rounded-3xl p-1 border border-slate-800 shadow-2xl relative group">
          <div className="absolute inset-0 bg-blue-600/5 blur-2xl rounded-3xl group-hover:bg-blue-600/10 transition-all duration-500" />
          
          <div className="bg-slate-950/80 backdrop-blur-xl rounded-[1.3rem] p-8 text-center relative overflow-hidden">
            {/* 裝飾光 */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

            <div className="flex items-center justify-center space-x-2 text-blue-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Radio size={12} className="animate-pulse" />
              <span>Local Time</span>
            </div>
            
            <div className="font-mono text-5xl font-bold tracking-tighter text-white tabular-nums mb-2">
              {time ? formatTime(time) : '00:00:00'}
            </div>
            <div className="text-slate-500 text-sm font-medium">
              {time ? formatDate(time) : 'Loading...'}
            </div>
          </div>
        </div>

        {/* 財務摘要卡片 (Finance Widget) */}
        <Link href={`/${currentLocale}/finance`} className="w-full group">
          <div className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between hover:border-blue-500/30 transition-all shadow-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-900/20 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                <Wallet size={24} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Current Burn Rate
                </div>
                <div className="text-2xl font-mono font-bold text-white flex items-baseline gap-1">
                  ${loading ? '...' : monthSpend}
                  <span className="text-xs text-slate-600 font-sans font-normal">/ Month</span>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* 快捷操作區 (Actions) */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {/* 按鈕 1: 記帳 */}
          <Link href={`/${currentLocale}/finance`} className="bg-slate-900/50 border border-slate-800/50 hover:bg-slate-800 hover:border-slate-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group">
            <Wallet size={20} className="text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300">Add Expense</span>
          </Link>
          
          {/* 按鈕 2: 簽證 (尚未實作，先放著) */}
          <div className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 opacity-50 cursor-not-allowed">
            <MapPin size={20} className="text-slate-500" />
            <span className="text-xs font-bold text-slate-600">Check Visa</span>
          </div>
        </div>

      </main>
    </div>
  );
}