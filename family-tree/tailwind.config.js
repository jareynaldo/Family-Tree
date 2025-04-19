/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2C5282',
        'primary-light': '#4299E1',
        secondary: '#4A5568',
        accent: '#ED8936',
      },
    },
  },
  plugins: [],
}

