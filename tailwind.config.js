/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'border-red-500',
    'focus:ring-red-400',
    'text-red-600',
    'text-gray-800',
    'hidden',
    'block',
    'bg-green-600',
    'bg-red-600',
    'bg-yellow-500',
    // gender toggle
    'ring-2',
    'ring-indigo-500',
    'border-indigo-500',
    'bg-indigo-50'
  ],
  plugins: [],
}
