import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35',
          50: '#FFE8E0',
          100: '#FFD4C6',
          200: '#FFB99A',
          300: '#FF9D6E',
          400: '#FF8452',
          500: '#FF6B35',
          600: '#FF4800',
          700: '#CC3A00',
          800: '#992B00',
          900: '#661D00',
        },
        secondary: {
          DEFAULT: '#004E89',
          50: '#E6F0F7',
          100: '#CCE1EF',
          200: '#99C3DF',
          300: '#66A5CF',
          400: '#3387BF',
          500: '#004E89',
          600: '#003E6E',
          700: '#002F52',
          800: '#001F37',
          900: '#00101B',
        },
        accent: {
          DEFAULT: '#1A659E',
          50: '#E7F2F8',
          100: '#CFE5F1',
          200: '#9FCBE3',
          300: '#6FB1D5',
          400: '#3F97C7',
          500: '#1A659E',
          600: '#15517E',
          700: '#103D5F',
          800: '#0A283F',
          900: '#051420',
        },
        success: '#5CB85C',
        warning: '#F0AD4E',
        danger: '#D9534F',
        neutral: {
          light: '#F4F4F9',
          dark: '#2C3E50',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
