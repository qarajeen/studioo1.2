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
  title: 'Studioo - Visual Production Agency',
  description: 'A visual production agency with a creative superpower.',
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
