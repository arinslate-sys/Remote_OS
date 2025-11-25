// app/[locale]/auth/callback/route.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('🔵 Callback triggered');
  console.log('📍 Locale:', locale);
  console.log('🔑 Code:', code);

  if (code) {
    const cookieStore = await cookies();
    
    // 使用 createServerClient 而不是 createRouteHandlerClient
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      }
    );

    try {
      console.log('⏳ Exchanging code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Exchange failed:', error.message);
        throw error;
      }

      if (data?.session) {
        console.log('✅ Session created successfully!');
        console.log('👤 User ID:', data.session.user.id);
        console.log('📧 Email:', data.session.user.email);
      }

    } catch (error: any) {
      console.error('🔴 Auth error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/${locale}/login`);
    }
  }

  console.log('🟢 Redirecting to:', `${requestUrl.origin}/${locale}`);
  return NextResponse.redirect(`${requestUrl.origin}/${locale}`);
}