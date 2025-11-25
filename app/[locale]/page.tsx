import { useTranslations } from 'next-intl';
import TimezonePlanner from '../../../components/TimezonePlanner';
import Link from 'next/link';

export default function HomePage() {
  // 關鍵修復：必須宣告 t 函式才能在下面使用 t('title')
  const t = useTranslations('Index');

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <div className="pt-32 pb-16 text-center px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            System Online
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6 drop-shadow-2xl">
            {t('title')}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto leading-relaxed font-light">
            {t('description')}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link href="/login">
               <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/50 w-full sm:w-auto">
                {t('start_btn')}
              </button>
             </Link>
             <span className="text-xs text-slate-600 mt-2 sm:mt-0">
               v1.0 (MVP Sprint) • Authorized Access Only
             </span>
          </div>
        </div>
      </div>

      {/* Application Area */}
      <div className="px-4 pb-20 max-w-6xl mx-auto">
        <TimezonePlanner />
      </div>
    </div>
  );
}