/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        sand: 'var(--sand)',
        cocoa: 'var(--cocoa)',
        ink: 'var(--ink)',
        blush: 'var(--blush)',
        moss: 'var(--moss)'
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        soft: 'var(--shadow-lg)',
        card: 'var(--shadow-md)',
        'card-hover': 'var(--shadow-xl)',
        glow: '0 0 60px -15px rgba(122, 95, 77, 0.3)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)'
      },
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)']
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out)',
        'in-out-expo': 'var(--ease-in-out)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      }
    }
  },
  plugins: []
};

