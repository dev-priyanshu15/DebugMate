import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            colors: {
                bg: '#0a0a0f',
                surface: '#111118',
                'surface-2': '#16161f',
                border: '#1e1e2e',
                'border-hover': '#2e2e4e',
                'accent-red': '#ff4d6d',
                'accent-blue': '#00d4ff',
                'accent-green': '#a8ff78',
                'accent-yellow': '#ffd60a',
                'text-primary': '#e8e8f0',
                'text-secondary': '#b0b0c0',
                'text-muted': '#6b6b80',
            },
            fontFamily: {
                display: ['Syne', 'sans-serif'],
                body: ['Fraunces', 'serif'],
                mono: ['DM Mono', 'monospace'],
                ui: ['Syne', 'sans-serif'],
            },
            spacing: {
                '4.5': '1.125rem',
            },
            borderRadius: {
                card: '12px',
                btn: '8px',
                input: '8px',
                badge: '4px',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                card: '0 4px 24px rgba(0,0,0,0.4)',
                'glow-red': '0 0 24px rgba(255,77,109,0.2)',
                'glow-blue': '0 0 24px rgba(0,212,255,0.2)',
                'glow-green': '0 0 24px rgba(168,255,120,0.2)',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(8px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-16px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
            animation: {
                shimmer: 'shimmer 2s infinite linear',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in': 'slide-in 0.3s ease-out',
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}

export default config
