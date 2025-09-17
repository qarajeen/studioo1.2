import type { Metadata } from 'next';
import { Inter, Luckiest_Guy } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ClientLayout } from '@/components/layout/client-layout';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const luckiestGuy = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-luckiest-guy',
});

export const metadata: Metadata = {
  title: 'Production House Dubai | Creative Video & Photo | STUDIOO',
  description: "STUDIOO is a dynamic media production house in Dubai, specializing in video production, photography, and creative content. Powered by ADHD for unmatched results. Let's create.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${luckiestGuy.variable}`}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
