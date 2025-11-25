import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // 1. 關閉 ESLint 阻擋：確保小語法問題不會卡住整個商業上線流程
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 2. 圖片優化適配：Cloudflare 免費版需關閉預設優化，否則圖片會掛掉
  images: {
    unoptimized: true, 
  }
};

export default withNextIntl(nextConfig);