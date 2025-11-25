import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css"; 

// [Commercial Grade Configuration] Force Edge Runtime usage
// This allows your site to deploy to Cloudflare global nodes for maximum speed
export const runtime = 'edge';

export const metadata: Metadata = {
  title: "Cipher", 
  description: "Operating System for Global Mobility",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  // Next.js 15/16 specification: params must be an asynchronous Promise
  params: Promise<{ locale: string }>;
}) {
  // Must await before reading locale, otherwise it will error
  const { locale } = await params;

  // Get translation messages on the server side
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