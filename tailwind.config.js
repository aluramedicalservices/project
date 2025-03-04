/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Esto es clave para que Tailwind funcione con Vue
    "node_modules/preline/dist/*.js", // Soporte para Preline UI
  ],
  theme: {
    extend: {
      colors: {
        medblue: "#5b5ea7",
        healingblue: "#76c7d0",
        noxgrey: "#3d4448",
        sterilgrey: "#e7e7e7",
        vitalblue: "#f0f9fe",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
