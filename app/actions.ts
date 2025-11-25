// src/app/actions.ts
'use server';

import { supabase } from '../lib/supabaseClient';
import { revalidatePath } from 'next/cache';

// 定義資料型別
export type City = {
  id: string;
  group_name: string;
  group_zone: string;
};

// 1. 讀取所有城市
export async function getCities() {
  const { data, error } = await supabase
    .from('tz_groups')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
  return data as City[];
}

// 2. 新增隨機城市 (演示用)
export async function addRandomCity() {
  // 準備一些預設城市池
  const cityPool = [
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'Berlin', zone: 'Europe/Berlin' },
    { name: 'Sydney', zone: 'Australia/Sydney' },
    { name: 'Dubai', zone: 'Asia/Dubai' },
    { name: 'Paris', zone: 'Europe/Paris' },
  ];

  const randomCity = cityPool[Math.floor(Math.random() * cityPool.length)];

  const { error } = await supabase
    .from('tz_groups')
    .insert({
      group_name: randomCity.name,
      group_zone: randomCity.zone,
    });

  if (error) {
    console.error('Error adding city:', error);
    return;
  }

  // 關鍵：告訴 Next.js 重新整理頁面數據
  revalidatePath('/');
}

// 3. 移除城市
export async function removeCity(id: string) {
  const { error } = await supabase.from('tz_groups').delete().eq('id', id);
  
  if (error) console.error('Error deleting city:', error);
  
  revalidatePath('/');
}