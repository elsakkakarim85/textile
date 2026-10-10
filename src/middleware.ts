import { clerkMiddleware, createRouteMatcher, clerkClient } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

const isProtectedRoute = createRouteMatcher(['/(ar|en)/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/(ar|en)/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req) || isProtectedRoute(req)) {
    // Just ensure the user is logged in at the Edge level.
    // The actual role check will happen in the Node.js Server Component (layout.tsx)
    await auth.protect();
  }

  // Skip i18n routing for API routes
  if (req.nextUrl.pathname.startsWith('/api')) {
    return;
  }

  return handleI18nRouting(req);
});

export const config = {
  // Match only internationalized pathnames and API routes
  matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)', '/(api|trpc)(.*)']
};
