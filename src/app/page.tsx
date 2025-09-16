import Image from 'next/image';

const spheres = [
  { id: 1, size: 150, top: '15%', left: '10%', animation: 'animate-float-in-1', floatAnimation: 'float-1 8s ease-in-out infinite', delay: '0.1s', z: 5, hint: 'abstract shapes' },
  { id: 2, size: 250, top: '10%', left: '60%', animation: 'animate-float-in-2', floatAnimation: 'float-2 10s ease-in-out infinite', delay: '0.3s', z: 25, hint: 'data analytics' },
  { id: 3, size: 100, top: '25%', left: '40%', animation: 'animate-float-in-5', floatAnimation: 'float-3 12s ease-in-out infinite', delay: '0.5s', z: 5, hint: 'minimalist lamp' },
  { id: 4, size: 120, top: '50%', left: '5%', animation: 'animate-float-in-3', floatAnimation: 'float-1 9s ease-in-out infinite', delay: '0.2s', z: 25, hint: 'code snippet' },
  { id: 5, size: 200, top: '60%', left: '30%', animation: 'animate-float-in-6', floatAnimation: 'float-2 11s ease-in-out infinite', delay: '0.4s', z: 5, hint: 'wireframe globe' },
  { id: 6, size: 180, top: '45%', left: '75%', animation: 'animate-float-in-4', floatAnimation: 'float-3 13s ease-in-out infinite', delay: '0.1s', z: 5, hint: 'blurry gradient' },
  { id: 7, size: 80, top: '75%', left: '85%', animation: 'animate-float-in-2', floatAnimation: 'float-1 7s ease-in-out infinite', delay: '0.6s', z: 25, hint: 'purple crystal' },
  { id: 8, size: 90, top: '80%', left: '15%', animation: 'animate-float-in-3', floatAnimation: 'float-2 10s ease-in-out infinite', delay: '0.7s', z: 5, hint: 'user portrait' },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      <main className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black tracking-tighter text-foreground uppercase animate-text-fade-in opacity-0">
          Studioo
        </h1>
      </main>

      <div className="absolute inset-0 w-full h-full z-10">
        {spheres.map((sphere) => (
          <div
            key={sphere.id}
            className={`absolute ${sphere.animation}`}
            style={{
              width: sphere.size,
              height: sphere.size,
              top: sphere.top,
              left: sphere.left,
              animation: `${sphere.animation.split(' ')[0]} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards, ${sphere.floatAnimation}`,
              animationDelay: sphere.delay,
              zIndex: sphere.z,
              opacity: 0,
            }}
          >
            <Image
              src={`https://picsum.photos/seed/sphere${sphere.id}/${sphere.size}/${sphere.size}`}
              alt={`Sphere ${sphere.id}`}
              width={sphere.size}
              height={sphere.size}
              className="rounded-full object-cover shadow-2xl border-2 border-white/20 shadow-white/20"
              data-ai-hint={sphere.hint}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
