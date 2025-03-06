/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/component/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hakgyo: ["HakgyoansimDunggeunmisoTTF-B", "sans-serif"], // ✅ 사용자 정의 폰트 추가
      },
    },
  },
  plugins: [],
};
