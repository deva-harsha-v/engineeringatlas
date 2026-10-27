import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://engineering-atlas.svec.edu';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/about', '/student/atlas', '/student/atlas/*', '/student/subjects', '/login'],
        disallow: ['/admin', '/admin/*', '/faculty', '/faculty/*', '/api/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
