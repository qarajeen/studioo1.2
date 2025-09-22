
'use client';

import { useContext, useEffect } from 'react';
import { NavContext } from '@/contexts/nav-context';
import { Carousel3D } from '@/components/landing/carousel-3d';

const spheresData = [
  { id: 1, img: 'sphere1.jpg', hint: 'abstract shapes' },
  { id: 2, img: 'sphere2.jpg', hint: 'data analytics' },
  { id: 3, img: 'sphere3.jpg', hint: 'minimalist lamp' },
  { id: 4, img: 'sphere4.jpg', hint: 'code snippet' },
  { id: 5, img: 'sphere5.jpg', hint: 'wireframe globe' },
  { id: 6, img: 'sphere6.jpg', hint: 'blurry gradient' },
  { id: 7, img: 'sphere7.jpg', hint: 'purple crystal' },
  { id: 8, img: 'sphere20.jpg', hint: 'user portrait' },
  { id: 9, img: 'sphere9.jpg', hint: 'glowing orb' },
  { id: 10, img: 'sphere10.jpg', hint: 'network lines' },
  { id: 11, img: 'sphere11.jpg', hint: 'geometric pattern' },
];

export default function Home() {
  const { setNavVisible } = useContext(NavContext);

  useEffect(() => {
    setNavVisible(true);
  }, [setNavVisible]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background p-4">
      
      <main className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="relative">
          <span className="absolute top-0 left-0 w-full text-center sm:w-auto -translate-y-full sm:-translate-y-1/2 sm:-translate-x-1/2 text-lg sm:text-xl md:text-2xl text-foreground font-display animate-text-fade-in opacity-0 transition-all duration-300 hover:[text-shadow:0_2px_20px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0.8s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Dubai Production
          </span>
          <h1 
            className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black text-foreground mix-blend-screen animate-text-fade-in opacity-0 transition-all duration-300 hover:[text-shadow:0_4px_40px_rgba(255,255,255,0.7)]"
            style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
          >
            Studioo
          </h1>
          <span className="absolute bottom-0 right-0 w-full text-center sm:w-auto translate-y-full sm:translate-y-1/2 sm:translate-x-1/2 text-lg sm:text-xl md:text-2xl text-foreground font-display animate-text-fade-in opacity-0 transition-all duration-300 hover:[text-shadow:0_2px_20px_rgba(255,2_55,255,0.8)]" style={{ animationDelay: '0.8s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Powered by ADHD
          </span>
        </div>
      </main>

      <div className="absolute inset-0 z-10 w-full h-full flex items-end justify-end pointer-events-none mt-48 pb-0 pr-8">
        <div className="h-96 pointer-events-auto">
            <Carousel3D items={spheresData} />
        </div>
      </div>

    </div>
  );
}
