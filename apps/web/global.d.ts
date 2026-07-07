declare module '*.md' {
  const text: string;
  export default text;
}
declare module '*.png';
declare module '*.webp';

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    PORT: number;
    RESEND_API_KEY: string;
    APP_URL?: string;
    NEXT_PUBLIC_APP_URL?: string;
    ADMIN_URL?: string;
    AOT_URL?: string;
    OG_URL?: string;
    NEXT_PUBLIC_OG_URL?: string;
    AUTH_COOKIE_DOMAIN?: string;
    FEATURE_FLAGS?: string;
    STAGING?: string;
    CRON_SECRET?: string;
    NEXT_PUBLIC_ALGOLIA_APP_ID: string;
    NEXT_PUBLIC_ALGOLIA_API_KEY: string;
  }
}
