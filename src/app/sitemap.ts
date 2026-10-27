import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://engineering-atlas.svec.edu';

  // Base static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/student/atlas`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/student/subjects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const topics = await db.atlasTopics.findMany();
    const topicUrls: MetadataRoute.Sitemap = topics.map((topic) => ({
      url: `${baseUrl}/student/atlas/${topic.slug}`,
      lastModified: new Date(topic.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...staticPages, ...topicUrls];
  } catch (e) {
    return staticPages;
  }
}
