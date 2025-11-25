// app/[locale]/page.tsx
import { getSession } from '../lib/auth-helpers';             
import { getResidencyLogCount } from '../lib/residency-api';  
import Dashboard from '../../components/Dashboard';       

// =========================================================
// [A] LandingPage 組件 (視覺優化版)
// =========================================================
function LandingPage({ locale }: { locale: string }) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 背景裝飾：藍色光暈 (Orbit 風格) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        {/* Logo / 標題 */}
        <div className="space-y-2">
          <div className="flex justify-center items-center gap-3 mb-4">
             <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]" />
             <span className="text-sm font-bold tracking-[0.2em] text-blue-400 uppercase">System Online</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            Orbit OS
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            The operating system for your global mobility, finance, and logistics.
          </p>
        </div>

        {/* 卡片式登入引導 */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <a 
            href={`/${locale}/login`} 
            className="block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Login / Initialize
          </a>
          <p className="mt-4 text-xs text-slate-500">
            v1.0 (MVP Sprint) • Authorized Access Only
          </p>
        </div>
      </div>
    </main>
  );
}

// =========================================================
// [B] 主要路由邏輯 (維持現狀，確保穩定)
// =========================================================
export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const session = await getSession();
  const userId = session?.user.id;

  // --- 狀態 1: 未登入用戶 ---
  if (!session || !userId) {
    return <LandingPage locale={locale} />;
  }

  // --- 狀態 2 & 3: 檢查用戶數據 ---
  // const logCount = await getResidencyLogCount(userId); 

  // *** 暫時註解：讓所有登入用戶都能直接進入 Dashboard 驗收功能 ***
  // if (logCount === 0) {
  //   return <LandingPage locale={locale} />; 
  // }

  // --- 狀態 3: 活躍用戶 ---
  return <Dashboard />;
}