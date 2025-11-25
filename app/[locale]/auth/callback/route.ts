import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 修正:從 referer 或 cookie 獲取語言,或使用預設值
  const referer = request.headers.get('referer');
  let locale = 'en'; // 預設語言
  
  if (referer) {
    // 嘗試從 referer URL 中提取語言
    const refererUrl = new URL(referer);
    const pathSegments = refererUrl.pathname.split('/');
    if (pathSegments[1] === 'zh' || pathSegments[1] === 'en') {
      locale = pathSegments[1];
    }
  }

  // 登入成功後跳轉回對應語言的首頁
  return NextResponse.redirect(`${origin}/${locale}`);
}