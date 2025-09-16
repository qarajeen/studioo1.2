"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { PageTransition } from './page-transition';
import { SideNav } from './side-nav';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [transitionKey, setTransitionKey] = React.useState(pathname);

  React.useEffect(() => {
    setTransitionKey(pathname);
  }, [pathname]);

  return (
    <>
      <SideNav />
      <main className="relative w-full flex-1 overflow-hidden">
        <PageTransition pageKey={transitionKey}>
          {children}
        </PageTransition>
      </main>
    </>
  );
}
