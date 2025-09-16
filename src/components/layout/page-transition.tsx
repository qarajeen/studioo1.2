'use client';

import * as React from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

export function PageTransition({
  children,
  pageKey,
}: {
  children: React.ReactNode;
  pageKey: string;
}) {
  const nodeRef = React.useRef(null);

  return (
    <SwitchTransition>
      <CSSTransition
        key={pageKey}
        nodeRef={nodeRef}
        timeout={500}
        classNames="page"
        unmountOnExit
      >
        <div ref={nodeRef} className="page">
            {children}
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
}
