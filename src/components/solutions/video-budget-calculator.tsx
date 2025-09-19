
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type VideoType = 'social' | 'corporate';
type ActorCount = 'none' | '1-2' | '3+';

export function VideoBudgetCalculator() {
  const [videoType, setVideoType] = useState<VideoType>('social');
  const [duration, setDuration] = useState(1);
  const [externalFilming, setExternalFilming] = useState(true);
  const [actors, setActors] = useState<ActorCount>('none');
  const [estimate, setEstimate] = useState({ min: 0, max: 0 });

  useEffect(() => {
    let baseMin = 0, baseMax = 0;

    // 1. Base price on video type
    if (videoType === 'social') {
      baseMin = 1500;
      baseMax = 3000;
    } else { // corporate
      baseMin = 5000;
      baseMax = 8000;
    }

    // 2. Adjust for duration
    const durationMultiplier = 1 + (duration - 1) * 0.4;
    baseMin *= durationMultiplier;
    baseMax *= durationMultiplier;

    // 3. Adjust for external filming
    if (externalFilming) {
      baseMin += 2000;
      baseMax += 4000;
    }

    // 4. Adjust for actors
    if (actors === '1-2') {
      baseMin += 1500;
      baseMax += 3000;
    } else if (actors === '3+') {
      baseMin += 4000;
      baseMax += 7000;
    }

    setEstimate({
      min: Math.round(baseMin / 500) * 500,
      max: Math.round(baseMax / 500) * 500,
    });

  }, [videoType, duration, externalFilming, actors]);

  const showEstimate = useMemo(() => estimate.min > 0 && estimate.max > 0, [estimate]);

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold">Marketing Video Budget Calculator</CardTitle>
        <CardDescription>Answer a few simple questions to get a real-time budget estimate for your next video project.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="space-y-8">
          {/* Question 1: Video Type */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What type of video do you need?</Label>
            <RadioGroup value={videoType} onValueChange={(v: VideoType) => setVideoType(v)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="social" id="social" className="sr-only" />
                <Label htmlFor="social" className={cn("flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", videoType === 'social' ? 'border-primary bg-accent' : 'border-border')}>
                  <span className="font-bold">Social Media Ad</span>
                  <span className="text-sm text-muted-foreground text-center">Short, punchy video for online platforms.</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem value="corporate" id="corporate" className="sr-only" />
                <Label htmlFor="corporate" className={cn("flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", videoType === 'corporate' ? 'border-primary bg-accent' : 'border-border')}>
                  <span className="font-bold">Corporate / Brand Video</span>
                  <span className="text-sm text-muted-foreground text-center">Introductory or informational video for your business.</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Question 2: Duration */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">What is the approximate final duration?</Label>
             <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon" onClick={() => setDuration(Math.max(1, duration - 1))}><Minus /></Button>
                <Slider value={[duration]} onValueChange={(v) => setDuration(v[0])} min={1} max={10} step={1} className="flex-1" />
                <Button variant="outline" size="icon" onClick={() => setDuration(Math.min(10, duration + 1))}><Plus /></Button>
              </div>
            <div className="text-center font-semibold w-full mt-2 text-lg">{duration} minute{duration > 1 ? 's' : ''}</div>
          </div>
          
          {/* Question 3: Filming Location */}
          <div className={cn("flex items-center justify-between p-4 border rounded-lg", externalFilming ? 'border-primary bg-accent/80' : 'border-border')}>
            <Label htmlFor="externalFilming" className="flex flex-col gap-1 cursor-pointer">
                <span className="text-lg font-semibold">Do you require on-location filming?</span>
                <span className="text-sm text-muted-foreground">Or will it be studio-based/stock footage?</span>
            </Label>
            <Switch id="externalFilming" checked={externalFilming} onCheckedChange={setExternalFilming} />
          </div>

          {/* Question 4: Actors */}
           <div className="space-y-4">
            <Label className="text-lg font-semibold">Will you need professional actors?</Label>
            <RadioGroup value={actors} onValueChange={(v: ActorCount) => setActors(v)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <RadioGroupItem value="none" id="actors-none" className="sr-only" />
                <Label htmlFor="actors-none" className={cn("flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", actors === 'none' ? 'border-primary bg-accent' : 'border-border')}>
                  None
                </Label>
              </div>
              <div>
                <RadioGroupItem value="1-2" id="actors-1-2" className="sr-only" />
                <Label htmlFor="actors-1-2" className={cn("flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", actors === '1-2' ? 'border-primary bg-accent' : 'border-border')}>
                  1 - 2 Actors
                </Label>
              </div>
               <div>
                <RadioGroupItem value="3+" id="actors-3+" className="sr-only" />
                <Label htmlFor="actors-3+" className={cn("flex items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50", actors === '3+' ? 'border-primary bg-accent' : 'border-border')}>
                  3+ Actors
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Separator />
          
          {/* Result */}
           {showEstimate && (
            <Card className="bg-background/70 border-primary shadow-lg animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-center text-xl">Your Estimated Budget</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-primary">
                    {estimate.min.toLocaleString()} - {estimate.max.toLocaleString()} AED
                </p>
                <p className="text-muted-foreground mt-2">This is a preliminary estimate. Complex projects may require a custom quote.</p>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <p className="text-center text-sm font-semibold">Ready to take the next step?</p>
                <Button asChild size="lg" className="w-full">
                  <Link href="/pricing">
                    Get a Precise and Detailed Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
           )}
        </div>
      </CardContent>
    </div>
  );
}
