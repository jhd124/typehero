import NextAuth from '@repo/auth/next-auth';

import { baseNextAuthConfig, createGitHubProvider } from '@repo/auth/server';

if (!process.env.GITHUB_ID) {
  throw new Error('No GITHUB_ID has been provided.');
}

if (!process.env.GITHUB_SECRET) {
  throw new Error('No GITHUB_SECRET has been provided.');
}

const authUrl = process.env.NEXTAUTH_URL ?? process.env.APP_URL;
const useSecureCookies = authUrl?.startsWith('https://') ?? false;
const cookiePrefix = useSecureCookies ? '__Secure-' : '';
const cookieDomain = process.env.AUTH_COOKIE_DOMAIN || undefined;

export const authOptions = {
  ...baseNextAuthConfig,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sameSite: 'lax' as any,
        path: '/',
        domain: cookieDomain,
        secure: useSecureCookies,
      },
    },
  },
  providers: [createGitHubProvider(process.env.GITHUB_ID, process.env.GITHUB_SECRET)],
};

export const { handlers, auth } = NextAuth(authOptions);
