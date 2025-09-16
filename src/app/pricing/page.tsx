"use client";

import { ClientQuoteCalculator } from '@/components/landing/client-quote-calculator';

export default function PricingPage() {
  return (
    <div className="min-h-screen w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <ClientQuoteCalculator />
      </div>
    </div>
  );
}
