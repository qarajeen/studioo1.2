
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Monitor, Palette, Video, Download, FileImage, Ratio, Paintbrush, Sunrise, Camera, Shrink, FileCode, Film, Hourglass, Music, Clapperboard } from 'lucide-react';

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

const repoName = process.env.NODE_ENV === 'production' ? '/studioo1.2' : '';

const tools = [
    {
        title: "Brand Color Consistency Checker",
        description: "Analyze your website's visual content against your brand's color palette.",
        href: "/tools/brand-color-checker",
        icon: <Paintbrush className="w-8 h-8 text-primary" />,
    },
    {
        title: "Marketing Video Budget Calculator",
        description: "Get an approximate budget for your next marketing video based on your needs.",
        href: "/tools/video-budget-calculator",
        icon: <Video className="w-8 h-8 text-primary" />,
    },
    {
        title: "Event Photography Checklist",
        description: "Download our free, comprehensive checklist for marketing and event managers.",
        href: "/tools/event-checklist",
        icon: <Download className="w-8 h-8 text-primary" />,
    },
    {
        title: "JPEG to WEBP Converter",
        description: "Convert your JPEG images to the modern, high-efficiency WEBP format.",
        href: "/tools/jpeg-to-webp-converter",
        icon: <FileImage className="w-8 h-8 text-primary" />,
    },
    {
        title: "Aspect Ratio Calculator",
        description: "Calculate aspect ratios and resolutions for your videos and images.",
        href: "/tools/aspect-ratio-calculator",
        icon: <Ratio className="w-8 h-8 text-primary" />,
    },
    {
        title: "Color Palette From Image",
        description: "Upload an image to automatically generate a palette of its most prominent colors.",
        href: "/tools/color-palette-generator",
        icon: <Palette className="w-8 h-8 text-primary" />,
    },
    {
        title: "Golden Hour Calculator",
        description: "Find the best natural light for your photos and videos by calculating sun times.",
        href: "/tools/golden-hour-calculator",
        icon: <Sunrise className="w-8 h-8 text-primary" />,
    },
    {
        title: "Image Compressor",
        description: "Optimize your JPEG or PNG images with an adjustable quality slider.",
        href: "/tools/image-compressor",
        icon: <Shrink className="w-8 h-8 text-primary" />,
    },
    {
        title: "File to Data URI Converter",
        description: "Convert any file into a Data URI string for embedding in web pages.",
        href: "/tools/file-to-data-uri-converter",
        icon: <FileCode className="w-8 h-8 text-primary" />,
    },
    {
        title: "Video Duration Calculator",
        description: "Add a list of timecodes (HH:MM:SS:FF) to calculate total running time.",
        href: "/tools/video-duration-calculator",
        icon: <Film className="w-8 h-8 text-primary" />,
    },
    {
        title: "Time-Lapse Calculator",
        description: "Calculate shooting intervals and storage needs for your time-lapse projects.",
        href: "/tools/timelapse-calculator",
        icon: <Hourglass className="w-8 h-8 text-primary" />,
    },
    {
        title: "Simple Audio Visualizer",
        description: "Upload an audio file to generate a simple, looping video visualizer.",
        href: "/tools/audio-visualizer",
        icon: <Music className="w-8 h-8 text-primary" />,
    },
]

export default function ToolsPage() {
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
          animation: `1s cubic-bezier(0.25, 1, 0.5, 1) forwards ${sphere.animation}, ${sphere.floatAnimation} ${sphere.duration} ease-in-out infinite`,
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
          />
        </div>
      </div>
    ));
  }

  return (
    <div className="relative min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 flex items-center overflow-hidden">
      
      <div className="absolute inset-0 w-full h-full z-0 opacity-50">
        {renderSpheres(spheres)}
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold">Tools</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A collection of online tools to spark creativity and assist with your production workflow.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map(tool => (
             <Card key={tool.href} className="w-full bg-card/50 backdrop-blur-sm border-border hover:border-primary/80 transition-all group flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                      {tool.icon}
                    </div>
                    <CardTitle className="text-xl leading-tight">{tool.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{tool.description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={tool.href}>
                            Launch Tool <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardFooter>
             </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
