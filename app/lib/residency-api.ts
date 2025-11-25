// app/lib/residency-api.ts
import { supabase } from './supabase';

export async function getResidencyLogCount(userId: string): Promise<number> {
    if (!userId) return 0;

    const { count, error } = await supabase
        .from('residency_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

    if (error) {
        console.error("Supabase Error fetching residency count:", error);
        return 0;
    }

    return count ?? 0;
}