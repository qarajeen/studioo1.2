
'use client';

import * as React from 'react';
import { createContext, useState, useMemo } from 'react';

type NavContextType = {
  navVisible: boolean;
  setNavVisible: (visible: boolean) => void;
};

export const NavContext = createContext<NavContextType>({
  navVisible: false,
  setNavVisible: () => {},
});

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [navVisible, setNavVisible] = useState(false);

  const value = useMemo(() => ({
    navVisible,
    setNavVisible,
  }), [navVisible]);

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
