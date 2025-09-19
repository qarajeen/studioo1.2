
'use client';

import * as React from 'react';
import SunCalc from 'suncalc';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Sunrise, Sunset, LocateFixed, Sun, Moon, Sparkles, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type SunTimes = {
  sunrise: Date;
  sunriseEnd: Date;
  goldenHourEnd: Date;
  solarNoon: Date;
  goldenHour: Date;
  sunsetStart: Date;
  sunset: Date;
  dusk: Date;
  nauticalDusk: Date;
  night: Date;
  nadir: Date;
  nightEnd: Date;
  nauticalDawn: Date;
  dawn: Date;
};

type LocationState = 'idle' | 'loading' | 'success' | 'error';
type ErrorType = 'permission' | 'unavailable' | 'timeout' | 'generic';

const timePhases = [
  { name: 'Dawn', key: 'dawn' as keyof SunTimes, icon: <Sunrise className="text-pink-400" />, description: 'Start of morning twilight.' },
  { name: 'Sunrise', key: 'sunrise' as keyof SunTimes, icon: <Sunrise className="text-orange-400" />, description: 'Top of the sun appears.' },
  { name: 'Golden Hour End', key: 'goldenHourEnd' as keyof SunTimes, icon: <Sun className="text-yellow-400" />, description: 'Warm, soft morning light.' },
  { name: 'Solar Noon', key: 'solarNoon' as keyof SunTimes, icon: <Sun className="text-yellow-300" />, description: 'Sun is at its highest point.' },
  { name: 'Golden Hour Start', key: 'goldenHour' as keyof SunTimes, icon: <Sun className="text-yellow-400" />, description: 'Warm, soft evening light.' },
  { name: 'Sunset', key: 'sunset' as keyof SunTimes, icon: <Sunset className="text-orange-400" />, description: 'Sun disappears below horizon.' },
  { name: 'Dusk', key: 'dusk' as keyof SunTimes, icon: <Sunset className="text-purple-400" />, description: 'End of evening twilight.' },
  { name: 'Night', key: 'night' as keyof SunTimes, icon: <Moon className="text-blue-300" />, description: 'Darkness begins.' },
];

export function GoldenHourCalculator() {
  const [locationState, setLocationState] = React.useState<LocationState>('idle');
  const [errorType, setErrorType] = React.useState<ErrorType | null>(null);
  const [sunTimes, setSunTimes] = React.useState<SunTimes | null>(null);
  const [date, setDate] = React.useState(new Date());

  const getLocation = () => {
    setLocationState('loading');
    setErrorType(null);
    if (!navigator.geolocation) {
      setLocationState('error');
      setErrorType('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const times = SunCalc.getTimes(date, latitude, longitude);
        setSunTimes(times as SunTimes);
        setLocationState('success');
      },
      (error) => {
        setLocationState('error');
        if (error.code === error.PERMISSION_DENIED) setErrorType('permission');
        else if (error.code === error.POSITION_UNAVAILABLE) setErrorType('unavailable');
        else if (error.code === error.TIMEOUT) setErrorType('timeout');
        else setErrorType('generic');
      },
      { timeout: 10000 }
    );
  };
  
  const renderContent = () => {
    switch (locationState) {
      case 'idle':
        return (
          <div className="text-center">
            <Button onClick={getLocation} size="lg">
              <LocateFixed className="mr-2 h-5 w-5" />
              Find My Location
            </Button>
            <p className="text-sm text-muted-foreground mt-4">We need your location to calculate accurate sun times for your area.</p>
          </div>
        );
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
            <p className="text-muted-foreground">Fetching your location...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h3 className="text-xl font-semibold">Location Error</h3>
            {errorType === 'permission' && <p>You have denied location access. Please enable it in your browser settings to use this tool.</p>}
            {errorType === 'unavailable' && <p>Your location could not be determined. Please try again.</p>}
            {errorType === 'timeout' && <p>The request for your location timed out.</p>}
            {errorType === 'generic' && <p>An unknown error occurred while fetching your location.</p>}
            <Button onClick={getLocation} variant="secondary">
              Try Again
            </Button>
          </div>
        );
      case 'success':
        if (!sunTimes) return null;
        return (
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-center text-lg font-semibold">{format(date, 'eeee, MMMM d, yyyy')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timePhases.map(phase => (
                <Card key={phase.key} className="bg-background/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{phase.name}</CardTitle>
                        {React.cloneElement(phase.icon, { className: "h-4 w-4 text-muted-foreground" })}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {format(sunTimes[phase.key], 'h:mm a')}
                        </div>
                        <p className="text-xs text-muted-foreground">{phase.description}</p>
                    </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center pt-4">
                <Button onClick={getLocation} variant="outline">
                    <LocateFixed className="mr-2 h-4 w-4" />
                    Refresh Location
                </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="w-full">
      <CardHeader className="px-0 pt-0 text-center">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
          <Sunrise className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold mt-4">Golden Hour Calculator</CardTitle>
        <CardDescription>Find the best natural light for your photos and videos.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 pb-0 mt-8 min-h-[20rem] flex items-center justify-center">
        {renderContent()}
      </CardContent>
    </div>
  );
}
