// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';

// 這裡會自動尋找根目錄下的 i18n.ts
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 你的其他設定...
};

export default withNextIntl(nextConfig);