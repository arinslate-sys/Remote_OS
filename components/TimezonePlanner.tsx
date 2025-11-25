// src/components/TimezonePlanner.tsx
"use client";

import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { getCities, addRandomCity, removeCity, type City } from '@/app/actions';

export default function TimezonePlanner() {
  const t = useTranslations('Planner');
  const [now, setNow] = useState(DateTime.now());
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 新增：使用者位置名稱
  const [userLocation, setUserLocation] = useState('DETECTING...');

  // 1. 初始載入資料 & 偵測位置
  useEffect(() => {
    loadCities();
    detectLocation();
  }, []);

  // 2. 定時更新時間
  useEffect(() => {
    const timer = setInterval(() => setNow(DateTime.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 偵測使用者位置的函數
  function detectLocation() {
    try {
      // 使用瀏覽器內建 API 抓取時區 ID (例如: "Asia/Taipei")
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // 美化顯示：將 "Asia/Taipei" 轉為 "ASIA > TAIPEI"
      const formatted = timeZone.replace('_', ' ').replace('/', ' > ').toUpperCase();
      setUserLocation(formatted);
    } catch (e) {
      setUserLocation('LOCAL TIME');
    }
  }

  async function loadCities() {
    const data = await getCities();
    setCities(data);
    setIsLoading(false);
  }

  async function handleAdd() {
    await addRandomCity(); 
    loadCities(); 
  }

  async function handleRemove(id: string) {
    await removeCity(id);
    loadCities();
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        
        {/* Header Area: 自動顯示使用者位置 */}
        <div className="bg-slate-900 text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            {/* 這裡會顯示偵測到的位置 */}
            <h2 className="text-blue-400 text-xs uppercase tracking-[0.2em] font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {userLocation}
            </h2>
            
            <div className="text-5xl md:text-6xl font-mono font-light tracking-tight">
              {now.toFormat('HH:mm:ss')}
            </div>
            <div className="text-slate-400 mt-2 font-light">{now.toFormat('cccc, dd LLL yyyy')}</div>
          </div>
          
          {/* Add Button */}
          <button 
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-blue-900/50 flex items-center gap-2"
          >
            <span>+</span> {t('add_city')}
          </button>
        </div>

        {/* Body: City Grid */}
        <div className="p-8 min-h-[300px]">
          {isLoading ? (
            <div className="text-center text-gray-400 py-10 animate-pulse">Syncing with Orbit Database...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {cities.map((city) => {
                const zone = city.group_zone || 'UTC';
                const cityTime = now.setZone(zone);
                const offset = cityTime.offset - now.offset;
                const offsetHours = offset / 60;
                const offsetString = offsetHours > 0 ? `+${offsetHours}` : `${offsetHours}`;

                return (
                  <div key={city.id} className="group relative flex flex-col p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all">
                    <button 
                      onClick={() => handleRemove(city.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-1 transition-opacity"
                      title={t('remove')}
                    >
                      ✕
                    </button>

                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide truncate pr-4">
                        {city.group_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${offsetHours === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                        {offsetHours === 0 ? 'SYNC' : `${offsetString} HRS`}
                      </span>
                    </div>
                    <div className="text-3xl font-mono text-gray-900 mb-1">
                      {cityTime.toFormat('HH:mm')}
                    </div>
                    <div className="text-xs text-gray-400 flex justify-between items-end mt-auto">
                      <span>{cityTime.toFormat('ccc')}</span>
                      <span className="opacity-50">{zone.split('/')[1] || zone}</span>
                    </div>
                  </div>
                );
              })}
              
              {cities.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-10 border-2 border-dashed border-gray-200 rounded-xl">
                  No bases connected. Initialize adding a base.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>  
  );
}