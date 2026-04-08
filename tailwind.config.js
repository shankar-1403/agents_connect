/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E4E8C',
        'primary-foreground': '#F8FAFC',
        secondary: '#C9A227',
        'secondary-foreground': '#0F172A',
        foreground: '#0F172A',
        'muted-foreground': '#475569',
        background: '#F5F7FA',
        card: '#FFFFFF',
        border: '#E2E8F0',
        accent: '#DBEAFE',
        destructive: '#DC2626',
        'brand-navy': '#0F2D52',
        'brand-blue': '#1E4E8C',
        'brand-blue-light': '#1FA2FF',
        'brand-gold': '#C9A227',
        'brand-gold-light': '#E8CB72',
        'brand-emerald': '#10B981',
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(90deg, #1FA2FF 0%, #1E4E8C 55%, #C9A227 100%)',
        'gradient-gold': 'linear-gradient(90deg, #E8CB72 0%, #C9A227 100%)',
      },
      boxShadow: {
        premium: '0 12px 30px rgba(15, 23, 42, 0.10)',
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
        elevated: '0 20px 45px rgba(15, 23, 42, 0.16)',
        'glow-gold': '0 12px 35px rgba(201, 162, 39, 0.45)',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(16px, -20px) scale(1.08)' },
          '66%': { transform: 'translate(-14px, 12px) scale(0.94)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 rgba(30, 78, 140, 0)' },
          '50%': { boxShadow: '0 0 24px rgba(31, 162, 255, 0.42)' },
        },
      },
      animation: {
        blob: 'blob 8s ease-in-out infinite',
        'blob-delay': 'blob 9s ease-in-out infinite 1.5s',
        'blob-delay-2': 'blob 10s ease-in-out infinite 3s',
        'pulse-glow': 'pulse-glow 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
