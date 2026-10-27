import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Engineering Atlas — Academic Companion',
    short_name: 'Engineering Atlas',
    description: 'Interactive visual engineering learning and academic hub for B.Tech students.',
    start_url: '/student/home',
    display: 'standalone',
    background_color: '#080B12',
    theme_color: '#6366F1',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
