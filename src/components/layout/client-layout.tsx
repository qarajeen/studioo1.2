"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { PageTransition } from './page-transition';
import { SideNav } from './side-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SideNav />
      <main className="relative w-full flex-1">
        <PageTransition pageKey={pathname}>
          {children}
        </PageTransition>
      </main>
    </>
  );
}
