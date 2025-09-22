
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useContext } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavContext } from '@/contexts/nav-context';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const spheresData = [
  { id: 1, img: 'sphere1.jpg', size: 240, hint: 'abstract shapes' },
  { id: 2, img: 'sphere2.jpg', size: 220, hint: 'data analytics' },
  { id: 3, img: 'sphere3.jpg', size: 240, hint: 'minimalist lamp' },
  { id: 4, img: 'sphere4.jpg', size: 220, hint: 'code snippet' },
  { id: 5, img: 'sphere5.jpg', size: 200, hint: 'wireframe globe' },
  { id: 6, img: 'sphere6.jpg', size: 180, hint: 'blurry gradient' },
  { id: 7, img: 'sphere7.jpg', size: 160, hint: 'purple crystal' },
  { id: 8, img: 'sphere20.jpg', size: 180, hint: 'user portrait' },
  { id: 9, img: 'sphere9.jpg', size: 140, hint: 'glowing orb' },
  { id: 10, img: 'sphere10.jpg', size: 220, hint: 'network lines' },
  { id: 11, img: 'sphere11.jpg', size: 190, hint: 'geometric pattern' },
];

export default function Home() {
    const isMobile = useIsMobile();
    const { setNavVisible } = useContext(NavContext);

    useEffect(() => {
        setNavVisible(true);
    }, [setNavVisible]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background p-4">
      
      <main className="relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-12">
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
          <span className="absolute bottom-0 right-0 w-full text-center sm:w_auto translate-y-full sm:translate-y-1/2 sm:translate-x-1/2 text-lg sm:text-xl md:text-2xl text-foreground font-display animate-text-fade-in opacity-0 transition-all duration-300 hover:[text-shadow:0_2px_20px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0.8s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Powered by ADHD
          </span>
        </div>
      </main>

      <div className="relative z-10 w-full max-w-6xl mx-auto mt-8">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {spheresData.map((sphere) => (
              <CarouselItem key={sphere.id} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <div className="p-1">
                    <div 
                        className="relative aspect-square rounded-full overflow-hidden border-2 border-white/10"
                        style={{
                            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.4)',
                        }}
                    >
                        <Image
                            src={`/${sphere.img}`}
                            alt={`Sphere ${sphere.id}`}
                            fill
                            className="object-cover w-full h-full rounded-full"
                            data-ai-hint={sphere.hint}
                            priority={sphere.size >= 150}
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                        />
                    </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>

    </div>
  );
}
