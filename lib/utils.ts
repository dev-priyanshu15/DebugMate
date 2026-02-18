import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function containsMaliciousPatterns(input: string): boolean {
    const patterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /DROP\s+TABLE/gi,
        /DELETE\s+FROM/gi,
        /UNION\s+SELECT/gi,
        /eval\s*\(/gi,
    ]
    return patterns.some((pattern) => pattern.test(input))
}

export function sanitizeInput(input: string): string {
    return input
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim()
}

export function generatePublicSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateString)
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

export function getLanguageIcon(language: string): string {
    const icons: Record<string, string> = {
        javascript: '🟨',
        typescript: '🔷',
        python: '🐍',
        java: '☕',
        cpp: '⚙️',
        rust: '🦀',
        go: '🐹',
        php: '🐘',
        ruby: '💎',
        swift: '🍎',
        kotlin: '🎯',
        csharp: '💜',
        html: '🌐',
        css: '🎨',
        sql: '🗄️',
    }
    return icons[language] || '💻'
}

export function getSeverityColor(severity: 'low' | 'medium' | 'high'): string {
    switch (severity) {
        case 'low':
            return 'text-accent-green'
        case 'medium':
            return 'text-accent-yellow'
        case 'high':
            return 'text-accent-red'
    }
}

export function getPlanColor(plan: string): string {
    switch (plan) {
        case 'pro':
            return 'text-accent-blue'
        case 'bootcamp':
            return 'text-accent-yellow'
        default:
            return 'text-text-muted'
    }
}

export function copyToClipboard(text: string): Promise<void> {
    return navigator.clipboard.writeText(text)
}

export function hashString(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash
    }
    return Math.abs(hash).toString(36)
}
