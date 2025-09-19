import * as React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Camera, Video, Wand2, Orbit, Hourglass, Atom } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FormData, RealEstateProperty, ServiceOptions } from './types';
import { PhotographyOptions } from './photography-options';
import { VideoOptions } from './video-options';
import { TimelapseOptions } from './timelapse-options';
import { ToursOptions } from './tours-options';
import { PostProductionOptions } from './post-production-options';
import { PhotogrammetryOptions } from './photogrammetry-options';

type Step1ServiceProps = {
  formData: FormData;
  handleInputChange: (field: keyof FormData, value: any) => void;
  handleRealEstateChange: (index: number, field: keyof RealEstateProperty, value: any) => void;
  addRealEstateProperty: () => void;
  removeRealEstateProperty: (index: number) => void;
  validationError: boolean;
};

const serviceOptions: ServiceOptions = {
    photography: { name: "Photography", icon: <Camera className="w-10 h-10 mb-3" /> },
    video: { name: "Video Production", icon: <Video className="w-10 h-10 mb-3" /> },
    post: { name: "Post Production", icon: <Wand2 className="w-10 h-10 mb-3" /> },
    '360tours': { name: "360 Tours", icon: <Orbit className="w-10 h-10 mb-3" /> },
    timelapse: { name: "Time Lapse", icon: <Hourglass className="w-10 h-10 mb-3" /> },
    photogrammetry: { name: "Photogrammetry", icon: <Atom className="w-10 h-10 mb-3" /> },
};

export function Step1Service({ 
  formData, 
  handleInputChange,
  handleRealEstateChange,
  addRealEstateProperty,
  removeRealEstateProperty,
  validationError,
}: Step1ServiceProps) {

  const handleBackToServices = () => {
    handleInputChange('serviceType', '');
    handleInputChange('photographySubType', '');
    handleInputChange('videoSubType', '');
    handleInputChange('timelapseSubType', '');
    handleInputChange('toursSubType', '');
    handleInputChange('postSubType', '');
    handleInputChange('photogrammetrySubType', '');
  };

  const renderSubServiceOptions = () => {
    switch (formData.serviceType) {
      case 'photography':
        return <PhotographyOptions 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                  handleRealEstateChange={handleRealEstateChange}
                  addRealEstateProperty={addRealEstateProperty}
                  removeRealEstateProperty={removeRealEstateProperty}
                  validationError={validationError}
                />;
      case 'video':
        return <VideoOptions formData={formData} handleInputChange={handleInputChange} validationError={validationError} />;
      case 'timelapse':
        return <TimelapseOptions formData={formData} handleInputChange={handleInputChange} validationError={validationError} />;
      case '360tours':
        return <ToursOptions formData={formData} handleInputChange={handleInputChange} validationError={validationError} />;
      case 'post':
        return <PostProductionOptions formData={formData} handleInputChange={handleInputChange} validationError={validationError} />;
      case 'photogrammetry':
        return <PhotogrammetryOptions formData={formData} handleInputChange={handleInputChange} validationError={validationError} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {formData.serviceType === '' ? (
        <div>
          <h3 className="font-semibold mb-4 text-base sm:text-lg">Select Service Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(serviceOptions).map(([id, { name, icon }]) => (
              <div
                key={id}
                onClick={() => handleInputChange("serviceType", id as keyof ServiceOptions)}
                className={cn(
                  "p-6 border-2 rounded-lg cursor-pointer transition-all flex flex-col items-center justify-center hover:bg-primary/80",
                  formData.serviceType === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                )}
              >
                {icon}
                <span className="font-semibold text-center text-sm sm:text-base">{name}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Button variant="ghost" onClick={handleBackToServices} className="mb-4 text-muted-foreground px-0 hover:bg-transparent -mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            <span className='hidden sm:inline'>Back to Services</span>
            <span className='sm:hidden'>Back</span>
          </Button>
          {renderSubServiceOptions()}
        </div>
      )}
    </div>
  );
}
