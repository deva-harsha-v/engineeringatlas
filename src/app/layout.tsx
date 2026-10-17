import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Engineering Atlas — Interactive Academic Companion for B.Tech Students',
  description:
    'Visual engineering education, faculty-managed course materials, practice questions, and past paper intelligence for B.Tech students.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="tech-grid-bg">{children}</body>
    </html>
  );
}
