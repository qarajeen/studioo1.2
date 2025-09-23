
'use client';

import * as React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';

interface Carousel3DProps {
  items: { id: number; img: string; hint: string }[];
  width?: number;
  height?: number;
  radius?: number;
}

export function Carousel3D({ items, width = 120, height = 160, radius = 7 }: Carousel3DProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const { rotateY } = useSpring({
    from: { rotateY: 0 },
    to: { rotateY: 360 },
    loop: true,
    config: { duration: 30000, easing: t => t },
    pause: isDragging,
    reset: isDragging,
  });
  
  const [{ manualRotateY }, api] = useSpring(() => ({
    manualRotateY: 0,
    config: { mass: 1, tension: 120, friction: 26 },
  }));

  const bind = useDrag(({ down, movement: [mx], first, last }) => {
    if (first) setIsDragging(true);
    if (last) setTimeout(() => setIsDragging(false), 0);
    
    api.start({ manualRotateY: down ? -mx / 2 : 0 });
  }, {
    from: () => [-manualRotateY.get() * 2, 0],
    bounds: { left: -Infinity, right: Infinity },
    rubberband: true,
  });

  const angleStep = 360 / items.length;

  return (
    <div
      className="relative w-full h-full flex items-center justify-center perspective-1000"
      {...bind()}
      style={{ cursor: 'grab' }}
    >
      <animated.div
        className="relative w-full h-full transform-style-3d"
        style={{ 
          transform: isDragging 
            ? manualRotateY.to(r => `rotateY(${r}deg)`)
            : rotateY.to(r => `rotateY(${r}deg)`)
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.id}
            className="absolute w-full h-full backface-hidden"
            style={{ transform: `rotateY(${i * angleStep}deg) translateZ(${radius}rem)` }}
          >
            <div
              className={cn(
                'relative rounded-lg overflow-hidden border-2 border-white/10 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-105',
                'reflect-below'
              )}
              style={{ width: `${width}px`, height: `${height}px` }}
            >
              <Image
                src={`${repoName}/${item.img}`}
                alt={`Carousel image ${item.id}`}
                fill
                className="object-cover"
                data-ai-hint={item.hint}
                priority
                sizes={`(max-width: 768px) 50vw, (max-width: 1200px) 33vw, ${width}px`}
              />
            </div>
          </div>
        ))}
      </animated.div>
    </div>
  );
}
