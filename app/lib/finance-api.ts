import { supabase } from './supabase';

// 定義回傳的資料結構
interface FinanceStats {
  todaySpending: number;
  monthTotal: number;
  disciplineScore: number;
}

export async function getFinanceStats(userId: string): Promise<FinanceStats> {
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date().toISOString().slice(0, 7) + '-01';

  // 1. 獲取今日花費
  const { data: todayLog } = await supabase
    .from('fin_daily_logs')
    .select('daily_spending')
    .eq('user_id', userId)
    .eq('log_date', today)
    .single();

  // 2. 獲取本月總花費 (這裡做簡單加總，進階版可以用 View)
  const { data: monthLogs } = await supabase
    .from('fin_daily_logs')
    .select('daily_spending')
    .eq('user_id', userId)
    .gte('log_date', startOfMonth);

  const monthTotal = monthLogs?.reduce((sum, log) => sum + (log.daily_spending || 0), 0) || 0;

  // 3. 獲取紀律分數 (從 View 讀取)
  // 注意：Materialized View 需要刷新才有數據，這裡先讀取，若無則為 0
  const { data: rankData } = await supabase
    .from('v_user_discipline_rank')
    .select('raw_discipline_score')
    .eq('user_id', userId)
    .single();

  return {
    todaySpending: todayLog?.daily_spending || 0,
    monthTotal: monthTotal,
    disciplineScore: rankData?.raw_discipline_score || 0,
  };
}