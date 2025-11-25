'use server';

import { supabase } from './supabaseClient';

export interface City {
  id: string;
  group_name: string;
  group_zone: string;
}

const CITY_POOL = [
  { name: 'Tokyo', zone: 'Asia/Tokyo' },
  { name: 'New York', zone: 'America/New_York' },
  { name: 'London', zone: 'Europe/London' },
  { name: 'Sydney', zone: 'Australia/Sydney' },
  { name: 'Dubai', zone: 'Asia/Dubai' },
  { name: 'Singapore', zone: 'Asia/Singapore' },
];

export async function getCities(): Promise<City[]> {
  return [];
}

export async function addRandomCity(): Promise<void> {
  console.log('Demo: Add city clicked');
}

export async function removeCity(id: string): Promise<void> {
  console.log('Demo: Remove city', id);
}