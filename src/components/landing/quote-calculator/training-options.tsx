
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { FormData } from './types';
import { trainingSubServices } from './types';
import { Minus, Plus } from 'lucide-react';

type TrainingOptionsProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  validationError: boolean;
};

export function TrainingOptions({ formData, handleInputChange, validationError }: TrainingOptionsProps) {
  const isOneOnOne = formData.trainingSubType === 'one-on-one';

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className={cn("p-4 border-2 rounded-lg transition-all", validationError ? 'border-destructive' : 'border-transparent')}>
        <h3 className="font-semibold mb-4 text-base sm:text-lg">Select Training Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(trainingSubServices).map(([id, { name }]) => (
            <Button
              key={id}
              variant="outline"
              size="lg"
              onClick={() => handleInputChange("trainingSubType", id)}
              className={cn(
                "h-auto min-h-[6rem] py-4 text-sm sm:text-base transition-all hover:bg-accent/50 text-center justify-center whitespace-normal",
                formData.trainingSubType === id ? 'border-primary bg-accent' : 'border-border'
              )}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      {formData.trainingSubType && (
        <div className="pt-4 space-y-6 animate-fade-in-up">
            <h4 className="font-semibold text-base sm:text-lg">Training Details</h4>
            <div>
              <Label>Duration (Hours)</Label>
              <div className="flex items-center gap-4 mt-2">
                <Button variant="outline" size="icon" onClick={() => handleInputChange('trainingHours', Math.max(1, formData.trainingHours - 1))}><Minus /></Button>
                <Slider
                  value={[formData.trainingHours]}
                  onValueChange={(v) => handleInputChange('trainingHours', v[0])}
                  min={1}
                  max={24}
                  step={1}
                  className='flex-1'
                />
                <Button variant="outline" size="icon" onClick={() => handleInputChange('trainingHours', Math.min(24, formData.trainingHours + 1))}><Plus /></Button>
              </div>
              <div className="text-center font-semibold w-full mt-2">{formData.trainingHours} hours</div>
            </div>

            <h4 className="font-semibold text-base sm:text-lg">Add-ons</h4>
            <div className="space-y-3">
            {isOneOnOne ? (
                <>
                    <div className={cn("flex items-center justify-between p-4 border rounded-lg", formData.trainingOneOnOneCameraRental ? 'border-primary bg-accent' : 'border-border' )}>
                        <Label htmlFor="oneOnOneCamera" className="cursor-pointer flex-grow text-sm sm:text-base">Camera Rental (+ AED 150/hr)</Label>
                        <Switch id="oneOnOneCamera" checked={formData.trainingOneOnOneCameraRental} onCheckedChange={(v) => handleInputChange("trainingOneOnOneCameraRental", v)} />
                    </div>
                    <div className={cn("flex items-center justify-between p-4 border rounded-lg", formData.trainingOneOnOneClassroomRental ? 'border-primary bg-accent' : 'border-border' )}>
                        <Label htmlFor="oneOnOneClassroom" className="cursor-pointer flex-grow text-sm sm:text-base">Classroom Rental (+ AED 150/hr)</Label>
                        <Switch id="oneOnOneClassroom" checked={formData.trainingOneOnOneClassroomRental} onCheckedChange={(v) => handleInputChange("trainingOneOnOneClassroomRental", v)} />
                    </div>
                </>
            ) : (
                <div className={cn("flex items-center justify-between p-4 border rounded-lg", formData.trainingGroupsClassroomRental ? 'border-primary bg-accent' : 'border-border' )}>
                    <Label htmlFor="groupsClassroom" className="cursor-pointer flex-grow text-sm sm:text-base">Classroom Rental (+ AED 250/hr)</Label>
                    <Switch id="groupsClassroom" checked={formData.trainingGroupsClassroomRental} onCheckedChange={(v) => handleInputChange("trainingGroupsClassroomRental", v)} />
                </div>
            )}
            </div>
        </div>
      )}
    </div>
  );
}
