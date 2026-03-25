/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./entrypoints/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // From UI-SPEC.md Color section
        dominant: '#6B7280', // gray-500
        secondary: '#9CA3AF', // gray-400
        accent: '#3B82F6', // blue-500
      },
      spacing: {
        // From UI-SPEC.md Spacing Scale section
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}
