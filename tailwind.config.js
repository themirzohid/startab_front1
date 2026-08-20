/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './node_modules/@material-tailwind/react/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce8ff',
          400: '#5b8def',
          500: '#3466df',
          600: '#274fc0',
          700: '#1f3f9c',
        },
      },
    },
  },
  plugins: [],
};
