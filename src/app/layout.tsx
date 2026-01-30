import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Development and Unity Alliance | Delivering Happiness',
  description: 'Development and Unity Alliance is a non-profit organisation dedicated to delivering happiness and improving lives through comprehensive Healthcare, quality Education, and sustainable Communal welfare programs across Bangladesh.',
  keywords: ['DUA', 'Development and Unity Alliance', 'NGO', 'Bangladesh', 'Healthcare', 'Education', 'Welfare', 'Charity', 'Non-profit'],
  authors: [{ name: 'Development and Unity Alliance' }],
  openGraph: {
    title: 'Development and Unity Alliance | Delivering Happiness',
    description: 'Delivering happiness through healthcare, education, and communal welfare initiatives across rural Bangladesh.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Development and Unity Alliance',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Development and Unity Alliance',
    description: 'Delivering happiness through healthcare, education, and communal welfare initiatives across rural Bangladesh.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
