import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Background Accent */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 opacity-10"
      >
        <div className="w-full h-full animate-[spin_20s_linear_infinite] [animation-delay:-5s]">
          <svg
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full text-primary"
          >
            <path
              d="M346.8,119.4c52.6,60,53.2,148.6-2.2,204.4c-55.4,55.8-144.5,52.9-204.6,2.3C80,266.3,77.1,177.3,132.8,122.5 C188.6,67.7,294.2,59.3,346.8,119.4z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>

      <main className="relative z-10 flex min-h-screen items-center px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-foreground"
            >
              Our Focus is Different. <br />
              <span className="text-primary">It's Our Superpower.</span>
            </h1>
            <p
              className="mt-6 max-w-xl mx-auto lg:mx-0 text-lg text-muted-foreground"
            >
              At Studioo, we transform the unique lens of ADHD into a creative
              advantage, capturing moments and telling stories with unparalleled
              depth and empathy.
            </p>
            <div
              className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button size="lg" asChild>
                <Link href="/services">Explore Our Services</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">
                  Get a Quote <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Content */}
          <div
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-[500px] h-[500px]">
               <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
               <Image
                src="https://picsum.photos/seed/studioo-hero/500/500"
                alt="Abstract creative visual"
                width={500}
                height={500}
                className="rounded-full object-cover z-10 relative shadow-2xl border-4 border-primary/20"
                data-ai-hint="abstract creative"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
