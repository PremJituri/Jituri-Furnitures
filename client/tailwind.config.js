/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: '#EEF5FC',
        surface: '#FFFFFF',
        'card-muted': '#F4F8FC',
        lime: '#5BBBF7',
        lavender: '#D59BF6',
        ink: '#111111',
        primary: '#0B1B2B',
        secondary: '#4A5D73',
        'border-subtle': '#D3E2F0',
        dark: '#0B1B2B',
        accent: '#5BBBF7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      lineHeight: {
        editorial: '1.15',
      },
      borderRadius: {
        sharp: '2px',
        subtle: '4px',
      },
      boxShadow: {
        soft: '0 8px 24px -6px rgba(11, 27, 43, 0.07)',
        mockup: '0 24px 48px -12px rgba(11, 27, 43, 0.14)',
      },
    },
  },
  plugins: [],
};
