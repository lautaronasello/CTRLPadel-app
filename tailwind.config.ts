import type { Config } from 'tailwindcss';

const config: Config = {
  // 1. Activa el modo oscuro manual leyendo la clase 'dark' del HTML
  darkMode: 'class',

  // 2. Le dice a Tailwind en qué carpetas buscar clases
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  // 3. Conecta tus variables de global.css con Tailwind
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        card: 'var(--card)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
};

export default config;
