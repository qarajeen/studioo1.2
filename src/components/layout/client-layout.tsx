"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from './side-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <SideNav />
      <main className="flex-1">
          {children}
      </main>
    </>
  );
}
