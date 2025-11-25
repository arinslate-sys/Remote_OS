import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  // 修正：動態獲取當前的網域 (例如 https://cipher-sys.pages.dev)
  // 而不是寫死 localhost
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 登入成功後，跳轉回首頁 (自動帶上語言前綴會更好，但先跳回根目錄確保成功)
  return NextResponse.redirect(`${origin}/zh`);
}