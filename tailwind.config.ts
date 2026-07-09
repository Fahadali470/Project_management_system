import type { Config } from 'tailwindcss'

const config: Config = {
  // Dark mode via class on <html> element
  darkMode: 'class',

  // Tell Tailwind where to look for class names (critical for purging unused styles)
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // Brand Color Palette — Indigo/Violet for a modern SaaS feel
      colors: {
        primary: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',  // Main brand color
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Neutral grays — slightly warm for a premium feel
        neutral: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Semantic colors for task priorities
        priority: {
          urgent: '#ef4444',   // red-500
          high:   '#f97316',   // orange-500
          medium: '#eab308',   // yellow-500
          low:    '#22c55e',   // green-500
          none:   '#6b7280',   // gray-500
        },
        // App surface colors for dark mode
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0f0f0f',
          'dark-elevated': '#1a1a1a',
          'dark-border': '#2a2a2a',
        },
      },

      // Typography
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },

      // Custom font sizes for design system consistency
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },

      // Layout tokens
      spacing: {
        'sidebar': '260px',
        'sidebar-collapsed': '72px',
        'header': '64px',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Border radius
      borderRadius: {
        '4xl': '2rem',
      },

      // Box shadows — elevated cards for depth
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'glow': '0 0 20px rgb(99 102 241 / 0.3)',
        'glow-lg': '0 0 40px rgb(99 102 241 / 0.4)',
      },

      // Animation durations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },

      // Keyframes for custom animations
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgb(99 102 241 / 0.4)' },
          '50%': { boxShadow: '0 0 20px rgb(99 102 241 / 0.8)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },

      // Animation utilities
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },

      // Z-index scale
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'toast': '1080',
      },
    },
  },

  plugins: [],
}

export default config
