
"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { SideNav } from './side-nav';
import { NavContext, NavProvider } from '@/contexts/nav-context';

function LayoutWithNav({ children }: { children: React.ReactNode }) {
  const { navVisible } = React.useContext(NavContext);
  return (
    <>
      {navVisible && <SideNav />}
      <main className="flex-1">
          {children}
      </main>
    </>
  )
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <NavProvider>
      <LayoutWithNav>{children}</LayoutWithNav>
    </NavProvider>
  );
}
