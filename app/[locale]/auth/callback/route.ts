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

  const referer = request.headers.get('referer');
  let locale = 'en';
  
  if (referer) {
    const refererUrl = new URL(referer);
    const pathSegments = refererUrl.pathname.split('/');
    if (pathSegments[1] === 'zh' || pathSegments[1] === 'en') {
      locale = pathSegments[1];
    }
  }

  return NextResponse.redirect(`${origin}/${locale}`);
}