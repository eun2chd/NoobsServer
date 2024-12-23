/** @type {import('tailwindcss').Config} */
/**@import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap'); */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        blackHanSans: ["'Black Han Sans'", "sans-serif"],
        notoSansKR: ["'Noto Sans KR'", "sans-serif"],
        protestGuerrilla: ["'Protest Guerrilla'", "cursive"],
        beaufort: ["Beaufort", "serif"],
      },
      screens: {
        xs: "425px",
        change: "700px",
      },
      backgroundImage: {
        mobileScreen: "url('/mobile_Login.jpg')",
        mobileContainer: "url('/mobile_Container.jpg')",
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
    mode: "jit",
  },
  plugins: [],
};
