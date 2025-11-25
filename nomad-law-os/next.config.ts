/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    // 關鍵配置：告訴 Next.js 你的專案內容位於 src/ 目錄
    experimental: {
      // 啟用 App Router 對 src/ 目錄的支持
      appDir: true,
      // 啟用對 src/ 目錄的常規支持
      // 這通常是通過設置這個來暗示的
    },
    // 如果需要，也可以明確設置
    // srcDir: 'src' 
};

module.exports = nextConfig;