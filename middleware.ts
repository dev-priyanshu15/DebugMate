import { authMiddleware } from '@clerk/nextjs/server'

export default authMiddleware({
    publicRoutes: [
        '/',
        '/pricing',
        '/blog',
        '/sign-in(.*)',
        '/sign-up(.*)',
        '/api/webhooks/(.*)',
        '/debug/(.*)',  // public shared sessions
    ],
    ignoredRoutes: [
        '/api/webhooks/(.*)',
    ],
})

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
