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
                bg: '#0B0B0F',
                surface: '#111217',
                'surface-2': '#18181F',
                border: 'rgba(255,255,255,0.06)',
                'border-hover': 'rgba(255,255,255,0.12)',
                'accent-red': '#FF5C7C',
                'accent-blue': '#00d4ff',
                'accent-green': '#a8ff78',
                'accent-yellow': '#ffd60a',
                'text-primary': '#EAEAEF',
                'text-secondary': '#A0A0B4',
                'text-muted': '#5C5C72',
            },
            fontFamily: {
                display: ['Inter', '-apple-system', 'sans-serif'],
                body: ['Inter', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
                ui: ['Inter', '-apple-system', 'sans-serif'],
            },
            spacing: {
                '4.5': '1.125rem',
            },
            borderRadius: {
                card: '10px',
                btn: '6px',
                input: '6px',
                badge: '4px',
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            boxShadow: {
                card: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.12)',
                'card-hover': '0 4px 16px rgba(0,0,0,0.3)',
                'glow-red': '0 0 20px rgba(255,92,124,0.15)',
                'glow-blue': '0 0 20px rgba(0,212,255,0.15)',
                'glow-green': '0 0 20px rgba(168,255,120,0.15)',
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
                    from: { opacity: '0', transform: 'translateY(6px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-12px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                pulse: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.8s infinite linear',
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.25s ease-out',
                'slide-in': 'slide-in 0.25s ease-out',
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
}

export default config
