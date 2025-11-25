'use client';

import { supabase } from '../../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

export default function LoginPage() {
  const [redirectUrl, setRedirectUrl] = useState('');
  const t = useTranslations('Login');
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    // 動態獲取當前網域
    const origin = window.location.origin;
    setRedirectUrl(`${origin}/${locale}/auth/callback`);
  }, [locale]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-2xl font-black tracking-tighter text-white mb-4 flex justify-center gap-2">
             <div className="w-3 h-3 bg-blue-600 rounded-full self-center animate-pulse"/>
             Orbit
          </div>
          <h1 className="text-xl font-bold text-slate-200 mb-2">{t('welcome')}</h1>
          <p className="text-slate-400 text-sm">
            {t('description')}
          </p>
        </div>
        
        {redirectUrl && (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                    inputBackground: '#1e293b',
                    inputText: 'white',
                    inputBorder: '#334155',
                  },
                },
              },
              className: {
                  container: 'w-full',
                  button: 'w-full px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2 text-white',
                  loader: 'animate-spin',
              }
            }}
            theme="dark"
            providers={['google']} 
            onlyThirdPartyProviders={true}
            redirectTo={redirectUrl}
          />
        )}
      </div>
    </div>
  );
}
```

---

### **3. 檢查 Supabase 設定**

你需要在 Supabase Dashboard 中設定正確的 Redirect URLs:

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 選擇你的專案
3. 前往 **Authentication** → **URL Configuration**
4. 在 **Redirect URLs** 中新增:
```
   https://cipher-sys.pages.dev/en/auth/callback
   https://cipher-sys.pages.dev/zh/auth/callback
```

5. 確保 **Site URL** 設定為:
```
   https://cipher-sys.pages.dev
```

---

### **4. 檢查環境變數**

確保 Cloudflare Pages 環境變數正確設定:

前往 Cloudflare Pages Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://vyyssqnmdkncbuftgkko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eXNzcW5tZGtuY2J1ZnRna2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDc3NDYsImV4cCI6MjA3OTIyMzc0Nn0.CNc6GdTLejMElAQHta2uko5T1z8ZmuPFeLxgF_tSivs