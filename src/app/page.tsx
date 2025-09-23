'use client';

import { useContext, useEffect } from 'react';
import { NavContext } from '@/contexts/nav-context';
import { Carousel3D } from '@/components/landing/carousel-3d';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
      <main className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h1 
              className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-foreground animate-text-fade-in opacity-0"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
            >
              Studioo
            </h1>
            <p 
              className="mt-4 text-lg sm:text-xl md:text-2xl text-muted-foreground animate-text-fade-in opacity-0"
              style={{ animationDelay: '0.5s' }}
            >
              A Dubai-based creative production house, where ADHD is our superpower. We craft unforgettable visual stories that demand attention.
            </p>
            <div 
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-text-fade-in opacity-0"
              style={{ animationDelay: '0.8s' }}
            >
              <Button asChild size="lg">
                <Link href="/pricing">Get a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services">View Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
          <div className="h-96 w-full flex items-center justify-center lg:justify-end mt-24 lg:mt-0">
            <div className="h-96 w-96">
              <Carousel3D items={spheresData} radius={7}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
