/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        vsm: "600px",
        vmd: "700px",
      },
      colors: {
        primary: "#3498db",
        main: "#212529",
        "main-lighter": "#2d3338",
        "main-danger": "#e63737",
        "dark-tab": "#181818",
        "dark-active-tab": "#1f1f1f",
        "light-tab": "#f8f8f8",
        "light-active-tab": "#ffffff",
        dark: "#343436",
      },
      spacing: {
        navD: "50px",
      },
      boxShadow: {
        headerShadow: "rgba(0, 0, 0, 0.03) 0px 10px 50px",
      },
    },
  },
  plugins: [],
};
