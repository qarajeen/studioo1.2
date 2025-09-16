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
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: '0%', opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full"
        >
            {children}
        </motion.div>
    </AnimatePresence>
  );
}
