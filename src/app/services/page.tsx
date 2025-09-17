
import Image from 'next/image';
import { services } from './data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function ServicesPage() {

  const renderSpheres = (sphereList: typeof spheres) => {
    return sphereList.map((sphere) => (
      <div
        key={sphere.id}
        className={'absolute opacity-0'}
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
          src={`https://picsum.photos/seed/${sphere.id}/${sphere.size}/${sphere.size}`}
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
    <div className="relative min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden pb-32 sm:pb-20">
      
      <div className="absolute inset-0 w-full h-full z-0">
        {renderSpheres(spheres)}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We channel our unique creative energy into a range of visual production services, delivering exceptional results that capture the essence of your story.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                'group relative rounded-xl overflow-hidden',
                index === 0 ? 'lg:col-span-3' : '',
                index === 1 ? 'lg:col-span-2' : '',
                index === 2 ? 'lg:col-span-2' : '',
                index === 3 ? 'lg:col-span-3' : '',
                index === 4 ? 'lg:col-span-5' : ''
              )}
            >
              <Image
                src={service.imageUrl}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={service.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end transition-all duration-300">
                <h3 className="text-2xl font-bold text-white transition-transform duration-300 transform-gpu group-hover:-translate-y-2">{service.title}</h3>
                <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden">
                    <p className="mt-2 text-sm md:text-base text-white/80 leading-relaxed">{service.description}</p>
                    <Button asChild variant="secondary" className="mt-4 w-full py-2 px-4 h-auto">
                        <Link href="/pricing">
                            Get a Quote
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
