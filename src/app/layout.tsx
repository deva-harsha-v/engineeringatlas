import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { ToastProvider, LoadingProvider } from '@/components/ui';
import { BeamsBackground } from '@/components/layout/BeamsBackground';

export const viewport: Viewport = {
  themeColor: '#6366F1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://engineering-atlas.svec.edu'),
  title: {
    default: 'Engineering Atlas — Interactive Academic Companion for B.Tech Students',
    template: '%s | Engineering Atlas',
  },
  description:
    'Visual engineering education, faculty-managed course materials, practice questions, and past paper intelligence for B.Tech students.',
  keywords: ['Engineering Atlas', 'B.Tech', 'SVEC', 'Visual Learning', 'Operating Systems', 'Data Structures', 'Interactive Atlas'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Engineering Atlas — Academic Companion',
    description: 'Learn concepts visually, access curated course materials, practice questions, and prepare for examinations.',
    url: 'https://engineering-atlas.svec.edu',
    siteName: 'Engineering Atlas',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 800,
        alt: 'Engineering Atlas Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var theme = localStorage.getItem('ea-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
                document.documentElement.classList.toggle('light', theme === 'light');
              } catch (e) {}
            })()`,
          }}
        />
      </head>
      <body className="tech-grid-bg">
        <BeamsBackground />
        <LoadingProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
