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
        // FlipCars Brand Colors - Gold, Black, Gray theme
        primary: {
          DEFAULT: '#C9A961', // Gold - Main brand color (lighter beige-gold)
          50: '#FAF8F0',
          100: '#F5F1E1',
          200: '#EBE3C3',
          300: '#E1D5A5',
          400: '#D7C787',
          500: '#C9A961', // Main gold tone
          600: '#B8962F',
          700: '#9C7E27',
          800: '#80651F',
          900: '#644D17',
        },
        gold: {
          light: '#E8D5A0',
          DEFAULT: '#C9A961',
          dark: '#B8962F',
          darker: '#9C7E27',
        },
        secondary: {
          DEFAULT: '#000000', // Pure Black
          50: '#F8F8F8',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#B3B3B3',
          400: '#8C8C8C',
          500: '#666666',
          600: '#4D4D4D',
          700: '#333333',
          800: '#1A1A1A',
          900: '#000000', // Pure black
        },
        black: {
          DEFAULT: '#000000',
          light: '#1A1A1A',
          lighter: '#333333',
        },
        accent: {
          DEFAULT: '#0EA5E9', // Blue accent
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
          dark: '#065F46',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#92400E',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#991B1B',
        },
        neutral: {
          50: '#FAFAFA',  // Almost white
          100: '#F5F5F5', // Very light gray
          200: '#E8E8E8', // Light gray
          300: '#D1D1D1', // Medium light gray
          400: '#B3B3B3', // Medium gray
          500: '#8C8C8C', // Mid gray
          600: '#666666', // Dark gray
          700: '#4D4D4D', // Darker gray
          800: '#333333', // Very dark gray
          900: '#1A1A1A', // Almost black
        },
        gray: {
          light: '#E8E8E8',
          DEFAULT: '#8C8C8C',
          dark: '#4D4D4D',
          darker: '#333333',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '400' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'base': ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }], // 15px - more compact
        'lg': ['1rem', { lineHeight: '1.5rem', fontWeight: '500' }],
        'xl': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '500' }],
        '2xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        '3xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        '4xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '700' }],
      },
      spacing: {
        '0.5': '0.125rem', // 2px
        '1': '0.25rem',    // 4px
        '1.5': '0.375rem', // 6px
        '2': '0.5rem',     // 8px
        '2.5': '0.625rem', // 10px
        '3': '0.75rem',    // 12px
        '3.5': '0.875rem', // 14px
        '4': '1rem',       // 16px
        '5': '1.25rem',    // 20px
        '6': '1.5rem',     // 24px
        '8': '2rem',       // 32px
      },
      borderRadius: {
        'none': '0',
        'sm': '0.25rem',   // 4px
        DEFAULT: '0.375rem', // 6px
        'md': '0.5rem',    // 8px
        'lg': '0.625rem',  // 10px
        'xl': '0.75rem',   // 12px
        '2xl': '1rem',     // 16px
        'full': '9999px',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
