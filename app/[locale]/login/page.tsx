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