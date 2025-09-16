'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export function PageTransition({
  children,
  pageKey,
}: {
  children: React.ReactNode;
  pageKey: string;
}) {
  return (
      <AnimatePresence mode="wait">
        <motion.div
            key={pageKey}
            initial={{ opacity: 0, x: '100vw' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100vw' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute top-0 left-0 w-full"
        >
            {children}
        </motion.div>
    </AnimatePresence>
  );
}
