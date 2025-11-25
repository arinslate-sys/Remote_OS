// app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import "../globals.css"; 
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server'; 

const inter = Inter({ subsets: ["latin"] });
const locales = ['en', 'zh']; 

export const metadata = {
  title: 'Remote Life OS',
  description: 'Modular toolkit for digital nomads.',
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; 
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as any)) notFound();

  setRequestLocale(locale);

  let messages;
  try {
    // 維持最穩定的 require 載入方式
    messages = require(`../../messages/${locale}.json`); 
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    notFound(); 
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      {/* 優化：在 body 加入預設深色背景，防止重新整理時閃爍白色 */}
      <body className={`${inter.className} bg-slate-950 text-white`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}