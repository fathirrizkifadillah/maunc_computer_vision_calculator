import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        maunc: {
          yellow: {
            DEFAULT: '#F59E0B',
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
          },
          dark: {
            950: '#070A10',
            900: '#0C111C',
            850: '#111726',
            800: '#182032',
            700: '#243048',
            600: '#344360',
          },
          metal: {
            DEFAULT: '#64748B',
            light: '#94A3B8',
            dark: '#475569',
          },
          red: {
            DEFAULT: '#DC2626',
            hover: '#B91C1C',
          },
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"SF Mono"',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Courier New"',
          'monospace',
        ],
      },
      boxShadow: {
        'tactile': '0 2px 4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'tactile-active': 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
        'yellow-subtle': '0 0 15px rgba(245, 158, 11, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
