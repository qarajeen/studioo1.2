
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Lock, Unlock } from 'lucide-react';

// Greatest Common Divisor function
const gcd = (a: number, b: number): number => {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
};

export function AspectRatioCalculator() {
  const [width, setWidth] = useState<number | ''>(1920);
  const [height, setHeight] = useState<number | ''>(1080);
  const [ratioWidth, setRatioWidth] = useState<number | ''>(16);
  const [ratioHeight, setRatioHeight] = useState<number | ''>(9);
  const [isLocked, setIsLocked] = useState(true);
  const [lastChanged, setLastChanged] = useState<'resolution' | 'ratio'>('resolution');

  useEffect(() => {
    if (lastChanged === 'resolution' && width && height) {
      const divisor = gcd(width, height);
      setRatioWidth(width / divisor);
      setRatioHeight(height / divisor);
    }
  }, [width, height, lastChanged]);
  
  useEffect(() => {
    if (isLocked && lastChanged === 'ratio' && ratioWidth && ratioHeight) {
      if (width) {
        setHeight(Math.round((width * ratioHeight) / ratioWidth));
      } else if (height) {
        setWidth(Math.round((height * ratioWidth) / ratioHeight));
      }
    }
  }, [ratioWidth, ratioHeight, isLocked, lastChanged, width, height]);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setWidth(newWidth);
    setLastChanged('resolution');
    if (isLocked && newWidth && ratioWidth && ratioHeight) {
      setHeight(Math.round((newWidth * ratioHeight) / ratioWidth));
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setHeight(newHeight);
    setLastChanged('resolution');
    if (isLocked && newHeight && ratioWidth && ratioHeight) {
      setWidth(Math.round((newHeight * ratioWidth) / ratioHeight));
    }
  };

  const handleRatioWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRatioWidth = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setRatioWidth(newRatioWidth);
    setLastChanged('ratio');
  };
  
  const handleRatioHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRatioHeight = e.target.value === '' ? '' : parseInt(e.target.value, 10);
    setRatioHeight(newRatioHeight);
    setLastChanged('ratio');
  };

  const commonRatios = [
    { name: 'SD', w: 4, h: 3 },
    { name: 'HD/FHD', w: 16, h: 9 },
    { name: 'Cinema', w: 21, h: 9 },
    { name: 'Square', w: 1, h: 1 },
    { name: 'Portrait', w: 9, h: 16 },
    { name: 'DCI 4K', w: 4096, h: 2160 },
  ];

  const applyRatioPreset = (w: number, h: number) => {
    const divisor = gcd(w, h);
    setRatioWidth(w / divisor);
    setRatioHeight(h / divisor);
    setLastChanged('ratio');
    if (isLocked && width) {
        setHeight(Math.round((width * (h / divisor)) / (w / divisor)));
    } else if (isLocked && height) {
        setWidth(Math.round((height * (w/divisor)) / (h/divisor)));
    }
  }


  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <ArrowRightLeft className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Aspect Ratio Calculator</CardTitle>
        <CardDescription>Calculate aspect ratios, resolutions, and more.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        <div className="space-y-6">
          {/* Resolution Inputs */}
          <div className="flex items-center gap-4">
            <div className="w-full">
              <Label htmlFor="width">Width</Label>
              <Input id="width" type="number" placeholder="1920" value={width} onChange={handleWidthChange} />
            </div>
            <div className="mt-6 text-muted-foreground">x</div>
            <div className="w-full">
              <Label htmlFor="height">Height</Label>
              <Input id="height" type="number" placeholder="1080" value={height} onChange={handleHeightChange} />
            </div>
          </div>
          
          <div className="flex justify-center items-center my-4">
            <div className="flex-grow border-t border-dashed border-border"></div>
            <Button variant="outline" size="icon" onClick={() => setIsLocked(!isLocked)} className="mx-4 flex-shrink-0">
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              <span className="sr-only">{isLocked ? 'Unlock Ratio' : 'Lock Ratio'}</span>
            </Button>
            <div className="flex-grow border-t border-dashed border-border"></div>
          </div>

          {/* Ratio Inputs */}
           <div className="flex items-center gap-4">
            <div className="w-full">
              <Label htmlFor="ratioWidth">Ratio Width</Label>
              <Input id="ratioWidth" type="number" placeholder="16" value={ratioWidth} onChange={handleRatioWidthChange} />
            </div>
            <div className="mt-6 text-muted-foreground">:</div>
            <div className="w-full">
              <Label htmlFor="ratioHeight">Ratio Height</Label>
              <Input id="ratioHeight" type="number" placeholder="9" value={ratioHeight} onChange={handleRatioHeightChange} />
            </div>
          </div>
          
          {/* Common Ratios */}
          <div className="pt-4">
            <Label className="block text-center mb-4 font-semibold">Common Ratios</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {commonRatios.map(r => (
                    <Button key={r.name} variant="secondary" onClick={() => applyRatioPreset(r.w, r.h)}>
                        {r.name} ({r.w}:{r.h})
                    </Button>
                ))}
            </div>
          </div>

        </div>
      </CardContent>
    </div>
  );
}
