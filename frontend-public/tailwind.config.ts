import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D4A259', // Rich Gold - matches reference images
          hover: '#C89533',
          light: '#E6B96D',
          dark: '#A67C2E',
        },
        secondary: {
          DEFAULT: '#000000', // Black from logo
          light: '#1A1A1A',
          dark: '#000000',
        },
        gold: {
          DEFAULT: '#D4A259', // Rich metallic gold
          light: '#E6B96D',
          dark: '#C89533',
          metallic: '#E8B253',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          red: '#EF4444',
          yellow: '#F59E0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
