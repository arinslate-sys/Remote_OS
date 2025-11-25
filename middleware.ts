import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';

export async function middleware(req: NextRequest) {
  // 1. 先執行 next-intl 邏輯，產生一個帶有 Locale 處理的 Response
  const handleI18nRouting = createIntlMiddleware({
    locales: ['en', 'zh'],
    defaultLocale: 'en'
  });
  
  const res = handleI18nRouting(req);

  // 2. 接著初始化 Supabase Client，並將剛才的 res 傳進去
  // 這樣 Supabase 就會把 Auth Cookie 寫入到 *同一個* Response 物件中
  const supabase = createMiddlewareClient({ req, res });
  
  // 3. 刷新 Session (這步至關重要，它會更新 Cookie 的有效期)
  await supabase.auth.getSession();

  // 4. 返回這個「同時包含 Locale 跳轉」和「Auth Cookie」的 Response
  return res;
}

export const config = {
  // 排除靜態資源、API 和不需要攔截的路徑
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};