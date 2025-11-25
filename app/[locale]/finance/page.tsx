'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '../../../components/Header'; 
import { 
  Wallet, 
  TrendingUp, 
  Zap, 
  ArrowLeft, 
  Calendar, 
  Tag, 
  DollarSign, 
  ChevronLeft, 
  ChevronRight,
  ClipboardList,
  ArrowDown, // 費用
  ArrowUp // 收入
} from 'lucide-react';
import Link from 'next/link';

export default function FinancePage() {
  const t = useTranslations('Finance');
  const supabase = createClientComponentClient();
  
  // 表單狀態
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('cat_food');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [note, setNote] = useState('');
  
  // *** 新增狀態：收入/費用切換，預設為費用 (Expense) ***
  const [isIncome, setIsIncome] = useState(false); 
  
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [dailyCost, setDailyCost] = useState<string | null>(null);
  const [showNoteInput, setShowNoteInput] = useState(false); 

  // 初始化日期 (預設今天)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
  }, []);

  // 日期操作輔助函數 (保持不變)
  const addDays = (dateStr: string, days: number) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };
  const handlePrevDay = () => {
    if (!startDate || !endDate) return;
    setStartDate(prev => addDays(prev, -1));
    setEndDate(prev => addDays(prev, -1));
  };
  const handleNextDay = () => {
    if (!startDate || !endDate) return;
    setStartDate(prev => addDays(prev, 1));
    setEndDate(prev => addDays(prev, 1));
  };

  // 點擊分類的處理函數
  const handleCategoryClick = (id: string) => {
    setCategory(id);
    // 零星收入 (Irregular Income) 處理邏輯：如果切換到 income mode，讓用戶自訂備註
    if (id === 'cat_other' || id === 'cat_income') { 
      setShowNoteInput(true);
    } else {
      setShowNoteInput(false);
      setNote(''); 
    }
  };

  // 自動計算每日分攤成本
  useEffect(() => {
    // 只有在 expense 模式下計算 amortized cost (攤提成本)
    if (!isIncome && amount && startDate && endDate) { 
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
      
      if (diffDays > 0) {
        const daily = (parseFloat(amount) / diffDays).toFixed(2);
        setDailyCost(t('hint_amortization', { days: diffDays, daily: daily }));
      } else {
        setDailyCost(null);
      }
    } else {
      setDailyCost(null);
    }
  }, [isIncome, amount, startDate, endDate, t]);

  // 處理送出
  const handleLog = async () => {
    if (!amount || !category || !startDate || !endDate) return;
    setLoading(true);
    setStatusMsg('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user logged in');

      const finalNote = category === 'cat_other' && note ? `[Other: ${note}]` : note;
      
      // *** 關鍵修正：金額根據模式，決定正負號 ***
      const finalAmount = parseFloat(amount) * (isIncome ? 1 : -1); 
      
      // 寫入 fin_transactions 表格
      const { error } = await supabase
        .from('fin_transactions')
        .insert({
          user_id: user.id,
          amount: finalAmount, // 這裡會是正數 (收入) 或負數 (費用)
          category: category,
          start_date: startDate,
          end_date: endDate,
          note: finalNote,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setStatusMsg(t('success_msg'));
      
      setAmount('');
      setNote('');
      
    } catch (err: any) {
      console.error('Log Error:', err);
      setStatusMsg(err.message || 'Error saving log.');
    } finally {
      setLoading(false);
    }
  };

  // 分類選項
  const categories = [
    { id: 'cat_food', icon: '🍔', type: 'expense' },
    { id: 'cat_housing', icon: '🏠', type: 'expense' },
    { id: 'cat_transport', icon: '🚕', type: 'expense' },
    { id: 'cat_work', icon: '☕', type: 'expense' },
    { id: 'cat_visa', icon: '🛂', type: 'expense' },
    // 收入選項
    { id: 'cat_income', icon: '💰', type: 'income' }, 
    { id: 'cat_other', icon: '📦', type: 'expense' }, 
  ];

  // 根據 isIncome 狀態決定要顯示的分類
  const filteredCategories = categories.filter(cat => 
    isIncome ? cat.type === 'income' || cat.id === 'cat_other' : cat.type === 'expense'
  );


  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <div className="opacity-80 hover:opacity-100 transition-opacity">
        <Header />
      </div>

      <main className="max-w-md mx-auto px-6 py-8 flex flex-col items-center space-y-6">
        
        {/* 標題區 */}
        <div className="text-center space-y-2 w-full relative mb-4">
          <Link href="/en" className="absolute left-0 top-1 text-slate-500 hover:text-white transition-colors p-2 -ml-2">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-slate-400 text-sm">{t('subtitle')}</p>
        </div>

        {/* 懶人輸入卡片 */}
        <div className="w-full bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl space-y-6">
          
          {/* *** 收入/費用切換開關 *** */}
          <div className="flex bg-slate-950 rounded-xl p-1 mb-6 border border-slate-800">
            <button
              onClick={() => setIsIncome(false)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                !isIncome 
                  ? 'bg-red-600/30 text-red-300 shadow-lg shadow-red-900/20' 
                  : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <ArrowDown size={20} /> 費用 (Expense)
            </button>
            <button
              onClick={() => setIsIncome(true)}
              className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                isIncome 
                  ? 'bg-green-600/30 text-green-300 shadow-lg shadow-green-900/20' 
                  : 'text-slate-500 hover:bg-slate-800'
              }`}
            >
              <ArrowUp size={20} /> 收入 (Income)
            </button>
          </div>


          {/* 1. 金額 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <DollarSign size={12} /> {isIncome ? "INCOME AMOUNT (USD)" : t('label_today_spending')}
            </label>
            <div className="relative">
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 px-4 text-3xl font-bold placeholder:text-slate-700 focus:ring-0 outline-none transition-all ${isIncome ? 'text-green-400 focus:border-green-500' : 'text-red-400 focus:border-red-500'}`}
              />
            </div>
          </div>

          {/* 2. 分類 (Grid 選擇) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Tag size={12} /> {t('label_category')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  // 根據模式過濾按鈕
                  className={`p-3 rounded-xl text-sm font-bold border transition-all flex flex-col items-center gap-1
                    ${category === cat.id 
                      ? 'bg-blue-600 border-blue-500 text-white' 
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}
                    ${(isIncome && cat.type !== 'income' && cat.id !== 'cat_other') ? 'hidden' : ''}
                    ${(!isIncome && cat.type === 'income') ? 'hidden' : ''}
                  `}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[10px] uppercase">{t(cat.id)}</span>
                </button>
              ))}
            </div>
          </div>


          {/* 3. 日期範圍與導航 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} /> {t('label_date_range')}
            </label>
            
            {/* 日期輸入框 */}
            <div className="flex gap-2">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:border-blue-500 outline-none"
              />
              <span className="text-slate-600 self-center">to</span>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-2 px-3 text-sm text-white focus:border-blue-500 outline-none"
              />
            </div>

            {/* 快速導航按鈕 */}
            <div className="flex gap-2 mt-2">
              <button 
                onClick={handlePrevDay}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-colors"
              >
                <ChevronLeft size={14} /> Prev Day
              </button>
              <button 
                onClick={handleNextDay}
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 transition-colors"
              >
                Next Day <ChevronRight size={14} />
              </button>
            </div>
            
            {/* 分攤提示 */}
            {dailyCost && (
              <div className="text-center text-xs text-blue-400 font-mono bg-blue-900/20 py-2 rounded-lg border border-blue-900/50 animate-pulse mt-2">
                {dailyCost}
              </div>
            )}
          </div>
          
          {/* 4. [新增] 自定義備註輸入框 (用於 Income 或 Other) */}
          {showNoteInput && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList size={12} /> Custom Note
              </label>
              <input 
                type="text" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g., Souvenir Shopping or Freelance Payment"
                className="w-full bg-slate-950 border-2 border-slate-800 rounded-xl py-3 px-3 text-sm text-white placeholder:text-slate-700 focus:border-blue-500 outline-none"
              />
            </div>
          )}

          {/* 送出按鈕 */}
          <button 
            onClick={handleLog}
            disabled={loading || !amount}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg active:scale-95 mt-4 
              ${isIncome 
                ? 'bg-green-600 hover:bg-green-500 shadow-green-900/30' 
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30'}
              disabled:bg-slate-800 disabled:text-slate-600 text-white`}
          >
            {loading ? 'Saving...' : t('btn_save')}
          </button>

          {statusMsg && (
            <div className={`text-center text-sm font-medium animate-pulse ${statusMsg.includes('Error') || statusMsg.includes('No user') ? 'text-red-400' : 'text-green-400'}`}>
              {statusMsg}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}