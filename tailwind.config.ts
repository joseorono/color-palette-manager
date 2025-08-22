import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Custom color palette for preview
        'preview-primary': 'var(--preview-primary)',
        'preview-secondary': 'var(--preview-secondary)',
        'preview-tertiary': 'var(--preview-tertiary)',
        'preview-background': 'var(--preview-background)',
        'preview-foreground': 'var(--preview-foreground)',
        'preview-card': 'var(--preview-card)',
        'preview-border': 'var(--preview-border)',
        'preview-muted': 'var(--preview-muted)',
        'preview-primary-foreground': 'var(--preview-primary-foreground)',
        'preview-secondary-foreground': 'var(--preview-secondary-foreground)',
        'preview-accent-foreground': 'var(--preview-accent-foreground)',
        'preview-card-foreground': 'var(--preview-card-foreground)',
        'preview-muted-foreground': 'var(--preview-muted-foreground)',

        // Custom color palette with shades
        'eerie-black': {
          50: '#f8f8f8',
          100: '#e8e8e8',
          200: '#d1d1d1',
          300: '#b4b4b4',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1f1f1f', // Original eerie-black
          DEFAULT: '#1f1f1f',
        },
        'eerie-black-2': {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#191919', // Original eerie-black-2
          DEFAULT: '#191919',
        },
        'azure-web': {
          50: '#e9fcff', // Original azure-web
          100: '#ccf7fe',
          200: '#9aeefd',
          300: '#58dffb',
          400: '#0fc7f6',
          500: '#00a9dc',
          600: '#0284b7',
          700: '#0a6994',
          800: '#105578',
          900: '#144865',
          950: '#082e44',
          DEFAULT: '#e9fcff',
        },
        'antiflash-white': {
          50: '#f5f6fa', // Original antiflash-white
          100: '#eaecf1',
          200: '#d9dde6',
          300: '#bdc4d4',
          400: '#9ca6bd',
          500: '#828ca9',
          600: '#6f7696',
          700: '#636286',
          800: '#54536f',
          900: '#48475c',
          950: '#2e2d3a',
          DEFAULT: '#f5f6fa',
        },
        'electric-blue': {
          50: '#f0fdfe',
          100: '#ccf7fe',
          200: '#93e6ef', // Original electric-blue
          300: '#67e2f0',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
          DEFAULT: '#93e6ef',
        },
        'vivid-sky-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#46cee6', // Original vivid-sky-blue
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          DEFAULT: '#46cee6',
        },
        'blue-munsell': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#1a8499', // Original blue-munsell
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
          DEFAULT: '#1a8499',
        },
        'midnight-green': {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#095764', // Original midnight-green
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
          DEFAULT: '#095764',
        },

        // Shadcn/ui semantic colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
