// app/actions.ts
'use server';

import { supabase } from './supabaseClient';

export interface City {
  id: string;
  group_name: string;
  group_zone: string;
}

// 隨機城市池 (Demo 用途)
const CITY_POOL = [
  { name: 'Tokyo', zone: 'Asia/Tokyo' },
  { name: 'New York', zone: 'America/New_York' },
  { name: 'London', zone: 'Europe/London' },
  { name: 'Sydney', zone: 'Australia/Sydney' },
  { name: 'Dubai', zone: 'Asia/Dubai' },
  { name: 'Singapore', zone: 'Asia/Singapore' },
];

export async function getCities(): Promise<City[]> {
  // 這是 Demo,返回空陣列即可
  // 如果你有 timezone_groups 表格,可以查詢資料庫
  return [];
}

export async function addRandomCity(): Promise<void> {
  // Demo 功能,不做實際操作
  console.log('Demo: Add city clicked');
}

export async function removeCity(id: string): Promise<void> {
  // Demo 功能,不做實際操作
  console.log('Demo: Remove city', id);
}