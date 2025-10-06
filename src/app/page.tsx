'use client';

import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { NavContext } from '@/contexts/nav-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';

const spheres = [
  { id: 1, size: 150, top: '5%', left: '10%', animation: 'float-in-1', floatAnimation: 'float-1', duration: '8s', delay: '0.1s', hint: 'abstract shapes' },
  { id: 2, size: 250, top: '15%', left: '70%', animation: 'float-in-2', floatAnimation: 'float-2', duration: '10s', delay: '0.3s', hint: 'data analytics' },
  { id: 3, size: 100, top: '35%', left: '40%', animation: 'float-in-5', floatAnimation: 'float-3', duration: '12s', delay: '0.5s', hint: 'minimalist lamp' },
  { id: 4, size: 120, top: '55%', left: '5%', animation: 'float-in-3', floatAnimation: 'float-1', duration: '9s', delay: '0.2s', hint: 'code snippet' },
  { id: 5, size: 200, top: '65%', left: '30%', animation: 'float-in-6', floatAnimation: 'float-2', duration: '11s', delay: '0.4s', hint: 'wireframe globe' },
  { id: 6, size: 180, top: '50%', left: '85%', animation: 'float-in-4', floatAnimation: 'float-3', duration: '13s', delay: '0.1s', hint: 'blurry gradient' },
  { id: 7, size: 80, top: '80%', left: '90%', animation: 'float-in-2', floatAnimation: 'float-1', duration: '7s', delay: '0.6s', hint: 'purple crystal' },
  { id: 8, size: 90, top: '85%', left: '15%', animation: 'float-in-3', floatAnimation: 'float-2', duration: '10s', delay: '0.7s', hint: 'user portrait' },
];


export default function Home() {
  const { setNavVisible } = useContext(NavContext);

  useEffect(() => {
    setNavVisible(true);
  }, [setNavVisible]);

  const renderSpheres = (sphereList: typeof spheres) => {
    return sphereList.map((sphere) => (
      <div
        key={sphere.id}
        className={'absolute opacity-0 rounded-full'}
        style={{
          width: sphere.size,
          height: sphere.size,
          top: sphere.top,
          left: sphere.left,
          animation: `${sphere.animation} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards, ${sphere.floatAnimation} ${sphere.duration} ease-in-out infinite`,
          animationDelay: `${sphere.delay}, 1s`
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20"
          style={{
            boxShadow: '0 0 112px -18px rgba(255, 255, 255, 0.75)'
          }}
        >
          <Image
            src={`${repoName}/sphere${sphere.id}.jpg`}
            alt={`Sphere ${sphere.id}`}
            width={sphere.size}
            height={sphere.size}
            className="object-cover w-full h-full"
            data-ai-hint={sphere.hint}
          />
        </div>
      </div>
    ));
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-0 w-full h-full z-0 opacity-40">
        {renderSpheres(spheres)}
      </div>
      <main className="relative z-10 w-full max-w-3xl mx-auto text-center">
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
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-text-fade-in opacity-0"
            style={{ animationDelay: '0.8s' }}
          >
            <Button asChild size="lg">
              <Link href="/pricing">Get a Quote</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/services">View Services <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
      </main>
    </div>
  );
}
