
import type { Metadata } from 'next';
import { IBM_Plex_Serif } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ClientLayout } from '@/components/layout/client-layout';
import './globals.css';
import { cn } from '@/lib/utils';

const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
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
      <body className={cn(ibmPlexSerif.variable, "font-body")}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
