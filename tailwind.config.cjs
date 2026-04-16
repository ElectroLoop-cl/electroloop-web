/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0B1B32',
        'copper': '#B97333',
        'copper-light': '#D4894A',
        'copper-dark': '#9A5E28',
        'steel': '#8E9297',
        'ceramic': '#F4F4F4',
        'footer-dark': '#060D1A',
      },
      fontFamily: {
        // Manual de Marca: tipografía principal Arial / Helvetica
        sans: ['Arial', 'Helvetica', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '16px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'count-up': 'countUp 2s ease forwards',
        'circuit': 'circuit 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        circuit: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionDelay: {
        '100': '100ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'copper': '0 4px 20px rgba(185, 115, 51, 0.3)',
        'copper-lg': '0 8px 40px rgba(185, 115, 51, 0.4)',
        'blue-glow': '0 4px 20px rgba(11, 27, 50, 0.5)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
