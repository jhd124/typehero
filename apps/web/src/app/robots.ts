import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const url = process.env.APP_URL ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      disallow: ['/api/*'],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
