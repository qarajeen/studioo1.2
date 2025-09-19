
'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Film, PlusCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Timecode {
  id: number;
  value: string;
}

// Function to convert HH:MM:SS:FF to total frames
const timecodeToFrames = (tc: string, frameRate: number): number => {
  const parts = tc.split(':').map(Number);
  if (parts.some(isNaN) || parts.length !== 4) return 0;
  const [hours, minutes, seconds, frames] = parts;
  return (hours * 3600 + minutes * 60 + seconds) * frameRate + frames;
};

// Function to convert total frames to HH:MM:SS:FF
const framesToTimecode = (totalFrames: number, frameRate: number): string => {
  const totalSeconds = Math.floor(totalFrames / frameRate);
  const frames = totalFrames % frameRate;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds, frames].map(num => String(num).padStart(2, '0')).join(':');
};

export function VideoDurationCalculator() {
  const [timecodes, setTimecodes] = React.useState<Timecode[]>([{ id: 1, value: '00:00:00:00' }]);
  const [frameRate, setFrameRate] = React.useState<string>('24');
  const [totalTimecode, setTotalTimecode] = React.useState('00:00:00:00');

  const addTimecode = () => {
    setTimecodes([...timecodes, { id: Date.now(), value: '00:00:00:00' }]);
  };

  const removeTimecode = (id: number) => {
    setTimecodes(timecodes.filter(tc => tc.id !== id));
  };

  const handleTimecodeChange = (id: number, value: string) => {
    const newTimecodes = timecodes.map(tc => tc.id === id ? { ...tc, value } : tc);
    setTimecodes(newTimecodes);
  };
  
  React.useEffect(() => {
    const rate = parseFloat(frameRate);
    if(isNaN(rate)) return;
    const totalFrames = timecodes.reduce((acc, tc) => acc + timecodeToFrames(tc.value, rate), 0);
    setTotalTimecode(framesToTimecode(Math.round(totalFrames), rate));
  }, [timecodes, frameRate]);
  
  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Film className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Video Duration Calculator</CardTitle>
        <CardDescription>Calculate the total runtime of a sequence by adding timecodes.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8">
        <div className="space-y-6">
            
          <div className="flex justify-center">
            <div className="w-full max-w-xs">
              <Label htmlFor="frameRate">Frame Rate (FPS)</Label>
              <Select value={frameRate} onValueChange={setFrameRate}>
                <SelectTrigger id="frameRate" className="mt-2">
                  <SelectValue placeholder="Select frame rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="23.976">23.976 (Film)</SelectItem>
                  <SelectItem value="24">24 (Film)</SelectItem>
                  <SelectItem value="25">25 (PAL)</SelectItem>
                  <SelectItem value="29.97">29.97 (NTSC)</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="59.94">59.94</SelectItem>
                  <SelectItem value="60">60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="font-semibold">Timecodes (HH:MM:SS:FF)</Label>
            {timecodes.map((tc, index) => (
              <div key={tc.id} className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="00:00:00:00"
                  value={tc.value}
                  onChange={(e) => handleTimecodeChange(tc.id, e.target.value)}
                  className="font-mono"
                />
                <Button variant="ghost" size="icon" onClick={() => removeTimecode(tc.id)} disabled={timecodes.length <= 1}>
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            ))}
             <Button variant="outline" onClick={addTimecode} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Timecode
            </Button>
          </div>
          
          <Separator />
          
          <Card className="bg-background/70 border-primary shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="text-lg">Total Duration</CardTitle>
                <CardDescription>(Hours : Minutes : Seconds : Frames)</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-4xl sm:text-5xl font-bold font-mono text-primary">
                    {totalTimecode}
                </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </div>
  );
}
