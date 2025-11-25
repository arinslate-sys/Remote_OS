// components/Header.tsx
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react'; // 引入圖標

export default function Header() {
  const t = useTranslations('App');
  const currentLocale = useLocale();
  const pathname = usePathname();
  
  // 控制手機版選單開關的狀態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const nextLocale = currentLocale === 'en' ? 'zh' : 'en';
  const switchLabel = currentLocale === 'en' ? t('nav_lang_switch_zh') : t('nav_lang_switch_en');

  // 處理路徑替換邏輯
  let redirectPath = '/';
  if (pathname) {
    // 如果 pathname 包含 locale (e.g. /en/tools), 替換它
    if (pathname.startsWith(`/${currentLocale}`)) {
      redirectPath = pathname.replace(`/${currentLocale}`, `/${nextLocale}`);
    } else if (pathname === '/') {
      // 特殊情況處理根路徑
      redirectPath = `/${nextLocale}`;
    } else {
      // 如果是純路徑，直接加上新 locale
      redirectPath = `/${nextLocale}${pathname}`;
    }
  }

  return (
    // 使用 sticky 定位，並設定 z-index 確保在最上層
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 1. LOGO 區域 */}
          <div className="flex-shrink-0">
            <Link href={`/${currentLocale}`} className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"/>
              Orbit
            </Link>
          </div>

          {/* 2. 桌面版導航 (Desktop Nav) - 僅在 md (中型螢幕) 以上顯示 */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link href={`/${currentLocale}`} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              {t('nav_home')}
            </Link>
            <Link href={`/${currentLocale}`} className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              {t('nav_tools')}
            </Link>
            
            {/* 語言切換按鈕 */}
            <a 
              href={redirectPath}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 rounded-full hover:bg-slate-700 transition-all"
            >
              <Globe size={14} />
              {switchLabel}
            </a>
          </nav>

          {/* 3. 手機版漢堡按鈕 (Mobile Menu Button) - 僅在 md 以下顯示 */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* 4. 手機版下拉選單 (Mobile Dropdown) */}
      {/* 根據 isMenuOpen 狀態決定是否顯示 */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl animation-slide-down">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link 
              href={`/${currentLocale}`} 
              className="block px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)} // 點擊後關閉選單
            >
              {t('nav_home')}
            </Link>
            <Link 
              href={`/${currentLocale}`} 
              className="block px-3 py-3 text-base font-bold text-slate-700 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav_tools')}
            </Link>
            
            <div className="pt-4 border-t border-slate-100 mt-2">
              <a 
                href={redirectPath}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all"
              >
                <Globe size={16} />
                {switchLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}