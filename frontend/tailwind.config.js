/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        body: "#f4f4f4",
        border: "#e1e2e3",
        card: "#ffffff",
        mainHeading: "#242424",
        subHeading: "#101010",
        textContent: "#898989",
        dark: {
          body: "#0f0f0f",
          card: "#1a1a1a",
          border: "#303030",
          mainHeading: "#e5e5e5",
          subHeading: "#a0a0a0",
          textContent: "#d9d9d9",
        },
        secondary: "#f7f7f8",
      },
      fontFamily: {
        Cal: ['"Cal Sans"', "system-ui", "sans-serif"],
        Manrope: ['"Manrope"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [], // 👈 no mtConfig here
};
