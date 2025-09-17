
import Image from 'next/image';

const spheres = [
  { id: 1, size: 150, top: '15%', left: '10%', animation: 'float-in-1', floatAnimation: 'move-around-1', duration: '18s', delay: '0.1s', z: 5, hint: 'abstract shapes' },
  { id: 2, size: 250, top: '10%', left: '60%', animation: 'float-in-2', floatAnimation: 'move-around-2', duration: '22s', delay: '0.3s', z: 30, hint: 'data analytics' },
  { id: 3, size: 100, top: '25%', left: '40%', animation: 'float-in-5', floatAnimation: 'move-around-3', duration: '25s', delay: '0.5s', z: 5, hint: 'minimalist lamp' },
  { id: 4, size: 120, top: '50%', left: '5%', animation: 'float-in-3', floatAnimation: 'move-around-4', duration: '20s', delay: '0.2s', z: 25, hint: 'code snippet' },
  { id: 5, size: 200, top: '60%', left: '30%', animation: 'float-in-6', floatAnimation: 'move-around-1', duration: '24s', delay: '0.4s', z: 25, hint: 'wireframe globe' },
  { id: 6, size: 180, top: '45%', left: '75%', animation: 'float-in-4', floatAnimation: 'move-around-2', duration: '28s', delay: '0.1s', z: 5, hint: 'blurry gradient' },
  { id: 7, size: 80, top: '75%', left: '85%', animation: 'float-in-2', floatAnimation: 'move-around-3', duration: '17s', delay: '0.6s', z: 25, hint: 'purple crystal' },
  { id: 8, size: 90, top: '80%', left: '15%', animation: 'float-in-3', floatAnimation: 'move-around-4', duration: '21s', delay: '0.7s', z: 5, hint: 'user portrait' },
];

export default function Home() {
  const backgroundSpheres = spheres.filter(s => s.z < 20);
  const foregroundSpheres = spheres.filter(s => s.z >= 20);

  const renderSpheres = (sphereList: typeof spheres) => {
    return sphereList.map((sphere) => (
      <div
        key={sphere.id}
        className={'absolute opacity-0 mix-blend-screen'}
        style={{
          width: sphere.size,
          height: sphere.size,
          top: sphere.top,
          left: sphere.left,
          animation: `${sphere.animation} 1s cubic-bezier(0.25, 1, 0.5, 1) forwards, ${sphere.floatAnimation} ${sphere.duration} ease-in-out infinite`,
          animationDelay: `${sphere.delay}, 1s`
        }}
      >
        <Image
          src={`/sphere${sphere.id}.png`}
          alt={`Sphere ${sphere.id}`}
          width={sphere.size}
          height={sphere.size}
          className="rounded-full object-cover border-2 border-white/20"
          style={{
            boxShadow: '0 0 112px -18px rgba(255, 255, 255, 0.75)'
          }}
          data-ai-hint={sphere.hint}
        />
      </div>
    ));
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background">

      <div className="absolute inset-0 w-full h-full z-10">
        {renderSpheres(backgroundSpheres)}
      </div>
      
      <main className="relative z-20 flex flex-col items-center justify-center text-center">
        <h1 
          className="font-display text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-black text-foreground mix-blend-screen animate-text-fade-in opacity-0"
          style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
        >
          Studioo
        </h1>
      </main>

      <div className="absolute inset-0 w-full h-full z-30">
        {renderSpheres(foregroundSpheres)}
      </div>
    </div>
  );
}
