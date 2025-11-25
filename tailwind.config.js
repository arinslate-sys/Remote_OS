/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 關鍵：指向 app/ 和 components/ 兩個根目錄下的資料夾
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}