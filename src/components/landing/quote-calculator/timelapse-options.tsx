import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { FormData } from './types';
import { Minus, Plus } from 'lucide-react';

type TimelapseOptionsProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  validationError: boolean;
};

export function TimelapseOptions({ formData, handleInputChange, validationError }: TimelapseOptionsProps) {
    
  const durationConfig = {
    hours: { min: 1, max: 24, step: 1 },
    days: { min: 1, max: 30, step: 1 },
    weeks: { min: 1, max: 12, step: 1 },
    months: { min: 1, max: 24, step: 1 },
  };

  const currentDurationConfig = durationConfig[formData.timelapseInterval];
  const durationValue = formData.timelapseInterval === 'hours' ? formData.timelapseHours : formData.timelapseDuration;
  const durationField = formData.timelapseInterval === 'hours' ? 'timelapseHours' : 'timelapseDuration';

  React.useEffect(() => {
    // Reset duration if it's out of bounds of the new interval
    if (durationValue > currentDurationConfig.max) {
      handleInputChange(durationField, currentDurationConfig.max);
    }
  }, [formData.timelapseInterval, durationValue, currentDurationConfig.max, handleInputChange, durationField]);


  return (
    <div className="space-y-8 animate-fade-in-up flex flex-col flex-grow pb-20 sm:pb-0">
      <div className="p-4 border-2 rounded-lg transition-all border-transparent card-glowing">
        <h3 className="font-semibold mb-4 text-lg">Project Duration</h3>
        <div className="space-y-4">
            <RadioGroup value={formData.timelapseInterval} onValueChange={(v) => handleInputChange("timelapseInterval", v)} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(['hours', 'days', 'weeks', 'months'] as const).map((interval) => (
                <div key={interval}>
                <RadioGroupItem value={interval} id={`tl-${interval}`} className="sr-only" />
                <Label htmlFor={`tl-${interval}`} className={cn("flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer w-full transition-colors hover:bg-accent/50 h-full text-base py-4",
                    formData.timelapseInterval === interval ? 'border-primary bg-accent' : 'border-border'
                )}>
                    {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </Label>
                </div>
            ))}
            </RadioGroup>
            <div>
              <Label>Number of {formData.timelapseInterval}</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon" onClick={() => handleInputChange(durationField, Math.max(currentDurationConfig.min, durationValue - currentDurationConfig.step))}><Minus /></Button>
                <Slider
                  value={[durationValue]}
                  onValueChange={(v) => handleInputChange(durationField, v[0])}
                  min={currentDurationConfig.min}
                  max={currentDurationConfig.max}
                  step={currentDurationConfig.step}
                  className='flex-1'
                />
                <Button variant="outline" size="icon" onClick={() => handleInputChange(durationField, Math.min(currentDurationConfig.max, durationValue + currentDurationConfig.step))}><Plus /></Button>
              </div>
              <div className="text-center font-semibold w-full mt-2">{durationValue} {durationValue > 1 ? formData.timelapseInterval : formData.timelapseInterval.slice(0, -1)}</div>
            </div>
        </div>
      </div>
       <div className="p-4 border-2 rounded-lg transition-all border-transparent card-glowing">
        <h3 className="font-semibold mb-4 text-lg">Number of Cameras</h3>
         <div>
            <div className="flex items-center gap-4 mt-2">
              <Button variant="outline" size="icon" onClick={() => handleInputChange('timelapseCameras', Math.max(1, formData.timelapseCameras - 1))}><Minus /></Button>
              <Slider
                value={[formData.timelapseCameras]}
                onValueChange={(v) => handleInputChange('timelapseCameras', v[0])}
                min={1}
                max={10}
                step={1}
                className='flex-1'
              />
              <Button variant="outline" size="icon" onClick={() => handleInputChange('timelapseCameras', Math.min(10, formData.timelapseCameras + 1))}><Plus /></Button>
            </div>
            <div className="text-center font-semibold w-full mt-2">{formData.timelapseCameras} {formData.timelapseCameras > 1 ? 'cameras' : 'camera'}</div>
          </div>
      </div>
    </div>
  );
}
