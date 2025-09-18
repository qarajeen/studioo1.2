
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useRef, useEffect } from 'react';

const spheres = [
  { id: 1, size: 150, top: '15%', left: '10%', hint: 'abstract shapes' },
  { id: 2, size: 250, top: '10%', left: '60%', hint: 'data analytics' },
  { id: 3, size: 100, top: '25%', left: '40%', hint: 'minimalist lamp' },
  { id: 4, size: 120, top: '50%', left: '5%', hint: 'code snippet' },
  { id: 5, size: 200, top: '60%', left: '30%', hint: 'wireframe globe' },
  { id: 6, size: 180, top: '45%', left: '75%', hint: 'blurry gradient' },
  { id: 7, size: 80, top: '75%', left: '85%', hint: 'purple crystal' },
  { id: 8, size: 90, top: '80%', left: '15%', hint: 'user portrait' },
];

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.1' : '';

export default function Home() {
    const positions = useRef(spheres.map(() => ({ x: 0, y: 0 }))).current;

    const [springs, api] = useSprings(spheres.length, i => ({
        x: 0, 
        y: 0,
        scale: 1,
        config: { mass: 2, tension: 150, friction: 20 }
    }));

    const bind = useDrag(({ args: [index], down, movement: [mx, my] }) => {
        positions[index] = { x: mx, y: my };
        api.start(i => {
            if (index !== i) return;
            const x = positions[i].x;
            const y = positions[i].y;
            return {
                x,
                y,
                scale: down ? 1.1 : 1,
                config: { mass: down ? 1 : 2, tension: 500, friction: down ? 25 : 20 }
            };
        });
    });

  const renderSpheres = () => {
    return springs.map((styles, index) => {
        const sphere = spheres[index];
        return (
            <animated.div
                {...bind(index)}
                key={sphere.id}
                className={'absolute rounded-full cursor-grab active:cursor-grabbing'}
                style={{
                    width: sphere.size,
                    height: sphere.size,
                    top: sphere.top,
                    left: sphere.left,
                    touchAction: 'none',
                    ...styles,
                }}
            >
                <div 
                    className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20"
                    style={{
                        boxShadow: '0 0 112px -18px rgba(255, 255, 255, 0.75)'
                    }}
                >
                    <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                            src={`${repoName}/sphere${sphere.id}.jpg`}
                            alt={`Sphere ${sphere.id}`}
                            width={sphere.size}
                            height={sphere.size}
                            className="object-cover w-full h-full rounded-full"
                            data-ai-hint={sphere.hint}
                            priority={sphere.size >= 150}
                            draggable={false}
                        />
                    </div>
                </div>
            </animated.div>
        );
    });
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">

      <div className="absolute inset-0 w-full h-full z-10">
        {renderSpheres()}
      </div>
      
      <main className="relative z-20 flex flex-col items-center justify-center text-center">
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
          <span className="absolute bottom-0 right-0 w-full text-center sm:w-auto translate-y-full sm:translate-y-1/2 sm:translate-x-1/2 text-lg sm:text-xl md:text-2xl text-foreground font-display animate-text-fade-in opacity-0 transition-all duration-300 hover:[text-shadow:0_2px_20px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0.8s', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Powered by ADHD
          </span>
        </div>
      </main>

    </div>
  );
}
