import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi', // VIETNAMESE DEFAULT
  localePrefix: 'always' // Forces /vi/dashboard or /en/dashboard
});

export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);
