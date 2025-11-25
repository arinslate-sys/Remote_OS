import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css"; 

// 【商業級配置】強制使用 Edge Runtime
// 這讓你的網站能部署到 Cloudflare 全球節點，實現極致速度
export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Orbit",
  description: "Operating System for Global Mobility",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  // Next.js 15/16 規範：params 必須是非同步 Promise
  params: Promise<{ locale: string }>;
}) {
  // 必須先 await 才能讀取 locale，否則會報錯
  const { locale } = await params;

  // 伺服器端獲取翻譯訊息
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}