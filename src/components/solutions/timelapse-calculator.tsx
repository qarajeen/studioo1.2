
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Hourglass } from 'lucide-react';

interface Result {
  interval: string;
  totalPhotos: number;
  totalStorage: string;
}

export function TimelapseCalculator() {
  const [eventDuration, setEventDuration] = React.useState<number>(8);
  const [durationUnit, setDurationUnit] = React.useState<'hours' | 'days'>('hours');
  const [clipLength, setClipLength] = React.useState<number>(30);
  const [frameRate, setFrameRate] = React.useState<string>('24');
  const [photoSize, setPhotoSize] = React.useState<number>(25);
  const [result, setResult] = React.useState<Result | null>(null);

  React.useEffect(() => {
    const eventDurationInSeconds = durationUnit === 'hours'
      ? eventDuration * 3600
      : eventDuration * 24 * 3600;

    const rate = parseFloat(frameRate);
    if (!eventDuration || !clipLength || !rate || eventDuration <= 0 || clipLength <= 0) {
      setResult(null);
      return;
    }

    const totalPhotos = clipLength * rate;
    const intervalSeconds = eventDurationInSeconds / totalPhotos;
    const totalStorageMB = totalPhotos * photoSize;
    const totalStorageGB = totalStorageMB / 1024;

    const formatInterval = (seconds: number): string => {
        if (seconds < 60) return `${seconds.toFixed(2)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = (seconds % 60).toFixed(0);
        return `${minutes}m ${remainingSeconds}s`;
    };

    setResult({
      interval: formatInterval(intervalSeconds),
      totalPhotos: Math.ceil(totalPhotos),
      totalStorage: totalStorageGB >= 1 
        ? `${totalStorageGB.toFixed(2)} GB`
        : `${totalStorageMB.toFixed(0)} MB`,
    });
  }, [eventDuration, durationUnit, clipLength, frameRate, photoSize]);

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Hourglass className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Time-Lapse Calculator</CardTitle>
        <CardDescription>Plan your next time-lapse by calculating the perfect shooting interval.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="eventDuration">Event Duration</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="eventDuration"
                  type="number"
                  value={eventDuration}
                  onChange={(e) => setEventDuration(Number(e.target.value))}
                  min="1"
                />
                <Select value={durationUnit} onValueChange={(v: 'hours' | 'days') => setDurationUnit(v)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="clipLength">Desired Clip Length (seconds)</Label>
              <Input
                id="clipLength"
                type="number"
                value={clipLength}
                onChange={(e) => setClipLength(Number(e.target.value))}
                min="1"
                className="mt-2"
              />
            </div>
             <div>
              <Label htmlFor="frameRate">Video Frame Rate (FPS)</Label>
              <Select value={frameRate} onValueChange={setFrameRate}>
                <SelectTrigger id="frameRate" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 (Cinematic)</SelectItem>
                  <SelectItem value="25">25 (PAL)</SelectItem>
                  <SelectItem value="30">30 (Standard)</SelectItem>
                  <SelectItem value="60">60 (Slow Motion)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="photoSize">Average Photo Size (MB)</Label>
              <Input
                id="photoSize"
                type="number"
                value={photoSize}
                onChange={(e) => setPhotoSize(Number(e.target.value))}
                min="1"
                className="mt-2"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <Card className="w-full bg-background/70 border-primary shadow-lg h-full">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Your Calculated Settings</CardTitle>
                </CardHeader>
                <CardContent className="h-full flex flex-col justify-center items-center">
                    {result ? (
                        <div className="space-y-6 text-center">
                            <div>
                                <Label className="text-sm text-muted-foreground">Shooting Interval</Label>
                                <p className="text-3xl font-bold text-primary">{result.interval}</p>
                            </div>
                             <Separator />
                            <div>
                                <Label className="text-sm text-muted-foreground">Total Photos Required</Label>
                                <p className="text-3xl font-bold">{result.totalPhotos.toLocaleString()}</p>
                            </div>
                             <Separator />
                            <div>
                                <Label className="text-sm text-muted-foreground">Estimated Storage</Label>
                                <p className="text-3xl font-bold">{result.totalStorage}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Enter valid inputs to see results.</p>
                    )}
                </CardContent>
            </Card>
          </div>

        </div>
      </CardContent>
    </div>
  );
}
