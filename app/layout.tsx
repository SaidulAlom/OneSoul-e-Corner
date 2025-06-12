import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'OneSoul e Corner - News, Jobs, Vlogs, E-Books & Services',
  description: 'Your one-stop destination for news, jobs, education, e-books, and digital services',
  keywords: 'news, jobs, education, e-books, digital services, cyber cafe, government services',
  authors: [{ name: 'OneSoul e Corner' }],
  openGraph: {
    title: 'OneSoul e Corner',
    description: 'Your one-stop destination for news, jobs, education, e-books, and digital services',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}