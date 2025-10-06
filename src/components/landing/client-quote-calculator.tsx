"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const QuoteCalculator = dynamic(
  () => import('@/components/landing/quote-calculator').then((mod) => mod.QuoteCalculator),
  {
    loading: () => (
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 w-full">
            <Skeleton className="w-full h-[700px] rounded-lg" />
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
        </div>
      </div>
    )
  }
);

function QuoteCalculatorLoader() {
  const [showCalculator, setShowCalculator] = useState(false);

  if (showCalculator) {
    return <QuoteCalculator />;
  }

  return (
     <div className="w-full max-w-2xl mx-auto text-center">
        <Card className="bg-card/50 backdrop-blur-sm border-border animate-fade-in-up">
            <CardHeader>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-200 bg-clip-text text-transparent animate-shine bg-[200%_auto]" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Instant Quote Calculator</CardTitle>
                <CardDescription className="text-lg text-muted-foreground pt-2">
                    Get a transparent, real-time estimate for your creative project. Select your services, customize your options, and see the price instantly.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" onClick={() => setShowCalculator(true)} className="w-full sm:w-auto">
                    Get Started
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}


export function ClientQuoteCalculator() {
  return <QuoteCalculatorLoader />;
}
