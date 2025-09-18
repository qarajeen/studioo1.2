
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { useRef, useEffect, useState, useContext } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavContext } from '@/contexts/nav-context';

const spheresData = [
  { id: 1, img: 'sphere1.jpg', size: 240, top: '25%', left: '35%', hint: 'abstract shapes' },
  { id: 2, img: 'sphere2.jpg', size: 220, top: '15%', left: '50%', hint: 'data analytics' },
  { id: 3, img: 'sphere3.jpg', size: 240, top: '45%', left: '45%', hint: 'minimalist lamp' },
  { id: 4, img: 'sphere4.jpg', size: 220, top: '55%', left: '25%', hint: 'code snippet' },
  { id: 5, img: 'sphere5.jpg', size: 200, top: '60%', left: '40%', hint: 'wireframe globe' },
  { id: 6, img: 'sphere6.jpg', size: 180, top: '40%', left: '65%', hint: 'blurry gradient' },
  { id: 7, img: 'sphere7.jpg', size: 160, top: '55%', left: '75%', hint: 'purple crystal' },
  { id: 8, img: 'sphere20.jpg', size: 180, top: '60%', left: '30%', hint: 'user portrait' },
  { id: 9, img: 'sphere9.jpg', size: 140, top: '10%', left: '10%', hint: 'glowing orb' },
  { id: 10, img: 'sphere10.jpg', size: 220, top: '75%', left: '60%', hint: 'network lines' },
  { id: 11, img: 'sphere11.jpg', size: 190, top: '80%', left: '5%', hint: 'geometric pattern' },
];

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.1' : '';

export default function Home() {
    const isMobile = useIsMobile();
    const spheres = spheresData.map(s => ({ ...s, size: isMobile ? s.size / 2 : s.size }));

    const positions = useRef(spheres.map(() => ({ x: 0, y: 0 }))).current;
    const [hasDragged, setHasDragged] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const { navVisible, setNavVisible } = useContext(NavContext);


    useEffect(() => {
        setIsClient(true);
        setNavVisible(false); // Initially hide the nav
        return () => setNavVisible(true); // Show nav on component unmount
    }, [setNavVisible]);

    const [springs, api] = useSprings(spheres.length, i => ({
        x: positions[i].x, 
        y: positions[i].y,
        scale: 1,
        rotateZ: 0,
        opacity: 0,
        config: { mass: 2, tension: 150, friction: 20 }
    }));
    
    useEffect(() => {
      api.start(i => ({
        opacity: 1,
        scale: 1,
        delay: i * 100,
        config: { mass: 1, tension: 120, friction: 20 }
      }));
    }, [api]);

    useEffect(() => {
        if (isClient) {
            try {
                const storedPositions = localStorage.getItem('spherePositions');
                if (storedPositions) {
                    const parsedPositions = JSON.parse(storedPositions);
                    if (Array.isArray(parsedPositions) && parsedPositions.length === spheres.length) {
                        api.start(i => ({ x: parsedPositions[i].x, y: parsedPositions[i].y, immediate: true }));
                        positions.forEach((_, i) => {
                            positions[i] = parsedPositions[i];
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to parse sphere positions from localStorage", error);
            }
        }
    }, [isClient, api, positions, spheres.length]);


    const bind = useDrag(({ args: [index], down, movement: [mx, my], first }) => {
        if (first && !hasDragged) {
            setHasDragged(true);
            if (!navVisible) {
                setNavVisible(true); // Show nav on first drag
            }
        }

        const newX = mx;
        const newY = my;

        api.start(i => {
            if (index !== i) return;
            return {
                x: newX,
                y: newY,
                scale: down ? 1.1 : 1,
                rotateZ: down ? (mx / 10) : 0,
                config: { mass: down ? 1 : 4, tension: down ? 500 : 300, friction: down ? 25 : 30 }
            };
        });

        if (!down) {
            positions[index] = { x: newX, y: newY };
            try {
                localStorage.setItem('spherePositions', JSON.stringify(positions));
            } catch (error) {
                console.error("Failed to save sphere positions to localStorage", error);
            }
        }
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
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.4)',
                    ...styles,
                }}
            >
                <div 
                    className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10"
                >
                    <div className="w-full h-full rounded-full overflow-hidden">
                        <Image
                            src={`${repoName}/${sphere.img}`}
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
      
      <main className="relative z-0 flex flex-col items-center justify-center text-center">
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

      {!hasDragged && (
          <span 
              className="absolute z-20 text-lg text-foreground font-display animate-pulse-subtle opacity-0 bg-card/50 backdrop-blur-sm border border-border px-4 py-2 rounded-lg"
              style={{ animationDelay: '2s' }}
          >
              Drag us
          </span>
      )}
      
      <div className="absolute inset-0 w-full h-full z-10">
        {renderSpheres()}
      </div>

    </div>
  );
}
