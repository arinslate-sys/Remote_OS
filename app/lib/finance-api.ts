// 1. 修正路徑：往上一層 (..) 找到 app 資料夾下的 supabaseClient
import { supabase } from '../supabaseClient';

// 定義回傳的資料結構
export interface FinanceStats {
  todaySpending: number;
  monthTotal: number;
  disciplineScore: number;
}

export async function getFinanceStats(userId: string): Promise<FinanceStats> {
  // 取得今日與本月第一天的日期字串 (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = new Date().toISOString().slice(0, 7) + '-01';

  // 2. 獲取今日花費
  // 修正：改查 fin_transactions 表格，且只計算支出 (amount < 0)
  const { data: todayLogs, error: todayError } = await supabase
    .from('fin_transactions')
    .select('amount')
    .eq('user_id', userId)
    .lt('amount', 0) // 只抓支出
    .gte('created_at', `${today}T00:00:00`) // 簡單以建立時間為準
    .lte('created_at', `${today}T23:59:59`);

  if (todayError) {
    console.error('Error fetching today stats:', todayError);
  }

  // 計算總和並取絕對值 (轉為正數顯示)
  const todaySpending = todayLogs?.reduce((sum, log) => sum + Math.abs(log.amount), 0) || 0;

  // 3. 獲取本月總花費
  const { data: monthLogs, error: monthError } = await supabase
    .from('fin_transactions')
    .select('amount')
    .eq('user_id', userId)
    .lt('amount', 0)
    .gte('start_date', startOfMonth); // 使用交易日期篩選

  if (monthError) {
    console.error('Error fetching month stats:', monthError);
  }

  const monthTotal = monthLogs?.reduce((sum, log) => sum + Math.abs(log.amount), 0) || 0;

  // 4. 獲取紀律分數
  // (目前尚未建立 v_user_discipline_rank View，為避免報錯，先回傳預設值 0 或計算簡單邏輯)
  // 等未來建立 View 後再開啟
  const disciplineScore = 0; 

  return {
    todaySpending,
    monthTotal,
    disciplineScore,
  };
}