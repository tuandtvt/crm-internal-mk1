import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - API routes
  // - Internal Next.js paths (_next)
  // - Static files (e.g. favicon.ico, avatar.png)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
