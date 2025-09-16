import Image from 'next/image';
import { services } from './data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ServicesPage() {
  return (
    <div className="min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            We channel our unique creative energy into a range of visual production services, delivering exceptional results that capture the essence of your story.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={cn(
                'group relative rounded-xl overflow-hidden',
                index === 0 ? 'md:col-span-2 lg:col-span-2' : '', // Make first item larger
                index === services.length -1 && services.length % 2 !== 0 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                <p className="mt-2 text-white/80 leading-relaxed">{service.description}</p>
                 <Button asChild variant="secondary" className="mt-4 w-fit">
                    <Link href="/pricing">
                        Get a Quote for {service.title}
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
