// i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// 這裡的語言列表必須跟 middleware.ts 和 layout.tsx 一致
const locales = ['en', 'zh'];

export default getRequestConfig(async ({ requestLocale }) => {
  // Next.js 15: 等待 requestLocale 解析
  let locale = await requestLocale;

  // 如果沒有 locale 或 locale 不在列表中，設為預設 'en' 或回傳 404
  if (!locale || !locales.includes(locale as any)) {
    locale = 'en'; // 或者 notFound();
  }

  return {
    locale,
    // 這裡載入 messages 資料夾裡的 JSON
    messages: (await import(`./messages/${locale}.json`)).default
  };
});