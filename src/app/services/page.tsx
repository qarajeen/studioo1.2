
import Image from 'next/image';
import { services } from './data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight, DollarSign, Repeat, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';

export const metadata: Metadata = {
  title: 'Creative Media Production Services in Dubai | STUDIOO',
  description: 'STUDIOO is a Dubai-based media production house offering video production, photography, post-production, time lapse & 360° tours. Powered by ADHD for unmatched creativity. Contact us',
};

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

const partnershipModels = [
    {
        icon: <DollarSign className="h-8 w-8 text-primary" />,
        title: 'Direct Payment',
        description: 'Clear services packages at fixed prices. You get stunning visuals, and we support you on your journey.',
    },
    {
        icon: <Repeat className="h-8 w-8 text-primary" />,
        title: 'Service Exchange',
        description: 'We serve your business in exchange for your services or products. A true win-win partnership.',
    },
    {
        icon: <TrendingUp className="h-8 w-8 text-primary" />,
        title: 'Growth Partner',
        description: 'We provide a comprehensive package for a small stake in your profits. When you succeed, we succeed.',
    }
]

export default function ServicesPage() {

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
            style={{ filter: 'brightness(0.5) blur(4px)' }}
          />
        </div>
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
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent animate-shine bg-[200%_auto] py-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                You have the vision.. <br /> We tell the story..
            </h1>
            <Card className="mt-6 bg-card/50 backdrop-blur-sm border-border p-4 sm:p-6">
                <p className="text-sm sm:text-lg text-foreground">
                    We know the story because we live it too. You’re here in Dubai, building something that matters, pouring every dirham and late night into an exceptional product. You have a world-class vision, but the budget for a world-class visual identity isn't quite there yet. This gap, between a brilliant idea and the resources to show it off, is the most frustrating place to be..
                    <br /><br />
                    It’s also where we do our best work. We didn’t start this company to be just another studio. We built it to be the creative partner we wished we had.. A dedicated team that’s as invested in your journey as you are. We’re here to grow with you, from launch day to your Series A..
                </p>
            </Card>
        </div>

        <div className="mt-24 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent animate-shine bg-[200%_auto]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Choose the Path That Fits Your Growth</h2>
            <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
                We offer flexible partnership models because we believe great ideas deserve to be seen, regardless of budget.
            </p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {partnershipModels.map((model, index) => (
                    <Card key={index} className="bg-card/50 backdrop-blur-sm border-border text-center">
                        <CardHeader>
                            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 border border-primary/20">
                                {model.icon}
                            </div>
                            <CardTitle>{model.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{model.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className='group relative rounded-xl overflow-hidden h-64'
            >
              <Image
                src={`${service.imageUrl}`}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={service.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-end transition-all duration-300">
                <h3 className="text-xl md:text-2xl font-bold text-white transition-transform duration-300 transform-gpu group-hover:-translate-y-2">{service.title}</h3>
                <div className="opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-40 transition-all duration-500 overflow-hidden">
                    <p className="mt-2 text-sm text-white/80 leading-relaxed">{service.description}</p>
                    <Button asChild variant="secondary" className="mt-4 w-full py-2 px-4 h-auto text-sm">
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
        
        <div className="mt-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold">Showcase</h2>
                <p className="mt-4 text-base sm:text-lg text-muted-foreground">A glimpse into our creative world.</p>
            </div>
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                    <h3 className="font-semibold text-lg p-4 bg-card/80 backdrop-blur-sm">Videography Reel</h3>
                    <video className="w-full h-auto" autoPlay loop muted playsInline>
                        <source src={`${repoName}/reel.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="rounded-xl overflow-hidden shadow-2xl">
                    <h3 className="font-semibold text-lg p-4 bg-card/80 backdrop-blur-sm">Time-Lapse Showcase</h3>
                    <video className="w-full h-auto" autoPlay loop muted playsInline>
                        <source src={`${repoName}/tl.mp4`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
