/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 'selector' 전략을 사용하면 미디어 쿼리보다 클래스명(.dark)이 우선순위를 갖습니다.
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [],
}
