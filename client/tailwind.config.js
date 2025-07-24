/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme colors - these will be used with dark: variants
        bg: {
          light: '#ffffff',
          dark: '#0f172a',
        },
        surface: {
          light: '#f8fafc',
          dark: '#1e293b',
        },
        card: {
          light: '#ffffff',
          dark: '#1e293b',
        },
        text: {
          primary: {
            light: '#1e293b',
            dark: '#f8fafc',
          },
          secondary: {
            light: '#64748b',
            dark: '#94a3b8',
          },
        },
        // Primary color with default value that will be overridden by CSS variables
        // This ensures bg-primary works even before CSS variables are loaded
        primary: {
          DEFAULT: '#2563eb', // Default light mode primary color
          light: '#2563eb',
          dark: '#60a5fa',
        },
        border: {
          light: '#e2e8f0',
          dark: '#334155',
        },
      },
      // Add utilities for easy theme application
      backgroundColor: (theme) => ({
        ...theme('colors'),
        'theme-bg': 'var(--bg-color, #ffffff)',
        'theme-surface': 'var(--surface-color, #f8fafc)',
        'theme-card': 'var(--card-color, #ffffff)',
        'primary': 'var(--primary, #2563eb)',
      }),
      textColor: (theme) => ({
        ...theme('colors'),
        'theme-text': 'var(--text-primary)',
        'theme-text-secondary': 'var(--text-secondary)',
      }),
      borderColor: (theme) => ({
        ...theme('colors'),
        'theme-border': 'var(--border-color)',
      }),
      ringColor: (theme) => ({
        ...theme('colors'),
        primary: 'var(--primary)',
      }),
    },
  },
  plugins: [],
}
